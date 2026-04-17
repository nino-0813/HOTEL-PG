'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen relative">
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h1 className="font-display text-3xl text-textMain mb-6">問題が発生しました</h1>
          <p className="text-gray-500 mb-8">申し訳ございません。エラーが発生しました。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-textMain text-white rounded-lg hover:bg-gray-700 transition-colors font-display text-sm tracking-wider"
            >
              再試行
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center font-display text-sm tracking-[0.2em] uppercase text-textMain border-b border-textMain pb-1 hover:opacity-70 transition-opacity"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
