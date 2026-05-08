import type { GameState, GameAction, GameSettings } from './types';
import { checkWinCondition } from './selectors';

const DEFAULT_SETTINGS: GameSettings = {
  imposterCount: 1,
  imposterSeesCategory: true,
  imposterSeesHint: true,
  impostersSeeEachOther: false,
  categoryId: '',
  categoryName: '',
};

export const INITIAL_STATE: GameState = {
  phase: 'setup',
  players: [],
  settings: DEFAULT_SETTINGS,
  roles: [],
  secretWord: '',
  secretHint: '',
  revealIndex: 0,
  pendingElimination: null,
  eliminations: [],
  result: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.players };

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };

    case 'START_GAME':
      return {
        ...state,
        phase: 'reveal',
        roles: action.roles,
        secretWord: action.secretWord,
        secretHint: action.secretHint,
        revealIndex: 0,
        eliminations: [],
        result: null,
        players: state.players.map((p) => ({ ...p, isAlive: true })),
      };

    case 'NEXT_REVEAL': {
      const nextIndex = state.revealIndex + 1;
      if (nextIndex >= state.players.length) {
        return { ...state, phase: 'discussion' };
      }
      return { ...state, revealIndex: nextIndex };
    }

    case 'BEGIN_DISCUSSION':
      return { ...state, phase: 'discussion' };

    case 'MARK_ELIMINATED':
      return {
        ...state,
        phase: 'eliminated',
        pendingElimination: action.playerIndex,
      };

    case 'ACK_ELIMINATION': {
      if (state.pendingElimination === null) return state;

      const idx = state.pendingElimination;
      const wasImposter = state.roles[idx]?.role === 'imposter';

      const updatedPlayers = state.players.map((p, i) =>
        i === idx ? { ...p, isAlive: false } : p,
      );

      const newEliminations = [
        ...state.eliminations,
        { playerIndex: idx, wasImposter, at: Date.now() },
      ];

      const nextState: GameState = {
        ...state,
        players: updatedPlayers,
        eliminations: newEliminations,
        pendingElimination: null,
      };

      const winner = checkWinCondition(nextState);
      if (winner) {
        return { ...nextState, phase: 'gameOver', result: winner };
      }

      return { ...nextState, phase: 'discussion' };
    }

    case 'RESET':
      return {
        ...INITIAL_STATE,
        settings: state.settings,
        players: state.players.map((p) => ({
          ...p,
          isAlive: true,
          sessionPoints: p.sessionPoints,
        })),
      };

    default:
      return state;
  }
}
