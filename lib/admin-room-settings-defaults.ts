/** SaaS 未返却時の表示用フォールバック（保存先は常に SaaS。API 値を優先しつつ欠損のみ補完。PG3 は room_type で 3名 / 4名を区別） */
export type PublicRoomSettingRow = {
  display_name: string;
  property_code: string;
  room_type: string;
  weekday_price: number;
  friday_price: number;
  saturday_price: number;
  included_guests: number;
  extra_guest_fee: number;
  max_guests: number;
  inventory_cap: number;
  is_active: boolean;
};

export type PublicInventoryCapRow = {
  property_code: string;
  room_type: string;
  min_guests: number;
  max_guests: number;
  inventory_cap: number;
};

export const DEFAULT_ROOM_SETTINGS: PublicRoomSettingRow[] = [
  {
    display_name: 'HOTEL PG -I-',
    property_code: 'PG1',
    room_type: 'standard',
    weekday_price: 8000,
    friday_price: 8000,
    saturday_price: 8000,
    included_guests: 2,
    extra_guest_fee: 0,
    max_guests: 2,
    inventory_cap: 3,
    is_active: true,
  },
  {
    display_name: 'HOTEL PG -II- シングル',
    property_code: 'PG2',
    room_type: 'single',
    weekday_price: 8000,
    friday_price: 12000,
    saturday_price: 12000,
    included_guests: 2,
    extra_guest_fee: 0,
    max_guests: 2,
    inventory_cap: 1,
    is_active: true,
  },
  {
    display_name: 'HOTEL PG -II- ファミリー',
    property_code: 'PG2',
    room_type: 'family',
    weekday_price: 14500,
    friday_price: 18500,
    saturday_price: 18500,
    included_guests: 2,
    extra_guest_fee: 5200,
    max_guests: 4,
    inventory_cap: 2,
    is_active: true,
  },
  {
    display_name: 'HOTEL PG-III 3名タイプ',
    property_code: 'PG3',
    room_type: 'washitsu_modern_3',
    weekday_price: 20400,
    friday_price: 24400,
    saturday_price: 24400,
    included_guests: 2,
    extra_guest_fee: 5000,
    max_guests: 3,
    inventory_cap: 10,
    is_active: true,
  },
  {
    display_name: 'HOTEL PG-III 4名タイプ',
    property_code: 'PG3',
    room_type: 'washitsu_modern_4',
    weekday_price: 24400,
    friday_price: 28500,
    saturday_price: 28500,
    included_guests: 2,
    extra_guest_fee: 5000,
    max_guests: 4,
    inventory_cap: 10,
    is_active: true,
  },
  {
    display_name: 'HOTEL PG-III メゾネット洋室',
    property_code: 'PG3',
    room_type: 'maisonette_6',
    weekday_price: 30400,
    friday_price: 34400,
    saturday_price: 34400,
    included_guests: 2,
    extra_guest_fee: 5200,
    max_guests: 6,
    inventory_cap: 1,
    is_active: true,
  },
];

export const DEFAULT_INVENTORY_CAPS: PublicInventoryCapRow[] = [
  { property_code: 'PG3', room_type: 'washitsu_modern_3', min_guests: 1, max_guests: 3, inventory_cap: 10 },
  { property_code: 'PG3', room_type: 'washitsu_modern_4', min_guests: 1, max_guests: 4, inventory_cap: 10 },
  { property_code: 'PG3', room_type: 'maisonette_6', min_guests: 1, max_guests: 6, inventory_cap: 1 },
];

/** 同一施設・同一 room_type でも最大人数が違えば別プラン（例: 旧 PG3 family の 3名 / 4名）。PG3 は現状 room_type で区別 */
function roomKey(r: { property_code: string; room_type: string; max_guests: number }) {
  return `${r.property_code}:${r.room_type}:${r.max_guests}`;
}

function capKey(r: { property_code: string; room_type: string; min_guests: number; max_guests: number }) {
  return `${r.property_code}:${r.room_type}:${r.min_guests}:${r.max_guests}`;
}

function normalizeRoomRow(raw: unknown): PublicRoomSettingRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pc = String(o.property_code ?? '');
  const rt = String(o.room_type ?? '');
  if (!pc || !rt) return null;
  return {
    display_name: String(o.display_name ?? ''),
    property_code: pc,
    room_type: rt,
    weekday_price: Number(o.weekday_price ?? 0) || 0,
    friday_price: Number(o.friday_price ?? 0) || 0,
    saturday_price: Number(o.saturday_price ?? 0) || 0,
    included_guests: Number(o.included_guests ?? 0) || 0,
    extra_guest_fee: Number(o.extra_guest_fee ?? 0) || 0,
    max_guests: Number(o.max_guests ?? 0) || 0,
    inventory_cap: Number(o.inventory_cap ?? 0) || 0,
    is_active: o.is_active === true || o.is_active === 1 || o.is_active === 'true',
  };
}

function normalizeCapRow(raw: unknown): PublicInventoryCapRow | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pc = String(o.property_code ?? '');
  const rt = String(o.room_type ?? '');
  if (!pc || !rt) return null;
  return {
    property_code: pc,
    room_type: rt,
    min_guests: Number(o.min_guests ?? 0) || 0,
    max_guests: Number(o.max_guests ?? 0) || 0,
    inventory_cap: Number(o.inventory_cap ?? 0) || 0,
  };
}

/** API 行を優先し、欠損キーはデフォルトで補完。同一 property + room_type は max_guests で別行 */
export function mergeRoomSettingsPayload(data: unknown): {
  room_settings: PublicRoomSettingRow[];
  inventory_caps: PublicInventoryCapRow[];
} {
  const root = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const rawRooms = Array.isArray(root.room_settings) ? root.room_settings : [];
  const rawCaps = Array.isArray(root.inventory_caps) ? root.inventory_caps : [];

  const fromApi = rawRooms.map(normalizeRoomRow).filter((x): x is PublicRoomSettingRow => x !== null);
  const fromApiCaps = rawCaps.map(normalizeCapRow).filter((x): x is PublicInventoryCapRow => x !== null);

  const mergedRooms: PublicRoomSettingRow[] = DEFAULT_ROOM_SETTINGS.map((def) => {
    const hit = fromApi.find((r) => roomKey(r) === roomKey(def));
    return hit ? { ...def, ...hit } : { ...def };
  });
  for (const r of fromApi) {
    if (!mergedRooms.some((m) => roomKey(m) === roomKey(r))) mergedRooms.push(r);
  }

  const mergedCaps: PublicInventoryCapRow[] = DEFAULT_INVENTORY_CAPS.map((def) => {
    const hit = fromApiCaps.find((c) => capKey(c) === capKey(def));
    return hit ? { ...def, ...hit } : { ...def };
  });
  for (const c of fromApiCaps) {
    if (!mergedCaps.some((m) => capKey(m) === capKey(c))) mergedCaps.push(c);
  }

  return { room_settings: mergedRooms, inventory_caps: mergedCaps };
}
