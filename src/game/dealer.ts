import type { Category, PlayerRole } from './types';

function cryptoRandInt(max: number): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = cryptoRandInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

  // Pick imposter indices via shuffle
  const indices = Array.from({ length: playerNames.length }, (_, i) => i);
  const shuffled = shuffle(indices);
  const imposterIndices = new Set(shuffled.slice(0, imposterCount));
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
