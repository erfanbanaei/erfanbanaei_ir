import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Post = CollectionEntry<'blog'>;

const byOrder = <T extends { data: { _order: number } }>(a: T, b: T) => a.data._order - b.data._order;

/** Content is static for a build, so each query runs once and is shared by every page (not in dev, to pick up edits). */
function once<T>(fn: () => Promise<T>): () => Promise<T> {
  if (import.meta.env.DEV) return fn;
  let cached: Promise<T> | undefined;
  return () => (cached ??= fn());
}

export const getSite = once(async () => {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('content/site.json is missing');
  return entry.data;
});

export const getNow = once(async () => {
  const entry = await getEntry('now', 'now');
  if (!entry) throw new Error('content/now.json is missing');
  return entry.data;
});

export const getProjects = once(async () =>
  (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id)),
);

export const getPosts = once(async () =>
  (await getCollection('blog', (p) => !p.data.draft)).sort(
    (a, b) => b.data.date.localeCompare(a.data.date) || a.id.localeCompare(b.id),
  ),
);

export const getSkills = once(async () => (await getCollection('skills')).sort(byOrder));
export const getEducation = once(async () => (await getCollection('education')).sort(byOrder));
export const getCertificates = once(async () => (await getCollection('certificates')).sort(byOrder));
export const getUses = once(async () => (await getCollection('uses')).sort(byOrder));
export const getTestimonials = once(async () => (await getCollection('testimonials')).sort(byOrder));

/** Most recent first; ongoing roles (no end date) before finished ones. */
export const getExperience = once(async () =>
  (await getCollection('experience')).sort(
    (a, b) => b.data.start.localeCompare(a.data.start) || (a.data.end ? 1 : 0) - (b.data.end ? 1 : 0),
  ),
);
