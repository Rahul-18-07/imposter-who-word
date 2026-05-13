export interface CategoryEntry {
  word: string;
  hint: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  locale: 'in' | 'global';
  entries: CategoryEntry[];
  isOfficial: boolean;
}

export interface Player {
  name: string;
  uid?: string;
  isAlive: boolean;
  sessionPoints: number;
}

export type Role = 'civilian' | 'imposter';

export interface PlayerRole {
  playerIndex: number;
  role: Role;
  word?: string;       // set for civilians
  hint?: string;       // set for imposters (when toggle on)
  categoryName?: string; // set for imposters (when toggle on)
  coImposterNames?: string[]; // set for imposters (when toggle on)
}

export interface GameSettings {
  imposterCount: number;
  imposterSeesCategory: boolean;
  imposterSeesHint: boolean;
  impostersSeeEachOther: boolean;
  categoryIds: string[];  // selected pool; game picks one randomly at start
  categoryId: string;     // the one actually used for the current game
  categoryName: string;
}

export interface Elimination {
  playerIndex: number;
  wasImposter: boolean;
  at: number; // timestamp
}

export type Phase =
  | 'setup'
  | 'reveal'        // pass-the-phone, one card per player
  | 'discussion'    // group discusses + eliminate button
  | 'eliminated'    // reveal eliminated player's role
  | 'gameOver';

export interface GameState {
  phase: Phase;
  players: Player[];
  settings: GameSettings;
  roles: PlayerRole[];
  secretWord: string;
  secretHint: string;
  revealIndex: number;       // which player is currently revealing
  pendingElimination: number | null; // playerIndex being eliminated
  eliminations: Elimination[];
  result: 'civilians' | 'imposters' | null;
  // Per-player impostor selection weights, keyed by player name. Lower weight =
  // less likely to be picked. Decays after being impostor, recovers otherwise.
  // Persisted across sessions so fairness carries across days.
  imposterWeights: Record<string, number>;
}

export type GameAction =
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'START_GAME'; roles: PlayerRole[]; secretWord: string; secretHint: string }
  | { type: 'NEXT_REVEAL' }
  | { type: 'BEGIN_DISCUSSION' }
  | { type: 'MARK_ELIMINATED'; playerIndex: number }
  | { type: 'ACK_ELIMINATION' }
  | { type: 'RESET' };
