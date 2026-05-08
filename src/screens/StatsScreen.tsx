import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { useCareerStats } from '../hooks/useCareerStats';

interface Props {
  user: User;
}

export function StatsScreen({ user }: Props) {
  const navigate = useNavigate();
  const { stats, recentGames, loading } = useCareerStats(user);

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <div className="flex items-center gap-3 px-5 safe-top pt-4 pb-4 border-b border-border/50">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-white transition-colors btn-press"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-white">Your Stats</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 border-purple-light border-t-transparent animate-spin" />
          </div>
        )}

        {!loading && !stats && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🎮</div>
            <p className="text-gray-400 font-medium">No games played yet</p>
            <p className="text-gray-500 text-sm mt-1">Start playing to see your stats!</p>
          </div>
        )}

        {!loading && stats && (
          <>
            <div className="bg-card border border-border rounded-2xl p-5 animate-slide-up">
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>📊</span> Career Overview
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Games', value: stats.gamesPlayed, emoji: '🎮', color: 'text-white' },
                  { label: 'Points', value: stats.careerPoints, emoji: '⭐', color: 'text-amber-300' },
                  { label: 'Wins', value: stats.careerWins, emoji: '🏆', color: 'text-green-400' },
                  { label: 'Losses', value: stats.careerLosses, emoji: '💀', color: 'text-red-400' },
                ].map(({ label, value, emoji, color }) => (
                  <div key={label} className="bg-surface border border-border/50 rounded-xl p-4 text-center">
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {stats.gamesPlayed > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-white font-semibold">{Math.round((stats.careerWins / stats.gamesPlayed) * 100)}%</span>
                  </div>
                  <div className="bg-surface rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-purple-gradient h-2.5 rounded-full transition-all"
                      style={{ width: `${(stats.careerWins / stats.gamesPlayed) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {recentGames.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5 animate-slide-up">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <span>🕐</span> Recent Games
                </h2>
                <div className="space-y-2">
                  {recentGames.map((g) => {
                    const won =
                      (g.result === 'civilians' && g.hostRole === 'civilian') ||
                      (g.result === 'imposters' && g.hostRole === 'imposter');
                    return (
                      <div key={g.id} className="flex items-center gap-3 bg-surface border border-border/50 rounded-xl px-4 py-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${g.hostRole === 'imposter' ? 'bg-red-500/20' : 'bg-purple-mid/20'}`}>
                          {g.hostRole === 'imposter' ? '🕵️' : '👤'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-semibold truncate">{g.categoryName}</div>
                          <div className="text-gray-500 text-xs">{g.playerCount} players · {g.hostRole}</div>
                        </div>
                        <div className={`text-sm font-bold px-2.5 py-1 rounded-full ${won ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {won ? '+3' : '+1'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
