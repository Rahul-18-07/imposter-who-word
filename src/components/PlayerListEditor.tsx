import { useState } from 'react';
import type { Player } from '../game/types';

interface Props {
  players: Player[];
  onChange: (players: Player[]) => void;
}

export function PlayerListEditor({ players, onChange }: Props) {
  const [newName, setNewName] = useState('');

  const addPlayer = () => {
    const name = newName.trim();
    if (!name || players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...players, { name, isAlive: true, sessionPoints: 0 }]);
    setNewName('');
  };

  const removePlayer = (i: number) => {
    onChange(players.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          placeholder="Player name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          className="flex-1 bg-surface border border-border text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-light transition-colors"
        />
        <button
          onClick={addPlayer}
          disabled={!newName.trim()}
          className="bg-purple-gradient text-white font-bold px-4 py-3 rounded-xl btn-press disabled:opacity-40 text-sm"
        >
          Add
        </button>
      </div>

      {players.length === 0 && (
        <p className="text-gray-600 text-sm text-center py-2">
          Add at least 3 players to start
        </p>
      )}

      <div className="space-y-2">
        {players.map((p, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-surface border border-border/50 rounded-xl px-4 py-3 animate-fade-in"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-purple-mid/20 flex items-center justify-center text-xs font-bold text-purple-pale">
                {i + 1}
              </div>
              <span className="text-white font-medium text-sm">{p.name}</span>
            </div>
            <button
              onClick={() => removePlayer(i)}
              className="w-7 h-7 rounded-full bg-surface border border-border text-gray-500 hover:text-red-400 hover:border-red-500/50 transition-colors flex items-center justify-center text-xs btn-press"
              aria-label={`Remove ${p.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
