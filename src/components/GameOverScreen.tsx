import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function GameOverScreen({ state, onPlayAgain, onHome }: Props) {
  const civilianWon = state.result === 'civilians';

  const imposters = state.players.filter(
    (_, i) => state.roles[i]?.role === 'imposter',
  );

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-between p-5 safe-top safe-bottom animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full max-w-sm">
        <div className="text-center animate-bounce-in">
          <div className="text-8xl mb-3">{civilianWon ? '🎉' : '🕵️'}</div>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 ${civilianWon ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {civilianWon ? '✅ Civilians Win!' : '🎭 Imposters Win!'}
          </div>
          <p className="text-gray-400 text-base">
            {civilianWon
              ? 'The imposters have been caught!'
              : 'The imposters stayed hidden!'}
          </p>
        </div>

        <div className="w-full bg-card border border-border rounded-2xl p-5 space-y-4 animate-slide-up">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">The Imposters Were</p>
            <div className="space-y-2">
              {imposters.map((p, i) => (
                <div key={i} className="flex items-center gap-3 bg-surface rounded-xl px-4 py-3">
                  <span className="text-xl">🕵️</span>
                  <span className="text-white font-semibold">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs mb-1">Secret Word</p>
              <p className="text-white font-extrabold text-xl">{state.secretWord}</p>
              {state.secretHint && (
                <p className="text-amber-300 text-xs mt-1">Hint: {state.secretHint}</p>
              )}
            </div>
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-gray-500 text-xs mb-1">Category</p>
              <p className="text-purple-pale font-semibold text-sm">{state.settings.categoryName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3 mt-5">
        <button
          onClick={onPlayAgain}
          className="w-full bg-purple-gradient text-white font-bold py-4 px-6 rounded-2xl btn-press shadow-lg shadow-purple-mid/30 text-base"
        >
          🎮 Play Again
        </button>
        <button
          onClick={onHome}
          className="w-full bg-surface border border-border text-gray-300 font-semibold py-4 px-6 rounded-2xl btn-press text-base"
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}
