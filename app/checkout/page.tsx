'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type RoomKey = 'pg1' | 'pg2_single' | 'pg2_family';

const ROOMS: { key: RoomKey; label: string; priceHint: string }[] = [
  { key: 'pg1', label: 'HOTEL PG -I-', priceHint: '¥8,000 / 泊〜' },
  { key: 'pg2_single', label: 'HOTEL PG -II-（シングル）', priceHint: '¥8,000 / 泊〜' },
  { key: 'pg2_family', label: 'HOTEL PG -II-（ファミリー）', priceHint: '¥14,000 / 泊〜' },
];

export default function CheckoutPage({
}: {}) {
  const searchParams = useSearchParams();
  const initialRoom = useMemo(() => {
    const r = searchParams.get('room');
    return (r === 'pg1' || r === 'pg2_single' || r === 'pg2_family') ? r : 'pg1';
  }, [searchParams]);

  const [room, setRoom] = useState<RoomKey>(initialRoom);
  const [loading, setLoading] = useState(false);
  const selected = ROOMS.find((r) => r.key === room)!;

  const startCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room }),
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
          まずは決済までの導線を最短で用意しています。日付・人数・最終金額の確定は次のステップで対応します。
        </p>

        <div className="mt-10 bg-white/90 backdrop-blur border border-gray-200 shadow-sm rounded-xl p-6 sm:p-8">
          <label className="block font-display text-xs tracking-[0.2em] uppercase text-gray-500">
            部屋タイプ
          </label>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROOMS.map((r) => {
              const active = r.key === room;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRoom(r.key)}
                  className={[
                    'text-left rounded-lg border px-4 py-4 transition-all',
                    active ? 'border-textMain shadow-sm' : 'border-gray-200 hover:border-gray-400',
                  ].join(' ')}
                >
                  <div className="font-display text-sm tracking-[0.12em] text-textMain">
                    {r.label}
                  </div>
                  <div className="font-serif text-xs text-textLight mt-1">
                    {r.priceHint}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={startCheckout}
              disabled={loading}
              className="w-full sm:w-auto font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded disabled:opacity-60"
            >
              {loading ? '処理中…' : `決済へ進む（${selected.label}）`}
            </button>
            <a
              href="/#reservation"
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
            >
              戻る
            </a>
          </div>

          <p className="font-serif text-xs text-gray-500 mt-6 leading-relaxed">
            ※ ここでの金額は目安です。実際の料金（週末・追加人数など）に合わせた自動計算は次のステップで実装します。
          </p>
        </div>
      </div>
    </main>
  );
}

