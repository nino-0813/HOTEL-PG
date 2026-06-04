import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * 部屋ごとの「何ヶ月先まで予約を受け付けるか」設定。
 * 保存先は SaaS と同じ Supabase の site_booking_windows テーブル。
 * ただしブラウザからは直接触らず、必ずサイトのサーバー API 経由で読み書きする
 * （service_role キーはサーバーだけが持つ）。値は「今日から N ヶ月先まで予約可」。
 * 0 は無制限（=従来どおりずっと先まで予約可）。SaaS 側の在庫計算は変更しない。
 */

/** SaaS の Supabase 内テーブル名（このサイト専用・reservations 等には触れない） */
export const BOOKING_WINDOW_TABLE = 'site_booking_windows';

/** 予約カレンダー（RoomBookingCalendar）と揃えた部屋キー */
export type BookingWindowRoomKey =
  | 'pg1'
  | 'pg2_single'
  | 'pg2_family'
  | 'pg3_three'
  | 'pg3_four'
  | 'pg3_maisonette';

export type BookingWindowRoom = {
  roomKey: BookingWindowRoomKey;
  label: string;
  propertyCode: string;
  roomType: string;
};

/** 管理画面・カレンダー双方で参照する正準リスト（順序＝表示順） */
export const BOOKING_WINDOW_ROOMS: BookingWindowRoom[] = [
  { roomKey: 'pg1', label: 'HOTEL PG -I-', propertyCode: 'PG1', roomType: 'standard' },
  { roomKey: 'pg2_single', label: 'HOTEL PG -II- シングル', propertyCode: 'PG2', roomType: 'single' },
  { roomKey: 'pg2_family', label: 'HOTEL PG -II- ファミリー', propertyCode: 'PG2', roomType: 'family' },
  { roomKey: 'pg3_three', label: 'HOTEL PG -III- 3名タイプ', propertyCode: 'PG3', roomType: 'washitsu_modern_3' },
  { roomKey: 'pg3_four', label: 'HOTEL PG -III- 4名タイプ', propertyCode: 'PG3', roomType: 'washitsu_modern_4' },
  { roomKey: 'pg3_maisonette', label: 'HOTEL PG -III- メゾネット洋室', propertyCode: 'PG3', roomType: 'maisonette_6' },
];

/** roomKey → 受付月数（0 = 無制限）。未設定の部屋は 0 扱い */
export type BookingWindowMap = Record<string, number>;

/** 管理画面の選択肢（月数）。0 は無制限 */
export const BOOKING_WINDOW_MONTH_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: '無制限（ずっと先まで）' },
  { value: 1, label: '1ヶ月先まで' },
  { value: 2, label: '2ヶ月先まで' },
  { value: 3, label: '3ヶ月先まで' },
  { value: 4, label: '4ヶ月先まで' },
  { value: 5, label: '5ヶ月先まで' },
  { value: 6, label: '6ヶ月先まで' },
  { value: 9, label: '9ヶ月先まで' },
  { value: 12, label: '12ヶ月先まで' },
];

const VALID_KEYS = new Set<string>(BOOKING_WINDOW_ROOMS.map((r) => r.roomKey));

/** 任意の値から安全に BookingWindowMap を作る。全部屋を埋め、不正値は 0（無制限） */
export function normalizeBookingWindows(raw: unknown): BookingWindowMap {
  const out: BookingWindowMap = {};
  for (const { roomKey } of BOOKING_WINDOW_ROOMS) out[roomKey] = 0;
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (!VALID_KEYS.has(k)) continue;
      const n = Math.trunc(Number(v));
      out[k] = Number.isFinite(n) && n > 0 ? n : 0;
    }
  }
  return out;
}

/** 指定部屋の受付月数（0 = 無制限） */
export function advanceMonthsForRoom(map: BookingWindowMap, roomKey: string): number {
  const n = map[roomKey];
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/* ------------------------------------------------------------------ *
 * サーバー専用（API ルートから呼ぶ）。service_role クライアントを受け取る
 * ------------------------------------------------------------------ */

/** DB から受付期間を読み出す（行が無い部屋は 0） */
export async function readBookingWindows(client: SupabaseClient): Promise<BookingWindowMap> {
  const { data, error } = await client.from(BOOKING_WINDOW_TABLE).select('room_key, advance_months');
  if (error) throw error;
  const obj: Record<string, unknown> = {};
  for (const row of (data ?? []) as { room_key: string; advance_months: number }[]) {
    obj[row.room_key] = row.advance_months;
  }
  return normalizeBookingWindows(obj);
}

/** 受付期間を DB に保存（全部屋を upsert） */
export async function writeBookingWindows(client: SupabaseClient, map: BookingWindowMap): Promise<void> {
  const normalized = normalizeBookingWindows(map);
  const rows = BOOKING_WINDOW_ROOMS.map(({ roomKey }) => ({
    room_key: roomKey,
    advance_months: normalized[roomKey] ?? 0,
    updated_at: new Date().toISOString(),
  }));
  const { error } = await client.from(BOOKING_WINDOW_TABLE).upsert(rows, { onConflict: 'room_key' });
  if (error) throw error;
}

/* ------------------------------------------------------------------ *
 * クライアント用（公開カレンダーが読む）。サーバー API 経由
 * ------------------------------------------------------------------ */

/** 公開 API から受付期間を取得（失敗時は全部屋 0=無制限にフォールバック） */
export async function fetchPublicBookingWindows(): Promise<BookingWindowMap> {
  try {
    const res = await fetch('/api/public/booking-windows', { cache: 'no-store' });
    if (!res.ok) return normalizeBookingWindows(null);
    const json = await res.json().catch(() => null);
    const raw = json && typeof json === 'object' ? (json as Record<string, unknown>).booking_windows : null;
    return normalizeBookingWindows(raw);
  } catch {
    return normalizeBookingWindows(null);
  }
}
