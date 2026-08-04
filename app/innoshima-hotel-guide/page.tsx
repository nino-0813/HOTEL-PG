'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useHydrated } from '@/lib/useHydrated';

type Lodging = {
  name: string;
  type: string;
  area: string;
  address: string;
  note: string;
};

const LODGINGS: Lodging[] = [
  { name: 'ホテルいんのしま', type: 'ホテル', area: '土生町', address: '尾道市因島土生町288', note: '天狗山・因島公園内に位置し、しまなみの多島美を望む景色が魅力。宴会場もあり団体利用にも対応。' },
  { name: 'ナティーク城山', type: 'ホテル', area: '土生町', address: '尾道市因島土生町2254-6', note: 'ウェディングにも対応する高級路線。特別な滞在を求める方向け。' },
  { name: '土井旅館', type: '旅館', area: '土生町', address: '尾道市因島土生町1893-3', note: '素泊まり中心のリーズナブルな宿。サイクリストの利用も多い。' },
  { name: '穂満旅館', type: '旅館', area: '土生町', address: '尾道市因島土生町新生区1818-6', note: '港町に佇む木造旅館。岩風呂が特徴。' },
  { name: 'HUB INN', type: 'ゲストハウス', area: '土生町', address: '尾道市因島土生町1896-12', note: '土生商店街にある1日1組限定の宿。' },
  { name: '民宿 布刈', type: '民宿', area: '大浜町', address: '尾道市因島大浜町1964', note: '和室中心、食事プランありでグルメ志向の方にも。' },
  { name: 'THE LANDSCAPE', type: 'コテージ', area: '大浜町', address: '尾道市因島大浜町1739-3', note: '築80年の建物をリノベーションした一棟貸しの宿。' },
  { name: '民宿 満寿美荘', type: '民宿', area: '田熊町', address: '尾道市因島田熊町4479-2', note: 'サイクリスト専用プランや岩風呂が特徴。' },
  { name: 'たくま商店「島の宿」', type: 'ゲストハウス', area: '田熊町', address: '尾道市因島田熊町4703-3', note: '個室ドミトリーから一棟貸し（最大8名）まで対応。' },
  { name: 'いんのしま ペンション白滝山荘', type: 'ペンション', area: '重井町', address: '尾道市因島重井町1233', note: '洋室中心で観光・サイクリング利用に。' },
  { name: '民宿 ふかうら', type: '民宿', area: '重井町', address: '尾道市因島重井町351', note: '宴会場もあり、グループ・団体利用に対応。' },
  { name: '民宿 玉屋', type: '民宿', area: '重井町', address: '尾道市因島重井町2658-8', note: '海に面したロケーションで、季節の料理が味わえる。' },
  { name: 'GUEST HOUSE THE HOME', type: 'コテージ', area: '三庄町', address: '尾道市因島三庄町692-4', note: '一棟貸しタイプで、グループ・ファミリー利用に対応。' },
  { name: 'しまなみの宿 いろり', type: 'ゲストハウス', area: '中庄町', address: '尾道市因島中庄町西浦2341', note: '静かな立地で、予算を抑えたい方向けのリーズナブルな宿。' },
];

const HOTEL_PG_AREA = '土生町';
const HOTEL_PG_ADDRESS = '尾道市因島土生町1896-8（HOTEL PG -Ⅱ-）ほか、土生町内に3棟';

const AREA_ORDER = ['土生町', '大浜町', '田熊町', '重井町', '三庄町', '中庄町'];

const CATEGORY_ORDER = ['ホテル', '旅館', '民宿', 'ゲストハウス・ペンション・コテージ'];
const CATEGORY_LEAD: Record<string, string> = {
  'ホテル': 'フロント対応や設備が比較的整っている、ビジネス・観光どちらにも使いやすいタイプです。',
  '旅館': '地域に根ざした宿で、素泊まりから食事付きまでプランの幅があります。',
  '民宿': '家庭的なもてなしと食事が魅力。目的に特化した宿も多いタイプです。',
  'ゲストハウス・ペンション・コテージ': '一棟貸しや1日1組限定など、少人数やグループでの滞在に向いたタイプです。',
};
const TYPE_TO_CATEGORY: Record<string, string> = {
  'ホテル': 'ホテル',
  '旅館': '旅館',
  '民宿': '民宿',
  'ゲストハウス': 'ゲストハウス・ペンション・コテージ',
  'ペンション': 'ゲストハウス・ペンション・コテージ',
  'コテージ': 'ゲストハウス・ペンション・コテージ',
};

const PURPOSE_GUIDE = [
  { purpose: '観光でしっかり休みたい', suggestion: 'ホテル（HOTEL PG／ホテルいんのしま　など）' },
  { purpose: 'サイクリングの拠点にしたい', suggestion: 'HOTEL PG（自転車預かり対応）／民宿 満寿美荘／ゲストハウス各所' },
  { purpose: 'グループ・宴会を楽しみたい', suggestion: 'ホテルいんのしま／民宿 ふかうら' },
  { purpose: '一人旅・カップルで静かに過ごしたい', suggestion: 'HOTEL PG／HUB INN' },
];

const ROOM_LINKS = [
  { href: '/rooms/pg1', label: 'HOTEL PG -Ⅰ-（ロフト付き洋室・素泊まり）' },
  { href: '/rooms/pg2-single', label: 'HOTEL PG -Ⅱ- シングルタイプ' },
  { href: '/rooms/pg2-family', label: 'HOTEL PG -Ⅱ- ファミリータイプ' },
  { href: '/rooms/pg3', label: 'HOTEL PG-III 3名タイプ' },
  { href: '/rooms/pg3-four', label: 'HOTEL PG-III 4名タイプ' },
  { href: '/rooms/pg3-maisonette', label: 'HOTEL PG-III メゾネット洋室' },
];

function mapLink(name: string, address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
}

export default function InnoshimaHotelGuidePage() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const reveal = hydrated && isInView;

  const areaGroups = AREA_ORDER.map((area) => ({
    area,
    items: LODGINGS.filter((l) => l.area === area),
  })).filter((g) => g.items.length > 0);

  const categoryGroups = CATEGORY_ORDER.map((category) => ({
    category,
    items: LODGINGS.filter((l) => TYPE_TO_CATEGORY[l.type] === category),
  }));

  return (
    <div className="min-h-screen relative bg-white">
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32 bg-white">
        <div className="relative bg-white py-16 sm:py-24 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block bg-textMain text-white text-xs tracking-widest px-4 py-2 mb-6">
                INNOSHIMA HOTEL GUIDE
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-6 tracking-[0.08em]">
                因島のホテル・宿泊施設まとめ
              </h1>
              <p className="font-serif text-base md:text-lg text-textLight leading-relaxed">
                因島にはホテル・旅館・民宿・ゲストハウスなど、さまざまなタイプの宿泊施設があります。
                このページではエリアとタイプ別に比較できるようまとめました。
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl mb-14 md:mb-20">
          <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden border border-gray-200">
            <Image
              src="/images/hero/innnoshima1-1280.webp"
              alt="瀬戸内海に浮かぶ因島の風景"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        </div>

        <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-12 hover:opacity-70 transition-opacity"
          >
            ← トップへ
          </Link>

          <div className="space-y-14 md:space-y-20 font-serif text-textLight">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-sm sm:text-base leading-relaxed">
                しまなみ海道のほぼ中央に位置する因島。観光やサイクリングの拠点として人気の島ですが、
                「どんな宿泊施設があるのか分からない」という声もよく聞きます。因島の宿泊施設は、
                フロント対応のあるホテルから、素泊まり中心の旅館・民宿、少人数向けのゲストハウスまでタイプはさまざまです。
                まずはどのエリアに何があるのか、地図で見てみましょう。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                因島 宿泊施設マップ
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                因島は土生町・重井町・田熊町・三庄町・大浜町など、いくつかの地区に分かれています。
                エリアごとにどんな宿泊施設があるか、下記にまとめました。各施設の位置はリンク先のGoogleマップでご確認いただけます。
              </p>

              <div className="rounded-xl overflow-hidden border border-gray-200 mb-3 h-[320px] sm:h-[420px]">
                <iframe
                  title="因島の宿泊施設マップ"
                  src="https://www.google.com/maps?q=%E3%83%9B%E3%83%86%E3%83%AB&ll=34.3172242,133.1724846&z=13&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <a
                href="https://www.google.com/maps/search/%E3%83%9B%E3%83%86%E3%83%AB/@34.3172242,133.1724846,13z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 mb-8 hover:border-textMain transition-colors"
              >
                <span className="text-sm sm:text-base text-textMain font-medium">Googleマップアプリで開く</span>
                <span className="text-xs tracking-widest uppercase text-textMain/70 whitespace-nowrap">開く →</span>
              </a>

              <div className="space-y-6">
                <div className="border border-textMain rounded-xl p-5 sm:p-6 bg-white">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-xs tracking-widest text-textMain/60">FEATURED</span>
                    <span className="text-textMain font-medium text-sm sm:text-base">HOTEL PG</span>
                    <span className="text-xs text-textLight/70 border border-gray-200 rounded-full px-2 py-0.5">
                      {HOTEL_PG_AREA}
                    </span>
                  </div>
                  <p className="text-xs text-textLight/70 mt-1">{HOTEL_PG_ADDRESS}</p>
                  <a
                    href={mapLink('HOTEL PG', '尾道市因島土生町1896-8')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-xs underline underline-offset-2 mt-2 hover:text-textMain"
                  >
                    Googleマップで見る →
                  </a>
                </div>

                {areaGroups.map((group) => (
                  <div key={group.area}>
                    <h3 className="font-display text-sm tracking-[0.15em] uppercase text-textMain/70 mb-2">
                      {group.area}
                    </h3>
                    <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
                      {group.items.map((item) => (
                        <div key={item.name} className="p-4 sm:p-5">
                          <div className="flex items-baseline gap-3 flex-wrap">
                            <span className="text-textMain font-medium text-sm">{item.name}</span>
                            <span className="text-xs text-textLight/70 border border-gray-200 rounded-full px-2 py-0.5">
                              {item.type}
                            </span>
                          </div>
                          <p className="text-xs text-textLight/70 mt-1">{item.address}</p>
                          <a
                            href={mapLink(item.name, item.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs underline underline-offset-2 mt-1 hover:text-textMain"
                          >
                            Googleマップで見る →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {categoryGroups.map((group, groupIndex) => (
              <motion.section
                key={group.category}
                initial={{ opacity: 0, y: 24 }}
                animate={reveal ? { opacity: 1, y: 0 } : false}
                transition={{ duration: 0.6, delay: 0.2 + groupIndex * 0.05 }}
              >
                <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                  {group.category}
                </h2>
                <p className="text-sm leading-relaxed mb-6">{CATEGORY_LEAD[group.category]}</p>

                {group.category === 'ホテル' && (
                  <div className="border border-textMain rounded-xl p-6 sm:p-8 bg-white space-y-4 mb-4">
                    <div className="text-xs tracking-widest text-textMain/60">FEATURED</div>
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                      <Image
                        src="/images/gallery/hotel-pg-ii-exterior.webp"
                        alt="HOTEL PG-II 外観"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 700px"
                      />
                    </div>
                    <div className="text-textMain font-medium text-base">HOTEL PG（因島 土生町）</div>
                    <p className="text-sm leading-relaxed">
                      フロントを設けないセルフチェックイン方式の、素泊まり型の隠れ家ホテル。
                      サイクリストの自転車預かりにも対応し、一人旅やカップルで静かに過ごしたい方に向いています。
                      3棟・6タイプの客室があり、人数や滞在スタイルに合わせて選べます。
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {ROOM_LINKS.map((room) => (
                        <Link
                          key={room.href}
                          href={room.href}
                          className="text-xs border border-gray-300 rounded-full px-3 py-1.5 hover:border-textMain hover:text-textMain transition-colors"
                        >
                          {room.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
                  {group.items.map((item) => (
                    <div key={item.name} className="p-5 sm:p-6">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <span className="text-textMain font-medium text-sm sm:text-base">{item.name}</span>
                        <span className="text-xs text-textLight/70 border border-gray-200 rounded-full px-2 py-0.5">
                          {item.area}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mt-1.5">{item.note}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                目的別の選び方
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                同じ因島の宿泊施設でも、旅の目的によって合う宿は変わります。ざっくりとした目安です。
              </p>
              <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
                {PURPOSE_GUIDE.map((row) => (
                  <div key={row.purpose} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="text-textMain font-medium text-sm sm:w-64 flex-shrink-0">{row.purpose}</span>
                    <span className="text-sm leading-relaxed">{row.suggestion}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-textLight/70 leading-relaxed mt-4">
                ※ 掲載している他施設の情報は、因島観光協会等の公開情報をもとにした概要です。最新の空室状況・料金・営業状況は各施設の公式情報をご確認ください。
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border border-textMain rounded-xl p-6 sm:p-10 bg-white text-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                HOTEL PGについて
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-xl mx-auto">
                因島の落ち着いた一角にあり、しまなみ海道をつなぐ旅の拠点にしやすい立地です。
                セルフチェックインで自分のペースで滞在でき、サイクリストへの自転車預かりなど現場寄りのサポートもあります。
                観光はしっかり楽しみたいが、夜は静かに過ごしたい方におすすめです。
              </p>
              <Link
                href="/reserve"
                className="inline-block font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
              >
                空室確認・ご予約はこちら →
              </Link>
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
