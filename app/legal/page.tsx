'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalPage() {
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
                LEGAL
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-6 tracking-[0.08em]">
                特定商取引法に基づく表記
              </h1>
              <p className="font-serif text-base md:text-lg text-textLight leading-relaxed">
                当サイトでの予約・決済に関する表記です。
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

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-textLight"
          >
            <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-6 tracking-[0.08em] flex items-center gap-3">
              <FileText size={22} className="text-textMain/60 flex-shrink-0" />
              表記
            </h2>

            <div className="border border-gray-200 rounded-xl p-6 sm:p-8 bg-white space-y-4 text-sm leading-relaxed">
              <div>
                <div className="text-textMain font-medium">事業者名</div>
                <div>合同会社ルノア</div>
              </div>
              <div>
                <div className="text-textMain font-medium">運営統括責任者</div>
                <div>政木 洋絵</div>
              </div>
              <div>
                <div className="text-textMain font-medium">所在地</div>
                <div>〒720-0807 広島県福山市明治町13-5</div>
              </div>
              <div>
                <div className="text-textMain font-medium">施設所在地</div>
                <div>〒722-2323 広島県尾道市因島土生町1896-17（PG-Ⅰ） / 1896-8（PG-Ⅱ）</div>
              </div>
              <div>
                <div className="text-textMain font-medium">電話番号</div>
                <div>070-8328-9154（施設） / 084-928-8855（本社）</div>
              </div>
              <div>
                <div className="text-textMain font-medium">メールアドレス</div>
                <div>hotelpg.info@gmail.com</div>
              </div>
              <div>
                <div className="text-textMain font-medium">URL</div>
                <div>https://www.hotelpg-innosima.com/</div>
              </div>
              <div>
                <div className="text-textMain font-medium">販売価格</div>
                <div>各宿泊プランページに表示（税込）</div>
              </div>
              <div>
                <div className="text-textMain font-medium">追加料金</div>
                <div>宿泊料金以外に発生する費用はありません（追加人数料金がある場合は予約時に表示）</div>
              </div>
              <div>
                <div className="text-textMain font-medium">支払方法</div>
                <div>クレジットカード決済（Stripe）</div>
                <div className="text-xs text-gray-500 mt-1">
                  対応ブランド：Visa / Mastercard / American Express / JCB / Diners Club / Discover
                </div>
              </div>
              <div>
                <div className="text-textMain font-medium">支払時期</div>
                <div>オンライン予約：予約確定時 / 現地払い：チェックイン時</div>
              </div>
              <div>
                <div className="text-textMain font-medium">サービス提供時期</div>
                <div>予約された宿泊日</div>
              </div>
              <div>
                <div className="text-textMain font-medium">キャンセルポリシー</div>
                <div>5日前まで：無料 / 4日前〜当日：宿泊料金の100% / 連絡なし不泊：宿泊料金の100%</div>
              </div>
              <div>
                <div className="text-textMain font-medium">返金について</div>
                <div>キャンセルポリシーに基づき返金。返金方法は予約経路に準ずる</div>
              </div>
              <div>
                <div className="text-textMain font-medium">旅館業法に基づく営業許可番号</div>
                <div>
                  <div>HOTEL PG - I -：尾市環指令第301号</div>
                  <div>HOTEL PG - II -：尾市環指令第753号</div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}

