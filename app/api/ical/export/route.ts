import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';
import { buildIcal } from '@/lib/ical';
import { type CheckoutRoomKey } from '@/lib/room-data';

export const runtime = 'nodejs';

function roomKeyToLabel(roomKey: string) {
  if (roomKey === 'pg1') return 'HOTEL PG -I-';
  if (roomKey === 'pg2_single') return 'HOTEL PG -II-（シングル）';
  if (roomKey === 'pg2_family') return 'HOTEL PG -II-（ファミリー）';
  return roomKey;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room') as CheckoutRoomKey | null;
  if (!room) {
    return NextResponse.json({ error: 'missing_room' }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'missing_supabase_service_role' }, { status: 500 });
  }

  const today = new Date();
  const todayStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(
    today.getUTCDate(),
  ).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('bookings')
    .select('id, room_key, checkin_date, checkout_date, status, stripe_session_id')
    .eq('room_key', room)
    .eq('status', 'paid')
    .gte('checkout_date', todayStr);

  if (error) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  const events = (data ?? [])
    .filter((b: any) => b.checkin_date && b.checkout_date)
    .map((b: any) => ({
      uid: b.id ?? b.stripe_session_id,
      start: b.checkin_date as string,
      end: b.checkout_date as string,
    }));

  const ical = buildIcal({
    roomLabel: roomKeyToLabel(room),
    events,
  });

  return new NextResponse(ical, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

