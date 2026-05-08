import { useEffect, useState } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { GameState, GameAction } from '../game/types';
import { RoleRevealCard } from '../components/RoleRevealCard';
import { DiscussionScreen } from '../components/DiscussionScreen';
import { GameOverScreen } from '../components/GameOverScreen';
import { recordGame } from '../lib/scoresRepo';
import { UserX, User as UserIcon, ArrowRight, AlertTriangle } from 'lucide-react';
import { StartingPlayerPicker } from '../components/StartingPlayerPicker';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
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
};

export function GameScreen({ state, dispatch, user }: Props) {
  const navigate = useNavigate();
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [startingPlayerName] = useState(
    () => state.players[Math.floor(Math.random() * state.players.length)]?.name ?? '',
  );

  const isActiveGame = state.phase === 'reveal' || state.phase === 'discussion' || state.phase === 'eliminated';

  const blocker = useBlocker(isActiveGame);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowExitWarning(true);
    }
  }, [blocker.state]);

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
          startingPlayerName={isLast ? startingPlayerName : undefined}
          onDone={() => {
            if (isLast) {
              setShowPicker(true);
            } else {
              dispatch({ type: 'NEXT_REVEAL' });
            }
          }}
        />
        {showPicker && (
          <StartingPlayerPicker
            players={state.players.map((p) => p.name)}
            winner={startingPlayerName}
            onDone={() => {
              setShowPicker(false);
              dispatch({ type: 'NEXT_REVEAL' });
            }}
          />
        )}
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
        <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center animate-fade-in" style={{ background: S.bg }}>
          <div className="animate-bounce-in mb-4">
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto"
              style={wasImposter
                ? { background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.30)' }
                : { background: 'rgba(74,222,128,0.08)', border: '1.5px solid rgba(74,222,128,0.25)' }}
            >
              {wasImposter
                ? <UserX size={52} style={{ color: '#f87171' }} />
                : <UserIcon size={52} style={{ color: '#4ade80' }} />}
            </div>
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={wasImposter
              ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', fontFamily: S.mono, fontSize: '11px', letterSpacing: '0.06em' }
              : { background: 'rgba(74,222,128,0.10)', color: '#4ade80', fontFamily: S.mono, fontSize: '11px', letterSpacing: '0.06em' }}
          >
            {wasImposter ? 'IMPOSTOR FOUND!' : 'INNOCENT PLAYER'}
          </div>
          <h2 style={{ fontFamily: S.anton, color: S.ink, fontSize: '40px', letterSpacing: '0.04em', marginBottom: '8px' }}>{player.name}</h2>
          <p style={{ color: S.dim, fontFamily: 'Inter, sans-serif', fontSize: '17px', marginBottom: '40px' }}>
            {wasImposter ? 'was hiding among you!' : 'was not the impostor.'}
          </p>
          <button
            onClick={() => dispatch({ type: 'ACK_ELIMINATION' })}
            className="py-4 px-10 rounded-2xl btn-press flex items-center gap-2"
            style={{ background: S.lemon, color: '#14141A', boxShadow: '0 4px 0 #C9AB22', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }}
          >
            CONTINUE <ArrowRight size={18} />
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
          startingPlayerName={startingPlayerName}
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
  const S = {
    bg: '#14141A',
    surface: '#1A1A22',
    card: '#1E1E28',
    border: 'rgba(245,213,71,0.10)',
    ink: '#F5F2E8',
    dim: '#A09A88',
    fade: '#5C5848',
    mono: 'JetBrains Mono, monospace' as const,
    anton: 'Anton, sans-serif' as const,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div
        className="relative w-full max-w-lg p-6 pb-8 shadow-2xl animate-slide-up safe-bottom"
        style={{ background: S.card, border: `1px solid ${S.border}`, borderBottom: 'none', borderRadius: '24px 24px 0 0' }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: S.fade }} />
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(245,213,71,0.08)', border: '1px solid rgba(245,213,71,0.20)' }}>
            <AlertTriangle size={28} style={{ color: '#F5D547' }} />
          </div>
          <h2 style={{ fontFamily: S.anton, color: S.ink, fontSize: '22px', letterSpacing: '0.05em', marginBottom: '8px' }}>END THE GAME?</h2>
          <p style={{ color: S.dim, fontFamily: S.mono, fontSize: '11px', letterSpacing: '0.04em' }}>THE GAME IS STILL IN PROGRESS. ALL PROGRESS WILL BE LOST.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl btn-press"
            style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.ink, fontFamily: S.mono, fontSize: '12px', letterSpacing: '0.05em' }}
          >
            KEEP PLAYING
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl btn-press"
            style={{ background: '#ef4444', color: '#fff', boxShadow: '0 3px 0 #b91c1c', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '16px' }}
          >
            END GAME
          </button>
        </div>
      </div>
    </div>
  );
}
