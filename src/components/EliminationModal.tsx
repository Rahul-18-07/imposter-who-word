import { useState } from 'react';
import type { GameState } from '../game/types';
import { livingPlayers } from '../game/selectors';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface Props {
  state: GameState;
  onEliminate: (playerIndex: number) => void;
  onCancel: () => void;
}

export function EliminationModal({ state, onEliminate, onCancel }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const alive = livingPlayers(state);

  return (
    <Modal open title="🗳️ Vote to Eliminate" onClose={onCancel}>
      <p className="text-gray-400 text-sm mb-4">
        The group has voted. Who gets eliminated?
      </p>

      <div className="space-y-2 mb-5">
        {alive.map((p) => (
          <button
            key={p.index}
            onClick={() => setSelected(p.index)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 transition-all btn-press ${
              selected === p.index
                ? 'border-red-500 bg-red-500/20'
                : 'border-transparent bg-surface hover:border-border'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selected === p.index ? 'bg-red-500/30 text-red-300' : 'bg-purple-mid/20 text-purple-pale'}`}>
              {p.name[0].toUpperCase()}
            </div>
            <span className="text-white font-medium">{p.name}</span>
            {selected === p.index && <span className="ml-auto text-red-400">✓</span>}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onCancel} fullWidth>
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={selected === null}
          onClick={() => selected !== null && onEliminate(selected)}
          fullWidth
        >
          Eliminate
        </Button>
      </div>
    </Modal>
  );
}
