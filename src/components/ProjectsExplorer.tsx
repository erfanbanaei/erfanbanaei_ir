'use client';

import { useEffect, useState } from 'react';

import { FilterChips, readParam, writeParams, type Chip } from '@/components/FilterChips';

type Item = { id: string; type: string; tech: string[]; card: React.ReactNode };

export function ProjectsExplorer({
  items,
  types,
  techs,
  labels,
}: {
  items: Item[];
  types: Chip[];
  techs: string[];
  labels: { filter: string; all: string; byType: string; byTech: string; empty: string; shown: string };
}) {
  const [type, setType] = useState('');
  const [tech, setTech] = useState('');

  useEffect(() => {
    setType(readParam('type'));
    setTech(readParam('tech'));
  }, []);

  const update = (next: { type?: string; tech?: string }) => {
    const t = next.type ?? type;
    const s = next.tech ?? tech;
    setType(t);
    setTech(s);
    writeParams({ type: t, tech: s });
  };

  const visible = items.filter((i) => (!type || i.type === type) && (!tech || i.tech.includes(tech)));

  return (
    <>
      {items.length > 1 && (
        <div className="mb-10 space-y-3" role="group" aria-label={labels.filter}>
          <FilterChips label={labels.byType} chips={[{ value: '', label: labels.all }, ...types]} value={type} onChange={(v) => update({ type: v })} />
          <FilterChips
            label={labels.byTech}
            chips={[{ value: '', label: labels.all }, ...techs.map((t) => ({ value: t, label: t, ltr: true }))]}
            value={tech}
            onChange={(v) => update({ tech: v })}
          />
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {visible.length} {labels.shown}
      </p>
      {visible.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((i) => (
            <li key={i.id}>{i.card}</li>
          ))}
        </ul>
      ) : (
        <p className="py-20 text-center text-muted-foreground">{labels.empty}</p>
      )}
    </>
  );
}
