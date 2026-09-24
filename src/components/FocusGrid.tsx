import { Bot, Database, Network, Palette, PenLine, Smartphone, Sparkles, Globe, Wrench, type LucideIcon } from 'lucide-react';

import type { Focus } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

const ICONS: Record<Focus['icon'], LucideIcon> = {
  mobile: Smartphone,
  web: Globe,
  automation: Bot,
  design: Palette,
  tools: Wrench,
  network: Network,
  data: Database,
  writing: PenLine,
  other: Sparkles,
};

export function FocusGrid({ items, lang }: { items: Focus[]; lang: Lang }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, i) => {
        const Icon = ICONS[item.icon];
        return (
          <li
            key={item.id}
            className="group surface surface-hover relative overflow-hidden p-6"
            data-reveal
          >
            <div className="pointer-events-none absolute -end-10 -top-10 size-32 rounded-full bg-primary/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0" aria-hidden />
            <span className="relative mb-5 grid size-11 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-brand-2/15 text-brand ring-1 ring-primary/20">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="relative text-base font-semibold">{item.title[lang]}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{item.description[lang]}</p>
          </li>
        );
      })}
    </ul>
  );
}
