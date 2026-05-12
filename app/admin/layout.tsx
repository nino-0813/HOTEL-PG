import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

/** ログイン (/admin) はラップしない。(panel) 配下だけサイドバー付きレイアウト。 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
