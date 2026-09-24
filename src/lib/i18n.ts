export const locales = ['fa', 'en'] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = 'fa';

export const isLang = (value: string): value is Lang => (locales as readonly string[]).includes(value);

export const dir = (lang: Lang) => (lang === 'fa' ? 'rtl' : 'ltr');

export const otherLang = (lang: Lang): Lang => (lang === 'fa' ? 'en' : 'fa');

/** Localized path: Persian at the root, English under /en. `href('en', '/about')` → `/en/about`. */
export function href(lang: Lang, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

/** Strips the /en prefix, giving the language-neutral path used to build the other language's URL. */
export function neutralPath(pathname: string) {
  const path = pathname.replace(/^\/(en|fa)(?=\/|$)/, '');
  return path || '/';
}

const intl = (lang: Lang) => (lang === 'fa' ? 'fa-IR' : 'en-US');

export const formatNumber = (lang: Lang, n: number) => n.toLocaleString(intl(lang));

export const formatPercent = (lang: Lang, n: number) =>
  (n / 100).toLocaleString(intl(lang), { style: 'percent', maximumFractionDigits: 0 });

/** Full date; Persian uses the solar calendar. Accepts `YYYY-MM-DD` or any ISO date. */
export function formatDate(lang: Lang, value: string) {
  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value);
  return new Intl.DateTimeFormat(intl(lang), { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

/** Month and year from `YYYY-MM`. */
export function formatMonth(lang: Lang, value: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat(intl(lang), { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(
    new Date(`${value}-15T12:00:00Z`),
  );
}

export function formatYear(lang: Lang, value: string) {
  if (!value) return '';
  return new Intl.DateTimeFormat(intl(lang), { year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${value.slice(0, 7)}-15T12:00:00Z`),
  );
}
