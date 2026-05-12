'use client';

import { useEffect, useState } from 'react';

/** マウント済みか。SSR と初回クライアント描画を一致させ、Framer Motion の useInView 起因の #418 を防ぐ */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
