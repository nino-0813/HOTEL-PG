import type { EmbedData } from '../types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

function extractMeta(html: string, key: string): string | undefined {
  const prop = key.startsWith('og:') ? key : `og:${key}`;
  const r = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, 'i');
  const m = html.match(r);
  if (m) return m[1];
  const r2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, 'i');
  const m2 = html.match(r2);
  return m2?.[1];
}

function extractTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1]?.trim();
}

/**
 * URL から OGP 情報を取得する（CORS プロキシ経由）
 */
export async function fetchEmbedData(url: string): Promise<EmbedData | null> {
  try {
    const encoded = encodeURIComponent(url);
    const res = await fetch(CORS_PROXY + encoded, { signal: AbortSignal.timeout(10000) });
    const html = await res.text();
    const title = extractMeta(html, 'og:title') ?? extractTitle(html);
    const description = extractMeta(html, 'og:description');
    const image = extractMeta(html, 'og:image');
    const siteName = extractMeta(html, 'og:site_name');
    return {
      url,
      title: title ?? undefined,
      description: description ?? undefined,
      image: image ?? undefined,
      siteName: siteName ?? undefined,
    };
  } catch (e) {
    console.error('fetchEmbedData:', e);
    return null;
  }
}
