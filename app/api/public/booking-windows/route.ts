import { NextResponse } from 'next/server';
import { getServerSupabase, isServerSupabaseConfigured } from '@/lib/supabase-server';
import { readBookingWindows, normalizeBookingWindows } from '@/lib/booking-window';

export const runtime = 'nodejs';

/** 公開カレンダー用。未設定や失敗時は全部屋 0（無制限）を返して従来挙動にフォールバック */
export async function GET() {
  const empty = normalizeBookingWindows(null);
  if (!isServerSupabaseConfigured()) {
    return NextResponse.json({ booking_windows: empty }, { status: 200 });
  }
  const client = getServerSupabase();
  if (!client) {
    return NextResponse.json({ booking_windows: empty }, { status: 200 });
  }
  try {
    const windows = await readBookingWindows(client);
    return NextResponse.json({ booking_windows: windows }, { status: 200 });
  } catch {
    return NextResponse.json({ booking_windows: empty }, { status: 200 });
  }
}
