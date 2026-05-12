'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ChevronDown, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import {
  emptySeasonalRoomRateDraft,
  putBodySeasonalRoomRates,
  seasonalRatesFromGetPayload,
  type SeasonalRoomRateRow,
} from '@/lib/admin-seasonal-room-rates';
import { ADMIN_INVENTORY_CAP_OPTIONS, ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS } from '@/lib/admin-room-form-options';

const STAFF_SEASONAL_PRIORITY = 100;

const STAFF_ROOM_TARGETS = [
  { value: 'pg1_standard', label: 'HOTEL PG -I-', property_code: 'PG1', room_type: 'standard' },
  { value: 'pg2_single', label: 'HOTEL PG -II- シングル', property_code: 'PG2', room_type: 'single' },
  { value: 'pg2_family', label: 'HOTEL PG -II- ファミリー', property_code: 'PG2', room_type: 'family' },
  { value: 'pg3_washitsu_3', label: 'HOTEL PG-III 3名タイプ', property_code: 'PG3', room_type: 'washitsu_modern_3' },
  { value: 'pg3_washitsu_4', label: 'HOTEL PG-III 4名タイプ', property_code: 'PG3', room_type: 'washitsu_modern_4' },
] as const;

const STAFF_INPUT_CLASS =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-textMain font-serif';
const STAFF_SELECT_CLASS = `${STAFF_INPUT_CLASS} cursor-pointer`;

function errMsgFromJson(json: unknown, status: number): string {
  let base = `エラー（${status}）`;
  if (json && typeof json === 'object') {
    const o = json as Record<string, unknown>;
    if (typeof o.message === 'string' && o.message.trim()) base = o.message;
    else if (typeof o.error === 'string' && o.error.trim()) base = o.error;
  }
  const hint =
    json && typeof json === 'object' && 'hint_ja' in json ? String((json as { hint_ja: unknown }).hint_ja).trim() : '';
  return hint ? `${base}\n\n${hint}` : base;
}

function staffTargetKey(row: Pick<SeasonalRoomRateRow, 'property_code' | 'room_type'>): string {
  const pc = row.property_code.trim();
  const rt = row.room_type.trim();
  const hit = STAFF_ROOM_TARGETS.find((t) => t.property_code === pc && t.room_type === rt);
  return hit?.value ?? '__custom__';
}

function staffTargetFromValue(value: string): { property_code: string; room_type: string } | null {
  const hit = STAFF_ROOM_TARGETS.find((t) => t.value === value);
  if (!hit) return null;
  return { property_code: hit.property_code, room_type: hit.room_type };
}

type StaffSeasonalFieldsProps = {
  value: SeasonalRoomRateRow;
  onChange: (patch: Partial<SeasonalRoomRateRow>) => void;
};

function StaffSeasonalFields({ value, onChange }: StaffSeasonalFieldsProps) {
  const target = staffTargetKey(value);
  const salesOverrideEnabled = value.inventory_cap_override !== null;

  const pricesDiffer =
    value.weekday_price !== value.friday_price || value.friday_price !== value.saturday_price;
  const [splitByDay, setSplitByDay] = useState(pricesDiffer);

  useEffect(() => {
    if (pricesDiffer) setSplitByDay(true);
  }, [pricesDiffer]);

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">設定名</label>
        <input
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={STAFF_INPUT_CLASS}
          placeholder="例：お盆料金・年末年始など"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">開始日</label>
          <input
            type="date"
            value={value.start_date}
            onChange={(e) => onChange({ start_date: e.target.value })}
            className={STAFF_INPUT_CLASS}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">終了日</label>
          <input
            type="date"
            value={value.end_date}
            onChange={(e) => onChange({ end_date: e.target.value })}
            className={STAFF_INPUT_CLASS}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">対象の部屋</label>
        <select
          value={target === '__custom__' ? '__custom__' : target}
          onChange={(e) => {
            const v = e.target.value;
            if (v === '__custom__') return;
            const m = staffTargetFromValue(v);
            if (m) onChange({ property_code: m.property_code, room_type: m.room_type });
          }}
          className={STAFF_SELECT_CLASS}
        >
          {target === '__custom__' ? (
            <option value="__custom__">
              その他（{value.property_code} / {value.room_type}）
            </option>
          ) : null}
          {STAFF_ROOM_TARGETS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {target === '__custom__' ? (
          <p className="mt-1.5 text-xs text-amber-800 font-serif bg-amber-50 border border-amber-100 rounded-lg px-2 py-1.5">
            この行は登録データの組み合わせです。上の一覧から削除のうえ、必要なら開発者にご相談ください。
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">
          {splitByDay ? '料金（曜日ごと・円）' : 'この期間の料金（1泊あたり・円）'}
        </label>
        {!splitByDay ? (
          <>
            <input
              type="number"
              min={0}
              step={1}
              value={value.weekday_price}
              onChange={(e) => {
                const n = Number(e.target.value) || 0;
                onChange({ weekday_price: n, friday_price: n, saturday_price: n });
              }}
              className={STAFF_INPUT_CLASS}
              placeholder="例：25000"
            />
            <p className="mt-1.5 text-xs text-gray-500 font-serif leading-relaxed">
              平日・金曜・土曜を同じ金額で登録します。金土だけ変えたい場合は下のチェックをオンにしてください。
            </p>
          </>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(
              [
                ['weekday_price', '平日（円）'],
                ['friday_price', '金曜（円）'],
                ['saturday_price', '土曜（円）'],
              ] as const
            ).map(([k, label]) => (
              <div key={k}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">{label}</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={value[k]}
                  onChange={(e) => onChange({ [k]: Number(e.target.value) || 0 } as Partial<SeasonalRoomRateRow>)}
                  className={STAFF_INPUT_CLASS}
                />
              </div>
            ))}
          </div>
        )}
        <label className="mt-3 flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={splitByDay}
            onChange={(e) => {
              const on = e.target.checked;
              setSplitByDay(on);
              if (!on) {
                const base = value.weekday_price;
                onChange({ weekday_price: base, friday_price: base, saturday_price: base });
              }
            }}
            className="mt-0.5 rounded border-gray-300"
          />
          <span className="text-sm text-textMain font-serif leading-snug">平日・金曜・土曜で金額を分ける</span>
        </label>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 space-y-3">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={salesOverrideEnabled}
            onChange={(e) => {
              if (e.target.checked) {
                onChange({ inventory_cap_override: 0 });
              } else {
                onChange({ inventory_cap_override: null });
              }
            }}
            className="mt-1 rounded border-gray-300"
          />
          <span className="text-sm text-textMain font-serif leading-snug">販売数をこの期間だけ変更する</span>
        </label>
        {salesOverrideEnabled ? (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">この期間の販売上限（室数）</label>
            <select
              value={String(value.inventory_cap_override ?? 0)}
              onChange={(e) => onChange({ inventory_cap_override: Number(e.target.value) })}
              className={STAFF_SELECT_CLASS}
            >
              {ADMIN_INVENTORY_CAP_OPTIONS.map((o) => (
                <option key={o.value} value={String(o.value)}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      <details className="group rounded-xl border border-gray-200 bg-white overflow-hidden">
        <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 text-sm font-medium text-textMain font-serif hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
          <span>詳細設定</span>
          <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-gray-50/50">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">料金に含む人数</label>
            <select
              value={value.included_guests}
              onChange={(e) => onChange({ included_guests: Number(e.target.value) || 1 })}
              className={STAFF_SELECT_CLASS}
            >
              {!ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS.some((o) => o.value === value.included_guests) ? (
                <option value={value.included_guests}>{value.included_guests}名（現在の値）</option>
              ) : null}
              {ADMIN_ROOM_INCLUDED_GUESTS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 font-serif">追加1人あたり（円）</label>
            <input
              type="number"
              min={0}
              step={1}
              value={value.extra_guest_fee}
              onChange={(e) => onChange({ extra_guest_fee: Number(e.target.value) || 0 })}
              className={STAFF_INPUT_CLASS}
            />
          </div>
        </div>
      </details>

      <label className="flex items-center gap-3 cursor-pointer select-none pt-1">
        <input
          type="checkbox"
          checked={value.is_active}
          onChange={(e) => onChange({ is_active: e.target.checked })}
          className="rounded border-gray-300"
        />
        <span className="text-sm text-textMain font-serif">この料金を有効にする</span>
      </label>
    </div>
  );
}

export default function AdminSeasonalRoomRatesSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [rows, setRows] = useState<SeasonalRoomRateRow[]>([]);
  const [draft, setDraft] = useState<SeasonalRoomRateRow>(() => emptySeasonalRoomRateDraft());
  const [draftFormKey, setDraftFormKey] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSaveOk(false);
    try {
      const res = await fetch('/api/admin/seasonal-room-rates', { credentials: 'include', cache: 'no-store' });
      const json = await res.json().catch(() => null);
      if (res.status === 401) {
        setLoadError('管理画面のセッションが無効です。一度ログアウトしてから再度ログインしてください。');
        setRows([]);
        return;
      }
      if (!res.ok) {
        setLoadError(errMsgFromJson(json, res.status));
        setRows([]);
        return;
      }
      setRows(seasonalRatesFromGetPayload(json));
    } catch {
      setLoadError('ネットワークエラーで読み込めませんでした。');
      setRows([]);
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

  const updateRow = (index: number, patch: Partial<SeasonalRoomRateRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const validateRow = (r: SeasonalRoomRateRow): string | null => {
    if (!r.name.trim()) return '設定名を入力してください。';
    if (!r.property_code.trim() || !r.room_type.trim()) return '対象の部屋を選んでください。';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.start_date.trim())) return '開始日を正しく選んでください。';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.end_date.trim())) return '終了日を正しく選んでください。';
    if (r.start_date > r.end_date) return '終了日は開始日以降にしてください。';
    if (r.inventory_cap_override !== null && !Number.isFinite(Number(r.inventory_cap_override))) {
      return '販売上限の数値が不正です。';
    }
    return null;
  };

  const saveAll = async (nextRows: SeasonalRoomRateRow[]) => {
    setSaveError(null);
    for (let i = 0; i < nextRows.length; i++) {
      const v = validateRow(nextRows[i]);
      if (v) {
        const msg = `${i + 1} 件目: ${v}`;
        setSaveError(msg);
        return { ok: false as const, message: msg };
      }
    }
    setSaving(true);
    setSaveOk(false);
    try {
      const body = putBodySeasonalRoomRates(nextRows);
      const res = await fetch('/api/admin/seasonal-room-rates', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => null);
      if (res.status === 401) {
        setSaveError('セッションが無効です。再ログインしてください。');
        return { ok: false as const, message: '' };
      }
      if (!res.ok) {
        setSaveError(errMsgFromJson(json, res.status));
        return { ok: false as const, message: '' };
      }
      setSaveOk(true);
      await load();
      return { ok: true as const, message: '' };
    } catch {
      setSaveError('保存中にエラーが発生しました。');
      return { ok: false as const, message: '' };
    } finally {
      setSaving(false);
    }
  };

  const handleSaveList = () => void saveAll(rows);

  const handleAddDraftAndSave = async () => {
    const toAdd: SeasonalRoomRateRow = {
      ...draft,
      priority: STAFF_SEASONAL_PRIORITY,
    };
    const v = validateRow(toAdd);
    if (v) {
      setSaveError(v);
      return;
    }
    const next = [...rows, toAdd];
    const r = await saveAll(next);
    if (r.ok) {
      setDraft(emptySeasonalRoomRateDraft());
      setDraftFormKey((k) => k + 1);
    }
  };

  const handleDelete = async (row: SeasonalRoomRateRow, index: number) => {
    setSaveError(null);
    setSaveOk(false);
    if (!row.id) {
      setRows((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    if (!window.confirm('この期間別料金を削除しますか？')) return;
    setDeletingId(row.id);
    try {
      const res = await fetch(`/api/admin/seasonal-room-rates/${encodeURIComponent(row.id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json().catch(() => null);
      if (res.status === 401) {
        setSaveError('セッションが無効です。再ログインしてください。');
        return;
      }
      if (!res.ok) {
        setSaveError(errMsgFromJson(json, res.status));
        return;
      }
      setSaveOk(true);
      await load();
    } catch {
      setSaveError('削除中にエラーが発生しました。');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="border-t border-gray-200 pt-10 mt-10">
      <h2 className="font-display text-lg text-textMain mb-2 tracking-[0.12em]">期間別料金</h2>
      <p className="font-serif text-sm text-gray-700 leading-relaxed mb-2">
        期間別料金は、通常料金より優先されます。お盆・連休・イベント期間など、特定期間だけ料金を変えたいときに使います。
      </p>
      <p className="font-serif text-xs text-gray-500 leading-relaxed mb-6">
        表示・保存先は SaaS 側です。ブラウザにシークレットは出しません。
      </p>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3 bg-white border border-gray-200 rounded-xl">
          <Loader2 className="animate-spin" size={28} />
          <p className="font-serif text-sm">読み込み中…</p>
        </div>
      ) : null}

      {!loading && loadError ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-serif mb-4">{loadError}</div>
      ) : null}

      {!loading && !loadError ? (
        <>
          {saveOk ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 font-serif mb-4">
              保存しました
            </div>
          ) : null}
          {saveError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-serif whitespace-pre-wrap mb-4">
              {saveError}
            </div>
          ) : null}

          <h3 className="font-display text-sm text-textMain mb-3 font-serif text-gray-700">登録済みの期間別料金</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {rows.map((row, idx) => (
              <div
                key={row.id ?? `new-${idx}`}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4 ring-1 ring-black/[0.02]"
              >
                <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <p className="font-display text-xs text-gray-400 tracking-wider mb-0.5">設定</p>
                    <p className="font-serif text-base text-textMain font-medium">{row.name.trim() || '（名称未設定）'}</p>
                    {row.id ? (
                      <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {row.id}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    disabled={deletingId === row.id || saving}
                    onClick={() => void handleDelete(row, idx)}
                    className="shrink-0 p-2 text-gray-400 hover:text-red-600 rounded disabled:opacity-40"
                    title="削除"
                  >
                    {deletingId === row.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                  </button>
                </div>
                <StaffSeasonalFields value={row} onChange={(patch) => updateRow(idx, patch)} />
              </div>
            ))}
          </div>
          {rows.length === 0 ? (
            <div className="mt-4 mb-8 flex flex-wrap items-center gap-4">
              <p className="text-sm text-gray-500 font-serif">まだ登録がありません。下のフォームから追加できます。</p>
              <button
                type="button"
                disabled={saving}
                onClick={() => void load()}
                className="text-sm text-gray-600 underline hover:text-textMain font-serif"
              >
                再読み込み
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4 mt-8 mb-10">
              <button
                type="button"
                disabled={saving}
                onClick={() => void handleSaveList()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-textMain text-white rounded-lg text-sm font-display tracking-wider hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? '保存中…' : '変更を保存'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void load()}
                className="text-sm text-gray-600 underline hover:text-textMain font-serif"
              >
                再読み込み
              </button>
            </div>
          )}

          <h3 className="font-display text-sm text-textMain mb-2 font-serif text-gray-700">新しい期間別料金を追加</h3>
          <p className="text-xs text-gray-500 font-serif mb-4">お盆料金・イベント料金・年末年始料金など、名前を付けて登録できます。</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 space-y-6">
            <div key={draftFormKey}>
              <StaffSeasonalFields
                value={draft}
                onChange={(patch) => setDraft((d) => ({ ...d, ...patch, priority: STAFF_SEASONAL_PRIORITY }))}
              />
            </div>
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleAddDraftAndSave()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-textMain text-white rounded-lg text-sm font-display tracking-wider hover:bg-gray-800 disabled:opacity-50 w-full sm:w-auto justify-center"
            >
              <Plus size={18} />
              この内容を追加して保存
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
