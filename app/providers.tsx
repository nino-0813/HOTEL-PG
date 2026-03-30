'use client';

import { CmsProvider } from '@/context/CmsContext';
import ScrollToTop from '@/components/ScrollToTop';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CmsProvider>
      <ScrollToTop />
      {children}
    </CmsProvider>
  );
}
