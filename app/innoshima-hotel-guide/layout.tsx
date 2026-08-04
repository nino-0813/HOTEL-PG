import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const title = '因島のホテル・宿泊施設まとめ｜タイプ別ガイド';
const description =
  '因島にあるホテル・旅館・民宿・ゲストハウスをタイプ別にまとめてご紹介。観光・サイクリング・ビジネスなど目的に合わせた宿泊施設の選び方も解説します。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/innoshima-hotel-guide' },
  openGraph: {
    type: 'website',
    url: `${SITE_ORIGIN}/innoshima-hotel-guide`,
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

export default function InnoshimaHotelGuideLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
