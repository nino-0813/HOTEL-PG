import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const title = '特定商取引法に基づく表記';
const description = 'HOTEL PG（因島）の特定商取引法に基づく表記。事業者情報、支払方法、キャンセルポリシー等を掲載しています。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/legal' },
  openGraph: {
    type: 'website',
    url: `${SITE_ORIGIN}/legal`,
    title: `${title} | ${SITE_NAME}`,
    description,
    siteName: SITE_NAME,
    locale: 'ja_JP',
    images: [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} | ${SITE_NAME}`,
    description,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function LegalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

