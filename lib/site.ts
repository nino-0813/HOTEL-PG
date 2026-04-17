/**
 * サイトの正規URL・デフォルトの title / description / OGP 用の単一ソース
 * ステージング等では NEXT_PUBLIC_SITE_URL を上書き
 */
const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.hotelpg-innosima.com').trim();

/** 末尾スラッシュなしのオリジン（metadataBase・canonical 生成用） */
export const SITE_ORIGIN = raw.replace(/\/+$/, '');

/** Schema.org 等で従来どおりトレイリングスラッシュ付きで使うベースURL */
export const SITE_URL = `${SITE_ORIGIN}/`;

export const SITE_NAME = 'ホテルPG 因島';

export const DEFAULT_PAGE_TITLE = '因島のホテルPG｜しまなみ海道の宿・観光拠点に最適';

export const DEFAULT_DESCRIPTION =
  'ホテルPG因島は、しまなみ海道・因島観光に便利な宿泊施設。海が見える落ち着いた空間で、観光・ビジネスどちらにも最適です。';

/** Next の file convention `/opengraph-image`（metadataBase と組み合わせて絶対URL化） */
export const DEFAULT_OG_IMAGE_PATH = '/opengraph-image';

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized}`;
}
