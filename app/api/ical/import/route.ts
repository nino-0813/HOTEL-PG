import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

type ImportEvent = { start: string; end: string; uid?: string };

export const runtime = 'nodejs';

function toUtcDate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, m - 1, d));
}

function diffDays(start: string, end: string): number | null {
  const s = toUtcDate(start);
  const e = toUtcDate(end);
  if (!s || !e) return null;
  return Math.round((e.getTime() - s.getTime()) / (24 * 60 * 60 * 1000));
}

function parseIcal(text: string): ImportEvent[] {
  const events: ImportEvent[] = [];
  const blocks = text.split('BEGIN:VEVENT');
  for (const block of blocks.slice(1)) {
    const dtstart = block.match(/DTSTART;?[^:]*:(\d{8})/)?.[1];
    const dtend = block.match(/DTEND;?[^:]*:(\d{8})/)?.[1];
    const uid = block.match(/UID:(.+)/)?.[1]?.trim();
    if (dtstart && dtend) {
      const start = `${dtstart.slice(0, 4)}-${dtstart.slice(4, 6)}-${dtstart.slice(6, 8)}`;
      const end = `${dtend.slice(0, 4)}-${dtend.slice(4, 6)}-${dtend.slice(6, 8)}`;
      events.push({ start, end, uid: uid || '' });
    }
  }
  return events;
}

function readCronSecret(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice('Bearer '.length);
  const url = new URL(req.url);
  return url.searchParams.get('secret');
}

export async function GET(req: Request) {
  try {
    const secret = readCronSecret(req);
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const RAKUTEN_ROOM_MAP = [
      { roomKey: 'pg1', url: process.env.RAKUTEN_ICAL_URL_1 },
      { roomKey: 'pg2_single', url: process.env.RAKUTEN_ICAL_URL_2 },
      { roomKey: 'pg2_family', url: process.env.RAKUTEN_ICAL_URL_3 },
    ] as const;
    const missing = RAKUTEN_ROOM_MAP.filter((m) => !m.url).map((m) => m.roomKey);
    if (missing.length > 0) {
      return NextResponse.json({ error: 'missing_rakuten_ical_url', missing }, { status: 500 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'missing_supabase_service_role' }, { status: 500 });
    }

    const results: { roomKey: string; inserted: number }[] = [];

    for (const m of RAKUTEN_ROOM_MAP) {
      const url = m.url!;
      if (!/^https?:\/\//.test(url)) {
        return NextResponse.json(
          { error: 'invalid_rakuten_ical_url', roomKey: m.roomKey, value: url },
          { status: 500 },
        );
      }

      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        return NextResponse.json({ error: 'fetch_failed', roomKey: m.roomKey }, { status: 502 });
      }
      const text = await res.text();

      const events = parseIcal(text).filter((e) => {
        const days = diffDays(e.start, e.end);
        return days !== null && days < 90;
      });

      const { error: delErr } = await supabase
        .from('external_blocks')
        .delete()
        .eq('source', 'rakuten_oyado')
        .eq('room_key', m.roomKey);
      if (delErr) {
        return NextResponse.json({ error: 'delete_failed', roomKey: m.roomKey }, { status: 500 });
      }

      if (events.length === 0) {
        results.push({ roomKey: m.roomKey, inserted: 0 });
        continue;
      }

      const rows = events.map((e) => ({
        room_key: m.roomKey,
        blocked_date_start: e.start,
        blocked_date_end: e.end,
        source: 'rakuten_oyado',
        external_uid: e.uid ?? null,
      }));

      const { error: insErr } = await supabase.from('external_blocks').insert(rows);
      if (insErr) {
        return NextResponse.json({ error: 'insert_failed', roomKey: m.roomKey }, { status: 500 });
      }
      results.push({ roomKey: m.roomKey, inserted: rows.length });
    }

    return NextResponse.json({ ok: true, results });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 500 });
  }
}

