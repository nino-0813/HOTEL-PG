import { ImageResponse } from 'next/og';

export const alt = 'HOTEL PG Innoshima — Shimanami Kaido';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * SNS・検索向けデフォルトOG画像（静的ファイルが無い環境でも確実に配信）
 * 日本語は Satori のフォント依存を避け、欧文で統一
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(152deg, #1a252d 0%, #0f171c 42%, #1c2e36 100%)',
          color: '#ebe6dc',
        }}
      >
        <div
          style={{
            fontSize: 86,
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
          }}
        >
          HOTEL PG
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 20,
            letterSpacing: '0.42em',
            textTransform: 'uppercase' as const,
            opacity: 0.92,
          }}
        >
          Innoshima
        </div>
        <div
          style={{
            fontSize: 26,
            marginTop: 56,
            opacity: 0.72,
            letterSpacing: '0.22em',
          }}
        >
          Setouchi · Shimanami Kaido
        </div>
      </div>
    ),
    { ...size }
  );
}
