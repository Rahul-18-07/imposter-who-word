import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { Eye } from 'lucide-react';

interface Props {
  user: User | null | undefined;
  onGoogle: () => void;
  onAnon: () => void;
  children: ReactNode;
}

export function AuthGate({ user, onGoogle, onAnon, children }: Props) {
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-dvh" style={{ background: '#14141A' }}>
        <div className="flex flex-col items-center gap-4">
          <Eye size={36} style={{ color: '#F5D547', opacity: 0.6 }} />
          <div
            className="w-7 h-7 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(245,213,71,0.25)', borderTopColor: '#F5D547' }}
          />
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-dvh relative flex flex-col overflow-hidden" style={{ background: '#14141A' }}>
        <div className="absolute inset-0 crt-grid pointer-events-none" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-72 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(245,213,71,0.07) 0%, transparent 70%)' }}
        />

        <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 safe-top gap-5">
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
                boxShadow: '0 0 32px rgba(245,213,71,0.15)',
              }}
            >
              <Eye size={40} strokeWidth={1.5} style={{ color: '#F5D547' }} />
            </div>
          </div>

          <div className="animate-fade-in text-center">
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
        </div>

        <div className="relative px-6 pb-8 safe-bottom space-y-3 animate-slide-up">
          <button
            onClick={onGoogle}
            className="w-full flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-2xl btn-press shadow-lg text-base"
            style={{ background: '#F5F2E8', color: '#14141A', fontFamily: 'Inter, sans-serif' }}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <button
            onClick={onAnon}
            className="w-full font-semibold py-4 px-6 rounded-2xl btn-press text-base"
            style={{
              background: '#1A1A22',
              border: '1px solid rgba(245,213,71,0.15)',
              color: '#A09A88',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.05em',
            }}
          >
            PLAY AS GUEST
          </button>

          <p
            className="text-center text-xs px-4"
            style={{ color: '#5C5848', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.03em' }}
          >
            SIGN IN TO SAVE STATS AND CUSTOM CATEGORIES
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
