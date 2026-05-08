import { useState, useEffect } from 'react';
import type { Category, CategoryEntry } from '../game/types';

const STORAGE_KEY = 'imposter_guest_categories';

function load(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : [];
  } catch {
    return [];
  }
}

function save(cats: Category[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  } catch {}
}

function genId() {
  return `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function useGuestCategories() {
  const [categories, setCategories] = useState<Category[]>(load);

  useEffect(() => {
    save(categories);
  }, [categories]);

  const create = (data: { name: string; emoji: string; entries: CategoryEntry[] }): string => {
    const cat: Category = {
      id: genId(),
      name: data.name,
      emoji: data.emoji,
      entries: data.entries,
      isOfficial: false,
      locale: 'global',
    };
    setCategories((prev) => [...prev, cat]);
    return cat.id;
  };

  const update = (id: string, data: Partial<{ name: string; emoji: string; entries: CategoryEntry[] }>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const remove = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return { categories, create, update, remove };
}
