/** SaaS `GET/PUT /api/admin/seasonal-room-rates` と管理画面の行型 */

export type SeasonalRoomRateRow = {
  id?: string;
  name: string;
  property_code: string;
  room_type: string;
  start_date: string;
  end_date: string;
  weekday_price: number;
  friday_price: number;
  saturday_price: number;
  /** null = 基本設定（public_room_settings）を引き継ぐ */
  included_guests: number | null;
  /** null = 基本設定の追加料金を引き継ぐ（例: シングルの 2人目 +5,200） */
  extra_guest_fee: number | null;
  inventory_cap_override: number | null;
  priority: number;
  is_active: boolean;
};

export function emptySeasonalRoomRateDraft(): SeasonalRoomRateRow {
  return {
    name: '',
    property_code: 'PG1',
    room_type: 'standard',
    start_date: '',
    end_date: '',
    weekday_price: 0,
    friday_price: 0,
    saturday_price: 0,
    included_guests: null,
    extra_guest_fee: null,
    inventory_cap_override: null,
    priority: 100,
    is_active: true,
  };
}

function num(v: unknown, fallback = 0): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

export function coerceSeasonalRow(x: unknown): SeasonalRoomRateRow | null {
  if (!x || typeof x !== 'object') return null;
  const r = x as Record<string, unknown>;
  const idRaw = r.id;
  const id = idRaw != null && String(idRaw).trim() !== '' ? String(idRaw) : undefined;
  return {
    id,
    name: String(r.name ?? ''),
    property_code: String(r.property_code ?? ''),
    room_type: String(r.room_type ?? ''),
    start_date: String(r.start_date ?? '').slice(0, 10),
    end_date: String(r.end_date ?? '').slice(0, 10),
    weekday_price: num(r.weekday_price, 0),
    friday_price: num(r.friday_price, 0),
    saturday_price: num(r.saturday_price, 0),
    included_guests: numOrNull(r.included_guests),
    extra_guest_fee: numOrNull(r.extra_guest_fee),
    inventory_cap_override: numOrNull(r.inventory_cap_override),
    priority: num(r.priority, 0),
    is_active: Boolean(r.is_active),
  };
}

/** GET 応答から配列を取り出す（SaaS のラップ形式の差を吸収） */
export function seasonalRatesFromGetPayload(json: unknown): SeasonalRoomRateRow[] {
  if (Array.isArray(json)) {
    return json.map(coerceSeasonalRow).filter((x): x is SeasonalRoomRateRow => x != null);
  }
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    for (const k of ['seasonal_room_rates', 'rates', 'data', 'items']) {
      const v = o[k];
      if (Array.isArray(v)) {
        return v.map(coerceSeasonalRow).filter((x): x is SeasonalRoomRateRow => x != null);
      }
    }
  }
  return [];
}

/** PUT 本文（SaaS が期待するキー） */
export function putBodySeasonalRoomRates(rows: SeasonalRoomRateRow[]): { seasonal_room_rates: Record<string, unknown>[] } {
  return {
    seasonal_room_rates: rows.map((r) => {
      const o: Record<string, unknown> = {
        name: r.name.trim(),
        property_code: r.property_code.trim(),
        room_type: r.room_type.trim(),
        start_date: r.start_date.trim(),
        end_date: r.end_date.trim(),
        weekday_price: Number(r.weekday_price),
        friday_price: Number(r.friday_price),
        saturday_price: Number(r.saturday_price),
        included_guests:
          r.included_guests === null || r.included_guests === undefined ? null : Number(r.included_guests),
        extra_guest_fee:
          r.extra_guest_fee === null || r.extra_guest_fee === undefined ? null : Number(r.extra_guest_fee),
        inventory_cap_override:
          r.inventory_cap_override === null || r.inventory_cap_override === undefined
            ? null
            : Number(r.inventory_cap_override),
        priority: Number(r.priority),
        is_active: !!r.is_active,
      };
      if (r.id != null && String(r.id).trim() !== '') {
        o.id = String(r.id).trim();
      }
      return o;
    }),
  };
}
