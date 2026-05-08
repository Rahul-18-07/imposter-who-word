import { useEffect, useState } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { GameState, GameAction } from '../game/types';
import { RoleRevealCard } from '../components/RoleRevealCard';
import { DiscussionScreen } from '../components/DiscussionScreen';
import { GameOverScreen } from '../components/GameOverScreen';
import { recordGame } from '../lib/scoresRepo';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  user: User;
}

export function GameScreen({ state, dispatch, user }: Props) {
  const navigate = useNavigate();
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isActiveGame = state.phase === 'reveal' || state.phase === 'discussion' || state.phase === 'eliminated';

  // Block React Router navigation during active game
  const blocker = useBlocker(isActiveGame);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowExitWarning(true);
    }
  }, [blocker.state]);

  // Block browser back / close during active game
  useEffect(() => {
    if (!isActiveGame) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isActiveGame]);

  useEffect(() => {
    if (state.phase === 'gameOver' && state.result && !user.isAnonymous) {
      const hostRole = state.roles[0]?.role ?? 'civilian';
      recordGame({
        uid: user.uid,
        displayName: user.displayName ?? 'Unknown',
        hostRole,
        result: state.result,
        categoryName: state.settings.categoryName,
        playerCount: state.players.length,
      }).catch(console.error);
    }
  }, [state.phase]);

  if (state.phase === 'setup') {
    navigate('/setup');
    return null;
  }

  const handleConfirmExit = () => {
    setShowExitWarning(false);
    dispatch({ type: 'RESET' });
    blocker.proceed?.();
  };

  const handleCancelExit = () => {
    setShowExitWarning(false);
    blocker.reset?.();
  };

  if (state.phase === 'reveal') {
    const player = state.players[state.revealIndex];
    const role = state.roles[state.revealIndex];
    const isLast = state.revealIndex === state.players.length - 1;

    return (
      <>
        <RoleRevealCard
          playerName={player.name}
          role={role}
          isLast={isLast}
          onDone={() => dispatch({ type: 'NEXT_REVEAL' })}
        />
        {showExitWarning && <ExitWarningModal onConfirm={handleConfirmExit} onCancel={handleCancelExit} />}
      </>
    );
  }

  if (state.phase === 'eliminated') {
    const idx = state.pendingElimination!;
    const player = state.players[idx];
    const wasImposter = state.roles[idx]?.role === 'imposter';

    return (
      <>
        <div className="min-h-dvh bg-bg flex flex-col items-center justify-center p-6 text-center animate-fade-in">
          <div className="animate-bounce-in">
            <div className="text-8xl mb-4">{wasImposter ? '🕵️' : '😇'}</div>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3 ${wasImposter ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {wasImposter ? '🎯 Imposter found!' : '✅ Innocent civilian'}
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-2">{player.name}</h2>
          <p className="text-gray-400 text-lg mb-8">
            {wasImposter ? 'was hiding among you!' : 'was just a civilian.'}
          </p>
          <button
            onClick={() => dispatch({ type: 'ACK_ELIMINATION' })}
            className="bg-purple-gradient text-white font-bold py-4 px-10 rounded-2xl btn-press shadow-lg shadow-purple-mid/30 text-base"
          >
            Continue →
          </button>
        </div>
        {showExitWarning && <ExitWarningModal onConfirm={handleConfirmExit} onCancel={handleCancelExit} />}
      </>
    );
  }

  if (state.phase === 'discussion') {
    return (
      <>
        <DiscussionScreen
          state={state}
          onEliminate={(idx) => dispatch({ type: 'MARK_ELIMINATED', playerIndex: idx })}
        />
        {showExitWarning && <ExitWarningModal onConfirm={handleConfirmExit} onCancel={handleCancelExit} />}
      </>
    );
  }

  if (state.phase === 'gameOver') {
    return (
      <GameOverScreen
        state={state}
        onPlayAgain={() => dispatch({ type: 'RESET' })}
        onHome={() => { dispatch({ type: 'RESET' }); navigate('/'); }}
      />
    );
  }

  return null;
}

function ExitWarningModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-t-3xl w-full max-w-lg p-6 pb-8 shadow-2xl animate-slide-up safe-bottom">
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-2">End the game?</h2>
          <p className="text-gray-400 text-sm">The game is still in progress. All progress will be lost.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-surface border border-border text-white font-semibold py-3.5 rounded-2xl btn-press"
          >
            Keep Playing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl btn-press"
          >
            End Game
          </button>
        </div>
      </div>
    </div>
  );
}
