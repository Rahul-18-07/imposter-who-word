import { useState, useRef } from 'react';
import type { Player } from '../game/types';
import { GripVertical, Plus, X } from 'lucide-react';

interface Props {
  players: Player[];
  onChange: (players: Player[]) => void;
}

export function PlayerListEditor({ players, onChange }: Props) {
  const [newName, setNewName] = useState('');
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLDivElement | null>(null);

  const addPlayer = () => {
    const name = newName.trim();
    if (!name || players.some((p) => p.name.toLowerCase() === name.toLowerCase())) return;
    onChange([...players, { name, isAlive: true, sessionPoints: 0 }]);
    setNewName('');
  };

  const removePlayer = (i: number) => onChange(players.filter((_, idx) => idx !== i));

  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDragIndex(i);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { if (dragNode.current) dragNode.current.style.opacity = '0.4'; }, 0);
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
          placeholder="Player name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
          style={{
            background: '#14141A',
            border: '1px solid rgba(245,213,71,0.15)',
            color: '#F5F2E8',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(245,213,71,0.50)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(245,213,71,0.15)')}
        />
        <button
          onClick={addPlayer}
          disabled={!newName.trim()}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl btn-press disabled:opacity-40 text-sm font-bold"
          style={{ background: '#F5D547', color: '#14141A', boxShadow: '0 3px 0 #C9AB22' }}
        >
          <Plus size={16} />
        </button>
      </div>

      {players.length === 0 && (
        <p className="text-sm text-center py-2" style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace' }}>
          ADD AT LEAST 3 PLAYERS
        </p>
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
            className="flex items-center justify-between rounded-xl px-3 py-3 transition-all"
            style={{
              background: '#1A1A22',
              border: dragOverIndex === i && dragIndex !== i
                ? '1px solid rgba(245,213,71,0.50)'
                : '1px solid rgba(245,213,71,0.08)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="cursor-grab active:cursor-grabbing touch-none select-none" style={{ color: '#5C5848' }}>
                <GripVertical size={16} />
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'rgba(245,213,71,0.08)', color: '#F5D547', fontFamily: 'JetBrains Mono, monospace' }}
              >
                {i + 1}
              </div>
              <span className="font-medium text-sm" style={{ color: '#F5F2E8', fontFamily: 'Inter, sans-serif' }}>
                {p.name}
              </span>
            </div>
            <button
              onClick={() => removePlayer(i)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors btn-press"
              style={{ background: '#14141A', color: '#5C5848' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#5C5848')}
            >
              <X size={13} />
            </button>
          </div>
        ))}
      </div>

      {players.length >= 2 && (
        <p className="text-xs text-center" style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace' }}>
          DRAG TO REORDER
        </p>
      )}
    </div>
  );
}
