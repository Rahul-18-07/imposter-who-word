import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { GameState, GameAction } from '../game/types';
import { PlayerListEditor } from '../components/PlayerListEditor';
import { CategoryPicker } from '../components/CategoryPicker';
import { Toggle } from '../components/ui/Toggle';
import { useCategories } from '../hooks/useCategories';
import { deal } from '../game/dealer';
import { saveSettings } from '../game/reducer';
import { ArrowLeft, Play, Minus, Plus } from 'lucide-react';

const PLAYERS_KEY = 'imposter_saved_players';

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
  bebas: 'Bebas Neue, sans-serif' as const,
};

export function SetupScreen({ state, dispatch, user }: Props) {
  const navigate = useNavigate();
  const { official, custom, loading } = useCategories(user);
  const { players, settings } = state;

  useEffect(() => {
    if (players.length === 0) {
      try {
        const saved = localStorage.getItem(PLAYERS_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            dispatch({ type: 'SET_PLAYERS', players: parsed });
          }
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)); } catch {}
  }, [players]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const maxImposters = Math.max(1, Math.floor((players.length - 1) / 2));
  const canStart = players.length >= 3 && settings.categoryIds.length > 0;

  const startGame = () => {
    const all = [...official, ...custom];
    const pool = settings.categoryIds.length > 0
      ? all.filter((c) => settings.categoryIds.includes(c.id))
      : all;
    const selectedCategory = pool[Math.floor(Math.random() * pool.length)];
    if (!selectedCategory) return;
    const clampedCount = Math.min(settings.imposterCount, maxImposters);
    const result = deal(
      players.map((p) => p.name),
      selectedCategory,
      clampedCount,
      settings.imposterSeesCategory,
      settings.imposterSeesHint,
      settings.impostersSeeEachOther,
    );
    dispatch({ type: 'SET_SETTINGS', settings: { categoryId: selectedCategory.id, categoryName: selectedCategory.name, imposterCount: clampedCount } });
    dispatch({ type: 'START_GAME', roles: result.roles, secretWord: result.secretWord, secretHint: result.secretHint });
    navigate('/game');
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: S.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 safe-top pt-4 pb-4" style={{ borderBottom: `1px solid ${S.border}` }}>
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl flex items-center justify-center btn-press"
          style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.dim }}
        >
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontFamily: S.anton, color: S.ink, letterSpacing: '0.05em', fontSize: '20px' }}>
          GAME SETUP
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-4 space-y-4">

        {/* Players */}
        <section className="rounded-2xl p-4" style={{ background: S.card, border: `1px solid ${S.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <h2 style={{ fontFamily: S.bebas, color: S.lemon, letterSpacing: '0.08em', fontSize: '16px' }}>PLAYERS</h2>
            <span
              className="ml-auto rounded-full px-2 py-0.5 text-xs"
              style={{ background: 'rgba(245,213,71,0.10)', color: S.lemon, fontFamily: S.mono }}
            >
              {players.length}
            </span>
          </div>
          <PlayerListEditor
            players={players}
            onChange={(p) => dispatch({ type: 'SET_PLAYERS', players: p })}
          />
        </section>

        {/* Category */}
        <section className="rounded-2xl p-4" style={{ background: S.card, border: `1px solid ${S.border}` }}>
          <div className="flex items-center gap-2 mb-3">
            <h2 style={{ fontFamily: S.bebas, color: S.lemon, letterSpacing: '0.08em', fontSize: '16px' }}>CATEGORY</h2>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 py-2" style={{ color: S.dim }}>
              <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(245,213,71,0.25)', borderTopColor: S.lemon }} />
              <span style={{ fontFamily: S.mono, fontSize: '12px' }}>LOADING...</span>
            </div>
          ) : (
            <CategoryPicker
              official={official}
              custom={custom}
              selectedIds={settings.categoryIds}
              user={user}
              onToggle={(id) =>
                dispatch({ type: 'SET_SETTINGS', settings: { categoryIds: settings.categoryIds.includes(id) ? settings.categoryIds.filter((x) => x !== id) : [...settings.categoryIds, id] } })
              }
              onSetIds={(ids) => dispatch({ type: 'SET_SETTINGS', settings: { categoryIds: ids } })}
            />
          )}
        </section>

        {/* Settings */}
        <section className="rounded-2xl p-4" style={{ background: S.card, border: `1px solid ${S.border}` }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 style={{ fontFamily: S.bebas, color: S.lemon, letterSpacing: '0.08em', fontSize: '16px' }}>SETTINGS</h2>
          </div>

          {/* Impostor count */}
          <div className="flex items-center justify-between py-2 mb-2">
            <div>
              <div className="text-sm font-medium" style={{ color: S.ink, fontFamily: 'Inter, sans-serif' }}>Impostors</div>
              <div className="text-xs mt-0.5" style={{ color: S.fade, fontFamily: S.mono }}>
                MAX {maxImposters} FOR {players.length} PLAYERS
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => dispatch({ type: 'SET_SETTINGS', settings: { imposterCount: Math.max(1, settings.imposterCount - 1) } })}
                disabled={settings.imposterCount <= 1}
                className="w-10 h-10 rounded-xl flex items-center justify-center btn-press disabled:opacity-40"
                style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.ink }}
              >
                <Minus size={16} />
              </button>
              <span style={{ color: S.lemon, fontFamily: S.anton, fontSize: '24px', minWidth: '24px', textAlign: 'center' }}>
                {Math.min(settings.imposterCount, maxImposters)}
              </span>
              <button
                onClick={() => dispatch({ type: 'SET_SETTINGS', settings: { imposterCount: Math.min(maxImposters, settings.imposterCount + 1) } })}
                disabled={settings.imposterCount >= maxImposters}
                className="w-10 h-10 rounded-xl flex items-center justify-center btn-press disabled:opacity-40"
                style={{ background: S.surface, border: `1px solid ${S.border}`, color: S.ink }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${S.border}` }} className="pt-1 space-y-0">
            <Toggle
              label="Impostor sees category"
              description="Gives impostor a category clue"
              checked={settings.imposterSeesCategory}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { imposterSeesCategory: v } })}
            />
            <Toggle
              label="Impostor sees hint word"
              description="Shows a related hint word to the impostor"
              checked={settings.imposterSeesHint}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { imposterSeesHint: v } })}
            />
            <Toggle
              label="Impostors see each other"
              description="Only relevant with multiple impostors"
              checked={settings.impostersSeeEachOther}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { impostersSeeEachOther: v } })}
            />
          </div>
        </section>

        <div className="pb-4" />
      </div>

      <div className="px-4 py-4 safe-bottom" style={{ borderTop: `1px solid ${S.border}`, background: `${S.bg}dd`, backdropFilter: 'blur(8px)' }}>
        <button
          onClick={startGame}
          disabled={!canStart}
          className="w-full py-4 px-6 rounded-2xl btn-press text-base flex items-center justify-center gap-2 disabled:opacity-40"
          style={canStart
            ? { background: S.lemon, color: '#14141A', boxShadow: '0 4px 0 #C9AB22', fontFamily: S.anton, letterSpacing: '0.06em', fontSize: '18px' }
            : { background: S.surface, border: `1px solid ${S.border}`, color: S.fade, fontFamily: S.mono, fontSize: '13px' }
          }
        >
          {canStart ? (
            <><Play size={18} fill="#14141A" /> START GAME — {players.length} PLAYERS</>
          ) : players.length < 3 ? (
            'ADD AT LEAST 3 PLAYERS'
          ) : (
            'PICK AT LEAST 1 CATEGORY'
          )}
        </button>
      </div>
    </div>
  );
}
