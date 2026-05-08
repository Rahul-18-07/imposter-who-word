import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category, CategoryEntry } from '../game/types';

export async function listOfficialCategories(): Promise<Category[]> {
  const snap = await getDocs(
    query(collection(db, 'categories'), orderBy('name')),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
}

export async function listMyCustomCategories(uid: string): Promise<Category[]> {
  const snap = await getDocs(
    query(
      collection(db, 'users', uid, 'customCategories'),
      orderBy('name'),
    ),
  );
  return snap.docs.map(
    (d) =>
      ({
        id: d.id,
        locale: 'global' as const,
        isOfficial: false,
        ...d.data(),
      }) as Category,
  );
}

export async function createCustomCategory(
  uid: string,
  data: { name: string; emoji: string; entries: CategoryEntry[] },
): Promise<string> {
  const ref = await addDoc(
    collection(db, 'users', uid, 'customCategories'),
    {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );
  return ref.id;
}

export async function updateCustomCategory(
  uid: string,
  categoryId: string,
  data: Partial<{ name: string; emoji: string; entries: CategoryEntry[] }>,
): Promise<void> {
  await updateDoc(doc(db, 'users', uid, 'customCategories', categoryId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCustomCategory(
  uid: string,
  categoryId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'customCategories', categoryId));
}
