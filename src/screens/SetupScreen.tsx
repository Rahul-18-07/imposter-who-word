import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import type { GameState, GameAction } from '../game/types';
import { PlayerListEditor } from '../components/PlayerListEditor';
import { CategoryPicker } from '../components/CategoryPicker';
import { Toggle } from '../components/ui/Toggle';
import { useCategories } from '../hooks/useCategories';
import { deal } from '../game/dealer';

const PLAYERS_KEY = 'imposter_saved_players';

interface Props {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  user: User;
}

export function SetupScreen({ state, dispatch, user }: Props) {
  const navigate = useNavigate();
  const { official, custom, loading } = useCategories(user);
  const { players, settings } = state;

  // Load saved players from localStorage on first mount (only if list is empty)
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

  // Persist players to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
    } catch {}
  }, [players]);

  const maxImposters = Math.max(1, Math.floor((players.length - 1) / 2));

  const canStart =
    players.length >= 3 &&
    settings.categoryIds.length > 0;

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

    dispatch({
      type: 'SET_SETTINGS',
      settings: {
        categoryId: selectedCategory.id,
        categoryName: selectedCategory.name,
        imposterCount: clampedCount,
      },
    });

    dispatch({
      type: 'START_GAME',
      roles: result.roles,
      secretWord: result.secretWord,
      secretHint: result.secretHint,
    });

    navigate('/game');
  };

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <div className="flex items-center gap-3 px-5 safe-top pt-4 pb-4 border-b border-border/50">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-gray-400 hover:text-white transition-colors btn-press"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-white">Game Setup</h1>
      </div>

      <div className="flex-1 overflow-y-auto scroll-hidden px-4 py-4 space-y-4">
        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">👥</span>
            <h2 className="text-white font-semibold text-base">Players</h2>
            <span className="ml-auto bg-purple-mid/20 text-purple-pale text-xs font-semibold px-2 py-0.5 rounded-full">
              {players.length}
            </span>
          </div>
          <PlayerListEditor
            players={players}
            onChange={(p) => dispatch({ type: 'SET_PLAYERS', players: p })}
          />
        </section>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🗂️</span>
            <h2 className="text-white font-semibold text-base">Category</h2>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
              <div className="w-4 h-4 rounded-full border-2 border-purple-light border-t-transparent animate-spin" />
              Loading categories…
            </div>
          ) : (
            <CategoryPicker
              official={official}
              custom={custom}
              selectedIds={settings.categoryIds}
              user={user}
              onToggle={(id) =>
                dispatch({
                  type: 'SET_SETTINGS',
                  settings: {
                    categoryIds: settings.categoryIds.includes(id)
                      ? settings.categoryIds.filter((x) => x !== id)
                      : [...settings.categoryIds, id],
                  },
                })
              }
            />
          )}
        </section>

        <section className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚙️</span>
            <h2 className="text-white font-semibold text-base">Settings</h2>
          </div>

          <div className="flex items-center justify-between py-2 mb-2">
            <div>
              <div className="text-white font-medium text-sm">Imposters</div>
              <div className="text-gray-500 text-xs mt-0.5">Max {maxImposters} for {players.length} players</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  dispatch({
                    type: 'SET_SETTINGS',
                    settings: { imposterCount: Math.max(1, settings.imposterCount - 1) },
                  })
                }
                disabled={settings.imposterCount <= 1}
                className="w-10 h-10 rounded-xl bg-surface border border-border text-white disabled:opacity-40 font-bold text-lg btn-press"
              >
                −
              </button>
              <span className="text-white font-bold text-xl w-6 text-center">
                {Math.min(settings.imposterCount, maxImposters)}
              </span>
              <button
                onClick={() =>
                  dispatch({
                    type: 'SET_SETTINGS',
                    settings: { imposterCount: Math.min(maxImposters, settings.imposterCount + 1) },
                  })
                }
                disabled={settings.imposterCount >= maxImposters}
                className="w-10 h-10 rounded-xl bg-surface border border-border text-white disabled:opacity-40 font-bold text-lg btn-press"
              >
                +
              </button>
            </div>
          </div>

          <div className="border-t border-border/50 space-y-1 pt-2">
            <Toggle
              label="Imposter sees category"
              description="Gives imposter a category clue"
              checked={settings.imposterSeesCategory}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { imposterSeesCategory: v } })}
            />
            <Toggle
              label="Imposter sees hint word"
              description="Shows a related hint word to the imposter"
              checked={settings.imposterSeesHint}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { imposterSeesHint: v } })}
            />
            <Toggle
              label="Imposters see each other"
              description="Only relevant with multiple imposters"
              checked={settings.impostersSeeEachOther}
              onChange={(v) => dispatch({ type: 'SET_SETTINGS', settings: { impostersSeeEachOther: v } })}
            />
          </div>
        </section>

        <div className="pb-4" />
      </div>

      <div className="px-4 py-4 safe-bottom border-t border-border/50 bg-bg/80 backdrop-blur-sm">
        <button
          onClick={startGame}
          disabled={!canStart}
          className={`w-full font-bold py-4 px-6 rounded-2xl btn-press text-base transition-all ${
            canStart
              ? 'bg-purple-gradient text-white shadow-lg shadow-purple-mid/30'
              : 'bg-surface border border-border text-gray-500 cursor-not-allowed'
          }`}
        >
          {!canStart
            ? players.length < 3
              ? '👥 Add at least 3 players'
              : '🗂️ Pick at least 1 category'
            : `🎮 Start Game · ${players.length} players`}
        </button>
      </div>
    </div>
  );
}
