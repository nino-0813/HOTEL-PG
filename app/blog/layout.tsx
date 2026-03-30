import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const blogDescription =
  'ホテルPG因島のブログ。因島観光・しまなみ海道の宿泊ヒント、ホテルの話題やアクセス情報などをお届けします。';
const blogOgDescription =
  '因島観光・しまなみ海道の宿泊やホテルPGの話題、読み物。観光のヒントやアクセス情報も掲載しています。';

export const metadata: Metadata = {
  title: 'Blog',
  description: blogDescription,
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    type: 'website',
    url: `${SITE_ORIGIN}/blog`,
    title: `Blog | ${SITE_NAME}`,
    description: blogOgDescription,
    siteName: SITE_NAME,
    locale: 'ja_JP',
    images: [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: `${SITE_NAME} Blog` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog | ${SITE_NAME}`,
    description: blogOgDescription,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
