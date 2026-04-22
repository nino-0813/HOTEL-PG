import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room');
  if (!room) return NextResponse.json({ error: 'missing_room' }, { status: 400 });

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'missing_supabase_service_role' }, { status: 500 });
  }

  const [bookingsRes, blocksRes] = await Promise.all([
    supabase
      .from('bookings')
      .select('checkin_date, checkout_date, status')
      .eq('room_key', room)
      .neq('status', 'cancelled'),
    supabase
      .from('external_blocks')
      .select('blocked_date_start, blocked_date_end, source')
      .eq('room_key', room),
  ]);

  if (bookingsRes.error || blocksRes.error) {
    return NextResponse.json({ error: 'db_error' }, { status: 500 });
  }

  const bookingRanges = (bookingsRes.data ?? [])
    .filter((b: any) => b.checkin_date && b.checkout_date)
    .map((b: any) => ({ start: b.checkin_date as string, end: b.checkout_date as string, source: 'self' }));

  const blockRanges = (blocksRes.data ?? []).map((b: any) => ({
    start: b.blocked_date_start as string,
    end: b.blocked_date_end as string,
    source: b.source as string,
  }));

  return NextResponse.json({ room, ranges: [...bookingRanges, ...blockRanges] });
}

