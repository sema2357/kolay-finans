"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "kf-compare";
export const MAX_COMPARE = 4;

type Ctx = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  clear: () => void;
  full: boolean;
};

const CompareContext = createContext<Ctx | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setSlugs(JSON.parse(saved));
    } catch {
      /* geçersiz kayıt yok sayılır */
    }
  }, []);

  const persist = (next: string[]) => {
    setSlugs(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const toggle = useCallback(
    (slug: string) => {
      if (slugs.includes(slug)) persist(slugs.filter((s) => s !== slug));
      else if (slugs.length < MAX_COMPARE) persist([...slugs, slug]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slugs],
  );

  const value: Ctx = {
    slugs,
    has: (slug) => slugs.includes(slug),
    toggle,
    clear: () => persist([]),
    full: slugs.length >= MAX_COMPARE,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare, CompareProvider içinde kullanılmalı");
  return ctx;
}
