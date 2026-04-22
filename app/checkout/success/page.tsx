'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') ?? '-';
  const sessionId = searchParams.get('session_id') ?? '-';
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-2xl">
        <h1 className="font-display text-3xl sm:text-4xl font-light text-textMain tracking-[0.08em]">
          Payment success
        </h1>
        <p className="font-serif text-sm text-textLight mt-4 leading-relaxed">
          決済が完了しました。ご利用ありがとうございます。
        </p>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <div className="font-serif text-sm text-textMain">
            部屋: {room}
          </div>
          <div className="font-serif text-xs text-gray-500 mt-2 break-all">
            session_id: {sessionId}
          </div>
        </div>

        <div className="mt-10">
          <a
            href="/#reservation"
            className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
          >
            トップへ戻る
          </a>
        </div>
      </div>
    </main>
  );
}

