import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/admin-server-session';

export const runtime = 'nodejs';

function stripBom(s: string): string {
  return s.replace(/^\uFEFF/, '');
}

function saasBaseUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SAAS_API_BASE_URL;
  if (raw == null) return null;
  const s = stripBom(String(raw)).trim().replace(/\/$/, '');
  return s || null;
}

function adminApiSecret(): string | null {
  const raw = process.env.ADMIN_API_SECRET;
  if (raw == null) return null;
  const s = stripBom(String(raw)).trim();
  return s || null;
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

/** パス用 id の最低限の検証（パストラバーサル防止） */
function safeIdSegment(id: string): string | null {
  const s = id.trim();
  if (!s || s.length > 128) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(s)) return null;
  return s;
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'unauthorized', message: '管理画面にログインしてください。' }, { status: 401 });
  }
  const base = saasBaseUrl();
  const secret = adminApiSecret();
  if (!base || !secret) {
    return siteEnvMissingResponse();
  }
  const { id: rawId } = await ctx.params;
  const id = safeIdSegment(rawId ?? '');
  if (!id) {
    return NextResponse.json({ error: 'invalid_id', message: '削除対象の id が不正です。' }, { status: 400 });
  }
  const url = `${base}/api/admin/seasonal-room-rates/${encodeURIComponent(id)}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'x-admin-api-secret': secret },
      cache: 'no-store',
    });
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
    return NextResponse.json({ error: 'proxy_error', message: msg }, { status: 500 });
  }
}
