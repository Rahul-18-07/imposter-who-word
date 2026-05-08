import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { signOut } from '../lib/auth';

interface Props {
  user: User;
}

export function HomeScreen({ user }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-hero-gradient flex flex-col">
      <div className="flex items-center justify-between px-5 safe-top pt-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-gradient flex items-center justify-center text-xs font-bold text-white shadow">
            {user.isAnonymous ? 'G' : (user.displayName?.[0]?.toUpperCase() ?? '?')}
          </div>
          <span className="text-gray-400 text-sm font-medium">
            {user.isAnonymous ? 'Guest' : user.displayName}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors py-2 pl-2"
        >
          Sign out
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
        <div className="text-9xl drop-shadow-2xl animate-bounce-in">🕵️</div>
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Imposter</h1>
          <p className="text-purple-pale text-lg font-medium mt-1">The party word game</p>
        </div>

        <div className="flex gap-5 mt-1 animate-fade-in">
          {[
            { emoji: '👥', label: '3+ players' },
            { emoji: '🎯', label: 'Word game' },
            { emoji: '🕵️', label: 'Find the spy' },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-xl">{emoji}</span>
              <span className="text-gray-500 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6 safe-bottom space-y-3 animate-slide-up">
        <button
          onClick={() => navigate('/setup')}
          className="w-full bg-purple-gradient text-white font-bold py-5 px-6 rounded-2xl btn-press shadow-lg shadow-purple-mid/30 text-lg tracking-wide"
        >
          🎮 Play Now
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/stats')}
            disabled={user.isAnonymous}
            className="flex flex-col items-center gap-1.5 bg-surface border border-border text-white font-semibold py-4 px-4 rounded-2xl btn-press transition-all disabled:opacity-40"
          >
            <span className="text-2xl">📊</span>
            <span className="text-sm">Stats</span>
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="flex flex-col items-center gap-1.5 bg-surface border border-border text-white font-semibold py-4 px-4 rounded-2xl btn-press transition-all"
          >
            <span className="text-2xl">🗂️</span>
            <span className="text-sm">Categories</span>
          </button>
        </div>

        {user.isAnonymous && (
          <p className="text-center text-gray-500 text-xs">
            Sign in with Google to track stats & create custom categories
          </p>
        )}
      </div>
    </div>
  );
}
