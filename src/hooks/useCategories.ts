import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import type { Category } from '../game/types';
import {
  listOfficialCategories,
  listMyCustomCategories,
} from '../lib/categoriesRepo';

export function useCategories(user: User | null | undefined) {
  const [official, setOfficial] = useState<Category[]>([]);
  const [custom, setCustom] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const [off, cust] = await Promise.all([
          listOfficialCategories(),
          user && !user.isAnonymous
            ? listMyCustomCategories(user.uid)
            : Promise.resolve([]),
        ]);
        setOfficial(off);
        setCustom(cust);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user]);

  const refresh = async () => {
    if (!user || user.isAnonymous) return;
    const cust = await listMyCustomCategories(user.uid);
    setCustom(cust);
  };

  return { official, custom, loading, refresh };
}
