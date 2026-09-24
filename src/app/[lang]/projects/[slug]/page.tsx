import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check, Download } from 'lucide-react';

import { JsonLd } from '@/components/JsonLd';
import { ProjectCard } from '@/components/ProjectCard';
import { SocialIcon } from '@/components/SocialIcon';
import { TechBadges } from '@/components/TechBadges';
import { Button } from '@/components/ui/button';
import { getProject, getProjects, getSite } from '@/lib/content';
import { formatMonth, href, isLang, locales } from '@/lib/i18n';
import { absolute, breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getProjects();
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.id })));
}

export async function generateMetadata({ params }: PageProps<'/[lang]/projects/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = await getProject(slug);
  if (!isLang(lang) || !project) return {};
  const image = project.cover || project.gallery[0];
  return pageMetadata({
    lang,
    path: `/projects/${slug}`,
    title: project.title[lang],
    description: project.summary[lang],
    image: image ? { url: image, alt: project.title[lang] } : undefined,
    site: await getSite(),
  });
}

export default async function ProjectPage({ params }: PageProps<'/[lang]/projects/[slug]'>) {
  const { lang, slug } = await params;
  const project = await getProject(slug);
  if (!isLang(lang) || !project) notFound();
  const t = getDictionary(lang);
  const [site, projects] = await Promise.all([getSite(), getProjects()]);
  const url = href(lang, `/projects/${slug}`);
  const others = projects.filter((p) => p.id !== slug).slice(0, 3);
  const images = [project.cover, ...project.gallery].filter(Boolean);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: project.title[lang],
            description: project.summary[lang],
            applicationCategory: project.type === 'website' ? 'WebApplication' : 'MobileApplication',
            operatingSystem: 'Android, iOS, Web',
            url: absolute(url),
            ...(images[0] ? { image: absolute(images[0]) } : {}),
            ...(project.links.github ? { codeRepository: project.links.github } : {}),
            keywords: project.tech.join(', '),
            author: { '@id': absolute('/#person'), '@type': 'Person', name: site.name[lang] },
          },
          breadcrumbSchema([
            { name: t.nav.home, path: href(lang, '/') },
            { name: t.projects.title, path: href(lang, '/projects') },
            { name: project.title[lang], path: url },
          ]),
        ]}
      />

      <article>
        <header className="relative -mt-16 overflow-hidden pt-16">
          <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden />
          <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden />
          <div className="container-page relative pt-10 pb-12">
            <Link
              href={href(lang, '/projects')}
              className="group mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5" aria-hidden />
              {t.projects.back}
            </Link>
            <p className="eyebrow mb-4">
              {t.type[project.type]}
              {project.date && <span className="text-muted-foreground">· {formatMonth(lang, project.date)}</span>}
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-6xl">{project.title[lang]}</h1>
            <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">{project.summary[lang]}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {project.links.demo && (
                <Button asChild size="lg">
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                    {t.projects.demo}
                    <ArrowUpRight className="rtl:-scale-x-100" aria-hidden />
                  </a>
                </Button>
              )}
              {project.links.github && (
                <Button asChild size="lg" variant="outline">
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                    <SocialIcon id="github" className="size-4" />
                    {t.projects.github}
                  </a>
                </Button>
              )}
              {project.links.store && (
                <Button asChild size="lg" variant="outline">
                  <a href={project.links.store} target="_blank" rel="noopener noreferrer">
                    <Download aria-hidden />
                    {t.projects.store}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </header>

        <div className="container-page grid gap-12 pt-6 lg:grid-cols-[1fr_18rem]">
          <div className="min-w-0 space-y-12">
            {images.length > 0 && (
              <section aria-label={t.projects.gallery}>
                <ul className={images.length > 1 ? 'grid gap-4 sm:grid-cols-2' : 'grid'}>
                  {images.map((src, i) => (
                    <li key={src} className="surface relative aspect-[16/10] overflow-hidden">
                      <a href={src} target="_blank" rel="noopener" className="group block size-full">
                        <Image
                          src={src}
                          alt={`${project.title[lang]} (${i + 1})`}
                          fill
                          priority={i === 0}
                          sizes={images.length > 1 ? '(min-width: 1024px) 400px, 50vw' : '(min-width: 1024px) 800px, 100vw'}
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {project.html[lang] && (
              <section aria-labelledby="details">
                <h2 id="details" className="mb-4 text-xl font-semibold">
                  {t.projects.details}
                </h2>
                <div className="prose-site" dangerouslySetInnerHTML={{ __html: project.html[lang] }} />
              </section>
            )}
            {project.features[lang].length > 0 && (
              <section aria-labelledby="features">
                <h2 id="features" className="mb-5 text-xl font-semibold">
                  {t.projects.features}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.features[lang].map((f) => (
                    <li key={f} className="surface flex gap-3 p-4 text-sm">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/12 text-brand">
                        <Check className="size-3.5" aria-hidden />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="surface space-y-4 p-6">
              <h2 className="text-sm font-semibold text-muted-foreground">{t.projects.tech}</h2>
              <TechBadges items={project.tech} variant="brand" />
            </div>
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section className="container-page mt-20 border-t pt-14" aria-labelledby="more-projects">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 id="more-projects" className="text-2xl font-bold tracking-tight">
              {t.projects.more}
            </h2>
            <Link href={href(lang, '/projects')} className="text-sm font-medium text-brand hover:underline">
              {t.home.allProjects}
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} lang={lang} t={t} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
