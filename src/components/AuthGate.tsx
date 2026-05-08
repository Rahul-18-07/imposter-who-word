import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';

interface Props {
  user: User | null | undefined;
  onGoogle: () => void;
  onAnon: () => void;
  children: ReactNode;
}

export function AuthGate({ user, onGoogle, onAnon, children }: Props) {
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="text-5xl animate-pulse-slow">🕵️</div>
          <div className="w-8 h-8 rounded-full border-2 border-purple-light border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-dvh bg-hero-gradient flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 safe-top">
          <div className="animate-bounce-in mb-2">
            <div className="text-8xl drop-shadow-2xl">🕵️</div>
          </div>
          <div className="animate-fade-in mt-4 text-center">
            <h1 className="text-5xl font-extrabold text-white tracking-tight">Imposter</h1>
            <p className="text-purple-pale mt-2 text-lg font-medium">The party word game</p>
          </div>
          <div className="mt-4 flex gap-3 animate-fade-in">
            {['🎯', '🎲', '🃏'].map((e) => (
              <span key={e} className="text-2xl opacity-50">{e}</span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-8 safe-bottom space-y-3 animate-slide-up">
          <button
            onClick={onGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-4 px-6 rounded-2xl btn-press shadow-lg shadow-black/30 text-base"
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
            className="w-full bg-surface border border-border text-white font-semibold py-4 px-6 rounded-2xl btn-press text-base"
          >
            Play as guest
          </button>

          <p className="text-center text-gray-500 text-xs px-4">
            Sign in with Google to save stats and create custom categories
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
