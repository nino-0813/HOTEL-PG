import { supabase, isSupabaseConfigured } from './supabase';

/**
 * 部屋ごとの「何ヶ月先まで予約を受け付けるか」設定。
 * 保存先は CMS と同じ cms_content テーブル（key='booking_windows', value=jsonb）。
 * 値は「今日から N ヶ月先まで予約可」。0 は無制限（=従来どおりずっと先まで予約可）。
 * この設定はこのサイトの予約カレンダー上での制御に使う（SaaS 側の在庫計算は変更しない）。
 */

const TABLE = 'cms_content';
export const BOOKING_WINDOW_CMS_KEY = 'booking_windows';

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

/** jsonb から安全に BookingWindowMap を取り出す。不正値は 0（無制限）に丸める */
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

export async function fetchBookingWindows(): Promise<BookingWindowMap> {
  if (!supabase) return normalizeBookingWindows(null);
  const { data, error } = await supabase.from(TABLE).select('value').eq('key', BOOKING_WINDOW_CMS_KEY).maybeSingle();
  if (error || !data) return normalizeBookingWindows(null);
  return normalizeBookingWindows((data as { value: unknown }).value);
}

export async function saveBookingWindows(map: BookingWindowMap): Promise<boolean> {
  if (!supabase) return false;
  const value = normalizeBookingWindows(map);
  const { error } = await supabase
    .from(TABLE)
    .upsert({ key: BOOKING_WINDOW_CMS_KEY, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

export { isSupabaseConfigured };
