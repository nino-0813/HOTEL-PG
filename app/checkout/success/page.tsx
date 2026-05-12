'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') ?? '-';
  const sessionId = searchParams.get('session_id') ?? '-';

  const roomLabel = useMemo(() => {
    if (room === 'pg1') return 'HOTEL PG -I-';
    if (room === 'pg2_single') return 'HOTEL PG -II-（シングル）';
    if (room === 'pg2_family') return 'HOTEL PG -II-（ファミリー）';
    if (room === 'pg3_three') return 'HOTEL PG-III 3名タイプ';
    if (room === 'pg3_four') return 'HOTEL PG-III 4名タイプ';
    if (room === 'pg3_maisonette') return 'HOTEL PG-III メゾネット洋室';
    if (room === 'pg3') return 'HOTEL PG-III 3名タイプ';
    return room;
  }, [room]);

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-2xl">
        <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-white">
              <Image
                src="/apple-touch-icon.png"
                alt="HOTEL PG"
                fill
                sizes="48px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
                HOTEL PG - INNOSHIMA
              </p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.08em] mt-1">
                ご予約ありがとうございます。決済が完了しました。
              </h1>
            </div>
          </div>

          <p className="font-serif text-sm sm:text-base text-textLight mt-6 leading-relaxed">
            ご予約内容はメールをご確認ください。空室・料金の反映には数分かかる場合があります。
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                予約内容
              </div>
              <div className="font-serif text-sm text-textMain mt-2">
                部屋タイプ: {roomLabel}
              </div>
              <div className="font-serif text-xs text-gray-500 mt-1">※ 予約の保存はSaaS側で行われます。</div>
            </div>
            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <div className="font-display text-[11px] tracking-[0.2em] uppercase text-gray-500">
                お問い合わせ
              </div>
              <div className="font-serif text-sm text-textMain mt-2">
                <a className="underline underline-offset-2 hover:opacity-80" href="tel:07083289154">
                  070-8328-9154
                </a>
              </div>
              <div className="font-serif text-xs text-gray-500 mt-1">
                受付時間: 9:00 - 20:00
              </div>
            </div>
          </div>

          <details className="mt-6">
            <summary className="cursor-pointer font-display text-[11px] tracking-[0.22em] uppercase text-gray-500 hover:text-textMain transition-colors">
              決済情報（控え）
            </summary>
            <p className="font-serif text-xs text-gray-500 mt-2 break-all">
              session_id: {sessionId}
            </p>
          </details>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="/#reservation"
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
            >
              トップへ戻る
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

