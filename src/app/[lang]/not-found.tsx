'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getDictionary } from '@/i18n/dictionaries';

// not-found pages receive no params, so the language comes from the URL.
export default function NotFound() {
  const lang = usePathname().startsWith('/en') ? 'en' : 'fa';
  const t = getDictionary(lang);
  return (
    <section className="relative -mt-16 overflow-hidden pt-16">
      <div className="bg-aurora pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-page relative grid min-h-[65vh] place-items-center py-24 text-center">
        <div>
          <p className="text-gradient text-8xl font-extrabold tracking-tight" dir="ltr">
            404
          </p>
          <h1 className="mt-6 text-3xl font-bold">{t.notFound.title}</h1>
          <p className="mt-3 text-muted-foreground">{t.notFound.text}</p>
          <Button asChild size="lg" className="mt-8">
            <Link href={lang === 'en' ? '/en' : '/'}>{t.notFound.home}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
