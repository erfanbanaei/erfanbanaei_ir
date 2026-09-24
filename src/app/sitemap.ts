import type { MetadataRoute } from 'next';

import { getProjects } from '@/lib/content';
import { href } from '@/lib/i18n';
import { absolute } from '@/lib/seo';

const PAGES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/projects', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/blog', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/resume', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/now', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/uses', priority: 0.4, changeFrequency: 'yearly' },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const paths = [
    ...PAGES,
    ...projects.map((p) => ({ path: `/projects/${p.id}`, priority: 0.7, changeFrequency: 'monthly' as const })),
  ];
  const lastModified = new Date();
  // One entry per language, each listing both versions as alternates (hreflang).
  return paths.flatMap(({ path, priority, changeFrequency }) =>
    (['fa', 'en'] as const).map((lang) => ({
      url: absolute(href(lang, path)),
      lastModified,
      changeFrequency,
      priority: lang === 'fa' ? priority : Math.round(priority * 90) / 100,
      alternates: { languages: { fa: absolute(href('fa', path)), en: absolute(href('en', path)) } },
    })),
  );
}
