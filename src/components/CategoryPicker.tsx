import { useState } from 'react';
import type { User } from 'firebase/auth';
import type { Category } from '../game/types';

interface Props {
  official: Category[];
  custom: Category[];
  selected: string;
  onSelect: (id: string, name: string) => void;
  user: User | null | undefined;
}

export function CategoryPicker({ official, custom, selected, onSelect, user }: Props) {
  const [tab, setTab] = useState<'official' | 'custom'>('official');

  const list = tab === 'official' ? official : custom;

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

      <div className="space-y-2 max-h-60 overflow-y-auto scroll-hidden">
        {tab === 'official' && (
          <button
            onClick={() => onSelect('__random__', 'Random')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all btn-press border-2 ${
              selected === '__random__'
                ? 'border-purple-light bg-purple-mid/20'
                : 'border-transparent bg-surface hover:border-border'
            }`}
          >
            <span className="text-2xl">🎲</span>
            <div className="text-left flex-1">
              <div className="text-white font-semibold text-sm">Surprise me</div>
              <div className="text-gray-500 text-xs">Random category</div>
            </div>
            {selected === '__random__' && <span className="text-purple-pale">✓</span>}
          </button>
        )}

        {list.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id, cat.name)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all btn-press border-2 ${
              selected === cat.id
                ? 'border-purple-light bg-purple-mid/20'
                : 'border-transparent bg-surface hover:border-border'
            }`}
          >
            <span className="text-2xl">{cat.emoji}</span>
            <div className="text-left flex-1 min-w-0">
              <div className="text-white font-semibold text-sm truncate">{cat.name}</div>
              <div className="text-gray-500 text-xs">{cat.entries.length} words</div>
            </div>
            {selected === cat.id && <span className="text-purple-pale flex-shrink-0">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
