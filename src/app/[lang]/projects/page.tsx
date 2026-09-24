import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/JsonLd';
import { PageHeader } from '@/components/PageHeader';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectsExplorer } from '@/components/ProjectsExplorer';
import { getProjects, getSite, projectTypes } from '@/lib/content';
import { href, isLang } from '@/lib/i18n';
import { absolute, breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { getDictionary } from '@/i18n/dictionaries';

export async function generateMetadata({ params }: PageProps<'/[lang]/projects'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDictionary(lang);
  return pageMetadata({ lang, path: '/projects', title: t.projects.title, description: t.projects.description, site: await getSite() });
}

export default async function ProjectsPage({ params }: PageProps<'/[lang]/projects'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDictionary(lang);
  const projects = await getProjects();

  const types = projectTypes.filter((type) => projects.some((p) => p.type === type)).map((type) => ({ value: type, label: t.type[type] }));
  // Technologies ordered by how many projects use them.
  const counts = new Map<string, number>();
  projects.forEach((p) => p.tech.forEach((tech) => counts.set(tech, (counts.get(tech) ?? 0) + 1)));
  const techs = [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tech]) => tech);

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: t.projects.title,
            url: absolute(href(lang, '/projects')),
            hasPart: projects.map((p) => ({ '@type': 'CreativeWork', name: p.title[lang], url: absolute(href(lang, `/projects/${p.id}`)) })),
          },
          breadcrumbSchema([
            { name: t.nav.home, path: href(lang, '/') },
            { name: t.projects.title, path: href(lang, '/projects') },
          ]),
        ]}
      />
      <PageHeader title={t.projects.title} description={t.projects.description} />
      <div className="container-page py-8">
        <ProjectsExplorer
          items={projects.map((p, i) => ({
            id: p.id,
            type: p.type,
            tech: p.tech,
            card: <ProjectCard project={p} lang={lang} t={t} headingLevel="h2" priority={i < 3} />,
          }))}
          types={types}
          techs={techs}
          labels={{
            filter: t.projects.filter,
            all: t.projects.all,
            byType: t.projects.byType,
            byTech: t.projects.byTech,
            empty: t.projects.empty,
            shown: t.projects.shown,
          }}
        />
      </div>
    </>
  );
}
