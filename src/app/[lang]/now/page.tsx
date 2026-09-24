import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { getNow, getSite } from '@/lib/content';
import { formatDate, href, isLang } from '@/lib/i18n';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: PageProps<'/[lang]/now'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: '/now', title: t.now.title, description: t.now.description, site: await getSite() });
}

export default async function NowPage({ params }: PageProps<'/[lang]/now'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const now = await getNow();
  const [before, after] = t.now.about.split('nownow.com');

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, path: href(lang, '/') },
          { name: t.now.title, path: href(lang, '/now') },
        ])}
      />
      <PageHeader title={t.now.title} description={t.now.description}>
        <p className="mt-6 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
          {t.now.updated}:{' '}
          <time dateTime={now.updated} className="font-medium text-foreground">
            {formatDate(lang, now.updated)}
          </time>
        </p>
      </PageHeader>
      <div className="container-page max-w-3xl py-8">
        <div className="surface p-7 sm:p-10">
          <div className="prose-site text-lg" dangerouslySetInnerHTML={{ __html: now.html[lang] }} />
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          {before}
          <a href="https://nownow.com/about" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">
            nownow.com
          </a>
          {after}
        </p>
      </div>
    </>
  );
}
