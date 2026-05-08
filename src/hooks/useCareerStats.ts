import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { getCareerStats, getRecentGames, type CareerStats, type GameRecord } from '../lib/scoresRepo';

export function useCareerStats(user: User | null | undefined) {
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [recentGames, setRecentGames] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.isAnonymous) {
      setStats(null);
      setRecentGames([]);
      return;
    }
    setLoading(true);
    Promise.all([getCareerStats(user.uid), getRecentGames(user.uid)])
      .then(([s, g]) => {
        setStats(s);
        setRecentGames(g);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return { stats, recentGames, loading };
}
