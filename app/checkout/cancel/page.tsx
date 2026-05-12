'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutCancel() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') ?? 'pg1';
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-light text-textMain tracking-[0.08em]">
          決済がキャンセルされました
        </h1>
        <p className="font-serif text-sm text-textLight mt-4 leading-relaxed">
          再度日程を選択してください。
        </p>
        <p className="font-serif text-xs text-gray-500 mt-2">部屋: {room}</p>

        <div className="mt-10 flex gap-3">
          <a
            href="/#reservation"
            className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
          >
            予約ページへ戻る
          </a>
          <a
            href="/#reservation"
            className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
          >
            トップへ戻る
          </a>
        </div>
      </div>
    </main>
  );
}

