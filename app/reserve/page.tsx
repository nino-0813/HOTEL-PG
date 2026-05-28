import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BedDouble, Phone, Sparkles, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ROOMS, type RoomSlug } from '@/lib/room-data';
import { EXPERIENCE_PLANS } from '@/constants';

export const metadata: Metadata = {
  title: 'ご予約 | HOTEL PG',
  description:
    'HOTEL PGの客室一覧と体験プラン。お部屋を選んで予約ページへ、または体験プランの詳細をご確認いただけます。',
};

/**
 * 体験プラン詳細LPの公開フラグ（[slug]/page.tsx と揃えて運用）。
 * false のあいだはカードのリンクを無効化し「準備中」表示にします。
 */
const EXPERIENCE_DETAIL_PUBLISHED = false;

const ROOM_ORDER: RoomSlug[] = [
  'pg1',
  'pg2-single',
  'pg2-family',
  'pg3',
  'pg3-four',
  'pg3-maisonette',
];

const ROOM_SHORT_DESCRIPTION: Record<RoomSlug, string> = {
  pg1: '因島の海沿いに立つPG -Ⅰ-。素泊まりプランで、共同キッチン利用も可。一人旅・カップル向けのコンパクトな1〜2名タイプ。',
  'pg2-single': 'PG -Ⅱ- のシングルタイプ。一人旅・出張・サイクリストの拠点に。落ち着いた色調と必要十分な設備を備えた1名利用向け客室。',
  'pg2-family': 'PG -Ⅱ- のファミリータイプ。ゆとりのある間取りで、家族・グループでの因島ステイに。最大人数や設備はページにて。',
  pg3: '【OPEN記念価格】PG -Ⅲ- 3名タイプ。和モダンの落ち着いた客室で、2名利用でもお得にご滞在いただけます。長期滞在歓迎。',
  'pg3-four': '【OPEN記念価格】PG -Ⅲ- 4名タイプ。家族やグループ向けの広めの客室。無料駐車場・長期滞在も対応。',
  'pg3-maisonette': 'PG -Ⅲ- メゾネット洋室。上下のある空間設計で、静かな港町ステイを少し特別に。',
};

export default function ReserveLandingPage() {
  return (
    <div className="min-h-screen relative bg-white">
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32 bg-white">
        {/* Hero */}
        <section className="relative py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl text-center">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
              RESERVATION
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-6 tracking-[0.08em]">
              ご予約
            </h1>
            <p className="font-serif text-base text-textLight leading-relaxed">
              お部屋を選んでご予約ページへお進みください。
              <br className="hidden sm:block" />
              因島での1日をまるごと楽しむ体験プランもご用意しています。
            </p>
            <div className="w-12 h-[1px] bg-gray-300 mt-8 mx-auto"></div>
          </div>
        </section>

        {/* Rooms */}
        <section className="container mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-gray-500 mb-3">
              <BedDouble size={16} className="text-gray-400" aria-hidden />
              <p className="font-body text-xs tracking-[0.25em] uppercase">ROOMS</p>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.08em]">
              客室から選んで予約する
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {ROOM_ORDER.map((slug) => {
              const room = ROOMS[slug];
              if (!room) return null;
              const heroImage = room.images?.[0];
              return (
                <article
                  key={slug}
                  className="group bg-white border border-gray-200 overflow-hidden flex flex-col hover:border-textMain hover:shadow-xl transition-all duration-500"
                >
                  {heroImage && (
                    <Link
                      href={`/rooms/${slug}`}
                      className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden block"
                    >
                      <Image
                        src={heroImage}
                        alt={`${room.name} ${room.subtitle}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </Link>
                  )}

                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <p className="font-body text-[11px] sm:text-xs text-gray-400 tracking-[0.2em] uppercase mb-2">
                      {room.name}
                    </p>
                    <h3 className="font-display text-lg sm:text-xl font-light text-textMain tracking-[0.04em] leading-snug mb-3">
                      {room.subtitle}
                    </h3>
                    <p className="font-serif text-sm text-gray-700 leading-relaxed mb-5 flex-1">
                      {ROOM_SHORT_DESCRIPTION[slug]}
                    </p>

                    <div className="mt-auto flex flex-col gap-2">
                      <Link
                        href={`/rooms/${slug}`}
                        className="inline-flex items-center justify-center gap-2 w-full bg-textMain text-white hover:bg-textLight transition-colors px-6 py-3 font-body text-xs tracking-widest uppercase"
                      >
                        予約ページへ
                        <ArrowRight size={14} />
                      </Link>
                      <Link
                        href={`/rooms/${slug}`}
                        className="inline-flex items-center justify-center gap-2 w-full border border-gray-300 text-textMain hover:border-textMain transition-colors px-6 py-3 font-body text-xs tracking-widest uppercase"
                      >
                        詳しく見る
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Experience plans */}
        {EXPERIENCE_PLANS.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-20 sm:mt-28">
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 text-gray-500 mb-3">
                <Sparkles size={16} className="text-gray-400" aria-hidden />
                <p className="font-body text-xs tracking-[0.25em] uppercase">EXPERIENCE</p>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.08em]">
                体験プラン
              </h2>
              <p className="font-serif text-sm text-textLight leading-relaxed mt-3">
                因島と瀬戸内を楽しむ、宿泊とセットの1日プラン
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {EXPERIENCE_PLANS.map((plan) => {
                const ImageWrap: React.ElementType = EXPERIENCE_DETAIL_PUBLISHED ? Link : 'div';
                const wrapProps = EXPERIENCE_DETAIL_PUBLISHED
                  ? { href: `/experience-plans/${plan.slug}` }
                  : { 'aria-disabled': 'true' as const };
                return (
                  <article
                    key={plan.slug}
                    className={
                      'group bg-white border border-gray-200 overflow-hidden flex flex-col ' +
                      (EXPERIENCE_DETAIL_PUBLISHED
                        ? 'hover:border-textMain hover:shadow-xl transition-all duration-500'
                        : '')
                    }
                  >
                    <ImageWrap
                      {...wrapProps}
                      className={
                        'relative aspect-[16/10] w-full bg-gray-100 overflow-hidden block ' +
                        (EXPERIENCE_DETAIL_PUBLISHED ? '' : 'cursor-default')
                      }
                    >
                      <Image
                        src={plan.heroImage}
                        alt={plan.heroImageAlt ?? plan.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={
                          'object-cover transition-transform duration-700 ' +
                          (EXPERIENCE_DETAIL_PUBLISHED ? 'group-hover:scale-[1.03]' : '')
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {plan.catchCopy && (
                        <p className="absolute bottom-4 left-4 right-4 font-serif text-white text-base sm:text-lg leading-snug drop-shadow">
                          {plan.catchCopy}
                        </p>
                      )}
                      {!EXPERIENCE_DETAIL_PUBLISHED && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-body text-[11px] tracking-[0.2em] uppercase text-textMain shadow">
                          COMING SOON
                        </span>
                      )}
                    </ImageWrap>
                    <div className="p-6 sm:p-7 flex flex-col flex-1">
                      <p className="font-body text-[11px] sm:text-xs text-gray-400 tracking-[0.2em] uppercase mb-2">
                        {plan.subtitle}
                      </p>
                      <h3 className="font-display text-lg sm:text-xl font-light text-textMain tracking-[0.04em] leading-snug mb-3">
                        {plan.title}
                      </h3>
                      <p className="font-serif text-sm text-gray-700 leading-relaxed mb-5 flex-1">
                        {plan.description}
                      </p>
                      {EXPERIENCE_DETAIL_PUBLISHED ? (
                        <Link
                          href={`/experience-plans/${plan.slug}`}
                          className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-textMain text-white hover:bg-textLight transition-colors px-6 py-3 font-body text-xs tracking-widest uppercase"
                        >
                          体験プランを見る
                          <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <div
                          aria-disabled="true"
                          className="mt-auto inline-flex items-center justify-center gap-2 w-full bg-gray-200 text-gray-500 px-6 py-3 font-body text-xs tracking-widest uppercase cursor-default"
                        >
                          詳細ページ準備中
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {EXPERIENCE_DETAIL_PUBLISHED && (
              <div className="text-center mt-10">
                <Link
                  href="/experience-plans"
                  className="inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-textMain hover:text-textLight transition-colors border-b border-gray-300 hover:border-textMain pb-1"
                >
                  体験プラン一覧をすべて見る
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Group discount */}
        <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-20 sm:mt-28">
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 text-gray-500 mb-3">
              <Users size={16} className="text-gray-400" aria-hidden />
              <p className="font-body text-xs tracking-[0.25em] uppercase">GROUP</p>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.08em]">
              団体割引
            </h2>
          </div>

          <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 sm:p-10 md:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <div className="flex-shrink-0 text-center sm:text-left">
                <div className="inline-flex items-baseline gap-1 text-textMain">
                  <span className="font-display text-5xl sm:text-6xl font-light leading-none">
                    10
                  </span>
                  <span className="font-body text-sm tracking-widest">名〜</span>
                </div>
                <p className="font-body text-[11px] tracking-[0.2em] uppercase text-gray-400 mt-2">
                  GROUP DISCOUNT
                </p>
              </div>
              <div className="flex-1">
                <p className="font-serif text-base text-textMain leading-relaxed mb-3">
                  10名以上のご利用から、団体割引を適用いたします。
                </p>
                <p className="font-serif text-sm text-gray-600 leading-relaxed">
                  人数・日程・ご予算に応じてご案内いたします。詳細はお気軽にお問い合わせください。
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href="tel:07083289154"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors font-body text-sm tracking-widest"
              >
                <Phone size={16} />
                電話する　070-8328-9154
              </a>
              <p className="font-serif text-xs text-gray-500">
                受付時間外につながらない場合は、お問い合わせフォームよりご連絡ください。
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-20 sm:mt-28">
          <div className="max-w-3xl mx-auto bg-gray-50 border border-gray-200 p-8 sm:p-10 md:p-12 text-center">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
              CONTACT
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-light text-textMain mb-4 tracking-[0.08em]">
              お部屋・プランのご相談
            </h2>
            <p className="font-serif text-sm sm:text-base text-textLight leading-relaxed mb-8">
              人数や日程・オプションのご相談はお問い合わせフォームからお気軽にどうぞ。
            </p>
            <Link
              href="/#contact"
              className="inline-block px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors font-body text-xs tracking-widest uppercase"
            >
              お問い合わせ
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
