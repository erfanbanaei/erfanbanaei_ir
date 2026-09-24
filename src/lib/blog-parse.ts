import { XMLParser } from 'fast-xml-parser';

// Pure parsing helpers for the WordPress feed and REST API, shared by the site (lib/blog.ts)
// and scripts/blog-snapshot.mjs.

export type BlogImage = { src: string; alt: string; width: number; height: number };
export type BlogPost = {
  id: string;
  title: string;
  url: string;
  date: string;
  excerpt: string;
  categories: string[];
  image: BlogImage | null;
};

const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—', zwnj: '‌' };

export function decodeEntities(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Plain-text excerpt from WordPress's HTML description. */
export function toExcerpt(html: string, max = 220) {
  let text = decodeEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/The post .* appeared first on .*$/s, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*(\[…\]|\[\.\.\.\]|…|\.\.\.)\s*$/, '')
    .trim();
  if (text.length > max) text = `${text.slice(0, max).replace(/\s+\S*$/, '')}`;
  return text ? `${text}…` : '';
}

const slugFromUrl = (url: string) => decodeURIComponent(new URL(url).pathname.replace(/^\/|\/$/g, '')) || url;

export function sameHost(url: string, base: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.host === new URL(base).host;
  } catch {
    return false;
  }
}

type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  category?: string[];
  'content:encoded'?: string;
};

export function parseFeed(xml: string, blogUrl: string) {
  const parser = new XMLParser({ ignoreAttributes: true, processEntities: true, htmlEntities: true, isArray: (name) => name === 'item' || name === 'category' });
  const items: FeedItem[] = parser.parse(xml)?.rss?.channel?.item ?? [];
  return items
    .filter((item) => item.link && item.title && sameHost(item.link, blogUrl))
    .map((item) => ({
      id: slugFromUrl(item.link!),
      title: decodeEntities(String(item.title)).trim(),
      url: item.link!,
      date: item.pubDate ? new Date(item.pubDate).toISOString() : '',
      excerpt: toExcerpt(String(item.description ?? '')),
      categories: (item.category ?? []).map((c) => decodeEntities(String(c)).trim()).filter(Boolean),
      contentImage: firstContentImage(String(item['content:encoded'] ?? ''), blogUrl),
    }));
}

/** First real image in a post body (WordPress emoji images are skipped). */
function firstContentImage(html: string, blogUrl: string): BlogImage | null {
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = /\ssrc="([^"]+)"/.exec(tag)?.[1];
    if (!src || !sameHost(src, blogUrl) || !src.includes('/wp-content/uploads/')) continue;
    const width = Number(/\swidth="(\d+)"/.exec(tag)?.[1]) || 1200;
    const height = Number(/\sheight="(\d+)"/.exec(tag)?.[1]) || 675;
    return { src, alt: decodeEntities(/\salt="([^"]*)"/.exec(tag)?.[1] ?? ''), width, height };
  }
  return null;
}

export type WpMedia = {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: { width?: number; height?: number; sizes?: Record<string, { source_url: string; width: number; height: number }> };
};

/** Featured images keyed by post URL, from WordPress REST `posts` and `media` responses. */
export function pickFeaturedImages(
  posts: { link: string; featured_media: number }[],
  media: WpMedia[],
  blogUrl: string,
): Map<string, BlogImage> {
  const byId = new Map(media.map((m) => [m.id, m]));
  const images = new Map<string, BlogImage>();
  for (const post of posts) {
    const m = byId.get(post.featured_media);
    if (!m || !sameHost(m.source_url, blogUrl)) continue;
    // A mid-size rendition is plenty for cards; next/image resizes further.
    const sizes = Object.values(m.media_details?.sizes ?? {}).filter((s) => s.width >= 768 && sameHost(s.source_url, blogUrl));
    const best = sizes.sort((a, b) => a.width - b.width)[0];
    images.set(post.link, {
      src: best?.source_url ?? m.source_url,
      alt: decodeEntities(m.alt_text ?? ''),
      width: best?.width ?? m.media_details?.width ?? 1200,
      height: best?.height ?? m.media_details?.height ?? 675,
    });
  }
  return images;
}
