import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as fbSignInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, OFFLINE } from './firebase';

const provider = new GoogleAuthProvider();

// ---- Offline mode: a fake anonymous user kept in localStorage ----
const OFFLINE_KEY = 'imposter_offline_guest';
const offlineListeners = new Set<(user: User | null) => void>();
const OFFLINE_USER = {
  uid: 'offline-guest',
  isAnonymous: true,
  displayName: null,
  email: null,
  photoURL: null,
} as unknown as User;

function offlineCurrent(): User | null {
  try {
    return localStorage.getItem(OFFLINE_KEY) ? OFFLINE_USER : null;
  } catch {
    return null;
  }
}

function offlineSet(signedIn: boolean) {
  try {
    if (signedIn) localStorage.setItem(OFFLINE_KEY, '1');
    else localStorage.removeItem(OFFLINE_KEY);
  } catch {
    // storage blocked — session still works in memory via listeners
  }
  const user = signedIn ? OFFLINE_USER : null;
  offlineListeners.forEach((cb) => cb(user));
}
// ------------------------------------------------------------------

export async function signInWithGoogle() {
  if (OFFLINE) {
    console.warn('[offline] Google sign-in unavailable without Firebase keys; signing in as guest.');
    offlineSet(true);
    return;
  }
  return signInWithPopup(auth, provider);
}

export async function signInAnonymously() {
  if (OFFLINE) {
    offlineSet(true);
    return;
  }
  return fbSignInAnonymously(auth);
}

export async function signOut() {
  if (OFFLINE) {
    offlineSet(false);
    return;
  }
  return fbSignOut(auth);
}

export function onAuth(callback: (user: User | null) => void) {
  if (OFFLINE) {
    offlineListeners.add(callback);
    callback(offlineCurrent());
    return () => {
      offlineListeners.delete(callback);
    };
  }
  return onAuthStateChanged(auth, callback);
}
