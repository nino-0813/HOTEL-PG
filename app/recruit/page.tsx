'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Banknote, FileText, Phone, Users, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { JsonLd } from '@/components/JsonLd';
import { INSTAGRAM_DM_URL } from '@/constants';
import { getBreadcrumbSchema } from '@/lib/json-ld';
import { useHydrated } from '@/lib/useHydrated';

export default function RecruitPage() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const reveal = hydrated && isInView;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'トップ', url: 'https://www.hotelpg-innosima.com/' },
    { name: '採用情報', url: 'https://www.hotelpg-innosima.com/recruit' },
  ]);

  return (
    <div className="min-h-screen relative">
      <JsonLd data={breadcrumbSchema} />
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-gray-50 to-background py-16 sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block bg-textMain text-white text-xs tracking-widest px-4 py-2 mb-6">
                RECRUIT
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-textMain mb-6 tracking-[0.08em]">
                スタッフ募集
              </h1>
              <p className="font-serif text-base md:text-lg text-textLight leading-relaxed">
                これからできる<br className="sm:hidden" />
                <span className="font-display tracking-wider">HOTEL PG -III-</span>
                <br className="hidden sm:block" />
                の仲間を募集しています
              </p>
            </motion.div>
          </div>
        </div>

        <div ref={ref} className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-12 hover:opacity-70 transition-opacity"
          >
            ← トップへ
          </Link>

          {/* 募集職種 */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-8 tracking-[0.1em] flex items-center gap-3">
              <FileText size={24} className="text-textMain/60" />
              募集職種
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-xl p-6 bg-white hover:border-textMain/30 transition-colors">
                <h3 className="font-display text-xl font-light text-textMain mb-2 tracking-wider">HK（ハウスキーパー）</h3>
                <p className="font-serif text-sm text-textLight">客室の清掃・メイクを担当。丁寧な仕事がお客様の滞在を支えます。</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 bg-white hover:border-textMain/30 transition-colors">
                <h3 className="font-display text-xl font-light text-textMain mb-2 tracking-wider">事務員</h3>
                <p className="font-serif text-sm text-textLight">予約対応・窓口業務など、ホテル運営をサポートします。</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 bg-white hover:border-textMain/30 transition-colors sm:col-span-2 lg:col-span-1">
                <h3 className="font-display text-xl font-light text-textMain mb-2 tracking-wider">朝食スタッフ</h3>
                <p className="font-serif text-sm text-textLight">朝食の提供・配膳を担当。6:30〜10:30の時間帯でお客様の朝のひとときを支えます。</p>
              </div>
            </div>
            <p className="mt-4 font-serif text-sm text-textLight">
              HKのみ・事務のみ・朝食スタッフ・両方など、ご希望に合わせてご相談ください。
            </p>
          </motion.section>

          {/* こんな方歓迎 */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-8 tracking-[0.1em] flex items-center gap-3">
              <Users size={24} className="text-textMain/60" />
              こんな方歓迎
            </h2>
            <ul className="space-y-3 font-serif text-textLight">
              {['未経験OK（研修あり）', '主婦・主夫', '学生', '短時間勤務をご希望の方', '因島・尾道エリア在住の方'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-textMain rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* 勤務条件 */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16 md:mb-24"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-8 tracking-[0.1em]">
              勤務条件
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-4 px-6 font-serif text-sm text-textLight w-32 sm:w-40">勤務地</td>
                    <td className="py-4 px-6 font-serif text-sm text-textMain flex items-center gap-2">
                      <MapPin size={16} className="flex-shrink-0 text-textMain/60" />
                      土生町エリア
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-serif text-sm text-textLight">給与</td>
                    <td className="py-4 px-6 font-serif text-sm text-textMain flex items-center gap-2">
                      <Banknote size={16} className="flex-shrink-0 text-textMain/60" />
                      時給 1,100円〜
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-serif text-sm text-textLight">待遇</td>
                    <td className="py-4 px-6 font-serif text-sm text-textMain">社保完備</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-serif text-sm text-textLight">勤務時間</td>
                    <td className="py-4 px-6 font-serif text-sm text-textMain">
                      <div className="flex items-start gap-2">
                        <Clock size={16} className="flex-shrink-0 mt-0.5 text-textMain/60" />
                        <div>
                          <p>10:30 〜 14:30</p>
                          <p className="mt-2 text-textLight text-xs">朝食スタッフ：6:30 〜 10:30（時給 1,100円 ＋ その他手当500円）</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* 応募方法 */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={reveal ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-200 pt-16"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-8 tracking-[0.1em]">
              応募方法
            </h2>
            <p className="font-serif text-sm text-textLight mb-8">
              InstagramのDM、またはお電話よりお気軽にご連絡ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300"
              >
                Instagram DMへ
                <ArrowRight size={16} />
              </a>
              <a
                href="tel:07083289154"
                className="inline-flex items-center justify-center gap-2 font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-textMain px-8 py-4 hover:bg-textMain hover:text-white transition-colors duration-300"
              >
                <Phone size={16} />
                070-8328-9154
              </a>
            </div>
            <p className="mt-6 font-serif text-xs text-textLight">
              受付時間：9:00 〜 20:00
            </p>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
