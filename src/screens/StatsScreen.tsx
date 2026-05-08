import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { useCareerStats } from '../hooks/useCareerStats';
import { ArrowLeft, BarChart2, Trophy, Skull, Gamepad2, Clock, UserX, User as UserIcon } from 'lucide-react';

interface Props {
  user: User;
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

export function StatsScreen({ user }: Props) {
  const navigate = useNavigate();
  const { stats, recentGames, loading } = useCareerStats(user);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: S.bg }}>
      <div className="flex items-center gap-3 px-5 safe-top pt-4 pb-4" style={{ borderBottom: `1px solid ${S.border}` }}>
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl flex items-center justify-center btn-press"
          style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.dim }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontFamily: S.anton, color: S.ink, letterSpacing: '0.05em', fontSize: '20px' }}>
          YOUR STATS
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(245,213,71,0.25)', borderTopColor: S.lemon }} />
          </div>
        )}

        {!loading && !stats && (
          <div className="text-center py-12">
            <Gamepad2 size={40} style={{ color: S.fade, margin: '0 auto 12px' }} />
            <p style={{ color: S.dim, fontFamily: S.mono, fontSize: '13px' }}>NO GAMES PLAYED YET</p>
            <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '11px', marginTop: '4px' }}>START PLAYING TO SEE YOUR STATS</p>
          </div>
        )}

        {!loading && stats && (
          <>
            <div className="rounded-2xl p-5 animate-slide-up" style={{ background: S.card, border: `1px solid ${S.border}` }}>
              <h2 className="flex items-center gap-2 mb-4" style={{ fontFamily: S.bebas, color: S.lemon, letterSpacing: '0.08em', fontSize: '18px' }}>
                <BarChart2 size={18} /> CAREER OVERVIEW
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'GAMES', value: stats.gamesPlayed, Icon: Gamepad2, color: S.ink },
                  { label: 'POINTS', value: stats.careerPoints, Icon: Trophy, color: S.lemon },
                  { label: 'WINS', value: stats.careerWins, Icon: Trophy, color: '#4ade80' },
                  { label: 'LOSSES', value: stats.careerLosses, Icon: Skull, color: '#f87171' },
                ].map(({ label, value, Icon, color }) => (
                  <div key={label} className="rounded-xl p-4 text-center" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
                    <Icon size={20} style={{ color, margin: '0 auto 6px' }} />
                    <div style={{ fontFamily: S.anton, fontSize: '32px', color, letterSpacing: '0.02em' }}>{value}</div>
                    <div style={{ fontFamily: S.mono, fontSize: '10px', color: S.fade, marginTop: '2px' }}>{label}</div>
                  </div>
                ))}
              </div>

              {stats.gamesPlayed > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: S.dim, fontFamily: S.mono, fontSize: '11px' }}>WIN RATE</span>
                    <span style={{ color: S.lemon, fontFamily: S.mono, fontSize: '11px', fontWeight: 700 }}>
                      {Math.round((stats.careerWins / stats.gamesPlayed) * 100)}%
                    </span>
                  </div>
                  <div className="rounded-full h-2 overflow-hidden" style={{ background: S.surface }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${(stats.careerWins / stats.gamesPlayed) * 100}%`, background: S.lemon, boxShadow: '0 0 8px rgba(245,213,71,0.40)' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {recentGames.length > 0 && (
              <div className="rounded-2xl p-5 animate-slide-up" style={{ background: S.card, border: `1px solid ${S.border}` }}>
                <h2 className="flex items-center gap-2 mb-4" style={{ fontFamily: S.bebas, color: S.lemon, letterSpacing: '0.08em', fontSize: '18px' }}>
                  <Clock size={18} /> RECENT GAMES
                </h2>
                <div className="space-y-2">
                  {recentGames.map((g) => {
                    const won = (g.result === 'civilians' && g.hostRole === 'civilian') ||
                      (g.result === 'imposters' && g.hostRole === 'imposter');
                    return (
                      <div key={g.id} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: g.hostRole === 'imposter' ? 'rgba(239,68,68,0.15)' : 'rgba(245,213,71,0.08)' }}
                        >
                          {g.hostRole === 'imposter'
                            ? <UserX size={16} style={{ color: '#f87171' }} />
                            : <UserIcon size={16} style={{ color: S.dim }} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate" style={{ color: S.ink, fontFamily: 'Inter, sans-serif' }}>
                            {g.categoryName}
                          </div>
                          <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px' }}>
                            {g.playerCount} PLAYERS · {g.hostRole.toUpperCase()}
                          </div>
                        </div>
                        <div
                          className="text-sm font-bold px-2.5 py-1 rounded-full"
                          style={won
                            ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontFamily: S.mono }
                            : { background: 'rgba(248,113,113,0.12)', color: '#f87171', fontFamily: S.mono }}
                        >
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
