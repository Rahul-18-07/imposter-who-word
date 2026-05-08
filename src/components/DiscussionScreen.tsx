import { useState } from 'react';
import type { GameState } from '../game/types';
import { livingPlayers } from '../game/selectors';
import { EliminationModal } from './EliminationModal';

interface Props {
  state: GameState;
  onEliminate: (playerIndex: number) => void;
}

export function DiscussionScreen({ state, onEliminate }: Props) {
  const [showModal, setShowModal] = useState(false);
  const alive = livingPlayers(state);

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <div className="px-5 safe-top pt-4 pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Discussion</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Category: <span className="text-purple-pale font-semibold">{state.settings.categoryName}</span>
            </p>
          </div>
          <div className="bg-purple-mid/20 px-3 py-1.5 rounded-full">
            <span className="text-purple-pale font-bold text-sm">{alive.length} alive</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-4 space-y-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>👥</span> Players Alive
          </h2>
          <div className="space-y-2">
            {alive.map((p) => (
              <div
                key={p.index}
                className="flex items-center gap-3 bg-surface border border-border/50 rounded-xl px-4 py-3"
              >
                <div className="w-8 h-8 rounded-full bg-purple-mid/20 flex items-center justify-center text-sm font-bold text-purple-pale">
                  {p.name[0].toUpperCase()}
                </div>
                <span className="text-white font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {state.eliminations.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="text-gray-400 font-semibold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>💀</span> Eliminated ({state.eliminations.length})
            </h2>
            <div className="space-y-2">
              {state.eliminations.map((e, i) => {
                const player = state.players[e.playerIndex];
                return (
                  <div key={i} className="flex items-center gap-3 opacity-60">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${e.wasImposter ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {e.wasImposter ? '🕵️' : '👤'}
                    </div>
                    <span className="text-gray-400 font-medium flex-1">{player.name}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${e.wasImposter ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {e.wasImposter ? 'Imposter' : 'Civilian'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 safe-bottom border-t border-border/50 bg-bg/80 backdrop-blur-sm">
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-2xl btn-press shadow-lg text-base"
        >
          🗳️ Vote to Eliminate
        </button>
      </div>

      {showModal && (
        <EliminationModal
          state={state}
          onEliminate={(idx) => {
            setShowModal(false);
            onEliminate(idx);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
