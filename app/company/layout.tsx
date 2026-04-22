import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const title = '会社情報（運営会社）';
const description = 'HOTEL PG（因島）の運営会社情報と施設情報を掲載しています。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/company' },
  openGraph: {
    type: 'website',
    url: `${SITE_ORIGIN}/company`,
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

export default function CompanyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}

