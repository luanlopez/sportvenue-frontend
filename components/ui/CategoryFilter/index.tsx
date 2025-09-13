'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { useState } from 'react';

export interface SportCategory {
  id: string;
  name: string;
  value: string;
  icon: React.ElementType;
  disabled?: boolean;
  count?: number;
}

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelect: (value: string | null) => void;
  categories?: SportCategory[];
}

export function CategoryFilter({ selectedCategory, onSelect, categories = [] }: CategoryFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleCategories = showAll ? categories : categories.slice(0, 7);
  return (
    <Tooltip.Provider delayDuration={200}>
      <div className="w-full grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-6">
        {visibleCategories.map((category) => (
          <Tooltip.Root key={category.id}>
            <Tooltip.Trigger asChild>
              <button
                onClick={() => !category.disabled && onSelect(selectedCategory === category.value ? null : category.value)}
                disabled={category.disabled}
                className={`
                  flex flex-col items-center gap-2 bg-sky-50 rounded-xl py-6 hover:shadow-lg transition cursor-pointer
                  ${category.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  ${selectedCategory === category.value ? 'ring-2 ring-blue-400' : ''}
                `}
              >
                <category.icon className="w-8 h-8 mb-2" />
                <div className="font-semibold text-slate-900 text-base">{category.name}</div>
              </button>
            </Tooltip.Trigger>
            {category.disabled && (
              <Tooltip.Portal>
                <Tooltip.Content
                  className="px-3 py-2 rounded-lg text-xs font-medium bg-primary-500 text-tertiary-500 shadow-lg border border-primary-500/20 animate-slideDownAndFade select-none z-[100]"
                  sideOffset={5}
                >
                  Em breve disponível
                  <Tooltip.Arrow className="fill-primary-500" width={10} height={5} />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        ))}
        {categories.length > 7 && (
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 hover:shadow-lg transition cursor-pointer"
          >
            <div className="mb-2 flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-slate-300">
              <span className="text-2xl text-slate-400">{showAll ? '-' : '+'}</span>
            </div>
            <div className="font-semibold text-slate-400 text-base">{showAll ? 'Ver menos' : 'Ver mais'}</div>
            <div className="text-slate-300 text-sm">Mais esportes</div>
          </button>
        )}
      </div>
    </Tooltip.Provider>
  );
} 