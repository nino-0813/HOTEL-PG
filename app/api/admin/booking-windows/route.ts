import { NextResponse } from 'next/server';
import { isAdminSessionValid } from '@/lib/admin-server-session';
import { getServerSupabase, isServerSupabaseConfigured } from '@/lib/supabase-server';
import { readBookingWindows, writeBookingWindows, normalizeBookingWindows } from '@/lib/booking-window';

export const runtime = 'nodejs';

function envMissingResponse() {
  return NextResponse.json(
    {
      error: 'server_supabase_missing',
      message:
        'サーバー側で Supabase（SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY）が設定されていません。Vercel の環境変数を確認し、再デプロイしてください。',
    },
    { status: 503 },
  );
}

export async function GET() {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'unauthorized', message: '管理画面にログインしてください。' }, { status: 401 });
  }
  if (!isServerSupabaseConfigured()) return envMissingResponse();
  const client = getServerSupabase();
  if (!client) return envMissingResponse();
  try {
    const windows = await readBookingWindows(client);
    return NextResponse.json({ booking_windows: windows }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'db_error', message: `読み込みに失敗しました：${msg}` }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: 'unauthorized', message: '管理画面にログインしてください。' }, { status: 401 });
  }
  if (!isServerSupabaseConfigured()) return envMissingResponse();
  const client = getServerSupabase();
  if (!client) return envMissingResponse();

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'リクエスト本文が JSON ではありません。' }, { status: 400 });
  }
  const raw =
    payload && typeof payload === 'object' ? (payload as Record<string, unknown>).booking_windows ?? payload : payload;
  const map = normalizeBookingWindows(raw);

  try {
    await writeBookingWindows(client, map);
    const windows = await readBookingWindows(client);
    return NextResponse.json({ booking_windows: windows }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'db_error', message: `保存に失敗しました：${msg}` }, { status: 500 });
  }
}
