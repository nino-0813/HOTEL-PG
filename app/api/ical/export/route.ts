import { NextResponse } from 'next/server';
import { buildIcal } from '@/lib/ical';
import { type CheckoutRoomKey } from '@/lib/room-data';

export const runtime = 'nodejs';

function roomKeyToLabel(roomKey: string) {
  if (roomKey === 'pg1') return 'HOTEL PG -I-';
  if (roomKey === 'pg2_single') return 'HOTEL PG -II-（シングル）';
  if (roomKey === 'pg2_family') return 'HOTEL PG -II-（ファミリー）';
  if (roomKey === 'pg3_three' || roomKey === 'pg3') return 'HOTEL PG-III 3名タイプ';
  if (roomKey === 'pg3_four') return 'HOTEL PG-III 4名タイプ';
  if (roomKey === 'pg3_maisonette') return 'HOTEL PG-III メゾネット洋室';
  return roomKey;
}

/** 旧: Supabase の予約から iCal 生成。サイトでは未使用のため空カレンダーを返す。 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get('room') as CheckoutRoomKey | null;
  if (!room) {
    return NextResponse.json({ error: 'missing_room' }, { status: 400 });
  }

  const ical = buildIcal({
    roomLabel: roomKeyToLabel(room),
    events: [],
  });

  return new NextResponse(ical, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
