import { useEffect, useRef, useState } from 'react';
import { Shuffle, ArrowRight } from 'lucide-react';

interface Props {
  players: string[];
  winner: string;
  onDone: () => void;
}

const S = {
  bg: '#14141A',
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

// Intervals simulate a slot machine slowing down
const SCHEDULE = [
  60, 60, 60, 60, 60, 60, 60, 60,   // fast
  80, 80, 80, 80, 80,                // medium-fast
  110, 110, 110,                      // medium
  160, 160,                           // slowing
  230, 230,                           // slow
  320,                                // very slow
  450,                                // final approach
];

export function StartingPlayerPicker({ players, winner, onDone }: Props) {
  const [current, setCurrent] = useState(players[0]);
  const [done, setDone] = useState(false);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Build a sequence: cycle through players randomly, end on winner
    const sequence: string[] = [];
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    for (let i = 0; i < SCHEDULE.length - 1; i++) {
      sequence.push(shuffled[i % shuffled.length]);
    }
    sequence.push(winner); // always end on winner

    const tick = () => {
      const step = stepRef.current;
      if (step >= sequence.length) {
        setDone(true);
        return;
      }
      setCurrent(sequence[step]);
      stepRef.current = step + 1;
      timerRef.current = setTimeout(tick, SCHEDULE[step]);
    };

    timerRef.current = setTimeout(tick, 200); // small delay before start
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 safe-top safe-bottom" style={{ background: S.bg }}>
      <div className="absolute inset-0 crt-grid pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shuffle size={18} style={{ color: S.lemon }} />
            <span style={{ fontFamily: S.mono, fontSize: '11px', color: S.dim, letterSpacing: '0.12em' }}>
              PICKING WHO STARTS
            </span>
          </div>
          <h1 style={{ fontFamily: S.anton, color: S.ink, fontSize: '28px', letterSpacing: '0.06em' }}>
            WHO STARTS THE DISCUSSION?
          </h1>
        </div>

        {/* Slot machine display */}
        <div className="w-full relative">
          {/* Scanline gradient overlay */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none z-10"
            style={{
              background: 'linear-gradient(rgba(245,213,71,0.03) 0%, transparent 30%, transparent 70%, rgba(245,213,71,0.03) 100%)',
            }}
          />
          <div
            className="w-full rounded-3xl flex items-center justify-center py-10 px-6"
            style={{
              background: S.card,
              border: done ? '2px solid rgba(245,213,71,0.60)' : '2px solid rgba(245,213,71,0.15)',
              boxShadow: done ? '0 0 40px rgba(245,213,71,0.20), inset 0 0 40px rgba(245,213,71,0.04)' : 'none',
              transition: 'border-color 0.3s, box-shadow 0.5s',
            }}
          >
            <div
              key={done ? 'done' : current}
              className="text-center"
              style={{
                animation: done ? 'none' : 'slotFlicker 0.05s ease',
              }}
            >
              <div
                style={{
                  fontFamily: S.anton,
                  fontSize: current.length > 10 ? '32px' : '44px',
                  color: done ? S.lemon : S.ink,
                  letterSpacing: '0.04em',
                  textShadow: done ? '0 0 32px rgba(245,213,71,0.60)' : 'none',
                  transition: 'color 0.3s, text-shadow 0.5s',
                }}
              >
                {current}
              </div>
              {done && (
                <div
                  className="mt-2"
                  style={{ fontFamily: S.mono, fontSize: '11px', color: S.dim, letterSpacing: '0.10em' }}
                >
                  GOES FIRST
                </div>
              )}
            </div>
          </div>

          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: done ? 'rgba(245,213,71,0.60)' : 'rgba(245,213,71,0.25)' }} />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: done ? 'rgba(245,213,71,0.60)' : 'rgba(245,213,71,0.25)' }} />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: done ? 'rgba(245,213,71,0.60)' : 'rgba(245,213,71,0.25)' }} />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: done ? 'rgba(245,213,71,0.60)' : 'rgba(245,213,71,0.25)' }} />
        </div>

        {/* Player dots indicator */}
        {!done && (
          <div className="flex items-center gap-2">
            {players.map((p) => (
              <div
                key={p}
                className="rounded-full transition-all duration-75"
                style={{
                  width: p === current ? '24px' : '6px',
                  height: '6px',
                  background: p === current ? S.lemon : S.fade,
                }}
              />
            ))}
          </div>
        )}

        {done && (
          <button
            onClick={onDone}
            className="w-full py-4 px-6 rounded-2xl btn-press flex items-center justify-center gap-2 animate-fade-in"
            style={{ background: S.lemon, color: '#14141A', boxShadow: '0 4px 0 #C9AB22', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }}
          >
            START DISCUSSION <ArrowRight size={18} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes slotFlicker {
          0% { opacity: 0.3; transform: scaleY(0.85); }
          100% { opacity: 1; transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
