import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** 旧: 楽天 iCal → Supabase。Web サイト構成からは無効化（SaaS 側で管理）。 */
export async function GET() {
  return NextResponse.json(
    { error: 'disabled', message: 'iCal import is not available on this deployment.' },
    { status: 501 },
  );
}
