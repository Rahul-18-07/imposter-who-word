import type { GameState } from '../game/types';
import { Trophy, Skull, UserX, Gamepad2, Home } from 'lucide-react';

interface Props {
  state: GameState;
  onPlayAgain: () => void;
  onHome: () => void;
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

export function GameOverScreen({ state, onPlayAgain, onHome }: Props) {
  const civilianWon = state.result === 'civilians';

  const imposters = state.players.filter(
    (_, i) => state.roles[i]?.role === 'imposter',
  );

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between p-5 safe-top safe-bottom animate-fade-in" style={{ background: S.bg }}>
      <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full max-w-sm">
        <div className="text-center animate-bounce-in">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={civilianWon
              ? { background: 'rgba(74,222,128,0.12)', border: '1.5px solid rgba(74,222,128,0.30)' }
              : { background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.30)' }}
          >
            {civilianWon
              ? <Trophy size={44} style={{ color: '#4ade80' }} />
              : <Skull size={44} style={{ color: '#f87171' }} />}
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={civilianWon
              ? { background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontFamily: S.mono, fontSize: '12px', letterSpacing: '0.06em' }
              : { background: 'rgba(239,68,68,0.12)', color: '#f87171', fontFamily: S.mono, fontSize: '12px', letterSpacing: '0.06em' }}
          >
            {civilianWon ? 'PLAYERS WIN!' : 'IMPOSTORS WIN!'}
          </div>
          <p style={{ color: S.dim, fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            {civilianWon ? 'The impostors have been unmasked!' : 'The impostors stayed hidden!'}
          </p>
        </div>

        <div className="w-full rounded-2xl p-5 space-y-4 animate-slide-up" style={{ background: S.card, border: `1px solid ${S.border}` }}>
          <div>
            <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.10em', marginBottom: '8px' }}>THE IMPOSTORS WERE</p>
            <div className="space-y-2">
              {imposters.map((p, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: S.surface, border: `1px solid ${S.border}` }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)' }}>
                    <UserX size={15} style={{ color: '#f87171' }} />
                  </div>
                  <span style={{ color: S.ink, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3" style={{ borderTop: `1px solid ${S.border}` }}>
            <div className="rounded-xl p-3 text-center" style={{ background: S.surface }}>
              <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '4px' }}>SECRET WORD</p>
              <p style={{ color: S.ink, fontFamily: S.anton, fontSize: '22px', letterSpacing: '0.03em' }}>{state.secretWord}</p>
              {state.secretHint && (
                <p style={{ color: S.lemon, fontFamily: S.mono, fontSize: '10px', marginTop: '2px' }}>HINT: {state.secretHint}</p>
              )}
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: S.surface }}>
              <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '4px' }}>CATEGORY</p>
              <p style={{ color: S.dim, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px' }}>{state.settings.categoryName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-3 mt-5">
        <button
          onClick={onPlayAgain}
          className="w-full py-4 px-6 rounded-2xl btn-press flex items-center justify-center gap-2"
          style={{ background: S.lemon, color: '#14141A', boxShadow: '0 4px 0 #C9AB22', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }}
        >
          <Gamepad2 size={20} /> PLAY AGAIN
        </button>
        <button
          onClick={onHome}
          className="w-full py-4 px-6 rounded-2xl btn-press flex items-center justify-center gap-2"
          style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.dim, fontFamily: S.mono, fontSize: '13px', letterSpacing: '0.04em' }}
        >
          <Home size={16} /> HOME
        </button>
      </div>
    </div>
  );
}
