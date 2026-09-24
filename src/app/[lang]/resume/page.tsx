import { stat } from 'node:fs/promises';
import path from 'node:path';

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Download, ExternalLink, FileText, Mail } from 'lucide-react';

import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { JsonLd } from '@/components/JsonLd';
import { PrintButton } from '@/components/PrintButton';
import { Button } from '@/components/ui/button';
import { getCertificates, getEducation, getExperience, getProjects, getSite, getSkills, resumePdf, skillCategories } from '@/lib/content';
import { formatNumber, formatPercent, formatYear, href, isLang, type Lang } from '@/lib/i18n';
import { breadcrumbSchema, pageMetadata, personSchema, siteUrl } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: PageProps<'/[lang]/resume'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  const site = await getSite();
  return pageMetadata({ lang, path: '/resume', title: t.resume.title, description: `${site.name[lang]}, ${site.role[lang]}. ${t.resume.description}`, site });
}

async function fileSize(lang: Lang, publicPath: string) {
  try {
    const { size } = await stat(path.join(process.cwd(), 'public', publicPath));
    const mb = size / 1024 / 1024;
    return mb >= 1 ? `${formatNumber(lang, Math.round(mb * 10) / 10)} MB` : `${formatNumber(lang, Math.round(size / 1024))} KB`;
  } catch {
    return '';
  }
}

export default async function ResumePage({ params }: PageProps<'/[lang]/resume'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const [site, skills, projects, experience, education, certificates] = await Promise.all([
    getSite(),
    getSkills(),
    getProjects(),
    getExperience(),
    getEducation(),
    getCertificates(),
  ]);
  const pdf = resumePdf(site, lang);
  const size = pdf ? await fileSize(lang, pdf.href) : '';
  const featured = projects.filter((p) => p.featured).slice(0, 4);
  const h2 = 'mb-5 border-b pb-2 text-sm font-semibold tracking-wide text-brand print:text-black';

  return (
    <>
      <JsonLd
        data={[
          personSchema(site, lang),
          breadcrumbSchema([
            { name: t.nav.home, path: href(lang, '/') },
            { name: t.resume.title, path: href(lang, '/resume') },
          ]),
        ]}
      />
      <div className="container-page max-w-4xl py-12 print:max-w-none print:p-0">
        {/* Download panel */}
        <section className="no-print surface relative mb-10 overflow-hidden p-6 sm:p-8" aria-labelledby="resume-download">
          <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-brand-2 text-white shadow-lg">
                <FileText className="size-6" aria-hidden />
              </span>
              <div>
                <h1 id="resume-download" className="text-2xl font-bold tracking-tight">
                  {t.resume.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {site.name[lang]} · {site.role[lang]}
                  {pdf && size && (
                    <>
                      {' · '}
                      <span dir="ltr">PDF, {size}</span>
                    </>
                  )}
                </p>
                {pdf && pdf.lang !== lang && t.resume.pdfNote && <p className="mt-1 text-xs text-muted-foreground">{t.resume.pdfNote}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {pdf ? (
                <>
                  <Button asChild size="lg">
                    <a href={pdf.href} download>
                      <Download aria-hidden />
                      {t.resume.download}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={pdf.href} target="_blank" rel="noopener">
                      <ExternalLink aria-hidden />
                      {t.resume.view}
                    </a>
                  </Button>
                </>
              ) : (
                <PrintButton label={t.resume.print} />
              )}
            </div>
          </div>
        </section>

        {/* Resume */}
        <article className="surface p-6 sm:p-10 print:border-0 print:p-0 print:shadow-none">
          <header className="flex flex-col gap-5 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-3xl font-bold tracking-tight">{site.name[lang]}</p>
              <p className="mt-1 text-lg text-brand print:text-black">{site.role[lang]}</p>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground sm:text-end" dir="ltr">
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
                  <Mail className="size-3.5" aria-hidden />
                  {site.email}
                </a>
              </li>
              <li>
                <Link href={href(lang, '/')} className="hover:text-foreground">
                  {new URL(siteUrl()).host}
                </Link>
              </li>
              {site.socials
                .filter((s) => ['github', 'linkedin'].includes(s.id))
                .map((s) => (
                  <li key={s.id}>
                    <a href={s.url} className="hover:text-foreground">
                      {s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </a>
                  </li>
                ))}
            </ul>
          </header>

          <section className="mt-8" aria-labelledby="r-summary">
            <h2 id="r-summary" className={h2}>
              {t.resume.summary}
            </h2>
            <p className="text-pretty">{site.about.short[lang]}</p>
          </section>

          <section className="mt-10" aria-labelledby="r-experience">
            <h2 id="r-experience" className={h2}>
              {t.about.experience}
            </h2>
            <ExperienceTimeline items={experience} lang={lang} t={t} compact />
          </section>

          <section className="mt-10 break-inside-avoid" aria-labelledby="r-skills">
            <h2 id="r-skills" className={h2}>
              {t.resume.skills}
            </h2>
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {skillCategories.map((cat) => {
                const items = skills.filter((s) => s.category === cat);
                if (!items.length) return null;
                return (
                  <div key={cat}>
                    <dt className="text-xs font-medium text-muted-foreground">{t.skill[cat]}</dt>
                    <dd className="mt-1 text-sm">
                      {items.map((s, i) => (
                        <span key={s.id}>
                          {i > 0 && (lang === 'fa' ? '، ' : ', ')}
                          <bdi>{s.name[lang]}</bdi> <span className="text-muted-foreground">({formatPercent(lang, s.level)})</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>

          {featured.length > 0 && (
            <section className="mt-10 break-inside-avoid" aria-labelledby="r-projects">
              <h2 id="r-projects" className={h2}>
                {t.resume.projects}
              </h2>
              <ul className="space-y-4">
                {featured.map((p) => (
                  <li key={p.id}>
                    <Link href={href(lang, `/projects/${p.id}`)} className="font-medium hover:text-brand">
                      {p.title[lang]}
                    </Link>
                    <span className="text-muted-foreground"> · </span>
                    <span className="text-sm">{p.summary[lang]}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground" dir="ltr">
                      {p.tech.join(' · ')}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            {education.length > 0 && (
              <section className="break-inside-avoid" aria-labelledby="r-education">
                <h2 id="r-education" className={h2}>
                  {t.about.education}
                </h2>
                <ul className="space-y-2 text-sm">
                  {education.map((e) => {
                    const meta = [e.institution[lang], e.note[lang], formatYear(lang, e.end)].filter(Boolean);
                    return (
                      <li key={e.id}>
                        <span className="font-medium">{e.title[lang]}</span>
                        {meta.length > 0 && <span className="block text-muted-foreground">{meta.join(' · ')}</span>}
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
            {certificates.length > 0 && (
              <section className="break-inside-avoid" aria-labelledby="r-certs">
                <h2 id="r-certs" className={h2}>
                  {t.about.certificates}
                </h2>
                <ul className="space-y-2 text-sm">
                  {certificates.map((c) => (
                    <li key={c.id}>
                      <span className="font-medium">{c.title[lang]}</span>
                      {c.description[lang] && <span className="text-muted-foreground"> · {c.description[lang]}</span>}
                      {c.credentialId && (
                        <span className="block text-xs text-muted-foreground">
                          {t.about.credential}: <span dir="ltr">{c.credentialId}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </article>
      </div>
    </>
  );
}
