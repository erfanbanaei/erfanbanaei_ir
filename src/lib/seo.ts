import type { Metadata } from 'next';

import type { Site } from '@/lib/content';
import { href, otherLang, type Lang } from '@/lib/i18n';
import { getDictionary } from '@/i18n/dictionaries';

/**
 * Absolute base URL. Set SITE_URL for your domain; on Vercel it falls back to the
 * production domain of the project.
 */
export function siteUrl() {
  const explicit = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return 'https://erfanbanaei.ir';
}

export const absolute = (path: string) => new URL(path, `${siteUrl()}/`).href;

export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630 };

type PageMeta = {
  lang: Lang;
  path: string;
  title?: string;
  description: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: 'website' | 'article' | 'profile';
  site: Site;
};

export function pageMetadata({ lang, path, title, description, image, type = 'website', site }: PageMeta): Metadata {
  const t = getDictionary(lang);
  const url = href(lang, path);
  const fullTitle = title ? `${title} | ${site.name[lang]}` : `${site.name[lang]} | ${site.role[lang]}`;
  return {
    title: title ? title : { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: { fa: href('fa', path), en: href('en', path), 'x-default': href('fa', path) },
    },
    openGraph: {
      type,
      url,
      siteName: site.name[lang],
      title: fullTitle,
      description,
      locale: t.meta.locale,
      alternateLocale: getDictionary(otherLang(lang)).meta.locale,
      images: [{ ...OG_IMAGE, alt: site.name[lang], ...image }],
    },
    twitter: { card: 'summary_large_image', site: '@erfan_banaei', creator: '@erfan_banaei', title: fullTitle, description },
  };
}

// -- structured data (schema.org) ----------------------------------------------

export function personSchema(site: Site, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absolute('/#person'),
    name: site.name[lang],
    alternateName: site.name[otherLang(lang)],
    jobTitle: site.role[lang],
    description: site.about.short[lang],
    email: `mailto:${site.email}`,
    url: absolute(href(lang, '/')),
    ...(site.avatar ? { image: absolute(site.avatar) } : {}),
    sameAs: [...site.socials.map((s) => s.url), site.blog.url],
    knowsAbout: ['Software development', 'Mobile app development', 'Web development', 'Flutter', 'Telegram bots'],
  };
}

export function websiteSchema(site: Site, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name[lang],
    url: absolute(href(lang, '/')),
    inLanguage: lang,
    author: { '@id': absolute('/#person') },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: absolute(item.path) })),
  };
}
