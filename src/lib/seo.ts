import type { Lang } from '@/i18n/utils';
import { asset, localize } from '@/i18n/utils';
import type { getSite } from '@/lib/content';

type Site = Awaited<ReturnType<typeof getSite>>;

export const absolute = (path: string, siteUrl: URL | undefined) => new URL(path, siteUrl).href;

export function personSchema(site: Site, lang: Lang, siteUrl: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absolute('/#person', siteUrl),
    name: site.name[lang],
    alternateName: site.name[lang === 'fa' ? 'en' : 'fa'],
    jobTitle: site.role[lang],
    description: site.about.short[lang],
    email: `mailto:${site.email}`,
    url: absolute(localize(lang, '/'), siteUrl),
    ...(site.avatar ? { image: absolute(asset(site.avatar), siteUrl) } : {}),
    sameAs: site.socials.map((s) => s.url),
    knowsAbout: ['Flutter', 'Dart', 'Mobile app development', 'Clean Architecture'],
  };
}

export function websiteSchema(site: Site, lang: Lang, siteUrl: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name[lang],
    url: absolute(localize(lang, '/'), siteUrl),
    inLanguage: lang,
    author: { '@id': absolute('/#person', siteUrl) },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[], siteUrl: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absolute(item.path, siteUrl),
    })),
  };
}

/** "Download resume" goes to the uploaded PDF if there is one, else to the printable page. */
export function resumeLink(site: Site, lang: Lang) {
  const pdf = site.resume[lang] || site.resume[lang === 'fa' ? 'en' : 'fa'];
  return pdf ? { href: asset(pdf), download: true } : { href: localize(lang, '/resume/'), download: false };
}
