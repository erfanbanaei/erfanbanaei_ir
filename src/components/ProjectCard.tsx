import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { ProjectVisual } from '@/components/ProjectVisual';
import { SocialIcon } from '@/components/SocialIcon';
import { TechBadges } from '@/components/TechBadges';
import { projectImage, type Project } from '@/lib/content';
import { href, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';

type Props = {
  project: Project;
  lang: Lang;
  t: Dictionary;
  headingLevel?: 'h2' | 'h3';
  priority?: boolean;
  sizes?: string;
};

export function ProjectCard({ project, lang, t, headingLevel: H = 'h3', priority, sizes = '(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw' }: Props) {
  const url = href(lang, `/projects/${project.id}`);
  const iconLink = 'relative z-10 grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';
  return (
    <article className="group surface surface-hover relative flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted">
        <ProjectVisual id={project.id} title={project.title.en} src={projectImage(project)} alt={project.title[lang]} sizes={sizes} priority={priority} />
        {project.featured && (
          <span className="absolute start-3 top-3 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[0.7rem] font-medium text-white backdrop-blur">
            {t.projects.featured}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs font-medium text-brand">{t.type[project.type]}</p>
        <H className="text-lg leading-snug font-semibold">
          <Link href={url} className="after:absolute after:inset-0 after:content-['']">
            {project.title[lang]}
          </Link>
        </H>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary[lang]}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <TechBadges items={project.tech} limit={3} />
          <div className="flex shrink-0 gap-0.5">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" aria-label={`${t.projects.github}: ${project.title[lang]}`} className={iconLink}>
                <SocialIcon id="github" className="size-4" />
              </a>
            )}
            {project.links.demo && (
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer" aria-label={`${t.projects.demo}: ${project.title[lang]}`} className={iconLink}>
                <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
