import { defaultLang, ui, type Lang, type UiKey } from './ui';

export type { Lang };

export const locales: Lang[] = ['fa', 'en'];

export const dir = (lang: Lang) => (lang === 'fa' ? 'rtl' : 'ltr');

/** `lang` for the `[...locale]` route param: `undefined` → Persian at the root. */
export const langFromParam = (param: string | undefined): Lang => (param === 'en' ? 'en' : defaultLang);

/** Static paths for pages that exist in both languages. */
export const localeStaticPaths = () => [{ params: { locale: undefined } }, { params: { locale: 'en' } }];

export function useTranslations(lang: Lang) {
  return (key: UiKey) => ui[lang][key] ?? ui.en[key];
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes the deploy base path to a root-relative asset path like `/images/x.webp`. */
export const asset = (path: string) => (path.startsWith('/') ? `${base}${path}` : path);

/** Builds a localized URL: `localize('en', '/about/')` → `/en/about/`. */
export function localize(lang: Lang, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${lang === defaultLang ? '' : `/${lang}`}${clean}`;
}

/** Strips base path and language prefix from a pathname, returning the language-neutral path. */
export function neutralPath(pathname: string) {
  let path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  path = path.replace(/^\/en(?=\/|$)/, '');
  return path || '/';
}

const intlLocale = (lang: Lang) => (lang === 'fa' ? 'fa-IR' : 'en-US');

export const formatNumber = (lang: Lang, n: number) => n.toLocaleString(intlLocale(lang));

/** Formats `YYYY-MM-DD` as a full date (Persian solar calendar for fa). */
export function formatDate(lang: Lang, value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat(intlLocale(lang), { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(date);
}

/** Formats `YYYY-MM` as month + year (Persian solar calendar for fa). */
export function formatMonth(lang: Lang, value: string) {
  if (!value) return '';
  const date = new Date(`${value}-15T12:00:00Z`);
  return new Intl.DateTimeFormat(intlLocale(lang), { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
}

export const formatYear = (lang: Lang, value: string) =>
  value ? new Intl.DateTimeFormat(intlLocale(lang), { year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value.slice(0, 7)}-15T12:00:00Z`)) : '';

export const formatPercent = (lang: Lang, n: number) =>
  (n / 100).toLocaleString(intlLocale(lang), { style: 'percent', maximumFractionDigits: 0 });
