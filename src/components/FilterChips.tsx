'use client';

import { cn } from '@/lib/utils';

export type Chip = { value: string; label: string; ltr?: boolean };

/** A row of toggle buttons; the empty value means "all". */
export function FilterChips({
  label,
  chips,
  value,
  onChange,
}: {
  label?: string;
  chips: Chip[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="me-1 w-full text-xs font-medium text-muted-foreground sm:w-20">{label}</span>}
      {chips.map((chip) => (
        <button
          key={chip.value || 'all'}
          type="button"
          aria-pressed={value === chip.value}
          dir={chip.ltr ? 'ltr' : undefined}
          onClick={() => onChange(chip.value)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm transition-colors',
            value === chip.value
              ? 'border-primary bg-primary/10 font-medium text-brand'
              : 'bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

/** Reads/writes simple filter state in the query string without a navigation. */
export function readParam(name: string) {
  return typeof window === 'undefined' ? '' : (new URLSearchParams(window.location.search).get(name) ?? '');
}

export function writeParams(values: Record<string, string>) {
  const params = new URLSearchParams(window.location.search);
  for (const [k, v] of Object.entries(values)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  const query = params.toString();
  window.history.replaceState(window.history.state, '', query ? `?${query}` : window.location.pathname);
}
