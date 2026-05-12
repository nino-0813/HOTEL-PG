import { NextResponse } from 'next/server';
import { ROOM_INVENTORY, type RoomKey as PricingRoomKey } from '@/lib/pricing';

/** 旧: Supabase の予約・ブロック集計。サイトは SaaS 空室 API を利用するため、ここは空の日次データのみ返す。 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get('room');
    if (!room) return NextResponse.json({ error: 'missing_room' }, { status: 400 });
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    if (!start || !end) {
      return NextResponse.json({ error: 'missing_range' }, { status: 400 });
    }

    const capacity = ROOM_INVENTORY[room as PricingRoomKey] ?? 3;
    return NextResponse.json({ room, capacity, start, end, days: {} });
  } catch (e: unknown) {
    console.error(e);
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'server_error', detail: message }, { status: 500 });
  }
}
