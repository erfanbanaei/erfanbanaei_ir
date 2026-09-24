// Saves the blog's latest posts to content/blog-snapshot.json, with their featured images
// downloaded to public/images/blog-snapshot/. The site shows this snapshot whenever the live
// feed can't be fetched (see src/lib/blog.ts). Run: `npm run blog:snapshot`.
//
// Requires Node 22.18+ (it imports the site's TypeScript feed parser directly).
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

import { parseFeed, pickFeaturedImages } from '../src/lib/blog-parse.ts';

const root = path.resolve(import.meta.dirname, '..');
const imageDir = path.join(root, 'public/images/blog-snapshot');
const site = JSON.parse(await readFile(path.join(root, 'content/site.json'), 'utf-8'));
const { url: blogUrl, feedUrl } = site.blog;

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'erfanbanaei.ir snapshot' }, signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res;
}

const items = parseFeed(await (await get(feedUrl)).text(), blogUrl);
const api = new URL('/wp-json/wp/v2/', blogUrl);
const wpPosts = await (await get(`${api}posts?per_page=20&_fields=link,featured_media`)).json();
const ids = wpPosts.map((p) => p.featured_media).filter((id) => id > 0);
const media = ids.length
  ? await (await get(`${api}media?include=${ids.join(',')}&per_page=${ids.length}&_fields=id,source_url,alt_text,media_details`)).json()
  : [];
const featured = pickFeaturedImages(wpPosts, media, blogUrl);

await mkdir(imageDir, { recursive: true });
const kept = new Set();
const posts = [];
for (const { contentImage, ...post } of items) {
  const remote = featured.get(post.url) ?? contentImage;
  let image = null;
  if (remote) {
    const name = `${post.id.replace(/[^a-z0-9-]+/gi, '-').toLowerCase().slice(0, 60) || 'post'}.webp`;
    const buffer = Buffer.from(await (await get(remote.src)).arrayBuffer());
    const { width, height } = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(imageDir, name));
    kept.add(name);
    image = { src: `/images/blog-snapshot/${name}`, alt: remote.alt, width, height };
  }
  posts.push({ ...post, image });
  console.log(`✓ ${post.title}${image ? '' : ' (no image)'}`);
}

for (const file of await readdir(imageDir)) {
  if (!kept.has(file)) await rm(path.join(imageDir, file));
}
await writeFile(
  path.join(root, 'content/blog-snapshot.json'),
  `${JSON.stringify({ fetchedAt: new Date().toISOString(), posts }, null, 2)}\n`,
);
console.log(`Saved ${posts.length} posts to content/blog-snapshot.json`);
