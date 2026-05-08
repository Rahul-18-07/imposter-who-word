import { useState } from 'react';
import type { User } from 'firebase/auth';
import type { Category } from '../game/types';
import { Check } from 'lucide-react';

interface Props {
  official: Category[];
  custom: Category[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSetIds: (ids: string[]) => void;
  user: User | null | undefined;
}

const S = {
  bg: '#14141A',
  surface: '#1A1A22',
  border: 'rgba(245,213,71,0.10)',
  lemon: '#F5D547',
  ink: '#F5F2E8',
  dim: '#A09A88',
  fade: '#5C5848',
  mono: 'JetBrains Mono, monospace' as const,
  anton: 'Anton, sans-serif' as const,
};

export function CategoryPicker({ official, custom, selectedIds, onToggle, onSetIds, user }: Props) {
  const [tab, setTab] = useState<'official' | 'custom'>('official');

  const list = tab === 'official' ? official : custom;
  const count = selectedIds.length;
  const listIds = list.map((c) => c.id);
  const allSelected = listIds.length > 0 && listIds.every((id) => selectedIds.includes(id));

  const handleSelectAll = () => {
    if (allSelected) {
      onSetIds(selectedIds.filter((id) => !listIds.includes(id)));
    } else {
      onSetIds(Array.from(new Set([...selectedIds, ...listIds])));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex rounded-xl p-1 gap-1" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
        {(['official', 'custom'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all btn-press"
            style={tab === t
              ? { background: S.lemon, color: '#14141A', fontFamily: S.anton, letterSpacing: '0.05em' }
              : { color: S.fade, fontFamily: S.mono }}
          >
            {t === 'official' ? 'OFFICIAL' : 'MY CATEGORIES'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {count > 0 ? (
          <div className="flex-1 rounded-xl px-3 py-2" style={{ background: 'rgba(245,213,71,0.06)', border: `1px solid ${S.border}` }}>
            <span style={{ color: S.lemon, fontFamily: S.mono, fontSize: '11px' }}>
              {count === 1 ? '1 CATEGORY SELECTED' : `${count} SELECTED — ONE PICKED RANDOMLY`}
            </span>
          </div>
        ) : (
          <div className="flex-1" />
        )}
        {list.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="flex-shrink-0 px-3 py-2 rounded-xl btn-press text-xs"
            style={{ background: S.surface, border: '1px solid rgba(245,213,71,0.25)', color: S.lemon, fontFamily: S.mono }}
          >
            {allSelected ? 'DESELECT ALL' : 'SELECT ALL'}
          </button>
        )}
      </div>

      {tab === 'custom' && (!user || user.isAnonymous) && custom.length === 0 && (
        <p className="text-center py-3" style={{ color: S.dim, fontFamily: S.mono, fontSize: '11px' }}>
          SIGN IN TO USE CUSTOM CATEGORIES
        </p>
      )}

      {tab === 'custom' && user && !user.isAnonymous && custom.length === 0 && (
        <p className="text-center py-3" style={{ color: S.dim, fontFamily: S.mono, fontSize: '11px' }}>
          NO CUSTOM CATEGORIES — CREATE ONE IN CATEGORIES
        </p>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto scroll-hidden">
        {list.map((cat) => {
          const isSelected = selectedIds.includes(cat.id);
          const abbrev = cat.name.slice(0, 2).toUpperCase();
          return (
            <button
              key={cat.id}
              onClick={() => onToggle(cat.id)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl btn-press"
              style={{
                background: isSelected ? 'rgba(245,213,71,0.08)' : S.surface,
                border: isSelected ? '1px solid rgba(245,213,71,0.40)' : `1px solid ${S.border}`,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,213,71,0.08)', color: S.lemon, fontFamily: S.anton, fontSize: '12px', letterSpacing: '0.03em' }}
              >
                {abbrev}
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-sm font-semibold truncate" style={{ color: S.ink, fontFamily: 'Inter, sans-serif' }}>{cat.name}</div>
                <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px' }}>{cat.entries.length} WORDS</div>
              </div>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isSelected ? S.lemon : 'transparent',
                  border: isSelected ? `2px solid ${S.lemon}` : '2px solid rgba(245,213,71,0.25)',
                }}
              >
                {isSelected && <Check size={11} strokeWidth={3} style={{ color: '#14141A' }} />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
