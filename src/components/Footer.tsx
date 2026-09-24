import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { SocialIcon } from '@/components/SocialIcon';
import type { Site } from '@/lib/content';
import { formatNumber, href, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';

export function Footer({ lang, site, t }: { lang: Lang; site: Site; t: Dictionary }) {
  const year = formatNumber(lang, new Date().getFullYear()).replace(/[٬,]/g, '');
  const explore = [
    { path: '/about', label: t.nav.about },
    { path: '/projects', label: t.nav.projects },
    { path: '/blog', label: t.nav.blog },
    { path: '/contact', label: t.nav.contact },
  ];
  const more = [
    { path: '/resume', label: t.nav.resume },
    { path: '/now', label: t.nav.now },
    { path: '/uses', label: t.nav.uses },
  ];

  return (
    <footer className="no-print mt-28 border-t bg-card/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm space-y-4">
          <div>
            <p className="text-lg font-semibold">{site.name[lang]}</p>
            <p className="text-sm text-muted-foreground">{site.role[lang]}</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{t.footer.tagline}</p>
          <ul className="flex flex-wrap gap-1">
            {site.socials.map((s) => (
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
        {[
          { title: t.footer.explore, links: explore },
          { title: t.footer.more, links: more },
        ].map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <p className="mb-4 text-sm font-semibold">{group.title}</p>
            <ul className="space-y-2.5 text-sm">
              {group.links.map((l) => (
                <li key={l.path}>
                  <Link href={href(lang, l.path)} className="text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
              {group.title === t.footer.more && (
                <li>
                  <a href={site.blog.url} className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
                    {t.blog.visit}
                    <ArrowUpRight className="size-3.5 rtl:-scale-x-100" aria-hidden />
                  </a>
                </li>
              )}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="container-page py-6 text-xs text-muted-foreground">
          © {year} {site.name[lang]}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
