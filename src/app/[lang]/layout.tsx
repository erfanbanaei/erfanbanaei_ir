import type { Metadata, Viewport } from 'next';
import { Inter, Vazirmatn } from 'next/font/google';
import { notFound } from 'next/navigation';

import '../globals.css';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSite } from '@/lib/content';
import { dir, isLang, locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

// Vazirmatn sets Persian text (with its matching Latin for mixed lines); Inter sets English. See globals.css.
const vazirmatn = Vazirmatn({ subsets: ['arabic', 'latin'], variable: '--font-vazirmatn', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const site = await getSite();
  return {
    metadataBase: new URL(`${siteUrl()}/`),
    title: { default: `${site.name[lang]} | ${site.role[lang]}`, template: `%s | ${site.name[lang]}` },
    description: site.about.short[lang],
    applicationName: site.name[lang],
    authors: [{ name: site.name[lang], url: siteUrl() }],
    creator: site.name[lang],
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/icons/apple-touch-icon.png',
    },
    alternates: { types: { 'application/rss+xml': [{ url: site.blog.feedUrl, title: `${site.name[lang]} blog` }] } },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
  colorScheme: 'light dark',
};

export default async function LangLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const site = await getSite();
  const t = getDictionary(lang);

  return (
    <html lang={lang} dir={dir(lang)} className={`${vazirmatn.variable} ${inter.variable}`} suppressHydrationWarning>
      {/* Browser extensions often add attributes to <body>; don't report those as hydration errors. */}
      <body className="flex min-h-dvh flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
          >
            {t.meta.skip}
          </a>
          <Header lang={lang} name={site.name[lang]} role={site.role[lang]} t={{ nav: t.nav, lang: t.lang, theme: t.theme }} />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer lang={lang} site={site} t={t} />
        </ThemeProvider>
      </body>
    </html>
  );
}
