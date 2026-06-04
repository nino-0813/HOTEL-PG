'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import {
  BOOKING_WINDOW_ROOMS,
  BOOKING_WINDOW_MONTH_OPTIONS,
  fetchBookingWindows,
  saveBookingWindows,
  isSupabaseConfigured,
  type BookingWindowMap,
} from '@/lib/booking-window';
import { ADMIN_SELECT_CLASS } from '@/lib/admin-room-form-options';

export default function AdminBookingWindowSection() {
  const [configured] = useState<boolean>(() => isSupabaseConfigured());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);
  const [windows, setWindows] = useState<BookingWindowMap>({});

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSaveOk(false);
    try {
      if (!isSupabaseConfigured()) {
        setLoadError('Supabase が未設定のため、この設定は保存できません（NEXT_PUBLIC_SUPABASE_URL / ANON_KEY を確認してください）。');
        setWindows({});
        return;
      }
      const map = await fetchBookingWindows();
      setWindows(map);
    } catch {
      setLoadError('予約受付期間の読み込みに失敗しました。');
      setWindows({});
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

  const setMonths = (roomKey: string, months: number) => {
    setWindows((prev) => ({ ...prev, [roomKey]: months }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveOk(false);
    try {
      const ok = await saveBookingWindows(windows);
      if (!ok) {
        setSaveError('保存に失敗しました。時間をおいて再度お試しください。');
        return;
      }
      setSaveOk(true);
      await load();
    } catch {
      setSaveError('保存中にエラーが発生しました。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="font-display text-lg text-textMain mb-2 tracking-[0.12em]">予約受付期間（何ヶ月先まで）</h2>
      <p className="font-serif text-sm text-gray-500 mb-6 leading-relaxed">
        部屋ごとに「今日から何ヶ月先まで予約を受け付けるか」を設定します。例: 3ヶ月先までにすると、それ以降の日付はカレンダー上で
        「受付期間外」になり予約できません。<span className="text-gray-400">（このサイトの予約カレンダーに反映されます）</span>
      </p>

      {loadError ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 font-serif">
          {loadError}
        </div>
      ) : null}

      {saveOk ? (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 font-serif">
          保存しました
        </div>
      ) : null}

      {saveError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 font-serif">
          {saveError}
        </div>
      ) : null}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500 py-6">
          <Loader2 className="animate-spin" size={20} />
          <span className="font-serif text-sm">読み込み中…</span>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {BOOKING_WINDOW_ROOMS.map((room) => {
              const months = windows[room.roomKey] ?? 0;
              return (
                <div
                  key={room.roomKey}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3 ring-1 ring-black/[0.02]"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <span className="font-serif text-sm font-medium text-textMain">{room.label}</span>
                    <span className="text-[10px] sm:text-xs font-mono text-gray-400">{room.propertyCode}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">受付期間</label>
                    <select
                      value={months}
                      onChange={(e) => setMonths(room.roomKey, Number(e.target.value) || 0)}
                      disabled={!configured}
                      className={`${ADMIN_SELECT_CLASS} disabled:opacity-50`}
                    >
                      {!BOOKING_WINDOW_MONTH_OPTIONS.some((o) => o.value === months) ? (
                        <option value={months}>{months}ヶ月先まで（現在の値）</option>
                      ) : null}
                      {BOOKING_WINDOW_MONTH_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled={saving || !configured}
              onClick={() => void handleSave()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-textMain text-white rounded-lg text-sm font-display tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? '保存中…' : '受付期間を保存'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
