import type { Experience } from '@/lib/content';
import { formatMonth, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';
import { TechBadges } from '@/components/TechBadges';

export function ExperienceTimeline({
  items,
  lang,
  t,
  compact = false,
}: {
  items: Experience[];
  lang: Lang;
  t: Dictionary;
  compact?: boolean;
}) {
  return (
    <ol className="relative space-y-10 border-s border-border ps-7">
      {items.map((item) => (
        <li key={item.id} className="relative" data-reveal>
          <span
            className={
              item.end
                ? 'absolute -start-[2.2rem] top-1.5 size-3.5 rounded-full border-2 border-background bg-muted-foreground/40'
                : 'absolute -start-[2.2rem] top-1.5 size-3.5 rounded-full border-2 border-background bg-primary ring-4 ring-primary/20'
            }
            aria-hidden
          />
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg font-semibold">
              {item.role[lang]}
              <span className="text-muted-foreground"> · </span>
              {item.url ? (
                <a href={item.url} className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">
                  {item.company[lang]}
                </a>
              ) : (
                <span className="text-brand">{item.company[lang]}</span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              <time dateTime={item.start}>{formatMonth(lang, item.start)}</time>
              {' – '}
              {item.end ? <time dateTime={item.end}>{formatMonth(lang, item.end)}</time> : t.about.present}
            </p>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{t.employment[item.employment]}</p>
          {item.highlights[lang].length > 0 && (
            <ul className="mt-3 list-disc space-y-1.5 ps-5 text-[0.95rem] marker:text-brand">
              {item.highlights[lang].map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}
          {!compact && item.tech.length > 0 && (
            <div className="mt-4">
              <TechBadges items={item.tech} variant="outline" />
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
