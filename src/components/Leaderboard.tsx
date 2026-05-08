import type { Player } from '../game/types';

interface Props {
  players: Player[];
}

export function Leaderboard({ players }: Props) {
  const sorted = [...players].sort((a, b) => b.sessionPoints - a.sessionPoints);

  if (sorted.every((p) => p.sessionPoints === 0)) return null;

  return (
    <div className="bg-card rounded-2xl p-4">
      <h3 className="text-white font-semibold mb-3">Session Scores</h3>
      <div className="space-y-2">
        {sorted.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="text-gray-400 w-6 text-sm">{i + 1}.</span>
            <span className="text-white font-medium flex-1">{p.name}</span>
            <span className="text-purple-300 font-bold">{p.sessionPoints} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
