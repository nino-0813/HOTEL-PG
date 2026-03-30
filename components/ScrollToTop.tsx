'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ルート変更時に常にページ先頭へスクロールする。
 */
const ScrollToTop: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
