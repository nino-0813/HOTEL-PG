'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type RoomKey = 'pg1' | 'pg2_single' | 'pg2_family';

const ROOM_META: Record<
  RoomKey,
  {
    label: string;
    subtitle: string;
    priceFrom: number;
    weekday: number;
    weekend: number;
    weekendRule: string;
    extra?: string;
    backTo: string;
  }
> = {
  pg1: {
    label: 'HOTEL PG -I-',
    subtitle: '【素泊まり】ロフト付き洋室',
    priceFrom: 8000,
    weekday: 8000,
    weekend: 8000,
    weekendRule: '金・土・日',
    extra: '2人目から +¥5,000/人',
    backTo: '/rooms/pg1',
  },
  pg2_single: {
    label: 'HOTEL PG -II-（シングル）',
    subtitle: 'シングルタイプ',
    priceFrom: 8000,
    weekday: 8000,
    weekend: 12000,
    weekendRule: '金・土（※日曜なし）',
    backTo: '/rooms/pg2-single',
  },
  pg2_family: {
    label: 'HOTEL PG -II-（ファミリー）',
    subtitle: 'ファミリータイプ',
    priceFrom: 14000,
    weekday: 14000,
    weekend: 18000,
    weekendRule: '金・土（※日曜なし）',
    extra: '3人目から +¥5,000/人',
    backTo: '/rooms/pg2-family',
  },
};

function yen(amount: number): string {
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
}

function toUtcDate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split('-').map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, m - 1, d));
}

function addDaysUtc(d: Date, days: number): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days));
}

export default function CheckoutPage({
}: {}) {
  const searchParams = useSearchParams();
  const checkin = searchParams.get('checkin') ?? '';
  const checkout = searchParams.get('checkout') ?? '';
  const initialRoom = useMemo(() => {
    const r = searchParams.get('room');
    return (r === 'pg1' || r === 'pg2_single' || r === 'pg2_family') ? r : 'pg1';
  }, [searchParams]);

  const [room] = useState<RoomKey>(initialRoom);
  const [loading, setLoading] = useState(false);
  const selected = ROOM_META[room];

  const priceSummary = useMemo(() => {
    const ci = checkin ? toUtcDate(checkin) : null;
    const co = checkout ? toUtcDate(checkout) : null;
    if (!ci || !co || ci.getTime() >= co.getTime()) return null;

    // weekend rules must match calendar + Stripe amount calc
    const weekendDays = room === 'pg1' ? new Set([0, 5, 6]) : new Set([5, 6]);
    let nights = 0;
    let total = 0;
    for (let d = new Date(ci); d.getTime() < co.getTime(); d = addDaysUtc(d, 1)) {
      total += weekendDays.has(d.getUTCDay()) ? selected.weekend : selected.weekday;
      nights += 1;
      if (nights > 30) break;
    }
    return { nights, total };
  }, [checkin, checkout, room, selected.weekday, selected.weekend]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (!data.session) {
        window.location.href = `/auth?next=${encodeURIComponent(`/checkout?room=${room}`)}`;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [room]);

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room, checkin, checkout }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (json.url) {
        window.location.href = json.url;
        return;
      }
      alert('決済ページの作成に失敗しました。時間をおいてお試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl">
        <h1 className="font-display text-3xl sm:text-4xl font-light text-textMain tracking-[0.08em]">
          Checkout
        </h1>
        <p className="font-serif text-sm text-textLight mt-3 leading-relaxed">
          ご予約内容をご確認のうえ、決済へお進みください。
        </p>

        <div className="mt-10 bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-xs tracking-[0.2em] uppercase text-gray-500">
                予約内容
              </div>
              <div className="font-display text-xl sm:text-2xl font-light text-textMain tracking-[0.08em] mt-2">
                {selected.label}
              </div>
              <div className="font-serif text-sm text-textLight mt-2">
                {selected.subtitle}
              </div>
              {checkin && checkout ? (
                <div className="font-serif text-sm text-textMain mt-3">
                  日程: {checkin} 〜 {checkout}
                </div>
              ) : (
                <div className="font-serif text-xs text-gray-500 mt-3">
                  ※ 日程が未指定です（部屋詳細ページで選択できます）
                </div>
              )}
              {priceSummary ? (
                <div className="font-serif text-sm text-textMain mt-2">
                  合計（{priceSummary.nights}泊）: {yen(priceSummary.total)}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => window.location.href = selected.backTo}
              className="flex-shrink-0 font-display text-[11px] tracking-[0.2em] uppercase text-textMain border border-gray-200 px-4 py-2 hover:border-gray-400 transition-colors rounded"
            >
              詳細を見る
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                料金（目安）
              </div>
              <div className="font-serif text-sm text-textMain mt-2">
                最低料金：{yen(selected.priceFrom)} / 泊〜
              </div>
              <div className="font-serif text-xs text-gray-500 mt-2 leading-relaxed">
                平日：{yen(selected.weekday)} / 週末：{yen(selected.weekend)}<br />
                週末適用：{selected.weekendRule}
                {selected.extra ? ` / 追加：${selected.extra}` : ''}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                キャンセルポリシー
              </div>
              <div className="font-serif text-xs text-gray-500 mt-2 leading-relaxed">
                5日前まで：無料<br />
                4日前〜当日：宿泊料金の100%<br />
                連絡なし不泊：宿泊料金の100%
              </div>
              <a
                href="/legal"
                className="inline-block mt-3 font-display text-[11px] tracking-[0.2em] uppercase text-textMain underline underline-offset-2 hover:opacity-80"
              >
                表記を確認 →
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading}
              className="w-full sm:w-auto font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded disabled:opacity-60"
            >
              {loading ? '処理中…' : 'この内容で決済へ進む'}
            </button>
            <a
              href={selected.backTo}
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
            >
              戻る
            </a>
          </div>

          <p className="font-serif text-xs text-gray-500 mt-6 leading-relaxed">
            ※ ここでの金額は目安です。日付・人数などによる最終金額の確定は次のステップで実装します。
          </p>
        </div>
      </div>
    </main>
  );
}

