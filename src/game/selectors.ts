import type { GameState } from './types';

export function livingPlayers(state: GameState) {
  return state.players
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.isAlive);
}

export function checkWinCondition(state: GameState): 'civilians' | 'imposters' | null {
  const alive = livingPlayers(state);
  const aliveImposters = alive.filter(
    (p) => state.roles[p.index]?.role === 'imposter',
  );
  const aliveCivilians = alive.filter(
    (p) => state.roles[p.index]?.role === 'civilian',
  );

  if (aliveImposters.length === 0) return 'civilians';
  if (aliveImposters.length >= aliveCivilians.length) return 'imposters';
  return null;
}

export function getPlayerRole(state: GameState, playerIndex: number) {
  return state.roles[playerIndex];
}
