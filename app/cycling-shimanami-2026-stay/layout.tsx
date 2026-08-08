import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, SITE_ORIGIN } from '@/lib/site';

const title =
  '【初参加でも安心】サイクリングしまなみ2026 宿泊・前泊・後泊ガイド｜コース別おすすめプラン';
const description =
  'サイクリングしまなみ2026（2026年10月25日開催）の参加者向け宿泊ガイド。前日受付・荷物預かり・輸送サービスの押さえどころから、A/B/D/Eコース別の前泊・後泊プラン、宿選びで失敗しないポイントまで。因島のHOTEL PGからのアクセスも正直にご案内します。';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/cycling-shimanami-2026-stay' },
  openGraph: {
    type: 'article',
    url: `${SITE_ORIGIN}/cycling-shimanami-2026-stay`,
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

export default function CyclingShimanami2026StayLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
