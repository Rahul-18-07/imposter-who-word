import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

export interface CareerStats {
  displayName: string;
  gamesPlayed: number;
  careerWins: number;
  careerLosses: number;
  careerPoints: number;
  lastPlayedAt: unknown;
}

export interface GameRecord {
  id: string;
  categoryName: string;
  result: 'civilians' | 'imposters';
  hostRole: 'civilian' | 'imposter';
  playerCount: number;
  playedAt: unknown;
}

export async function getCareerStats(uid: string): Promise<CareerStats | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as CareerStats;
}

export async function getRecentGames(uid: string, count = 10): Promise<GameRecord[]> {
  const snap = await getDocs(
    query(
      collection(db, 'users', uid, 'games'),
      orderBy('playedAt', 'desc'),
      limit(count),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as GameRecord);
}

export async function recordGame(params: {
  uid: string;
  displayName: string;
  hostRole: 'civilian' | 'imposter';
  result: 'civilians' | 'imposters';
  categoryName: string;
  playerCount: number;
}): Promise<void> {
  const { uid, displayName, hostRole, result, categoryName, playerCount } = params;
  const won =
    (result === 'civilians' && hostRole === 'civilian') ||
    (result === 'imposters' && hostRole === 'imposter');

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  const pointsDelta = won ? 3 : 1;

  if (!snap.exists()) {
    await setDoc(userRef, {
      displayName,
      gamesPlayed: 1,
      careerWins: won ? 1 : 0,
      careerLosses: won ? 0 : 1,
      careerPoints: pointsDelta,
      lastPlayedAt: serverTimestamp(),
    });
  } else {
    await updateDoc(userRef, {
      displayName,
      gamesPlayed: increment(1),
      careerWins: increment(won ? 1 : 0),
      careerLosses: increment(won ? 0 : 1),
      careerPoints: increment(pointsDelta),
      lastPlayedAt: serverTimestamp(),
    });
  }

  await addDoc(collection(db, 'users', uid, 'games'), {
    categoryName,
    result,
    hostRole,
    playerCount,
    playedAt: serverTimestamp(),
  });
}
