import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { bilingualMarkdownLoader, jsonArrayLoader, jsonSingletonLoader } from './lib/loaders';

// Schemas mirror docs/CONTENT.md. Keep the two in sync.

const text = z.string().trim().min(1);
const i18n = z.object({ fa: text, en: text });
const i18nOptional = z.object({ fa: z.string(), en: z.string() }).default({ fa: '', en: '' });
const i18nList = z.object({ fa: z.array(text), en: z.array(text) }).default({ fa: [], en: [] });
const html = z.object({ fa: z.string(), en: z.string() });

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'IDs must be lowercase slugs (a-z, 0-9, "-")');
const month = z.union([z.literal(''), z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected "YYYY-MM"')]).default('');
const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected "YYYY-MM-DD"');
const url = z.union([z.literal(''), z.url({ protocol: /^https?$/ })]).default('');
const image = z
  .union([z.literal(''), z.string().regex(/^\/images\/.+\.(webp|avif|png|jpe?g|svg|gif)$/, 'Images must live under /images/')])
  .default('');
const file = z.union([z.literal(''), z.string().regex(/^\/files\/.+$/, 'Files must live under /files/')]).default('');
const order = { _order: z.number().int() };

export const skillCategories = ['mobile', 'languages', 'web', 'backend', 'tools', 'design', 'other'] as const;
export const employmentTypes = ['full-time', 'part-time', 'freelance', 'contract', 'internship'] as const;
export const projectTypes = ['app', 'ui', 'template', 'website', 'tool', 'library', 'other'] as const;
export const usesCategories = ['hardware', 'software', 'devtools', 'books', 'courses', 'other'] as const;
export const socialIds = ['linkedin', 'github', 'x', 'youtube', 'instagram', 'telegram', 'aparat', 'email', 'website', 'other'] as const;

const site = defineCollection({
  loader: jsonSingletonLoader('site.json', ['about.story', 'about.philosophy']),
  schema: z.object({
    name: i18n,
    role: i18n,
    avatar: image,
    hero: z.object({ greeting: i18n, headline: i18n, intro: i18n }),
    about: z.object({
      short: i18n,
      story: i18n,
      philosophy: i18nOptional,
      interests: i18nList,
    }),
    email: z.email(),
    socials: z.array(z.object({ id: z.enum(socialIds), label: i18n, url: z.string().min(1) })),
    resume: z.object({ fa: file, en: file }).default({ fa: '', en: '' }),
    integrations: z
      .object({
        web3formsKey: z.string().default(''),
        giscus: z
          .object({
            repo: z.string().default(''),
            repoId: z.string().default(''),
            category: z.string().default(''),
            categoryId: z.string().default(''),
          })
          .default({ repo: '', repoId: '', category: '', categoryId: '' }),
      })
      .default({ web3formsKey: '', giscus: { repo: '', repoId: '', category: '', categoryId: '' } }),
    html: z.record(z.string(), html),
  }),
});

const now = defineCollection({
  loader: jsonSingletonLoader('now.json', ['body']),
  schema: z.object({ updated: day, body: i18n, html: z.record(z.string(), html) }),
});

const skills = defineCollection({
  loader: jsonArrayLoader('skills.json'),
  schema: z.object({
    id: slug,
    name: i18n,
    level: z.number().int().min(0).max(100),
    category: z.enum(skillCategories),
    ...order,
  }),
});

const experience = defineCollection({
  loader: jsonArrayLoader('experience.json'),
  schema: z.object({
    id: slug,
    company: i18n,
    role: i18n,
    employment: z.enum(employmentTypes),
    start: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected "YYYY-MM"'),
    end: month,
    url,
    highlights: i18nList,
    tech: z.array(text).default([]),
    ...order,
  }),
});

const education = defineCollection({
  loader: jsonArrayLoader('education.json'),
  schema: z.object({
    id: slug,
    title: i18n,
    institution: i18nOptional,
    start: month,
    end: month,
    note: i18nOptional,
    ...order,
  }),
});

const certificates = defineCollection({
  loader: jsonArrayLoader('certificates.json'),
  schema: z.object({
    id: slug,
    title: i18n,
    description: i18nOptional,
    issuer: i18nOptional,
    date: month,
    image,
    credentialId: z.string().default(''),
    credentialUrl: url,
    ...order,
  }),
});

const uses = defineCollection({
  loader: jsonArrayLoader('uses.json'),
  schema: z.object({
    id: slug,
    category: z.enum(usesCategories),
    name: i18n,
    description: i18nOptional,
    url,
    ...order,
  }),
});

const testimonials = defineCollection({
  loader: jsonArrayLoader('testimonials.json'),
  schema: z.object({
    id: slug,
    name: i18n,
    role: i18nOptional,
    quote: i18n,
    avatar: image,
    url,
    ...order,
  }),
});

const projects = defineCollection({
  loader: bilingualMarkdownLoader('projects'),
  schema: z.object({
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
    html,
    readingMinutes: z.object({ fa: z.number(), en: z.number() }),
  }),
});

const blog = defineCollection({
  loader: bilingualMarkdownLoader('blog'),
  schema: z.object({
    title: i18n,
    description: i18n,
    date: day,
    updated: z.union([z.literal(''), day]).default(''),
    tags: i18nList,
    cover: image,
    draft: z.boolean().default(false),
    html,
    readingMinutes: z.object({ fa: z.number(), en: z.number() }),
  }),
});

export const collections = { site, now, skills, experience, education, certificates, uses, testimonials, projects, blog };
