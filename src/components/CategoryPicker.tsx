import { useState } from 'react';
import type { User } from 'firebase/auth';
import type { Category } from '../game/types';

interface Props {
  official: Category[];
  custom: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  user: User | null | undefined;
}

export function CategoryPicker({ official, custom, selectedIds, onToggle, user }: Props) {
  const [tab, setTab] = useState<'official' | 'custom'>('official');

  const list = tab === 'official' ? official : custom;
  const count = selectedIds.length;

  return (
    <div className="space-y-3">
      <div className="flex bg-surface border border-border rounded-xl p-1 gap-1">
        {(['official', 'custom'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all btn-press ${
              tab === t ? 'bg-purple-gradient text-white shadow' : 'text-gray-400'
            }`}
          >
            {t === 'official' ? 'Official' : 'My Categories'}
          </button>
        ))}
      </div>

      {count > 0 && (
        <div className="bg-purple-mid/10 border border-purple-light/20 rounded-xl px-3 py-2">
          <span className="text-purple-pale text-xs font-semibold">
            {count === 1
              ? '1 category selected'
              : `${count} categories selected — one picked randomly at start`}
          </span>
        </div>
      )}

      {tab === 'custom' && (!user || user.isAnonymous) && (
        <p className="text-gray-400 text-sm text-center py-4">
          Sign in with Google to use custom categories.
        </p>
      )}

      {tab === 'custom' && user && !user.isAnonymous && custom.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No custom categories yet. Create one in Categories.
        </p>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto scroll-hidden">
        {list.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all btn-press border-2 ${
                isSelected
                  ? 'border-purple-light bg-purple-mid/20'
                  : 'border-transparent bg-surface hover:border-border'
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="text-left flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate">{cat.name}</div>
                <div className="text-gray-500 text-xs">{cat.entries.length} words</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected ? 'border-purple-light bg-purple-light' : 'border-gray-600'
              }`}>
                {isSelected && <span className="text-white text-xs font-bold leading-none">✓</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
