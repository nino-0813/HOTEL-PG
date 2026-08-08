'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useHydrated } from '@/lib/useHydrated';

/** 大会公式サイト（cycling-shimanami.jp）で確認できた情報をもとに構成しています。 */
const OFFICIAL_URL = 'https://cycling-shimanami.jp/';

type Course = {
  code: string;
  name: string;
  distance: string;
  route: string;
  start: string;
  startTime: string;
  level: string;
  /** 向島（尾道側）が絡むコースかどうか */
  onomichiSide: boolean;
};

const COURSES: Course[] = [
  { code: 'A', name: 'IMABARI 70', distance: '約70km', route: '尾道（向島）→ 今治', start: '向島', startTime: '7:37〜', level: '中級者向け', onomichiSide: true },
  { code: 'B', name: 'INNOSHIMA 70', distance: '約70km', route: '尾道（向島）↔ 上島（岩城島）往復', start: '向島', startTime: '8:02〜', level: '中級者向け', onomichiSide: true },
  { code: 'C', name: 'AROUND OMISHIMA 100', distance: '約100km', route: '今治 ↔ 大三島 周遊往復', start: '今治', startTime: '8:15〜', level: '上級者向け', onomichiSide: false },
  { code: 'D', name: 'COMPLETE SHIMANAMI 140', distance: '約140km', route: '今治 ↔ 尾道（向島）往復', start: '今治', startTime: '8:35〜', level: '上級者向け', onomichiSide: true },
  { code: 'E', name: 'ONOMICHI 65', distance: '約65km', route: '今治 → 尾道（向島）', start: '今治', startTime: '8:43〜', level: '中級者向け', onomichiSide: true },
  { code: 'F', name: 'OMISHIMA 70', distance: '約70km', route: '今治 ↔ 大三島 折返往復', start: '今治', startTime: '8:59〜', level: '中級者向け', onomichiSide: false },
  { code: 'G', name: 'YUMESHIMA 75', distance: '約75km', route: '今治 → 上島（弓削島）', start: '今治', startTime: '9:19〜', level: '中級者向け', onomichiSide: false },
  { code: 'H', name: 'OSHIMA 30', distance: '約30km', route: '今治 ↔ 大島 往復', start: '今治', startTime: '9:57〜', level: '初心者向け', onomichiSide: false },
];

const TOC = [
  { id: 'basics', label: '① 大会の基本情報（日程・受付）' },
  { id: 'courses', label: '② コース一覧と向島スタートの見分け方' },
  { id: 'plans', label: '③ コース別・宿泊プランの組み立て方' },
  { id: 'timeline', label: '④ 大会当日の流れ' },
  { id: 'pitfalls', label: '⑤ 意外と知られていない5つのこと' },
  { id: 'howto-choose', label: '⑥ 宿選びで失敗しないチェックリスト' },
  { id: 'hotel-pg', label: '⑦ HOTEL PG（因島）の場合' },
  { id: 'next-day', label: '⑧ 翌日は因島をゆっくり' },
];

const CHECKLIST = [
  {
    q: '朝早く出発できるか',
    a: '向島スタートのA・Bコースは7:37〜8:02スタート。集合・整列を考えると、宿は「早朝に出られること」が最優先条件になります。フロント対応の時間に縛られないセルフチェックイン方式の宿は、この点で有利です。',
  },
  {
    q: '自転車を安全に置けるか',
    a: '輪行袋のまま部屋に持ち込めるか、屋内・敷地内で保管できるか。前日受付から当日朝まで、愛車を安心して置ける場所があるかは必ず確認を。',
  },
  {
    q: '駐車場があるか',
    a: '車＋自転車で来る方は宿の駐車場が無料か、何台まで停められるか。大会会場の駐車場は事前申込制なので、宿の駐車場を拠点にする場合は往復の動線も考えておきます。',
  },
  {
    q: 'ゴール後にどう戻るか決まっているか',
    a: '片道コース（A・E・G）は、ゴール地点とスタート地点が違います。輸送サービスを申し込めているか、申し込めていないなら翌日移動にするのか。ここが決まっていないと宿の場所も決められません。',
  },
  {
    q: '当日の食事をどうするか',
    a: '大会前夜は早く休みたい、当日ゴール後は動きたくない——という方が多いです。近くに食事処やコンビニがあるか、宿の周辺で完結できるかを見ておくと当日がラクになります。',
  },
];

const TIMELINE = [
  { time: '10/24(土)', title: '参加者受付（必須）', body: 'エントリー時に選んだ会場（尾道・今治・松山のいずれか）で受付。この日のうちに済ませておかないと当日走れません。受付後にそのまま宿へ入る流れが基本です。' },
  { time: '前日夜', title: '準備・早めの就寝', body: 'ゼッケン・計測チップの取り付け、補給食の準備、翌朝の服装確認。スタートが早いコースほど、この夜の過ごし方が当日を左右します。' },
  { time: '10/25(日) 早朝', title: '起床・朝食・移動', body: 'スタート会場までの移動時間を逆算。宿から会場が離れている場合は、この時間の見積もりが最重要です。' },
  { time: '会場到着後', title: '荷物預け・整列', body: '手荷物預かりは事前申込・有料。スタート会場で預けて、フィニッシュ会場で受け取る仕組みです。預けられるのは指定サイズの袋に入るぶんだけ。' },
  { time: 'スタート', title: 'コース別に時差スタート', body: 'コースごとにスタート時刻が異なります（7:37〜9:57）。自分のコースの時刻を必ず確認しておきましょう。' },
  { time: 'フィニッシュ', title: 'ゴール・荷物受け取り', body: '片道コースは、ここから「どう戻るか」が始まります。輸送サービスの有無で当日の終わり方が大きく変わります。' },
];

export default function CyclingShimanami2026StayPage() {
  const ref = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const reveal = hydrated && isInView;

  return (
    <div className="min-h-screen relative bg-white">
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32 bg-white">
        {/* Hero */}
        <div className="relative bg-white py-14 sm:py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block bg-textMain text-white text-xs tracking-widest px-4 py-2 mb-6">
                CYCLING SHIMANAMI 2026
              </span>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-textMain mb-6 tracking-[0.06em] leading-snug">
                サイクリングしまなみ2026
                <br />
                宿泊・前泊・後泊ガイド
              </h1>
              <p className="font-serif text-base md:text-lg text-textLight leading-relaxed">
                2026年10月25日(日)開催。前日受付から当日の流れ、コース別の宿の取り方まで、
                「初参加でも当日あわてない」ための情報をまとめました。
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl mb-12 md:mb-16">
          <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-xl overflow-hidden border border-gray-200">
            <Image
              src="/blog/blog-bridge-view.webp"
              alt="高見山から望むしまなみ海道・因島大橋"
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
            className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-textMain mb-10 hover:opacity-70 transition-opacity"
          >
            ← トップへ
          </Link>

          <div className="space-y-14 md:space-y-20 font-serif text-textLight">
            {/* この記事で分かること */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="border border-gray-200 rounded-xl bg-white p-6 sm:p-8">
                <h2 className="font-display text-lg sm:text-xl font-light text-textMain mb-4 tracking-[0.08em]">
                  この記事で分かること
                </h2>
                <ul className="space-y-2 text-sm leading-relaxed">
                  {TOC.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="hover:text-textMain transition-colors underline-offset-4 hover:underline">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.section>

            {/* ① 基本情報 */}
            <motion.section
              id="basics"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-4 tracking-[0.08em]">
                ① 大会の基本情報（日程・受付）
              </h2>
              <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100 text-sm">
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-textMain font-medium sm:w-40 flex-shrink-0">大会当日</span>
                  <span className="leading-relaxed">2026年10月25日(日)</span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-textMain font-medium sm:w-40 flex-shrink-0">前日</span>
                  <span className="leading-relaxed">2026年10月24日(土)　参加者受付・イベント</span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-textMain font-medium sm:w-40 flex-shrink-0">参加者受付</span>
                  <span className="leading-relaxed">
                    <strong className="text-textMain">大会前日に受付が必須</strong>です。会場は尾道・今治・松山の3か所で、
                    <strong className="text-textMain">エントリー時に選択した会場でのみ</strong>受付できます。
                    ここを見落とすと当日走れないので、まず自分がどの会場を選んだかを確認してください。
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-textMain font-medium sm:w-40 flex-shrink-0">スタート会場</span>
                  <span className="leading-relaxed">今治新都市第1地区／来島海峡SA／向島運動公園</span>
                </div>
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-1 sm:gap-4">
                  <span className="text-textMain font-medium sm:w-40 flex-shrink-0">フィニッシュ会場</span>
                  <span className="leading-relaxed">広小路・今治港／向島運動公園／弓削港</span>
                </div>
              </div>
              <a
                href={OFFICIAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 hover:border-textMain transition-colors group"
              >
                <span>
                  <span className="block text-xs tracking-widest text-textMain/60 mb-1">OFFICIAL</span>
                  <span className="block text-sm sm:text-base text-textMain font-medium">
                    サイクリングしまなみ2026 公式サイト
                  </span>
                  <span className="block text-xs text-textLight/70 mt-1">
                    エントリー状況・当日の最新案内はこちら（cycling-shimanami.jp）
                  </span>
                </span>
                <span className="text-xs tracking-widest uppercase text-textMain/70 whitespace-nowrap group-hover:text-textMain transition-colors">
                  開く →
                </span>
              </a>

              <p className="text-xs text-textLight/70 leading-relaxed mt-4">
                ※ 本ページは大会公式サイトの公開情報をもとに整理した参考情報です。最新・正確な内容は必ず公式サイトおよび参加者向けの案内をご確認ください。
              </p>
            </motion.section>

            {/* ② コース一覧 */}
            <motion.section
              id="courses"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ② コース一覧と「向島スタート」の見分け方
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                全8コース。宿を決めるうえで一番大事なのは
                <strong className="text-textMain">「自分はどこからスタートして、どこにゴールするのか」</strong>
                です。尾道側（向島）が絡むのはA・B・D・Eの4コースで、
                <strong className="text-textMain">向島スタートはAとBの2つだけ</strong>。Eは向島“ゴール”です。
              </p>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm min-w-[640px]">
                  <thead>
                    <tr className="bg-gray-50 text-textMain">
                      <th className="text-left font-medium px-4 py-3 whitespace-nowrap">コース</th>
                      <th className="text-left font-medium px-4 py-3 whitespace-nowrap">距離</th>
                      <th className="text-left font-medium px-4 py-3 whitespace-nowrap">ルート</th>
                      <th className="text-left font-medium px-4 py-3 whitespace-nowrap">スタート</th>
                      <th className="text-left font-medium px-4 py-3 whitespace-nowrap">目安レベル</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {COURSES.map((c) => (
                      <tr key={c.code} className={c.onomichiSide ? 'bg-white' : 'bg-white/60'}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-textMain font-medium">{c.code}</span>
                          <span className="block text-xs text-textLight/70">{c.name}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{c.distance}</td>
                        <td className="px-4 py-3">{c.route}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {c.start}
                          <span className="block text-xs text-textLight/70">{c.startTime}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">{c.level}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-textLight/70 leading-relaxed mt-3">
                ※ スタート時刻はコースごとの時差スタートの目安です。詳細は公式の案内をご確認ください。
              </p>
            </motion.section>

            {/* ③ コース別プラン */}
            <motion.section
              id="plans"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ③ コース別・宿泊プランの組み立て方
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                「前泊すべきか」「後泊すべきか」は、コースの片道／往復で答えが変わります。
                自分のコースのところだけ読んでいただければ大丈夫です。
              </p>

              <div className="space-y-5">
                <div className="border border-gray-200 rounded-xl bg-white p-5 sm:p-6">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <span className="text-textMain font-medium">Aコース｜IMABARI 70</span>
                    <span className="text-xs border border-gray-200 rounded-full px-2 py-0.5">向島スタート → 今治ゴール</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3">
                    片道コースの代表格。<strong className="text-textMain">7:37〜スタートと全コースで最も早い</strong>ため、
                    前泊はほぼ必須と考えてよいでしょう。悩みどころは「ゴールした今治から、どうやって戻るか」。
                  </p>
                  <ul className="text-sm leading-relaxed space-y-1.5 list-disc pl-5">
                    <li>輸送サービス（今治↔尾道のシャトルバス）を申し込めている方 → 尾道側に戻ってから宿へ</li>
                    <li>申し込めていない方 → <strong className="text-textMain">今治側に後泊するか、自走で戻る前提で計画を</strong>。ここは早めに決めておかないと当日困ります</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-xl bg-white p-5 sm:p-6">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <span className="text-textMain font-medium">Bコース｜INNOSHIMA 70</span>
                    <span className="text-xs border border-gray-200 rounded-full px-2 py-0.5">向島スタート → 向島ゴール</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    向島を出て岩城島まで行って戻ってくる往復コース。
                    <strong className="text-textMain">スタートとゴールが同じなので、帰りの足を考えなくてよいのが最大の利点</strong>です。
                    コース名のとおり因島を通過するルートで、走り慣れた道を高速道路側から眺められるのがこのコースの面白さ。
                    宿は尾道側（向島・因島エリア）に取っておくと、前後どちらも動きやすくなります。
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl bg-white p-5 sm:p-6">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <span className="text-textMain font-medium">Eコース｜ONOMICHI 65</span>
                    <span className="text-xs border border-gray-200 rounded-full px-2 py-0.5">今治スタート → 向島ゴール</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    今治を出て尾道側にゴールする片道コース。
                    <strong className="text-textMain">ゴール後に尾道側で後泊するのが最も自然な流れ</strong>です。
                    65kmを走り切ったあとに長距離移動をせず、そのまま尾道・島側で一泊して翌日ゆっくり帰る、という組み立てができます。
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl bg-white p-5 sm:p-6">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <span className="text-textMain font-medium">Dコース｜COMPLETE SHIMANAMI 140</span>
                    <span className="text-xs border border-gray-200 rounded-full px-2 py-0.5">今治発着・向島折返</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    140kmの最長コース。今治発着なので宿は今治側が基本ですが、
                    <strong className="text-textMain">走り切ったあとの疲労を考えると、前泊・後泊の両方を押さえておく</strong>のが安心です。
                    翌日は移動だけの日にする、くらいの余裕を見ておくとよいでしょう。
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl bg-white p-5 sm:p-6">
                  <div className="flex items-baseline gap-3 flex-wrap mb-2">
                    <span className="text-textMain font-medium">走らないご家族・応援の方</span>
                  </div>
                  <p className="text-sm leading-relaxed">
                    見落とされがちですが、
                    <strong className="text-textMain">走る本人と、同行するご家族では「良い宿の条件」が違います</strong>。
                    本人が早朝に出たあと、ご家族は島でゆっくり過ごすことになるので、
                    「朝早く出ても他の人が寝ていられるか」「日中に周辺で過ごせる場所があるか」が実は大事です。
                    走る人と走らない人で部屋を分ける、という選択肢も検討してみてください。
                  </p>
                </div>
              </div>
            </motion.section>

            {/* ④ 当日の流れ */}
            <motion.section
              id="timeline"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ④ 大会当日の流れ
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                前日受付から当日ゴールまでを時系列で並べると、宿に求める条件が見えてきます。
              </p>
              <div className="border-l border-gray-200 pl-6 sm:pl-8 space-y-7">
                {TIMELINE.map((t) => (
                  <div key={t.time} className="relative">
                    <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-2.5 h-2.5 rounded-full bg-textMain" />
                    <div className="text-xs tracking-widest text-textMain/60 mb-1">{t.time}</div>
                    <div className="text-textMain font-medium text-sm mb-1">{t.title}</div>
                    <p className="text-sm leading-relaxed">{t.body}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ⑤ 意外と知られていないこと */}
            <motion.section
              id="pitfalls"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ⑤ 意外と知られていない5つのこと
              </h2>
              <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
                {[
                  { t: '受付は「前日」。当日ではありません', b: '大会前日（10/24）に受付を済ませる必要があります。しかもエントリー時に選んだ会場でのみ。遠方からの日帰り参加が難しいのは、この前日受付があるためです。' },
                  { t: '受付会場は自分で選んだ1か所だけ', b: '尾道・今治・松山の3会場がありますが、どこでも受け付けてもらえるわけではありません。エントリー時の選択を必ず確認してください。' },
                  { t: '荷物預かりは事前申込・有料。袋のサイズ制限あり', b: 'スタート会場で預けてフィニッシュ会場で受け取る仕組みで、指定サイズの袋に入るぶんだけ。「大きい荷物は宿に置いていく」前提で準備すると身軽です。' },
                  { t: '輸送サービス・駐車場は事前申込制で、当日販売なし', b: 'シャトルバスやチャーター船、会場駐車場はいずれも事前申込制です。申込期間を過ぎている場合、当日その場で買うことはできません。申し込めていない方は、別の帰り方を前提に計画を立てる必要があります。' },
                  { t: 'スタート時刻はコースごとに違う', b: '7:37〜9:57まで、コース別の時差スタートです。「朝は早い」と一括りにせず、自分のコースの時刻から逆算しましょう。' },
                ].map((item) => (
                  <div key={item.t} className="p-5 sm:p-6">
                    <div className="text-textMain font-medium text-sm mb-1.5">{item.t}</div>
                    <p className="text-sm leading-relaxed">{item.b}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ⑥ チェックリスト */}
            <motion.section
              id="howto-choose"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ⑥ 宿選びで失敗しないチェックリスト
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                価格や口コミよりも、大会前後は「当日の動きやすさ」で決めたほうが後悔しません。
              </p>
              <div className="border border-gray-200 rounded-xl bg-white divide-y divide-gray-100">
                {CHECKLIST.map((c, i) => (
                  <div key={c.q} className="p-5 sm:p-6">
                    <div className="text-textMain font-medium text-sm mb-1.5">
                      {i + 1}. {c.q}
                    </div>
                    <p className="text-sm leading-relaxed">{c.a}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ⑦ HOTEL PG */}
            <motion.section
              id="hotel-pg"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ⑦ HOTEL PG（因島）の場合
              </h2>

              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 mb-5">
                <Image
                  src="/images/gallery/hotel-pg-ii-exterior.webp"
                  alt="HOTEL PG-II 外観（広島県尾道市因島土生町）"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              </div>

              <p className="text-sm leading-relaxed mb-5">
                HOTEL PGは<strong className="text-textMain">因島（尾道市因島土生町）</strong>にある、
                フロントを設けないセルフチェックイン方式の素泊まり型ホテルです。
                サイクリストの自転車預かりに対応し、無料駐車場も備えています。
                3棟・6タイプの客室があり、走る方と走らないご家族で分けて取ることもできます。
              </p>

              {/* 正直なアクセス表示 */}
              <div className="border-2 border-textMain/20 rounded-xl bg-white p-5 sm:p-6 mb-5">
                <div className="text-xs tracking-widest text-textMain/60 mb-3">
                  先にお伝えしておきたいこと（アクセス）
                </div>
                <p className="text-sm leading-relaxed mb-4">
                  HOTEL PGがあるのは<strong className="text-textMain">因島</strong>で、
                  A・Bコースのスタート地点である<strong className="text-textMain">向島運動公園とは島がひとつ違います</strong>。
                  因島大橋を渡る必要があり、<strong className="text-textMain">自転車でおよそ20km以上・1時間30分前後、お車で30〜40分程度</strong>が目安です。
                </p>
                <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
                  <li>
                    <strong className="text-textMain">向島スタート（A・B）で前泊される場合</strong>は、
                    早朝の移動時間を必ず計算に入れてください。7:37スタートのAコースなら、自走だと5時台の出発になります。
                    <strong className="text-textMain">お車での移動を前提にされることをおすすめします。</strong>
                  </li>
                  <li>
                    <strong className="text-textMain">後泊・翌日観光でのご利用</strong>なら、この移動時間はほとんど負担になりません。
                    むしろ、しまなみのちょうど中ほどに泊まれることが利点になります。
                  </li>
                </ul>
                <p className="text-xs text-textLight/70 leading-relaxed mt-4">
                  ※ 距離・所要時間はルートや天候により変わる目安です。ご不安な場合はご予約前にお問い合わせください。
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl bg-white p-5 sm:p-6">
                <div className="text-textMain font-medium text-sm mb-3">こんな使い方が向いています</div>
                <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5">
                  <li><strong className="text-textMain">Bコース（INNOSHIMA 70）</strong>の前後泊。因島を通るコースなので、島に拠点があると土地勘が活きます</li>
                  <li><strong className="text-textMain">大会後にその日のうちに帰らない</strong>方の後泊。走り切った日に長距離移動をしなくて済みます</li>
                  <li><strong className="text-textMain">翌日もしまなみを自分のペースで走りたい</strong>方。大会は高速道路を走る特別なコースなので、通常ルートは翌日にゆっくり</li>
                  <li><strong className="text-textMain">走らないご家族の滞在拠点</strong>として。日中は因島を観光しながら過ごせます</li>
                </ul>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="text-xs tracking-widest text-textMain/60 mb-2">客室タイプ</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { href: '/rooms/pg1', label: 'HOTEL PG -Ⅰ-' },
                      { href: '/rooms/pg2-single', label: 'PG -Ⅱ- シングル' },
                      { href: '/rooms/pg2-family', label: 'PG -Ⅱ- ファミリー' },
                      { href: '/rooms/pg3', label: 'PG-III 3名' },
                      { href: '/rooms/pg3-four', label: 'PG-III 4名' },
                      { href: '/rooms/pg3-maisonette', label: 'PG-III メゾネット' },
                    ].map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="text-xs border border-gray-300 rounded-full px-3 py-1.5 hover:border-textMain hover:text-textMain transition-colors"
                      >
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* ⑧ 翌日は因島 */}
            <motion.section
              id="next-day"
              className="scroll-mt-28"
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                ⑧ 翌日は因島をゆっくり
              </h2>
              <p className="text-sm leading-relaxed mb-6">
                しまなみ海道を走り切った翌日、そのまま帰ってしまうのは少しもったいないかもしれません。
                大会当日は高速道路を走る特別なコースなので、
                <strong className="text-textMain">島の中の道や港町の風景は、実はまだ見ていない</strong>という方が多いのです。
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { t: '大山神社（自転車神社）', b: '全国のサイクリストが安全祈願に訪れる、自転車の神様を祀る神社。走り切ったお礼参りに。' },
                  { t: '白滝山', b: '頂上から瀬戸内の多島美を一望。五百羅漢が並ぶ独特の景観も見どころです。' },
                  { t: 'はっさく屋', b: '因島名物「はっさく大福」。走った翌日の甘いものは格別です。' },
                  { t: '因島水軍城', b: '村上水軍の歴史に触れられるお城。自転車を降りて、島の歴史に触れる時間も。' },
                ].map((s) => (
                  <div key={s.t} className="border border-gray-200 rounded-xl bg-white p-5">
                    <div className="text-textMain font-medium text-sm mb-1.5">{s.t}</div>
                    <p className="text-sm leading-relaxed">{s.b}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm leading-relaxed mt-6">
                ルートや立ち寄りスポットの詳細は
                <Link href="/blog/shimanami-innoshima-cycling-guide" className="underline underline-offset-2 hover:text-textMain">
                  しまなみ海道サイクリング完全ガイド
                </Link>
                に、因島の宿泊施設全体の比較は
                <Link href="/innoshima-hotel-guide" className="underline underline-offset-2 hover:text-textMain">
                  因島のホテル・宿泊施設まとめ
                </Link>
                にまとめています。
              </p>
            </motion.section>

            {/* CTA */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={reveal ? { opacity: 1, y: 0 } : false}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="border border-textMain rounded-xl p-6 sm:p-10 bg-white text-center"
            >
              <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-3 tracking-[0.08em]">
                大会前後のご宿泊について
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-xl mx-auto">
                大会シーズンは島全体の宿が埋まりやすくなります。
                日程が決まっている方は、お早めに空室状況をご確認ください。
                コースやご予定に合わせたご相談も承っております。
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
