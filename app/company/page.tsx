'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CompanyPage() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <div className="min-h-screen relative">
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32">
        <div className="relative bg-gradient-to-b from-gray-50 to-background py-16 sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block bg-textMain text-white text-xs tracking-widest px-4 py-2 mb-6">
                FACILITIES
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-6 tracking-[0.08em]">
                施設情報
              </h1>
              <p className="font-serif text-base md:text-lg text-textLight leading-relaxed">
                各施設の基本情報をご案内します。
              </p>
            </motion.div>
          </div>
        </div>

        <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-12 hover:opacity-70 transition-opacity"
          >
            ← トップへ
          </Link>

          <div className="space-y-12 md:space-y-16 font-serif text-textLight">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
                <MapPin size={22} className="text-textMain/60 flex-shrink-0" />
                施設情報
              </h2>
              <div className="border border-gray-200 rounded-xl p-6 sm:p-8 bg-white space-y-5 text-sm leading-relaxed">
                <div className="space-y-2">
                  <div className="text-textMain font-medium">HOTEL PG -Ⅰ-</div>
                  <div>住所: 尾道市因島土生町1896-17</div>
                  <div>旅館業法に基づく営業許可番号: 尾市環指令第301号</div>
                  <div>電話: 070-8328-9154</div>
                  <div>チェックイン: 15:00〜18:00 / チェックアウト: 10:00</div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="space-y-2">
                  <div className="text-textMain font-medium">HOTEL PG -Ⅱ-</div>
                  <div>住所: 尾道市因島土生町1896-8</div>
                  <div>旅館業法に基づく営業許可番号: 尾市環指令第753号</div>
                  <div>電話: 070-8328-9154</div>
                  <div>チェックイン: 15:00〜18:00 / チェックアウト: 10:00</div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="space-y-2">
                  <div className="text-textMain font-medium">HOTEL PG -Ⅲ-（準備中）</div>
                  <div>住所: 広島県尾道市因島土生町1747-5</div>
                  <div>電話: 070-8328-9154</div>
                  <div>チェックイン: 【要確認】 / チェックアウト: 10:00</div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </main>
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}

