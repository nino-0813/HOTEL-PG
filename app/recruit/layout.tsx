import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const title = 'スタッフ募集';
const description =
  '因島に誕生するHOTEL PG -III-のスタッフを募集しています。HK（ハウスキーパー）・事務員。未経験OK、主婦・主夫、学生歓迎。土生町エリア、時給1,100円〜、社保完備。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/recruit' },
  openGraph: {
    type: 'website',
    url: `${SITE_ORIGIN}/recruit`,
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

export default function RecruitLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
