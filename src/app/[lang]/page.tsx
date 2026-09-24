import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Download, Mail } from 'lucide-react';

import { ExperienceTimeline } from '@/components/ExperienceTimeline';
import { FocusGrid } from '@/components/FocusGrid';
import { JsonLd } from '@/components/JsonLd';
import { PostCard } from '@/components/PostCard';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeading } from '@/components/SectionHeading';
import { SkillsGrid } from '@/components/SkillsGrid';
import { SocialIcon } from '@/components/SocialIcon';
import { Button } from '@/components/ui/button';
import { getBlogFeed } from '@/lib/blog';
import {
  getCertificates,
  getExperience,
  getFocus,
  getProjects,
  getSite,
  getSkills,
  getTestimonials,
  resumePdf,
} from '@/lib/content';
import { formatNumber, href, isLang } from '@/lib/i18n';
import { pageMetadata, personSchema, websiteSchema } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

// Latest blog posts are refreshed from the feed at most once an hour.
export const revalidate = 3600;

const CODING_SINCE = 2015;

export async function generateMetadata({ params }: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const site = await getSite();
  return pageMetadata({ lang, path: '/', description: site.hero.intro[lang], type: 'profile', site });
}

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const [site, projects, experience, focus, skills, certificates, testimonials] = await Promise.all([
    getSite(),
    getProjects(),
    getExperience(),
    getFocus(),
    getSkills(),
    getCertificates(),
    getTestimonials(),
  ]);
  const feed = await getBlogFeed(site.blog.feedUrl, site.blog.url);
  const featured = (projects.some((p) => p.featured) ? projects.filter((p) => p.featured) : projects).slice(0, 4);
  const current = experience.find((e) => !e.end);
  const pdf = resumePdf(site, lang);
  const years = new Date().getFullYear() - CODING_SINCE;

  const stats = [
    { value: `${formatNumber(lang, years)}+`, label: t.stats.years },
    { value: formatNumber(lang, projects.length), label: t.stats.projects },
    { value: formatNumber(lang, feed.posts.length), label: t.stats.articles },
    { value: formatNumber(lang, certificates.length), label: t.stats.certificates },
  ];

  return (
    <>
      <JsonLd data={[personSchema(site, lang), websiteSchema(site, lang)]} />

      {/* Hero */}
      <section className="relative -mt-16 overflow-hidden pt-16" aria-labelledby="hero-title">
        <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden />
        <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-page relative grid items-center gap-14 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:pb-28">
          <div>
            {current && (
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border bg-card/70 px-3.5 py-1.5 text-xs text-muted-foreground shadow-xs backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                {t.hero.currentlyAt} <span className="font-medium text-foreground">{current.company[lang]}</span>
              </p>
            )}
            <p className="text-lg font-medium text-muted-foreground">{site.hero.greeting[lang]}</p>
            <h1 id="hero-title" className="mt-3 text-4xl leading-[1.15] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {site.hero.headline[lang]}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">{site.hero.intro[lang]}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={href(lang, '/projects')}>
                  {t.hero.viewProjects}
                  <ArrowRight className="rtl:rotate-180" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                {pdf ? (
                  <a href={pdf.href} download>
                    <Download aria-hidden />
                    {t.hero.downloadResume}
                  </a>
                ) : (
                  <Link href={href(lang, '/resume')}>{t.hero.downloadResume}</Link>
                )}
              </Button>
            </div>
          </div>

          {/* Profile card */}
          <div className="relative mx-auto w-full max-w-sm" data-reveal>
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-primary/25 via-transparent to-brand-2/25 blur-2xl" aria-hidden />
            <div className="animate-float surface relative overflow-hidden rounded-3xl p-7">
              <div className="bg-aurora absolute inset-x-0 top-0 h-28 opacity-80" aria-hidden />
              <div className="relative flex items-center gap-4">
                {site.avatar ? (
                  <Image src={site.avatar} alt={site.name[lang]} width={72} height={72} priority className="size-18 rounded-2xl object-cover ring-4 ring-card" />
                ) : (
                  <span
                    className="grid size-18 place-items-center rounded-2xl bg-gradient-to-br from-primary to-brand-2 text-2xl font-bold text-white ring-4 ring-card"
                    aria-hidden
                  >
                    EB
                  </span>
                )}
                <div>
                  <p className="text-lg font-semibold">{site.name[lang]}</p>
                  <p className="text-sm text-muted-foreground">{site.role[lang]}</p>
                </div>
              </div>
              <p className="relative mt-6 inline-flex items-center gap-2 text-sm">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
                {t.hero.open}
              </p>
              <div className="relative mt-6 flex flex-wrap gap-1.5">
                {focus.map((f) => (
                  <span key={f.id} className="rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                    {f.title[lang]}
                  </span>
                ))}
              </div>
              <div className="relative mt-7 flex items-center justify-between border-t pt-5">
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                  <Mail className="size-4" aria-hidden />
                  <span dir="ltr">{site.email}</span>
                </a>
              </div>
              <ul className="relative mt-4 flex flex-wrap gap-0.5">
                {site.socials.slice(0, 6).map((s) => (
                  <li key={s.id + s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="me noopener noreferrer"
                      aria-label={s.label[lang]}
                      title={s.label[lang]}
                      className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <SocialIcon id={s.id} className="size-[1.05rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container-page relative pb-6">
          <dl className="surface grid grid-cols-2 divide-border overflow-hidden sm:grid-cols-4 sm:divide-x rtl:sm:divide-x-reverse" data-reveal>
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-6 text-center max-sm:[&:nth-child(-n+2)]:border-b max-sm:[&:nth-child(odd)]:border-e">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-3xl font-bold tracking-tight">
                  <span className="text-gradient">{s.value}</span>
                </dd>
                <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* What I do */}
      {focus.length > 0 && (
        <section className="container-page py-20" aria-labelledby="focus-heading">
          <SectionHeading id="focus-heading" title={t.home.focus} description={t.home.focusIntro} />
          <FocusGrid items={focus} lang={lang} />
        </section>
      )}

      {/* Selected work */}
      <section className="container-page py-20" aria-labelledby="work-heading">
        <SectionHeading
          id="work-heading"
          title={t.home.featured}
          description={t.home.featuredIntro}
          link={{ href: href(lang, '/projects'), label: t.home.allProjects }}
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {featured.map((project, i) => (
            <div key={project.id} data-reveal>
              <ProjectCard project={project} lang={lang} t={t} sizes="(min-width: 1152px) 560px, (min-width: 640px) 50vw, 100vw" />
            </div>
          ))}
        </div>
      </section>

      {/* About + experience */}
      <section className="container-page py-20" aria-labelledby="about-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal>
            <p className="eyebrow mb-4">{t.home.about}</p>
            <h2 id="about-heading" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {site.name[lang]}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-pretty text-muted-foreground">{site.about.short[lang]}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href={href(lang, '/about')}>
                  {t.home.aboutMore}
                  <ArrowRight className="rtl:rotate-180" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="mb-6 text-sm font-semibold text-muted-foreground">{t.home.journey}</h3>
            <ExperienceTimeline items={experience} lang={lang} t={t} compact />
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="container-page py-20" aria-labelledby="skills-heading">
        <SectionHeading id="skills-heading" title={t.home.skills} description={t.home.skillsIntro} />
        <SkillsGrid skills={skills} lang={lang} t={t} />
      </section>

      {/* Latest from the blog */}
      {feed.posts.length > 0 && (
        <section className="container-page py-20" aria-labelledby="blog-heading">
          <SectionHeading
            id="blog-heading"
            title={t.home.latest}
            description={t.home.latestIntro}
            link={{ href: href(lang, '/blog'), label: t.nav.blog }}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feed.posts.slice(0, 3).map((post, i) => (
              <div key={post.id} data-reveal>
                <PostCard post={post} lang={lang} t={t} />
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" variant="outline">
              <a href={site.blog.url}>
                {t.blog.visit}
                <ArrowUpRight className="rtl:-scale-x-100" aria-hidden />
              </a>
            </Button>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-page py-20" aria-labelledby="testimonials-heading">
          <SectionHeading id="testimonials-heading" title={t.home.testimonials} />
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.id} className="surface flex flex-col gap-5 p-7" data-reveal>
                <blockquote className="text-lg leading-relaxed text-pretty">“{item.quote[lang]}”</blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  {item.avatar && <Image src={item.avatar} alt="" width={40} height={40} className="size-10 rounded-full object-cover" />}
                  <div className="text-sm">
                    <p className="font-semibold">
                      {item.url ? (
                        <a href={item.url} className="hover:underline" target="_blank" rel="noopener noreferrer">
                          {item.name[lang]}
                        </a>
                      ) : (
                        item.name[lang]
                      )}
                    </p>
                    {item.role[lang] && <p className="text-muted-foreground">{item.role[lang]}</p>}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="container-page py-20" aria-labelledby="contact-heading">
        <div className="relative overflow-hidden rounded-3xl border bg-card px-6 py-14 text-center shadow-[var(--shadow-soft)] sm:px-12 sm:py-20" data-reveal>
          <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden />
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div className="relative">
            <h2 id="contact-heading" className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {t.home.contact}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">{t.home.contactIntro}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href={href(lang, '/contact')}>{t.home.contactCta}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`mailto:${site.email}`}>
                  <Mail aria-hidden />
                  <span dir="ltr">{site.email}</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
