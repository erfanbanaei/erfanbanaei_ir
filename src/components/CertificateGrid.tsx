import Image from 'next/image';
import { Award, BadgeCheck, ExternalLink } from 'lucide-react';

import type { Certificate } from '@/lib/content';
import { formatMonth, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';

export function CertificateGrid({ items, lang, t }: { items: Certificate[]; lang: Lang; t: Dictionary }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((c) => (
        <li key={c.id} className="surface flex flex-col overflow-hidden" data-reveal>
          {c.image && (
            <a
              href={c.image}
              target="_blank"
              rel="noopener"
              className="group relative block aspect-[4/3] overflow-hidden border-b bg-muted"
              aria-label={`${t.about.viewCertificate}: ${c.title[lang]}`}
            >
              <Image
                src={c.image}
                alt={`${c.title[lang]} ${c.description[lang]}`.trim()}
                fill
                sizes="(min-width: 640px) 420px, 100vw"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </a>
          )}
          <div className="flex flex-1 gap-4 p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-brand" aria-hidden>
              <Award className="size-5" />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-semibold">{c.title[lang]}</h3>
              {c.description[lang] && <p className="text-sm text-muted-foreground">{c.description[lang]}</p>}
              {(c.issuer[lang] || c.date) && (
                <p className="text-xs text-muted-foreground">{[c.issuer[lang], c.date && formatMonth(lang, c.date)].filter(Boolean).join(' · ')}</p>
              )}
              {(c.credentialId || c.credentialUrl) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
                  {c.credentialId && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <BadgeCheck className="size-3.5 text-brand" aria-hidden />
                      {t.about.credential}:
                      <code dir="ltr" className="rounded bg-muted px-1.5 py-0.5 font-mono text-foreground select-all">
                        {c.credentialId}
                      </code>
                    </span>
                  )}
                  {c.credentialUrl && (
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand hover:underline">
                      {t.about.verify}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
