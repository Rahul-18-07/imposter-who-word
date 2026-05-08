import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  if (state.phase === 'reveal') {
    const player = state.players[state.revealIndex];
    const role = state.roles[state.revealIndex];
    const isLast = state.revealIndex === state.players.length - 1;

    return (
      <RoleRevealCard
        playerName={player.name}
        role={role}
        isLast={isLast}
        onDone={() => dispatch({ type: 'NEXT_REVEAL' })}
      />
    );
  }

  if (state.phase === 'eliminated') {
    const idx = state.pendingElimination!;
    const player = state.players[idx];
    const wasImposter = state.roles[idx]?.role === 'imposter';

    return (
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
    );
  }

  if (state.phase === 'discussion') {
    return (
      <DiscussionScreen
        state={state}
        onEliminate={(idx) => dispatch({ type: 'MARK_ELIMINATED', playerIndex: idx })}
      />
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
