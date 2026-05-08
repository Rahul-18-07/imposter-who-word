// Run via: npx tsx src/lib/seedCategories.ts
// Requires .env.local to be set up with Firebase keys
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { SEED_CATEGORIES } from '../game/seed-data';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

async function seed() {
  const col = collection(db, 'categories');

  const existing = await getDocs(col);
  for (const d of existing.docs) {
    await deleteDoc(d.ref);
  }
  console.log('Cleared existing categories.');

  for (const cat of SEED_CATEGORIES) {
    const ref = await addDoc(col, {
      ...cat,
      createdAt: new Date().toISOString(),
    });
    console.log(`Seeded: ${cat.name} (${ref.id})`);
  }

  console.log('Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
