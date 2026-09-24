import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CertificateGrid } from '@/components/CertificateGrid';
import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { SectionHeading } from '@/components/SectionHeading';
import { getCertificates, getEducation, getExperience, getSite } from '@/lib/content';
import { formatYear, href, isLang } from '@/lib/i18n';
import { breadcrumbSchema, pageMetadata, personSchema } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: PageProps<'/[lang]/about'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: '/about', title: t.about.title, description: t.about.description, type: 'profile', site: await getSite() });
}

export default async function AboutPage({ params }: PageProps<'/[lang]/about'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const [site, experience, education, certificates] = await Promise.all([getSite(), getExperience(), getEducation(), getCertificates()]);

  return (
    <>
      <JsonLd
        data={[
          { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: personSchema(site, lang) },
          breadcrumbSchema([
            { name: t.nav.home, path: href(lang, '/') },
            { name: t.about.title, path: href(lang, '/about') },
          ]),
        ]}
      />
      <PageHeader title={t.about.title} description={site.about.short[lang]} eyebrow={site.role[lang]} />

      <div className="container-page grid gap-16 py-12 lg:grid-cols-[1fr_17rem]">
        <div className="min-w-0 space-y-20">
          <section aria-labelledby="story">
            <h2 id="story" className="mb-6 text-2xl font-bold tracking-tight">
              {t.about.story}
            </h2>
            <div className="prose-site text-[1.05rem]" dangerouslySetInnerHTML={{ __html: site.html.story[lang] }} />
          </section>

          {site.html.philosophy[lang] && (
            <section aria-labelledby="philosophy" className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-brand-2/8 p-7 sm:p-9" data-reveal>
              <h2 id="philosophy" className="eyebrow mb-4">
                {t.about.philosophy}
              </h2>
              <div className="prose-site text-lg" dangerouslySetInnerHTML={{ __html: site.html.philosophy[lang] }} />
            </section>
          )}

          <section aria-labelledby="experience">
            <SectionHeading id="experience" title={t.about.experience} />
            <ExperienceTimeline items={experience} lang={lang} t={t} />
          </section>

          {education.length > 0 && (
            <section aria-labelledby="education">
              <SectionHeading id="education" title={t.about.education} />
              <ul className="space-y-3">
                {education.map((e) => (
                  <li key={e.id} className="surface flex flex-wrap items-baseline justify-between gap-2 p-5" data-reveal>
                    <div>
                      <h3 className="font-semibold">{e.title[lang]}</h3>
                      {(e.institution[lang] || e.note[lang]) && (
                        <p className="text-sm text-muted-foreground">{[e.institution[lang], e.note[lang]].filter(Boolean).join(' · ')}</p>
                      )}
                    </div>
                    {(e.start || e.end) && (
                      <p className="text-sm text-muted-foreground">{[formatYear(lang, e.start), formatYear(lang, e.end)].filter(Boolean).join(' – ')}</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {certificates.length > 0 && (
            <section aria-labelledby="certificates">
              <SectionHeading id="certificates" title={t.about.certificates} />
              <CertificateGrid items={certificates} lang={lang} t={t} />
            </section>
          )}
        </div>

        {site.about.interests[lang].length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-labelledby="interests">
            <div className="surface p-6">
              <h2 id="interests" className="mb-4 text-sm font-semibold text-muted-foreground">
                {t.about.interests}
              </h2>
              <ul className="space-y-3">
                {site.about.interests[lang].map((item) => (
                  <li key={item} className="flex gap-3 text-sm">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
