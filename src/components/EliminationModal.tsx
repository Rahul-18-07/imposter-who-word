import { useState } from 'react';
import type { GameState } from '../game/types';
import { livingPlayers } from '../game/selectors';
import { Check, X } from 'lucide-react';

interface Props {
  state: GameState;
  onEliminate: (playerIndex: number) => void;
  onCancel: () => void;
}

const S = {
  bg: '#14141A',
  surface: '#1A1A22',
  card: '#1E1E28',
  border: 'rgba(245,213,71,0.10)',
  lemon: '#F5D547',
  ink: '#F5F2E8',
  dim: '#A09A88',
  fade: '#5C5848',
  mono: 'JetBrains Mono, monospace' as const,
  anton: 'Anton, sans-serif' as const,
  bebas: 'Bebas Neue, sans-serif' as const,
};

export function EliminationModal({ state, onEliminate, onCancel }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const alive = livingPlayers(state);

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: S.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 safe-top pt-4 pb-4" style={{ borderBottom: `1px solid ${S.border}` }}>
        <button
          onClick={onCancel}
          className="w-10 h-10 rounded-xl flex items-center justify-center btn-press"
          style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.dim }}
        >
          <X size={18} />
        </button>
        <div className="flex-1">
          <h1 style={{ fontFamily: S.anton, color: S.ink, fontSize: '20px', letterSpacing: '0.05em' }}>VOTE TO ELIMINATE</h1>
          <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px', marginTop: '1px', letterSpacing: '0.06em' }}>
            WHO DID THE GROUP VOTE OUT?
          </p>
        </div>
      </div>

      {/* Player list */}
      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-5 space-y-3">
        {alive.map((p) => {
          const isSelected = selected === p.index;
          return (
            <button
              key={p.index}
              onClick={() => setSelected(p.index)}
              className="w-full flex items-center gap-4 rounded-2xl px-4 py-4 btn-press transition-all"
              style={{
                background: isSelected ? 'rgba(239,68,68,0.10)' : S.card,
                border: isSelected ? '2px solid rgba(239,68,68,0.55)' : `1px solid ${S.border}`,
                boxShadow: isSelected ? '0 0 20px rgba(239,68,68,0.10)' : 'none',
              }}
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={isSelected
                  ? { background: 'rgba(239,68,68,0.20)', color: '#f87171', fontFamily: S.mono }
                  : { background: 'rgba(245,213,71,0.08)', color: S.lemon, fontFamily: S.mono }}
              >
                {p.name[0].toUpperCase()}
              </div>

              {/* Name */}
              <span
                className="flex-1 text-left text-base font-semibold"
                style={{ color: isSelected ? S.ink : S.dim, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}
              >
                {p.name}
              </span>

              {/* Checkmark */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={isSelected
                  ? { background: '#ef4444', border: '2px solid #ef4444' }
                  : { background: 'transparent', border: '2px solid rgba(245,213,71,0.18)' }}
              >
                {isSelected && <Check size={14} strokeWidth={3} style={{ color: '#fff' }} />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      <div className="px-4 py-4 safe-bottom" style={{ borderTop: `1px solid ${S.border}`, background: `${S.bg}ee`, backdropFilter: 'blur(8px)' }}>
        <button
          disabled={selected === null}
          onClick={() => selected !== null && onEliminate(selected)}
          className="w-full py-4 px-6 rounded-2xl btn-press disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ background: '#ef4444', color: '#fff', boxShadow: selected !== null ? '0 4px 0 #b91c1c' : 'none', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }}
        >
          {selected !== null
            ? `ELIMINATE ${alive.find((p) => p.index === selected)?.name.toUpperCase()}`
            : 'SELECT A PLAYER'}
        </button>
      </div>
    </div>
  );
}
