import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/admin-server-session';

export const runtime = 'nodejs';

/** UTF-8 BOM 付き .env 行の先頭除去 */
function stripBom(s: string): string {
  return s.replace(/^\uFEFF/, '');
}

function saasBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SAAS_API_BASE_URL;
  if (raw == null) return null;
  const s = stripBom(String(raw)).trim().replace(/\/$/, '');
  return s || null;
}

/** サイト側が読むのは `ADMIN_API_SECRET` のみ（別名は参照しない） */
function adminApiSecret(): string | null {
  const raw = process.env.ADMIN_API_SECRET;
  if (raw == null) return null;
  const s = stripBom(String(raw)).trim();
  return s || null;
}

function logEnvPresenceDev(): void {
  if (process.env.NODE_ENV !== 'development') return;
  // シークレットの値は出さない
  console.log('[api/admin/public-room-settings] ADMIN_API_SECRET (boolean):', Boolean(adminApiSecret()));
  console.log('[api/admin/public-room-settings] NEXT_PUBLIC_SAAS_API_BASE_URL (boolean):', Boolean(saasBaseUrl()));
}

function siteEnvMissingResponse() {
  return NextResponse.json(
    {
      error: 'site_env_missing',
      message:
        'Webサイト側（Next.js サーバー）で ADMIN_API_SECRET または NEXT_PUBLIC_SAAS_API_BASE_URL が読み取れていません。プロジェクト直下の .env.local を確認し、開発サーバーを再起動してください。',
    },
    { status: 503 },
  );
}

async function forwardToSaaS(method: 'GET' | 'PUT', body?: unknown): Promise<Response> {
  const base = saasBaseUrl();
  const secret = adminApiSecret();
  if (!base || !secret) {
    throw new Error('SITE_ENV_MISSING');
  }
  const url = `${base}/api/admin/public-room-settings`;
  const init: RequestInit = {
    method,
    headers: {
      'x-admin-api-secret': secret,
      ...(method === 'PUT' ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  };
  if (method === 'PUT' && body !== undefined) {
    init.body = JSON.stringify(body);
  }
  return fetch(url, init);
}

/** SaaS が返す英語メッセージ用の補足（サイト .env は別問題の可能性） */
function attachSaaSHintIfNeeded(status: number, json: unknown): unknown {
  if (status < 400 || !json || typeof json !== 'object') return json;
  const o = json as Record<string, unknown>;
  const msg = [o.message, o.error].map((x) => (typeof x === 'string' ? x : '')).join(' ');
  if (/ADMIN_API_SECRET|admin.?api.?secret|not configured/i.test(msg)) {
    return {
      ...o,
      hint_ja:
        'この文言は多くの場合、SaaS（Vercel）側の ADMIN_API_SECRET と、リクエストヘッダー x-admin-api-secret の値が一致していないときに返されます。ホームサイトの .env.local は読み込めている可能性があります。',
    };
  }
  return json;
}

export async function GET() {
  logEnvPresenceDev();
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'unauthorized', message: '管理画面にログインしてください。' }, { status: 401 });
  }
  const base = saasBaseUrl();
  const secret = adminApiSecret();
  if (!base || !secret) {
    return siteEnvMissingResponse();
  }
  try {
    const res = await forwardToSaaS('GET');
    const text = await res.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      return NextResponse.json(
        { error: 'saas_invalid_json', message: 'SaaS からの応答を解析できませんでした。', detail: text.slice(0, 200) },
        { status: 502 },
      );
    }
    const out = attachSaaSHintIfNeeded(res.status, json);
    return NextResponse.json(out, { status: res.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === 'SITE_ENV_MISSING') {
      return siteEnvMissingResponse();
    }
    return NextResponse.json({ error: 'proxy_error', message: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  logEnvPresenceDev();
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'unauthorized', message: '管理画面にログインしてください。' }, { status: 401 });
  }
  const base = saasBaseUrl();
  const secret = adminApiSecret();
  if (!base || !secret) {
    return siteEnvMissingResponse();
  }
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'リクエスト本文が JSON ではありません。' }, { status: 400 });
  }
  try {
    const res = await forwardToSaaS('PUT', payload);
    const text = await res.text();
    let json: unknown = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text.slice(0, 500) };
      }
    }
    const out = attachSaaSHintIfNeeded(res.status, json ?? {});
    return NextResponse.json(out, { status: res.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === 'SITE_ENV_MISSING') {
      return siteEnvMissingResponse();
    }
    return NextResponse.json({ error: 'proxy_error', message: msg }, { status: 500 });
  }
}
