import type { Category, PlayerRole } from './types';

// Uniform random integer in [0, max) from the crypto RNG. Rejection sampling
// avoids modulo bias, so every value is exactly equally likely.
function cryptoRandInt(max: number): number {
  const limit = Math.floor(0x100000000 / max) * max;
  const arr = new Uint32Array(1);
  do {
    crypto.getRandomValues(arr);
  } while (arr[0] >= limit);
  return arr[0] % max;
}

// Pure random pick: `count` distinct player indices out of `n`, every player
// equally likely every round. No memory of previous rounds, so the same person
// can be imposter again (partial Fisher-Yates shuffle).
export function randomPickIndices(n: number, count: number): number[] {
  const idx = Array.from({ length: n }, (_, i) => i);
  const k = Math.min(count, n);
  for (let i = 0; i < k; i++) {
    const j = i + cryptoRandInt(n - i);
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx.slice(0, k);
}

export interface DealResult {
  roles: PlayerRole[];
  secretWord: string;
  secretHint: string;
}

export function deal(
  playerNames: string[],
  category: Category,
  imposterCount: number,
  imposterSeesCategory: boolean,
  imposterSeesHint: boolean,
  impostersSeeEachOther: boolean,
): DealResult {
  const entryIndex = cryptoRandInt(category.entries.length);
  const entry = category.entries[entryIndex];

  // Fallback hint: another word from same category
  const fallbackHint =
    entry.hint ||
    category.entries.find((_, i) => i !== entryIndex)?.word ||
    '';
  const effectiveHint = entry.hint || fallbackHint;

  // Pick imposters uniformly at random among all players.
  const imposterIndices = new Set(randomPickIndices(playerNames.length, imposterCount));
  const imposterNames = [...imposterIndices].map((i) => playerNames[i]);

  const roles: PlayerRole[] = playerNames.map((_, i) => {
    if (!imposterIndices.has(i)) {
      return {
        playerIndex: i,
        role: 'civilian',
        word: entry.word,
        categoryName: category.name,
      };
    }

    const coImposterNames = impostersSeeEachOther
      ? imposterNames.filter((n) => n !== playerNames[i])
      : undefined;

    return {
      playerIndex: i,
      role: 'imposter',
      categoryName: imposterSeesCategory ? category.name : undefined,
      hint: imposterSeesHint ? effectiveHint : undefined,
      coImposterNames,
    };
  });

  return { roles, secretWord: entry.word, secretHint: effectiveHint };
}
