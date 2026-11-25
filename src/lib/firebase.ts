import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Local offline mode: when no Firebase keys are configured (no .env), the app
// runs fully in the browser — guest login only, built-in categories from
// seed-data.ts, no cloud stats. Nothing talks to Firebase in this mode.
export const OFFLINE = !import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = OFFLINE
  ? { apiKey: 'offline', projectId: 'offline-local', appId: 'offline' }
  : {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
