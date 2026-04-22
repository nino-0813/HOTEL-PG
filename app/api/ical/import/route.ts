import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-server';

type ImportEvent = { start: string; end: string; uid?: string };

export const runtime = 'nodejs';

function toDateStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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

    const map = [
      { roomKey: 'pg1', url: process.env.RAKUTEN_ICAL_URL_1 },
      { roomKey: 'pg2_single', url: process.env.RAKUTEN_ICAL_URL_2 },
      { roomKey: 'pg2_family', url: process.env.RAKUTEN_ICAL_URL_3 },
    ] as const;
    const missing = map.filter((m) => !m.url).map((m) => m.roomKey);
    if (missing.length > 0) {
      return NextResponse.json({ error: 'missing_rakuten_ical_url', missing }, { status: 500 });
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'missing_supabase_service_role' }, { status: 500 });
    }

    let ical: any;
    try {
      const mod = await import('node-ical');
      ical = mod?.default ?? mod;
    } catch (e: any) {
      console.error(e);
      return NextResponse.json(
        { error: 'node-ical import failed', detail: e?.message ?? String(e) },
        { status: 500 },
      );
    }

    const results: { roomKey: string; inserted: number }[] = [];

    for (const m of map) {
      const res = await fetch(m.url!, { cache: 'no-store' });
      if (!res.ok) {
        return NextResponse.json({ error: 'fetch_failed', roomKey: m.roomKey }, { status: 502 });
      }
      const text = await res.text();

      const parsed = ical.sync.parseICS(text);
      const events: ImportEvent[] = [];
      for (const key of Object.keys(parsed)) {
        const ev: any = (parsed as any)[key];
        if (!ev || ev.type !== 'VEVENT') continue;
        if (!ev.start || !ev.end) continue;
        events.push({
          start: toDateStr(new Date(ev.start)),
          end: toDateStr(new Date(ev.end)),
          uid: ev.uid ? String(ev.uid) : undefined,
        });
      }

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

