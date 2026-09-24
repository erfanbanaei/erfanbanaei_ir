import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Rss } from 'lucide-react';

import { BlogExplorer } from '@/components/BlogExplorer';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { PostCard } from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { getBlogFeed } from '@/lib/blog';
import { getSite } from '@/lib/content';
import { href, isLang } from '@/lib/i18n';
import { absolute, breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

// Posts come from the blog's RSS feed and are refreshed at most once an hour.
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[lang]/blog'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: '/blog', title: t.blog.title, description: t.blog.description, site: await getSite() });
}

export default async function BlogPage({ params }: PageProps<'/[lang]/blog'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const site = await getSite();
  const { posts } = await getBlogFeed(site.blog.feedUrl, site.blog.url);
  const [latest, ...rest] = posts;
  const categories = [...new Set(rest.flatMap((p) => p.categories))];

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: t.blog.title,
            url: site.blog.url,
            inLanguage: 'fa',
            author: { '@id': absolute('/#person') },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: p.url,
              ...(p.date ? { datePublished: p.date } : {}),
              ...(p.image ? { image: p.image.src.startsWith('/') ? absolute(p.image.src) : p.image.src } : {}),
            })),
          },
          breadcrumbSchema([
            { name: t.nav.home, path: href(lang, '/') },
            { name: t.blog.title, path: href(lang, '/blog') },
          ]),
        ]}
      />
      <PageHeader title={t.blog.title} description={t.blog.description}>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href={site.blog.url}>
              {t.blog.visit}
              <ArrowUpRight className="rtl:-scale-x-100" aria-hidden />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={site.blog.feedUrl}>
              <Rss className="text-brand" aria-hidden />
              RSS
            </a>
          </Button>
        </div>
        {t.blog.persianNote && <p className="mt-5 text-sm text-muted-foreground">{t.blog.persianNote}</p>}
      </PageHeader>

      <div className="container-page space-y-14 py-8">
        {!latest && <p className="py-20 text-center text-muted-foreground">{t.blog.empty}</p>}
        {latest && (
          <section aria-labelledby="latest-post">
            <h2 id="latest-post" className="eyebrow mb-4">
              {t.blog.latestPost}
            </h2>
            <PostCard post={latest} lang={lang} t={t} variant="feature" priority />
          </section>
        )}
        {rest.length > 0 && (
          <BlogExplorer
            items={rest.map((post) => ({ id: post.id, categories: post.categories, card: <PostCard post={post} lang={lang} t={t} headingLevel="h2" /> }))}
            categories={categories}
            labels={{ filter: t.blog.filter, all: t.blog.all }}
          />
        )}
      </div>
    </>
  );
}
