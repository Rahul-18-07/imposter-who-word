import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { onAuth, signInWithGoogle, signInAnonymously, signOut } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    return onAuth(setUser);
  }, []);

  return { user, signInWithGoogle, signInAnonymously, signOut };
}
