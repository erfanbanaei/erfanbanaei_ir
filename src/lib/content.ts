import 'server-only';

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { z } from 'zod';

import { renderMarkdown } from '@/lib/markdown';

/*
 * Reads the bilingual files in content/ (format: docs/CONTENT.md, written by the
 * Telegram bot). Every file is validated, so a malformed edit fails the build with
 * a message naming the file and field instead of producing a broken page.
 */

const CONTENT_DIR = path.join(process.cwd(), 'content');

// -- schemas -------------------------------------------------------------------

const text = z.string().trim().min(1);
const i18n = z.object({ fa: text, en: text });
const i18nOptional = z.object({ fa: z.string(), en: z.string() }).default({ fa: '', en: '' });
const i18nList = z.object({ fa: z.array(text), en: z.array(text) }).default({ fa: [], en: [] });
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'IDs must be lowercase slugs (a-z, 0-9, "-")');
const monthRe = /^\d{4}-(0[1-9]|1[0-2])$/;
const month = z.union([z.literal(''), z.string().regex(monthRe, 'Expected "YYYY-MM"')]).default('');
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected "YYYY-MM-DD"');
const url = z.union([z.literal(''), z.url({ protocol: /^https?$/ })]).default('');
const image = z
  .union([z.literal(''), z.string().regex(/^\/images\/.+\.(webp|avif|png|jpe?g|svg|gif)$/, 'Images must live under /images/')])
  .default('');
const file = z.union([z.literal(''), z.string().regex(/^\/files\/.+$/, 'Files must live under /files/')]).default('');

export const skillCategories = ['mobile', 'languages', 'web', 'backend', 'tools', 'design', 'other'] as const;
export const projectTypes = ['app', 'ui', 'template', 'website', 'tool', 'library', 'other'] as const;
export const usesCategories = ['hardware', 'software', 'devtools', 'books', 'courses', 'other'] as const;
export const focusIcons = ['mobile', 'web', 'automation', 'design', 'tools', 'network', 'data', 'writing', 'other'] as const;
const employmentTypes = ['full-time', 'part-time', 'freelance', 'contract', 'internship'] as const;
const socialIds = ['linkedin', 'github', 'x', 'youtube', 'instagram', 'telegram', 'aparat', 'email', 'website', 'other'] as const;

const siteSchema = z.object({
  name: i18n,
  role: i18n,
  avatar: image,
  hero: z.object({ greeting: i18n, headline: i18n, intro: i18n }),
  about: z.object({ short: i18n, story: i18n, philosophy: i18nOptional, interests: i18nList }),
  email: z.email(),
  socials: z.array(z.object({ id: z.enum(socialIds), label: i18n, url: z.string().min(1) })),
  resume: z.object({ fa: file, en: file }).default({ fa: '', en: '' }),
  blog: z
    .object({ url: z.url({ protocol: /^https?$/ }), feedUrl: z.url({ protocol: /^https?$/ }) })
    .default({ url: 'https://blog.erfanbanaei.ir', feedUrl: 'https://blog.erfanbanaei.ir/feed/' }),
  integrations: z.object({ web3formsKey: z.string().default('') }).default({ web3formsKey: '' }),
});

const nowSchema = z.object({ updated: day, body: i18n });

const skillSchema = z.object({ id: slug, name: i18n, level: z.number().int().min(0).max(100), category: z.enum(skillCategories) });

const focusSchema = z.object({ id: slug, icon: z.enum(focusIcons), title: i18n, description: i18n });

const experienceSchema = z.object({
  id: slug,
  company: i18n,
  role: i18n,
  employment: z.enum(employmentTypes),
  start: z.string().regex(monthRe, 'Expected "YYYY-MM"'),
  end: month,
  url,
  highlights: i18nList,
  tech: z.array(text).default([]),
});

const educationSchema = z.object({ id: slug, title: i18n, institution: i18nOptional, start: month, end: month, note: i18nOptional });

const certificateSchema = z.object({
  id: slug,
  title: i18n,
  description: i18nOptional,
  issuer: i18nOptional,
  date: month,
  image,
  credentialId: z.string().default(''),
  credentialUrl: url,
});

const usesSchema = z.object({ id: slug, category: z.enum(usesCategories), name: i18n, description: i18nOptional, url });

const testimonialSchema = z.object({ id: slug, name: i18n, role: i18nOptional, quote: i18n, avatar: image, url });

const projectSchema = z.object({
  title: i18n,
  summary: i18n,
  type: z.enum(projectTypes),
  tech: z.array(text).default([]),
  features: i18nList,
  featured: z.boolean().default(false),
  order: z.number().int().default(100),
  date: month,
  cover: image,
  gallery: z.array(image).default([]),
  links: z.object({ github: url, demo: url, store: url }).default({ github: '', demo: '', store: '' }),
});

export type Bilingual = { fa: string; en: string };
export type Site = z.infer<typeof siteSchema> & { html: { story: Bilingual; philosophy: Bilingual } };
export type Skill = z.infer<typeof skillSchema>;
export type Focus = z.infer<typeof focusSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Certificate = z.infer<typeof certificateSchema>;
export type UsesItem = z.infer<typeof usesSchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Project = z.infer<typeof projectSchema> & { id: string; html: Bilingual };

// -- loading -------------------------------------------------------------------

function parse<T extends z.ZodType>(schema: T, data: unknown, file: string): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`).join('\n');
    throw new Error(`Invalid content in content/${file}:\n${issues}`);
  }
  return result.data;
}

async function readJson(file: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path.join(CONTENT_DIR, file), 'utf-8'));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw new Error(`Could not read content/${file}: ${(error as Error).message}`);
  }
}

async function readArray<T extends z.ZodType>(file: string, schema: T): Promise<z.infer<T>[]> {
  const raw = (await readJson(file)) ?? [];
  if (!Array.isArray(raw)) throw new Error(`content/${file} must contain a JSON array.`);
  const items = raw.map((item, i) => parse(schema, item, `${file} [${i}]`));
  const ids = new Set<string>();
  for (const item of items as { id: string }[]) {
    if (ids.has(item.id)) throw new Error(`content/${file}: duplicate id "${item.id}".`);
    ids.add(item.id);
  }
  return items;
}

async function renderPair(value: Bilingual): Promise<Bilingual> {
  const [fa, en] = await Promise.all([renderMarkdown(value.fa), renderMarkdown(value.en)]);
  return { fa, en };
}

/** Splits a Markdown body into its `<!-- fa -->` and `<!-- en -->` sections. */
function splitBilingualBody(body: string, file: string): Bilingual {
  const fa = /^<!--\s*fa\s*-->[ \t]*$/m.exec(body);
  const en = /^<!--\s*en\s*-->[ \t]*$/m.exec(body);
  if (!fa || !en || en.index < fa.index) {
    throw new Error(`content/${file}: body must contain "<!-- fa -->" followed by "<!-- en -->" marker lines.`);
  }
  return { fa: body.slice(fa.index + fa[0].length, en.index).trim(), en: body.slice(en.index + en[0].length).trim() };
}

/** gray-matter turns unquoted YAML dates into Date objects; turn them back into strings. */
function normaliseDates(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map(normaliseDates);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, normaliseDates(v)]));
  }
  return value;
}

export const getSite = cache(async (): Promise<Site> => {
  const site = parse(siteSchema, await readJson('site.json'), 'site.json');
  const [story, philosophy] = await Promise.all([renderPair(site.about.story), renderPair(site.about.philosophy)]);
  return { ...site, html: { story, philosophy } };
});

export const getNow = cache(async () => {
  const now = parse(nowSchema, await readJson('now.json'), 'now.json');
  return { ...now, html: await renderPair(now.body) };
});

export const getSkills = cache(() => readArray('skills.json', skillSchema));
export const getFocus = cache(() => readArray('focus.json', focusSchema));
export const getEducation = cache(() => readArray('education.json', educationSchema));
export const getCertificates = cache(() => readArray('certificates.json', certificateSchema));
export const getUses = cache(() => readArray('uses.json', usesSchema));
export const getTestimonials = cache(() => readArray('testimonials.json', testimonialSchema));

/** Most recent first; ongoing roles before finished ones that started the same month. */
export const getExperience = cache(async () =>
  (await readArray('experience.json', experienceSchema)).sort(
    (a, b) => b.start.localeCompare(a.start) || Number(Boolean(a.end)) - Number(Boolean(b.end)),
  ),
);

export const getProjects = cache(async (): Promise<Project[]> => {
  const dir = path.join(CONTENT_DIR, 'projects');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
  const projects = await Promise.all(
    files.map(async (name) => {
      const id = name.replace(/\.md$/, '');
      const rel = `projects/${name}`;
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`content/${rel}: file name must be a lowercase slug.`);
      const { data, content } = matter(await readFile(path.join(dir, name), 'utf-8'));
      const fields = parse(projectSchema, normaliseDates(data), rel);
      return { ...fields, id, html: await renderPair(splitBilingualBody(content, rel)) };
    }),
  );
  return projects.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
});

export async function getProject(id: string) {
  return (await getProjects()).find((p) => p.id === id);
}

/** The image that best represents a project: its cover, else the first screenshot. */
export const projectImage = (p: Project) => p.cover || p.gallery[0] || '';

/** "Download resume" target: the PDF for this language, else the other language's PDF. */
export function resumePdf(site: Site, lang: 'fa' | 'en') {
  const other = lang === 'fa' ? 'en' : 'fa';
  if (site.resume[lang]) return { href: site.resume[lang], lang };
  if (site.resume[other]) return { href: site.resume[other], lang: other };
  return null;
}
