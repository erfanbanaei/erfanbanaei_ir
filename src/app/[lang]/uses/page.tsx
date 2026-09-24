import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { getSite, getUses, usesCategories } from '@/lib/content';
import { href, isLang } from '@/lib/i18n';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: PageProps<'/[lang]/uses'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: '/uses', title: t.uses.title, description: t.uses.description, site: await getSite() });
}

export default async function UsesPage({ params }: PageProps<'/[lang]/uses'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const uses = await getUses();
  const groups = usesCategories.map((c) => ({ c, items: uses.filter((u) => u.category === c) })).filter((g) => g.items.length);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: t.nav.home, path: href(lang, '/') },
          { name: t.uses.title, path: href(lang, '/uses') },
        ])}
      />
      <PageHeader title={t.uses.title} description={t.uses.description} />
      <div className="container-page max-w-3xl space-y-14 py-8">
        {groups.map(({ c, items }) => (
          <section key={c} aria-labelledby={`uses-${c}`} data-reveal>
            <h2 id={`uses-${c}`} className="mb-5 text-xl font-semibold">
              {t.usesCategory[c]}
            </h2>
            <ul className="surface divide-y overflow-hidden">
              {items.map((item) => (
                <li key={item.id} className="group relative flex items-start justify-between gap-4 p-5 transition-colors hover:bg-accent/50">
                  <div>
                    <h3 className="font-medium">
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0 group-hover:text-brand">
                          {item.name[lang]}
                        </a>
                      ) : (
                        item.name[lang]
                      )}
                    </h3>
                    {item.description[lang] && <p className="mt-1 text-sm text-muted-foreground">{item.description[lang]}</p>}
                  </div>
                  {item.url && <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-brand rtl:-scale-x-100" aria-hidden />}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
