import { useState } from 'react';
import type { PlayerRole } from '../game/types';
import { Eye, UserX, UserCheck, Shuffle, ArrowRight, Users, Lightbulb, Tag } from 'lucide-react';

interface Props {
  playerName: string;
  role: PlayerRole;
  isLast: boolean;
  startingPlayerName?: string;
  onDone: () => void;
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
  bebas: 'Bebas Neue, sans-serif' as const,
};

export function RoleRevealCard({ playerName, role, isLast, startingPlayerName, onDone }: Props) {
  const [revealed, setRevealed] = useState(false);

  const handleHide = () => {
    setRevealed(false);
    onDone();
  };

  const isImposter = role.role === 'imposter';

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between p-5 safe-top safe-bottom" style={{ background: S.bg }}>
      <div className="text-center pt-4 animate-fade-in">
        <p style={{ color: S.fade, fontFamily: S.mono, fontSize: '10px', letterSpacing: '0.12em', marginBottom: '6px' }}>PASS PHONE TO</p>
        <h2 style={{ fontFamily: S.anton, color: S.ink, fontSize: '36px', letterSpacing: '0.04em' }}>{playerName}</h2>
        {isLast && startingPlayerName && (
          <div
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-2xl"
            style={{ background: 'rgba(245,213,71,0.08)', border: '1px solid rgba(245,213,71,0.25)' }}
          >
            <Shuffle size={14} style={{ color: S.lemon }} />
            <div className="text-left">
              <p style={{ color: S.dim, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em' }}>STARTS DISCUSSION</p>
              <p style={{ color: S.lemon, fontFamily: S.anton, fontSize: '16px', letterSpacing: '0.04em' }}>{startingPlayerName}</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-5">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full aspect-square max-h-72 rounded-3xl flex flex-col items-center justify-center gap-4 btn-press animate-fade-in"
            style={{ background: S.card, border: '2px dashed rgba(245,213,71,0.20)' }}
          >
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(245,213,71,0.08)' }}>
              <Eye size={36} style={{ color: S.lemon, opacity: 0.7 }} />
            </div>
            <div className="text-center">
              <div style={{ color: S.ink, fontFamily: S.anton, fontSize: '20px', letterSpacing: '0.05em' }}>TAP TO REVEAL</div>
              <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '11px', marginTop: '4px' }}>YOUR SECRET ROLE</div>
            </div>
          </button>
        ) : (
          <div className="w-full animate-bounce-in">
            <div
              className="rounded-3xl p-6 text-center"
              style={isImposter
                ? { background: 'rgba(239,68,68,0.08)', border: '1.5px solid rgba(239,68,68,0.35)' }
                : { background: 'rgba(74,222,128,0.06)', border: '1.5px solid rgba(74,222,128,0.30)' }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={isImposter ? { background: 'rgba(239,68,68,0.15)' } : { background: 'rgba(74,222,128,0.12)' }}
              >
                {isImposter
                  ? <UserX size={32} style={{ color: '#f87171' }} />
                  : <UserCheck size={32} style={{ color: '#4ade80' }} />}
              </div>

              {isImposter ? (
                <>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                    style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', fontFamily: S.mono, fontSize: '11px', letterSpacing: '0.06em' }}
                  >
                    YOU ARE THE IMPOSTOR
                  </div>
                  <div className="space-y-3 text-left">
                    {role.categoryName && (
                      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <Tag size={14} style={{ color: S.dim, flexShrink: 0 }} />
                        <div>
                          <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '2px' }}>CATEGORY</div>
                          <div style={{ color: S.dim, fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600 }}>{role.categoryName}</div>
                        </div>
                      </div>
                    )}
                    {role.hint && (
                      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
                        <Lightbulb size={14} style={{ color: S.lemon, flexShrink: 0 }} />
                        <div>
                          <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '2px' }}>HINT WORD</div>
                          <div style={{ color: S.lemon, fontFamily: S.anton, fontSize: '22px', letterSpacing: '0.03em' }}>{role.hint}</div>
                        </div>
                      </div>
                    )}
                    {role.coImposterNames && role.coImposterNames.length > 0 && (
                      <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(239,68,68,0.08)' }}>
                        <Users size={14} style={{ color: '#f87171', flexShrink: 0 }} />
                        <div>
                          <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '2px' }}>CO-IMPOSTORS</div>
                          <div style={{ color: '#f87171', fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 600 }}>{role.coImposterNames.join(', ')}</div>
                        </div>
                      </div>
                    )}
                    <p style={{ color: 'rgba(239,68,68,0.55)', fontFamily: S.mono, fontSize: '10px', textAlign: 'center', letterSpacing: '0.06em' }}>BLEND IN. DON'T GET CAUGHT!</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
                    style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', fontFamily: S.mono, fontSize: '11px', letterSpacing: '0.06em' }}
                  >
                    YOU ARE NOT THE IMPOSTOR
                  </div>
                  <div className="space-y-3 text-left">
                    <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <Tag size={14} style={{ color: S.dim, flexShrink: 0 }} />
                      <div>
                        <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '2px' }}>CATEGORY</div>
                        <div style={{ color: S.dim, fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: 600 }}>{role.categoryName}</div>
                      </div>
                    </div>
                    <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <div style={{ color: S.fade, fontFamily: S.mono, fontSize: '9px', letterSpacing: '0.10em', marginBottom: '6px' }}>SECRET WORD</div>
                      <div style={{ color: S.ink, fontFamily: S.anton, fontSize: '36px', letterSpacing: '0.04em' }}>{role.word}</div>
                    </div>
                    <p style={{ color: 'rgba(74,222,128,0.50)', fontFamily: S.mono, fontSize: '10px', textAlign: 'center', letterSpacing: '0.06em' }}>FIND THE IMPOSTOR. DON'T REVEAL THE WORD!</p>

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
          className="w-full max-w-sm py-4 px-6 rounded-2xl btn-press flex items-center justify-center gap-2"
          style={{ background: S.lemon, color: '#14141A', boxShadow: '0 4px 0 #C9AB22', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }}
        >
          {isLast ? <>START DISCUSSION <ArrowRight size={18} /></> : <>DONE — PASS THE PHONE <ArrowRight size={16} /></>}
        </button>
      ) : (
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full" style={{ background: S.fade }} />
          ))}
        </div>
      )}
    </div>
  );
}
