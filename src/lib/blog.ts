import 'server-only';

import { cache } from 'react';

import snapshot from '../../content/blog-snapshot.json';
import { parseFeed, pickFeaturedImages, type BlogImage, type BlogPost, type WpMedia } from '@/lib/blog-parse';

export type { BlogImage, BlogPost };

/*
 * Latest posts from the external WordPress blog.
 *
 * The RSS feed gives the list (title, link, date, categories, excerpt). RSS has no
 * featured images, so those come from the WordPress REST API (/wp-json/wp/v2/media).
 * Both requests are cached and revalidated hourly (ISR). If the blog can't be reached,
 * the last saved snapshot (content/blog-snapshot.json, refreshed with
 * `npm run blog:snapshot`) is used so the section is never empty.
 */

export const BLOG_REVALIDATE = 3600;
const TIMEOUT_MS = 10_000;

export type BlogFeed = { posts: BlogPost[]; source: 'live' | 'snapshot' };

async function get(url: string, accept: string) {
  const res = await fetch(url, {
    headers: { Accept: accept, 'User-Agent': 'erfanbanaei.ir (+https://erfanbanaei.ir)' },
    next: { revalidate: BLOG_REVALIDATE },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}

/** Featured images keyed by post URL, via the WordPress REST API. */
async function featuredImages(blogUrl: string): Promise<Map<string, BlogImage>> {
  const api = new URL('/wp-json/wp/v2/', blogUrl);
  const posts: { link: string; featured_media: number }[] = await (
    await get(`${api}posts?per_page=20&_fields=link,featured_media`, 'application/json')
  ).json();
  const ids = posts.map((p) => p.featured_media).filter((id) => id > 0);
  if (!ids.length) return new Map();
  const media: WpMedia[] = await (
    await get(`${api}media?include=${ids.join(',')}&per_page=${ids.length}&_fields=id,source_url,alt_text,media_details`, 'application/json')
  ).json();
  return pickFeaturedImages(posts, media, blogUrl);
}

const snapshotFeed = (): BlogFeed => ({ posts: snapshot.posts as BlogPost[], source: 'snapshot' });

export const getBlogFeed = cache(async (feedUrl: string, blogUrl: string): Promise<BlogFeed> => {
  let items: ReturnType<typeof parseFeed>;
  try {
    items = parseFeed(await (await get(feedUrl, 'application/rss+xml, application/xml')).text(), blogUrl);
  } catch (error) {
    console.warn(`[blog] feed unavailable, using the saved snapshot: ${describe(error)}`);
    return snapshotFeed();
  }
  if (!items.length) return snapshotFeed();

  let featured = new Map<string, BlogImage>();
  try {
    featured = await featuredImages(blogUrl);
  } catch (error) {
    console.warn(`[blog] featured images unavailable: ${describe(error)}`);
  }
  const saved = new Map((snapshot.posts as BlogPost[]).map((p) => [p.url, p.image]));
  const posts = items.map(({ contentImage, ...post }) => ({
    ...post,
    image: featured.get(post.url) ?? contentImage ?? saved.get(post.url) ?? null,
  }));
  return { posts, source: 'live' };
});

function describe(error: unknown) {
  const cause = (error as { cause?: { code?: string; message?: string } })?.cause;
  return [String((error as Error)?.message ?? error), cause?.code ?? cause?.message].filter(Boolean).join(' / ');
}
