import { useState, useRef } from 'react';
import type { Player } from '../game/types';

interface Props {
  players: Player[];
  onChange: (players: Player[]) => void;
}

export function PlayerListEditor({ players, onChange }: Props) {
  const [newName, setNewName] = useState('');
  const [pickedFirst, setPickedFirst] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const addPlayer = () => {
    const name = newName.trim();
    if (!name || players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...players, { name, isAlive: true, sessionPoints: 0 }]);
    setNewName('');
    setPickedFirst(null);
  };

  const removePlayer = (i: number) => {
    const updated = players.filter((_, idx) => idx !== i);
    onChange(updated);
    setPickedFirst(null);
  };

  const pickRandom = () => {
    if (players.length === 0) return;
    const winner = players[Math.floor(Math.random() * players.length)];
    setPickedFirst(winner.name);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDragIndex(i);
    e.dataTransfer.effectAllowed = 'move';
    // small delay so the drag image captures before we style it
    setTimeout(() => {
      if (dragNode.current) dragNode.current.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnter = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    setDragOverIndex(i);
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = '1';
    if (dragIndex !== null && dragOverIndex !== null && dragIndex !== dragOverIndex) {
      const reordered = [...players];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(dragOverIndex, 0, moved);
      onChange(reordered);
    }
    setDragIndex(null);
    setDragOverIndex(null);
    dragNode.current = null;
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

      {players.length >= 2 && (
        <button
          onClick={pickRandom}
          className="w-full flex items-center justify-center gap-2 bg-surface border border-border/50 text-purple-pale text-sm font-semibold py-2.5 rounded-xl btn-press hover:border-purple-light/50 transition-colors"
        >
          🎲 Pick random first player
        </button>
      )}

      {pickedFirst && (
        <div className="flex items-center gap-2 bg-purple-mid/20 border border-purple-light/30 rounded-xl px-4 py-3 animate-bounce-in">
          <span className="text-xl">👑</span>
          <span className="text-purple-pale font-semibold text-sm">
            <span className="text-white">{pickedFirst}</span> goes first!
          </span>
          <button
            onClick={() => setPickedFirst(null)}
            className="ml-auto text-gray-500 hover:text-gray-300 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <div className="space-y-2">
        {players.map((p, i) => (
          <div
            key={p.name}
            ref={dragIndex === i ? dragNode : null}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragEnter={() => handleDragEnter(i)}
            onDragOver={(e) => e.preventDefault()}
            onDragEnd={handleDragEnd}
            className={`flex items-center justify-between bg-surface border rounded-xl px-3 py-3 transition-all ${
              dragOverIndex === i && dragIndex !== i
                ? 'border-purple-light bg-purple-mid/10 scale-[1.02]'
                : 'border-border/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {/* drag handle */}
              <div className="text-gray-600 cursor-grab active:cursor-grabbing px-1 touch-none select-none text-base leading-none">
                ⠿
              </div>
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

      {players.length >= 2 && (
        <p className="text-gray-600 text-xs text-center">
          Drag ⠿ to reorder players
        </p>
      )}
    </div>
  );
}
