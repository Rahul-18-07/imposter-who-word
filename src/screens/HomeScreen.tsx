import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { signOut } from '../lib/auth';
import { Users, Target, BarChart2, LayoutGrid, Eye, LogOut } from 'lucide-react';

interface Props {
  user: User;
}

export function HomeScreen({ user }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh relative flex flex-col overflow-hidden" style={{ background: '#14141A' }}>

      {/* CRT grid */}
      <div className="absolute inset-0 crt-grid pointer-events-none" />

      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-72 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(245,213,71,0.07) 0%, transparent 70%)' }}
      />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-5 safe-top pt-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              border: '1px solid rgba(245,213,71,0.35)',
              color: '#F5D547',
              background: 'rgba(245,213,71,0.08)',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {user.isAnonymous ? 'G' : (user.displayName?.[0]?.toUpperCase() ?? '?')}
          </div>
          <span style={{ color: '#A09A88', fontFamily: 'JetBrains Mono, monospace' }} className="text-sm">
            {user.isAnonymous ? 'GUEST' : (user.displayName ?? '').toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 py-2 pl-2 transition-colors group"
          style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.08em', fontSize: '12px' }}
        >
          <LogOut size={13} />
          EXIT
        </button>
      </div>

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 gap-5">

        {/* Icon mark */}
        <div className="relative animate-bounce-in">
          <div
            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'rgba(245,213,71,0.10)', transform: 'scale(2.8)' }}
          />
          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #22221A, #161610)',
              border: '1.5px solid rgba(245,213,71,0.40)',
              boxShadow: '0 0 32px rgba(245,213,71,0.15), inset 0 1px 0 rgba(245,213,71,0.10)',
            }}
          >
            <Eye size={40} strokeWidth={1.5} style={{ color: '#F5D547' }} />
          </div>
        </div>

        {/* Title block */}
        <div className="text-center animate-fade-in">
          <h1
            className="text-7xl text-white tracking-wide leading-none"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            IMPOSTOR
          </h1>
          <div
            className="mx-auto mt-2 mb-3 rounded-full"
            style={{ height: '2px', width: '80px', background: '#F5D547', boxShadow: '0 0 12px rgba(245,213,71,0.60)' }}
          />
          <p
            className="text-sm tracking-widest uppercase"
            style={{ color: '#A09A88', fontFamily: 'JetBrains Mono, monospace' }}
          >
            The Party Word Game
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex gap-2 mt-1 animate-fade-in flex-wrap justify-center">
          {[
            { icon: <Users size={11} />, label: '3+ PLAYERS' },
            { icon: <Eye size={11} />, label: 'FIND THE SPY' },
            { icon: <Target size={11} />, label: 'WORD GAME' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                border: '1px solid rgba(245,213,71,0.18)',
                color: '#A09A88',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.05em',
              }}
            >
              {icon}
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="relative px-5 pb-6 safe-bottom space-y-3 animate-slide-up">

        <button
          onClick={() => navigate('/setup')}
          className="btn-neon w-full py-5 px-6 rounded-2xl text-xl"
        >
          PLAY NOW
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/stats')}
            disabled={user.isAnonymous}
            className="flex flex-col items-center gap-2 py-4 px-4 rounded-2xl btn-press transition-all disabled:opacity-30"
            style={{ background: '#1A1A22', border: '1px solid rgba(245,213,71,0.12)' }}
          >
            <BarChart2 size={22} style={{ color: '#F5D547' }} />
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em', fontSize: '17px', color: '#F5F2E8' }}>
              STATS
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5C5848', letterSpacing: '0.04em' }}>
              {user.isAnonymous ? 'SIGN IN NEEDED' : 'YOUR RECORD'}
            </span>
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="flex flex-col items-center gap-2 py-4 px-4 rounded-2xl btn-press transition-all"
            style={{ background: '#1A1A22', border: '1px solid rgba(245,213,71,0.12)' }}
          >
            <LayoutGrid size={22} style={{ color: '#F5D547' }} />
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.08em', fontSize: '17px', color: '#F5F2E8' }}>
              CATEGORIES
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#5C5848', letterSpacing: '0.04em' }}>
              MANAGE PACKS
            </span>
          </button>
        </div>

        {user.isAnonymous && (
          <p
            className="text-center text-xs"
            style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.04em' }}
          >
            SIGN IN WITH GOOGLE TO TRACK STATS
          </p>
        )}
      </div>
    </div>
  );
}
