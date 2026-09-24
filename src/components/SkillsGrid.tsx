import { skillCategories, type Skill } from '@/lib/content';
import { formatPercent, type Lang } from '@/lib/i18n';
import type { Dictionary } from '@/i18n/dictionaries';

export function SkillsGrid({ skills, lang, t }: { skills: Skill[]; lang: Lang; t: Dictionary }) {
  const groups = skillCategories
    .map((category) => ({ category, items: skills.filter((s) => s.category === category) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group, i) => (
        <section key={group.category} className="surface p-6" data-reveal>
          <h3 className="mb-5 text-sm font-semibold text-muted-foreground">{t.skill[group.category]}</h3>
          <ul className="space-y-4">
            {group.items.map((skill) => (
              <li key={skill.id}>
                <div className="mb-2 flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-medium">{skill.name[lang]}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{formatPercent(lang, skill.level)}</span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-muted"
                  role="meter"
                  aria-label={skill.name[lang]}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={skill.level}
                  aria-valuetext={formatPercent(lang, skill.level)}
                >
                  <div className="skill-bar h-full rounded-full bg-gradient-to-r from-primary to-brand-2 rtl:bg-gradient-to-l" style={{ '--level': `${skill.level}%` } as React.CSSProperties} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
