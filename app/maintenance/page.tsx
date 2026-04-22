'use client';

import React from 'react';
import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-background flex items-center">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl py-20">
        <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 sm:p-12 shadow-sm">
          <p className="font-display text-[11px] tracking-[0.25em] uppercase text-gray-500">
            RENEWAL IN PROGRESS
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain tracking-[0.08em] mt-4">
            ただいまサイトをリニューアルしています
          </h1>
          <p className="font-serif text-sm sm:text-base text-textLight leading-relaxed mt-6">
            HOTEL PG のウェブサイトにお越しいただきありがとうございます。
            現在、より快適にご利用いただけるよう、内容の更新・改善作業を行っています。
            ご不便をおかけしますが、公開まで今しばらくお待ちください。
          </p>
          <p className="font-serif text-sm sm:text-base text-textLight leading-relaxed mt-4">
            お急ぎのご用件は、以下よりお問い合わせください。
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="tel:07083289154"
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
            >
              お電話：070-8328-9154
            </a>
            <a
              href="mailto:hotelpg.info@gmail.com"
              className="w-full sm:w-auto text-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
            >
              メールで問い合わせ
            </a>
          </div>

          <div className="mt-10">
            <Link
              href="/legal"
              className="inline-flex items-center gap-2 font-display text-[11px] tracking-[0.22em] uppercase text-gray-500 hover:text-textMain transition-colors"
            >
              特定商取引法に基づく表記 →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

