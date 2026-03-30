import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { DEFAULT_DESCRIPTION, DEFAULT_PAGE_TITLE, SITE_NAME } from '@/lib/site';

/** トップの title / description を明示（ルート layout の default と一致） */
export const metadata: Metadata = {
  title: DEFAULT_PAGE_TITLE,
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: DEFAULT_PAGE_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
  },
};

export default function Page() {
  return <HomePage />;
}
