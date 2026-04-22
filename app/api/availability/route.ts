import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get('room');
    if (!room) return NextResponse.json({ error: 'missing_room' }, { status: 400 });
    const start = searchParams.get('start'); // YYYY-MM-DD (inclusive)
    const end = searchParams.get('end'); // YYYY-MM-DD (exclusive)
    if (!start || !end) {
      return NextResponse.json({ error: 'missing_range' }, { status: 400 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      // Local dev / misconfig: don't break the UI; just show no blocks.
      return NextResponse.json({ room, days: {}, warning: 'missing_supabase_service_role' }, { status: 200 });
    }

    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() + 90);
    const cutoffStr = `${cutoff.getUTCFullYear()}-${String(cutoff.getUTCMonth() + 1).padStart(2, '0')}-${String(
      cutoff.getUTCDate(),
    ).padStart(2, '0')}`;

    const [bookingsRes, blocksRes] = await Promise.all([
      supabase
        .from('bookings')
        .select('checkin_date, checkout_date, status')
        .eq('room_key', room)
        .eq('status', 'paid')
        .lt('checkin_date', end)
        .gt('checkout_date', start),
      supabase
        .from('external_blocks')
        .select('blocked_date_start, blocked_date_end, source')
        .eq('room_key', room)
        .lt('blocked_date_start', end)
        .gt('blocked_date_end', start)
        .lte('blocked_date_start', cutoffStr),
    ]);

    if (bookingsRes.error || blocksRes.error) {
      return NextResponse.json(
        {
          error: 'db_error',
          detail: bookingsRes.error?.message ?? blocksRes.error?.message ?? 'unknown',
        },
        { status: 500 },
      );
    }

    const toUtc = (d: string): Date => {
      const [y, m, day] = d.split('-').map((x) => parseInt(x, 10));
      return new Date(Date.UTC(y, m - 1, day));
    };
    const toStr = (d: Date): string =>
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    const addDays = (d: Date, days: number) =>
      new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));

    const days: Record<string, number> = {};
    const rangeStart = toUtc(start);
    const rangeEnd = toUtc(end);

    const incRange = (s: string, e: string) => {
      const ds = toUtc(s);
      const de = toUtc(e);
      for (let d = new Date(ds); d.getTime() < de.getTime(); d = addDays(d, 1)) {
        if (d.getTime() < rangeStart.getTime() || d.getTime() >= rangeEnd.getTime()) continue;
        const k = toStr(d);
        days[k] = (days[k] ?? 0) + 1;
      }
    };

    // bookings count as 1 per day
    for (const b of bookingsRes.data ?? []) {
      if (!(b as any).checkin_date || !(b as any).checkout_date) continue;
      incRange((b as any).checkin_date as string, (b as any).checkout_date as string);
    }

    // external blocks: ignore huge "inventory unset" blocks (>=90 days)
    for (const bl of blocksRes.data ?? []) {
      const s = (bl as any).blocked_date_start as string | undefined;
      const e = (bl as any).blocked_date_end as string | undefined;
      if (!s || !e) continue;
      const dur = Math.round((toUtc(e).getTime() - toUtc(s).getTime()) / (24 * 60 * 60 * 1000));
      if (dur >= 90) continue;
      incRange(s, e);
    }

    return NextResponse.json({ room, start, end, days });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'db_error', detail: e?.message ?? String(e) }, { status: 500 });
  }
}

