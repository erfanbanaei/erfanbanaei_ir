'use client';

import { useEffect, useState } from 'react';

import { FilterChips, readParam, writeParams } from '@/components/FilterChips';

type Item = { id: string; categories: string[]; card: React.ReactNode };

export function BlogExplorer({ items, categories, labels }: { items: Item[]; categories: string[]; labels: { filter: string; all: string } }) {
  const [category, setCategory] = useState('');
  useEffect(() => setCategory(readParam('category')), []);

  const choose = (value: string) => {
    setCategory(value);
    writeParams({ category: value });
  };
  const visible = items.filter((i) => !category || i.categories.includes(category));

  return (
    <>
      {categories.length > 1 && (
        <div className="mb-10" role="group" aria-label={labels.filter} dir="rtl" lang="fa">
          <FilterChips chips={[{ value: '', label: labels.all }, ...categories.map((c) => ({ value: c, label: c }))]} value={category} onChange={choose} />
        </div>
      )}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((i) => (
          <li key={i.id}>{i.card}</li>
        ))}
      </ul>
    </>
  );
}
