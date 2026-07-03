'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import {
  mergeRoomSettingsPayload,
  type PublicRoomSettingRow,
} from '@/lib/admin-room-settings-defaults';
import {
  ADMIN_INVENTORY_CAP_OPTIONS,
  ADMIN_PG3_DISPLAY_NAME_OPTIONS,
  ADMIN_PG3_DISPLAY_NAME_SELECT_CLASS,
  ADMIN_PROPERTY_OPTIONS,
  ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS,
  ADMIN_ROOM_MAX_GUESTS_OPTIONS,
  ADMIN_SELECT_CLASS,
  adminRoomTypeOptionsForProperty,
} from '@/lib/admin-room-form-options';
import AdminSeasonalRoomRatesSection from '@/components/admin/AdminSeasonalRoomRatesSection';
import AdminBookingWindowSection from '@/components/admin/AdminBookingWindowSection';

/** 管理画面表示用（施設コード → ホテル名） */
function propertyBlockMeta(code: string): { title: string; description: string; accent: string } {
  switch (code) {
    case 'PG1':
      return {
        title: 'HOTEL PG -I-',
        description: '施設コード PG1 の部屋タイプ・料金',
        accent: 'border-l-stone-400',
      };
    case 'PG2':
      return {
        title: 'HOTEL PG -II-',
        description: '施設コード PG2（シングル / ファミリー等）',
        accent: 'border-l-amber-500/80',
      };
    case 'PG3':
      return {
        title: 'HOTEL PG -III-',
        description:
          '3名タイプ（washitsu_modern_3）・4名タイプ（washitsu_modern_4）・メゾネット洋室（maisonette_6）の行で管理します。それぞれ最大人数・料金が異なります。',
        accent: 'border-l-emerald-600/70',
      };
    default:
      return {
        title: code,
        description: '施設コード別の部屋タイプ・料金',
        accent: 'border-l-gray-400',
      };
  }
}

export default function AdminRoomSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [roomSettings, setRoomSettings] = useState<PublicRoomSettingRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSaveOk(false);
    try {
      const res = await fetch('/api/admin/public-room-settings', { credentials: 'include', cache: 'no-store' });
      const json = await res.json().catch(() => null);
      if (res.status === 401) {
        setLoadError('管理画面のセッションが無効です。一度ログアウトしてから再度ログインしてください。');
        setRoomSettings([]);
        return;
      }
      if (!res.ok) {
        const baseMsg =
          (json && typeof json === 'object' && 'message' in json && String((json as { message: unknown }).message)) ||
          (json && typeof json === 'object' && 'error' in json && String((json as { error: unknown }).error)) ||
          `読み込みに失敗しました（${res.status}）`;
        const hint =
          json && typeof json === 'object' && 'hint_ja' in json && String((json as { hint_ja: unknown }).hint_ja).trim();
        setLoadError(hint ? `${baseMsg}\n\n${hint}` : baseMsg);
        const merged = mergeRoomSettingsPayload({});
        setRoomSettings(merged.room_settings);
        return;
      }
      const merged = mergeRoomSettingsPayload(json);
      setRoomSettings(merged.room_settings);
    } catch {
      setLoadError('ネットワークエラーで読み込めませんでした。');
      const merged = mergeRoomSettingsPayload({});
      setRoomSettings(merged.room_settings);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!saveOk) return;
    const t = setTimeout(() => setSaveOk(false), 4000);
    return () => clearTimeout(t);
  }, [saveOk]);

  const updateRoom = (index: number, patch: Partial<PublicRoomSettingRow>) => {
    setRoomSettings((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const roomSettingsByProperty = useMemo(() => {
    const order = ['PG1', 'PG2', 'PG3'];
    const buckets = new Map<string, { index: number; row: PublicRoomSettingRow }[]>();
    roomSettings.forEach((row, index) => {
      const key = row.property_code.trim() || '_';
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push({ index, row });
    });
    const keys = [...buckets.keys()];
    keys.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia !== -1 || ib !== -1) {
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      }
      return a.localeCompare(b);
    });
    const pg3TypeOrder = ['washitsu_modern_3', 'washitsu_modern_4', 'maisonette_6'];
    return keys.map((property_code) => {
      const items = [...(buckets.get(property_code) ?? [])];
      if (property_code === 'PG3') {
        items.sort((a, b) => {
          const ia = pg3TypeOrder.indexOf(a.row.room_type);
          const ib = pg3TypeOrder.indexOf(b.row.room_type);
          if (ia !== -1 || ib !== -1) {
            if (ia === -1) return 1;
            if (ib === -1) return -1;
            return ia - ib;
          }
          return a.row.room_type.localeCompare(b.row.room_type);
        });
      }
      return { property_code, items };
    });
  }, [roomSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const body = {
        room_settings: roomSettings.map((r) => ({
          display_name: r.display_name,
          property_code: r.property_code,
          room_type: r.room_type,
          weekday_price: Number(r.weekday_price),
          friday_price: Number(r.friday_price),
          saturday_price: Number(r.saturday_price),
          included_guests: Number(r.included_guests),
          extra_guest_fee: Number(r.extra_guest_fee),
          max_guests: Number(r.max_guests),
          inventory_cap: Number(r.inventory_cap),
          is_active: !!r.is_active,
        })),
      };
      const res = await fetch('/api/admin/public-room-settings', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (res.status === 401) {
        setSaveError('セッションが無効です。再ログインしてください。');
        return;
      }
      if (!res.ok) {
        const baseMsg =
          (json && typeof json === 'object' && 'message' in json && String((json as { message: unknown }).message)) ||
          (json && typeof json === 'object' && 'error' in json && String((json as { error: unknown }).error)) ||
          `保存に失敗しました（${res.status}）`;
        const hint =
          json && typeof json === 'object' && 'hint_ja' in json && String((json as { hint_ja: unknown }).hint_ja).trim();
        setSaveError(hint ? `${baseMsg}\n\n${hint}` : baseMsg);
        return;
      }
      await load();
      setSaveOk(true);
    } catch {
      setSaveError('保存中にエラーが発生しました。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
        <Loader2 className="animate-spin" size={28} />
        <p className="font-serif text-sm">SaaS から設定を読み込み中…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl text-textMain tracking-[0.08em]">料金・在庫設定</h1>
        <p className="mt-2 font-serif text-sm text-gray-500 leading-relaxed">
          表示・保存先は SaaS 側です。この画面は管理 API 経由で読み書きします（ブラウザにシークレットは出しません）。
        </p>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-serif">
          {loadError}
        </div>
      ) : null}

      {saveOk ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 font-serif">
          保存しました
        </div>
      ) : null}

      {saveError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-serif">{saveError}</div>
      ) : null}

      <section>
        <h2 className="font-display text-lg text-textMain mb-2 tracking-[0.12em]">部屋タイプ（public_room_settings）</h2>
        <p className="font-serif text-sm text-gray-500 mb-6 leading-relaxed">
          ホテル（施設コード）ごとにまとめています。下のカードは部屋タイプ単位の料金・在庫です。
        </p>
        <div className="space-y-8">
          {roomSettingsByProperty.map(({ property_code, items }) => {
            const meta = propertyBlockMeta(property_code);
            return (
              <div
                key={property_code}
                className={`rounded-2xl border border-gray-200/90 bg-gradient-to-br from-gray-50/90 to-white shadow-sm overflow-hidden border-l-4 ${meta.accent}`}
              >
                <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100/80 bg-white/60">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[10px] sm:text-xs tracking-[0.28em] uppercase text-gray-400 mb-1">施設</p>
                      <h3 className="font-display text-xl sm:text-2xl text-textMain tracking-[0.06em]">{meta.title}</h3>
                      <p className="mt-1 font-serif text-sm text-gray-500">{meta.description}</p>
                    </div>
                    <span className="shrink-0 inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 font-mono text-xs text-gray-600">
                      {property_code}
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    {items.map(({ index: idx, row }) => (
                      <div
                        key={`${row.property_code}-${row.room_type}-${row.max_guests}-${idx}`}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3 ring-1 ring-black/[0.02]"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                          <span className="inline-flex items-center gap-2 flex-wrap">
                            <span className="font-display text-[10px] tracking-[0.2em] uppercase bg-textMain text-white px-2.5 py-1 rounded-md">
                              {row.room_type}
                            </span>
                            <span className="text-[10px] sm:text-xs font-serif text-gray-600 bg-gray-100 border border-gray-200 rounded-md px-2 py-0.5">
                              最大{row.max_guests}名
                            </span>
                            <span className="text-xs text-gray-400 font-mono hidden sm:inline">{row.property_code}</span>
                          </span>
                          <label className="flex items-center gap-2 text-sm text-textMain cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={row.is_active}
                              onChange={(e) => updateRoom(idx, { is_active: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            有効
                          </label>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">表示名</label>
                          {row.property_code === 'PG3' ? (
                            <select
                              value={row.display_name}
                              onChange={(e) => updateRoom(idx, { display_name: e.target.value })}
                              className={ADMIN_PG3_DISPLAY_NAME_SELECT_CLASS}
                            >
                              {!ADMIN_PG3_DISPLAY_NAME_OPTIONS.includes(row.display_name) && row.display_name.trim() ? (
                                <option value={row.display_name}>{row.display_name}（現在の値）</option>
                              ) : null}
                              {ADMIN_PG3_DISPLAY_NAME_OPTIONS.map((label) => (
                                <option key={label} value={label}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={row.display_name}
                              onChange={(e) => updateRoom(idx, { display_name: e.target.value })}
                              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">property_code</label>
                            <select
                              value={row.property_code}
                              onChange={(e) => updateRoom(idx, { property_code: e.target.value })}
                              className={ADMIN_SELECT_CLASS}
                            >
                              {!ADMIN_PROPERTY_OPTIONS.some((o) => o.value === row.property_code) ? (
                                <option value={row.property_code}>{row.property_code}（現在の値）</option>
                              ) : null}
                              {ADMIN_PROPERTY_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">room_type</label>
                            <select
                              value={row.room_type}
                              onChange={(e) => updateRoom(idx, { room_type: e.target.value })}
                              className={ADMIN_SELECT_CLASS}
                            >
                              {!adminRoomTypeOptionsForProperty(row.property_code).some((o) => o.value === row.room_type) ? (
                                <option value={row.room_type}>{row.room_type}（現在の値）</option>
                              ) : null}
                              {adminRoomTypeOptionsForProperty(row.property_code).map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {(['weekday_price', 'friday_price', 'saturday_price'] as const).map((k) => (
                            <div key={k}>
                              <label className="block text-xs text-gray-500 mb-1">
                                {k === 'weekday_price' ? '平日' : k === 'friday_price' ? '金' : '土'}（円）
                              </label>
                              <input
                                type="number"
                                min={0}
                                step={1}
                                value={row[k]}
                                onChange={(e) =>
                                  updateRoom(idx, { [k]: Number(e.target.value) || 0 } as Partial<PublicRoomSettingRow>)
                                }
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 xl:grid-cols-4 gap-y-3 gap-x-4 min-[480px]:gap-x-5 xl:gap-x-7 min-w-0">
                          <div className="min-w-0">
                            <label className="block text-xs text-gray-500 mb-1 whitespace-nowrap">
                              基本人数（料金に含む）
                            </label>
                            <select
                              value={row.included_guests}
                              onChange={(e) => updateRoom(idx, { included_guests: Number(e.target.value) || 1 })}
                              className={`${ADMIN_SELECT_CLASS} min-w-0 max-w-full font-sans`}
                            >
                              {!ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS.some((o) => o.value === row.included_guests) ? (
                                <option value={row.included_guests}>{row.included_guests}名（現在の値）</option>
                              ) : null}
                              {ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="min-w-0 min-[480px]:pl-2 xl:pl-3">
                            <label className="block text-xs text-gray-500 mb-1 whitespace-nowrap">追加1人（円）</label>
                            <input
                              type="number"
                              min={0}
                              step={1}
                              value={row.extra_guest_fee}
                              onChange={(e) => updateRoom(idx, { extra_guest_fee: Number(e.target.value) || 0 })}
                              className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="min-w-0">
                            <label className="block text-xs text-gray-500 mb-1 whitespace-nowrap">最大人数</label>
                            <select
                              value={row.max_guests}
                              onChange={(e) => updateRoom(idx, { max_guests: Number(e.target.value) || 1 })}
                              className={`${ADMIN_SELECT_CLASS} min-w-0 max-w-full font-sans`}
                            >
                              {!ADMIN_ROOM_MAX_GUESTS_OPTIONS.some((o) => o.value === row.max_guests) ? (
                                <option value={row.max_guests}>最大{row.max_guests}名（現在の値）</option>
                              ) : null}
                              {ADMIN_ROOM_MAX_GUESTS_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="min-w-0 max-xl:min-[480px]:pl-2">
                            <label className="block text-xs text-gray-500 mb-1 whitespace-nowrap">販売在庫上限</label>
                            <select
                              value={row.inventory_cap}
                              onChange={(e) => updateRoom(idx, { inventory_cap: Number(e.target.value) || 0 })}
                              className={`${ADMIN_SELECT_CLASS} min-w-0 max-w-full font-sans`}
                            >
                              {!ADMIN_INVENTORY_CAP_OPTIONS.some((o) => o.value === row.inventory_cap) ? (
                                <option value={row.inventory_cap}>{row.inventory_cap}（現在の値）</option>
                              ) : null}
                              {ADMIN_INVENTORY_CAP_OPTIONS.map((o) => (
                                <option key={o.value} value={o.value}>
                                  {o.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-textMain text-white rounded-lg text-sm font-display tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? '保存中…' : 'SaaS に保存'}
        </button>
        <button
          type="button"
          onClick={() => void load()}
          className="text-sm text-gray-600 underline hover:text-textMain"
        >
          再読み込み
        </button>
      </div>

      <AdminBookingWindowSection />

      <AdminSeasonalRoomRatesSection />
    </div>
  );
}
