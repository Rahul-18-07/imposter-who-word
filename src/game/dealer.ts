import type { Category, PlayerRole } from './types';

function cryptoRandInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function cryptoRandFloat(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 0x100000000;
}

// Weighted sampling without replacement. Returns `count` distinct indices,
// drawn proportional to weights[i]. Players with weight 0 are still eligible
// at a tiny minimum so they can never be permanently excluded.
function weightedPickIndices(weights: number[], count: number): number[] {
  const picked: number[] = [];
  const pool = weights.map((w, i) => ({ i, w: Math.max(w, 1e-6) }));
  for (let k = 0; k < count && pool.length > 0; k++) {
    const total = pool.reduce((s, p) => s + p.w, 0);
    let r = cryptoRandFloat() * total;
    let chosenIdx = pool.length - 1;
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].w;
      if (r <= 0) { chosenIdx = j; break; }
    }
    picked.push(pool[chosenIdx].i);
    pool.splice(chosenIdx, 1);
  }
  return picked;
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
  playerWeights: number[],
): DealResult {
  const entryIndex = cryptoRandInt(category.entries.length);
  const entry = category.entries[entryIndex];

  // Fallback hint: another word from same category
  const fallbackHint =
    entry.hint ||
    category.entries.find((_, i) => i !== entryIndex)?.word ||
    '';
  const effectiveHint = entry.hint || fallbackHint;

  // Pick imposter indices via weighted sampling without replacement.
  const imposterIndices = new Set(weightedPickIndices(playerWeights, imposterCount));
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
