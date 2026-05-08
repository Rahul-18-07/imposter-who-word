import { useState } from 'react';
import type { PlayerRole } from '../game/types';

interface Props {
  playerName: string;
  role: PlayerRole;
  isLast: boolean;
  onDone: () => void;
}

export function RoleRevealCard({ playerName, role, isLast, onDone }: Props) {
  const [revealed, setRevealed] = useState(false);

  const handleReveal = () => setRevealed(true);
  const handleHide = () => {
    setRevealed(false);
    onDone();
  };

  const isImposter = role.role === 'imposter';

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-between p-5 safe-top safe-bottom">
      <div className="text-center pt-4 animate-fade-in">
        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold mb-1">Pass phone to</p>
        <h2 className="text-3xl font-extrabold text-white">{playerName}</h2>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-5">
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="w-full aspect-square max-h-72 rounded-3xl bg-card border-2 border-dashed border-border hover:border-purple-light transition-all flex flex-col items-center justify-center gap-4 group btn-press animate-fade-in"
          >
            <div className="w-20 h-20 rounded-2xl bg-purple-mid/20 flex items-center justify-center group-hover:bg-purple-mid/30 transition-colors">
              <span className="text-5xl">👆</span>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold text-lg">Tap to reveal</div>
              <div className="text-gray-500 text-sm mt-0.5">your secret role</div>
            </div>
          </button>
        ) : (
          <div className="w-full animate-bounce-in">
            <div className={`rounded-3xl p-6 border-2 text-center ${isImposter ? 'bg-red-950/50 border-red-500/60' : 'bg-green-950/50 border-green-500/60'}`}>
              <div className="text-6xl mb-3">{isImposter ? '🕵️' : '👤'}</div>

              {isImposter ? (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full mb-4">
                    🎭 You are the Imposter!
                  </div>
                  <div className="space-y-3">
                    {role.categoryName && (
                      <div className="bg-black/20 rounded-xl p-3">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Category</div>
                        <div className="text-purple-pale font-semibold">{role.categoryName}</div>
                      </div>
                    )}
                    {role.hint && (
                      <div className="bg-black/20 rounded-xl p-3">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Hint word</div>
                        <div className="text-amber-300 font-bold text-xl">{role.hint}</div>
                      </div>
                    )}
                    {role.coImposterNames && role.coImposterNames.length > 0 && (
                      <div className="bg-red-900/30 rounded-xl p-3">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Your co-imposters</div>
                        <div className="text-red-300 font-semibold">{role.coImposterNames.join(', ')}</div>
                      </div>
                    )}
                    <p className="text-red-300/70 text-xs italic">Blend in. Don't get caught!</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 text-sm font-bold px-3 py-1 rounded-full mb-4">
                    ✅ You are a Civilian
                  </div>
                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Category</div>
                      <div className="text-purple-pale font-semibold">{role.categoryName}</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-3">
                      <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Secret Word</div>
                      <div className="text-white font-extrabold text-3xl">{role.word}</div>
                    </div>
                    <p className="text-green-300/70 text-xs italic">Find the imposter. Don't reveal the word!</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {revealed ? (
        <button
          onClick={handleHide}
          className="w-full max-w-sm bg-purple-gradient text-white font-bold py-4 px-6 rounded-2xl btn-press shadow-lg shadow-purple-mid/30 text-base"
        >
          {isLast ? '🗣️ Start Discussion' : '✅ Done — Pass the phone'}
        </button>
      ) : (
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-border" />
          ))}
        </div>
      )}
    </div>
  );
}
