import { useState } from 'react';
import type { GameState } from '../game/types';
import { livingPlayers } from '../game/selectors';
import { Shuffle, Users, Skull, UserX, User, X } from 'lucide-react';

interface Props {
  state: GameState;
  startingPlayerName: string;
  onEliminate: (playerIndex: number) => void;
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

export function DiscussionScreen({ state, startingPlayerName, onEliminate }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const alive = livingPlayers(state);

  const selectedPlayer = selected !== null ? alive.find((p) => p.index === selected) : null;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: S.bg }}>
      <div className="px-5 safe-top pt-4 pb-4" style={{ borderBottom: `1px solid ${S.border}` }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: S.anton, color: S.ink, fontSize: '22px', letterSpacing: '0.05em' }}>DISCUSSION</h1>
            <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px', marginTop: '2px', letterSpacing: '0.06em' }}>
              CATEGORY: <span style={{ color: S.dim }}>{state.settings.categoryName}</span>
            </p>
          </div>
          <div className="rounded-full px-3 py-1.5" style={{ background: 'rgba(245,213,71,0.08)', border: `1px solid ${S.border}` }}>
            <span style={{ color: S.lemon, fontFamily: S.mono, fontSize: '11px', fontWeight: 700 }}>{alive.length} ALIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-4 space-y-4">
        {/* Starting player */}
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'rgba(245,213,71,0.06)', border: '1px solid rgba(245,213,71,0.25)' }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,213,71,0.10)' }}>
            <Shuffle size={16} style={{ color: S.lemon }} />
          </div>
          <div>
            <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '2px' }}>STARTS THE DISCUSSION</p>
            <p style={{ color: S.lemon, fontFamily: S.anton, fontSize: '18px', letterSpacing: '0.04em' }}>{startingPlayerName}</p>
          </div>
        </div>

        {/* Players alive — tappable for voting */}
        <div className="rounded-2xl p-4" style={{ background: S.card, border: `1px solid ${S.border}` }}>
          <h2 className="flex items-center gap-2 mb-1" style={{ fontFamily: S.bebas, color: S.dim, letterSpacing: '0.08em', fontSize: '15px' }}>
            <Users size={15} /> PLAYERS ALIVE
          </h2>
          <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px', marginBottom: '12px', letterSpacing: '0.04em' }}>
            TAP A PLAYER TO VOTE THEM OUT
          </p>
          <div className="space-y-2">
            {alive.map((p) => {
              const isSelected = selected === p.index;
              return (
                <button
                  key={p.index}
                  onClick={() => setSelected(isSelected ? null : p.index)}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 btn-press transition-all"
                  style={{
                    background: isSelected ? 'rgba(239,68,68,0.10)' : S.surface,
                    border: isSelected ? '2px solid rgba(239,68,68,0.55)' : `1px solid ${S.border}`,
                    boxShadow: isSelected ? '0 0 16px rgba(239,68,68,0.10)' : 'none',
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={isSelected
                      ? { background: 'rgba(239,68,68,0.20)', color: '#f87171', fontFamily: S.mono }
                      : { background: 'rgba(245,213,71,0.08)', color: S.lemon, fontFamily: S.mono }}
                  >
                    {p.name[0].toUpperCase()}
                  </div>
                  <span className="flex-1 text-left font-medium" style={{ color: isSelected ? S.ink : S.dim, fontFamily: 'Inter, sans-serif' }}>
                    {p.name}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#ef4444' }}>
                      <X size={11} strokeWidth={3} style={{ color: '#fff' }} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Eliminated list */}
        {state.eliminations.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: S.card, border: `1px solid ${S.border}` }}>
            <h2 className="flex items-center gap-2 mb-3" style={{ fontFamily: S.bebas, color: S.fade, letterSpacing: '0.08em', fontSize: '15px' }}>
              <Skull size={15} /> ELIMINATED ({state.eliminations.length})
            </h2>
            <div className="space-y-2">
              {state.eliminations.map((e, i) => {
                const player = state.players[e.playerIndex];
                return (
                  <div key={i} className="flex items-center gap-3 opacity-60">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={e.wasImposter ? { background: 'rgba(239,68,68,0.15)' } : { background: 'rgba(245,213,71,0.06)' }}
                    >
                      {e.wasImposter
                        ? <UserX size={14} style={{ color: '#f87171' }} />
                        : <User size={14} style={{ color: S.fade }} />}
                    </div>
                    <span style={{ color: S.fade, fontFamily: 'Inter, sans-serif', fontWeight: 500, flex: 1 }}>{player.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={e.wasImposter
                        ? { background: 'rgba(239,68,68,0.15)', color: '#f87171', fontFamily: S.mono }
                        : { background: 'rgba(74,222,128,0.10)', color: '#4ade80', fontFamily: S.mono }}
                    >
                      {e.wasImposter ? 'IMPOSTOR' : 'INNOCENT'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom — confirm elimination */}
      <div className="px-4 py-4 safe-bottom" style={{ borderTop: `1px solid ${S.border}`, background: `${S.bg}ee`, backdropFilter: 'blur(8px)' }}>
        <button
          disabled={selected === null}
          onClick={() => selected !== null && onEliminate(selected)}
          className="w-full py-4 px-6 rounded-2xl btn-press disabled:opacity-35 flex items-center justify-center gap-2 transition-all"
          style={selectedPlayer
            ? { background: '#ef4444', color: '#fff', boxShadow: '0 4px 0 #b91c1c', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }
            : { background: S.surface, border: `1px solid ${S.border}`, color: S.fade, fontFamily: S.mono, fontSize: '13px', letterSpacing: '0.04em' }}
        >
          {selectedPlayer
            ? `ELIMINATE ${selectedPlayer.name.toUpperCase()}`
            : 'TAP A PLAYER TO ELIMINATE'}
        </button>
      </div>
    </div>
  );
}
