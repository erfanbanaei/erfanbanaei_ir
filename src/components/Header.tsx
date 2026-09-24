'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages, Menu } from 'lucide-react';

import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { dir, href, neutralPath, otherLang, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';
import { cn } from '@/lib/utils';

type Props = {
  lang: Lang;
  name: string;
  role: string;
  t: Pick<Dictionary, 'nav' | 'lang' | 'theme'>;
};

export function Header({ lang, name, role, t }: Props) {
  const pathname = usePathname();
  const path = neutralPath(pathname);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primary = [
    { path: '/about', label: t.nav.about },
    { path: '/projects', label: t.nav.projects },
    { path: '/blog', label: t.nav.blog },
    { path: '/resume', label: t.nav.resume },
    { path: '/contact', label: t.nav.contact },
  ];
  const secondary = [
    { path: '/now', label: t.nav.now },
    { path: '/uses', label: t.nav.uses },
  ];
  const isActive = (p: string) => path === p || path.startsWith(`${p}/`);
  const other = otherLang(lang);

  return (
    <header
      className={cn(
        'no-print sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled ? 'border-border bg-background/75 backdrop-blur-xl' : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href={href(lang, '/')} className="group flex items-center gap-3 rounded-lg">
          <span
            aria-hidden
            className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-brand-2 text-[0.8rem] font-bold tracking-tight text-white shadow-[0_6px_16px_-6px_rgb(0_184_217/0.7)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
          >
            EB
          </span>
          <span className="flex flex-col leading-tight max-sm:sr-only">
            <span className="text-[0.95rem] font-semibold">{name}</span>
            <span className="text-xs text-muted-foreground">{role}</span>
          </span>
        </Link>

        <nav aria-label={t.nav.main} className="hidden md:block">
          <ul className="flex items-center gap-0.5 rounded-full border bg-card/60 p-1 shadow-xs backdrop-blur">
            {primary.map((item) => (
              <li key={item.path}>
                <Link
                  href={href(lang, item.path)}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className="block rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:bg-primary/12 aria-[current=page]:font-medium aria-[current=page]:text-brand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground">
            <Link href={href(other, path)} hrefLang={other} lang={other} aria-label={t.lang.switchLabel} prefetch={false}>
              <Languages aria-hidden />
              <span>{t.lang.switch}</span>
            </Link>
          </Button>
          <ThemeToggle labels={t.theme} dir={dir(lang)} />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t.nav.menu}>
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side={lang === 'fa' ? 'right' : 'left'} closeLabel={t.nav.close} dir={dir(lang)} aria-describedby={undefined}>
              <SheetTitle className="pt-1 text-lg">{name}</SheetTitle>
              <nav aria-label={t.nav.main}>
                <ul className="grid gap-1">
                  {[{ path: '/', label: t.nav.home }, ...primary, ...secondary].map((item) => (
                    <li key={item.path}>
                      <SheetClose asChild>
                        <Link
                          href={href(lang, item.path)}
                          aria-current={(item.path === '/' ? path === '/' : isActive(item.path)) ? 'page' : undefined}
                          className="block rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:bg-primary/10 aria-[current=page]:font-medium aria-[current=page]:text-brand"
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
