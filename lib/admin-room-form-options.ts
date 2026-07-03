/** 料金・在庫・期間別料金の管理画面で使うセレクト肢 */

export const ADMIN_SELECT_CLASS =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white font-mono text-textMain';

export const ADMIN_PROPERTY_OPTIONS: { value: string; label: string }[] = [
  { value: 'PG1', label: 'PG1（HOTEL PG -I-）' },
  { value: 'PG2', label: 'PG2（HOTEL PG -II-）' },
  { value: 'PG3', label: 'PG3（HOTEL PG -III-）' },
];

export const ADMIN_ROOM_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'standard', label: 'standard（標準）' },
  { value: 'single', label: 'single（シングル）' },
  { value: 'family', label: 'family（ファミリー）' },
];

/** 施設ごとの room_type 候補 */
export function adminRoomTypeOptionsForProperty(propertyCode: string): { value: string; label: string }[] {
  const pc = propertyCode.trim();
  if (pc === 'PG1') {
    return [{ value: 'standard', label: 'standard（HOTEL PG -I-）' }];
  }
  if (pc === 'PG2') {
    return [
      { value: 'single', label: 'single（HOTEL PG -II- シングル）' },
      { value: 'family', label: 'family（HOTEL PG -II- ファミリー）' },
    ];
  }
  if (pc === 'PG3') {
    return [
      { value: 'washitsu_modern_3', label: 'washitsu_modern_3（PG-III 3名タイプ）' },
      { value: 'washitsu_modern_4', label: 'washitsu_modern_4（PG-III 4名タイプ）' },
      { value: 'maisonette_6', label: 'maisonette_6（PG-III メゾネット洋室）' },
    ];
  }
  return ADMIN_ROOM_TYPE_OPTIONS;
}

export function intOptions(min: number, max: number, labelFn: (n: number) => string): { value: number; label: string }[] {
  return Array.from({ length: max - min + 1 }, (_, i) => {
    const value = min + i;
    return { value, label: labelFn(value) };
  });
}

/** 部屋タイプカード：最大人数 */
export const ADMIN_ROOM_MAX_GUESTS_OPTIONS = intOptions(1, 10, (n) => `最大${n}名`);

/** 部屋タイプカード：料金に含む人数（ラベル側で「料金に含む」と説明するため option は短く） */
export const ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS = intOptions(1, 8, (n) => `${n}名`);

/** 部屋タイプカード・在庫上限：販売在庫 */
export const ADMIN_INVENTORY_CAP_OPTIONS = intOptions(0, 50, (n) => String(n));

/** PG3 の表示名（SaaS / 掲載用の固定候補） */
export const ADMIN_PG3_DISPLAY_NAME_OPTIONS: string[] = [
  '【OPEN記念価格】2名利用でお得｜和モダン客室｜最大3名｜無料駐車場｜長期滞在歓迎',
  '【OPEN記念価格】2名利用でお得｜和モダン客室｜最大4名｜セミダブルベッド｜無料駐車場',
  'メゾネット洋室｜静かな港町ステイ',
];

export const ADMIN_PG3_DISPLAY_NAME_SELECT_CLASS =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-textMain font-serif leading-snug';


/** 期間別料金：priority */
export const ADMIN_SEASONAL_PRIORITY_OPTIONS = intOptions(0, 30, (n) => `優先度 ${n}`);
