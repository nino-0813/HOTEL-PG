import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EXPERIENCE_PLANS } from '@/constants';

/**
 * 体験プラン詳細LPの公開フラグ（[slug]/page.tsx と揃えて運用）。
 * false のあいだはカードのリンクを無効化し「準備中」表示にします。
 */
const DETAIL_PUBLISHED = false;

export const metadata: Metadata = {
  title: '体験プラン一覧 | HOTEL PG',
  description:
    '因島と瀬戸内の自然を、宿泊とセットで楽しむHOTEL PGの体験プラン一覧。海・自転車・島時間など、ご家族・カップル・ご友人での1日をご提案します。',
};

export default function ExperiencePlansListPage() {
  return (
    <div className="min-h-screen relative bg-white">
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32 bg-white">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-gray-50 to-background py-16 sm:py-24 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl text-center">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
              EXPERIENCE PLANS
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-6 tracking-[0.08em]">
              体験プラン
            </h1>
            <p className="font-serif text-base text-textLight leading-relaxed">
              因島と瀬戸内の自然を、宿泊とセットで遊びつくす。
              <br className="hidden sm:block" />
              HOTEL PGがご用意する、1日まるごと愉しむ体験プラン一覧です。
            </p>
            <div className="w-12 h-[1px] bg-gray-300 mt-8 mx-auto"></div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-12 sm:mt-16">
          {EXPERIENCE_PLANS.length === 0 ? (
            <div className="max-w-2xl mx-auto border border-gray-200 rounded-xl p-8 sm:p-10 md:p-12 bg-white shadow-sm text-center">
              <h2 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-6 tracking-[0.08em]">
                体験プランを準備中です
              </h2>
              <p className="font-serif text-base text-textLight leading-relaxed">
                公開準備中です。決まり次第、こちらでご案内いたします。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {EXPERIENCE_PLANS.map((plan) => {
                const cardClass =
                  'group bg-white border border-gray-200 overflow-hidden flex flex-col relative ' +
                  (DETAIL_PUBLISHED
                    ? 'hover:border-textMain hover:shadow-xl transition-all duration-500'
                    : '');
                const cardInner = (
                  <>
                    <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
                      <Image
                        src={plan.heroImage}
                        alt={plan.heroImageAlt ?? plan.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={
                          'object-cover transition-transform duration-700 ' +
                          (DETAIL_PUBLISHED ? 'group-hover:scale-[1.03]' : '')
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {plan.catchCopy && (
                        <p className="absolute bottom-4 left-4 right-4 font-serif text-white text-base sm:text-lg leading-snug drop-shadow">
                          {plan.catchCopy}
                        </p>
                      )}
                      {!DETAIL_PUBLISHED && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 font-body text-[11px] tracking-[0.2em] uppercase text-textMain shadow">
                          COMING SOON
                        </span>
                      )}
                    </div>
                    <div className="p-6 sm:p-7 md:p-8 flex flex-col flex-1">
                      <p className="font-body text-[11px] sm:text-xs text-gray-400 tracking-[0.2em] uppercase mb-2">
                        {plan.subtitle}
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl font-light text-textMain tracking-[0.06em] leading-snug mb-3">
                        {plan.title}
                      </h2>
                      <p className="font-serif text-sm text-gray-700 leading-relaxed mb-5">
                        {plan.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mb-5">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1 text-gray-600 text-[11px] sm:text-xs">
                          <Clock size={12} className="text-gray-400" aria-hidden />
                          {plan.duration}
                        </span>
                        {plan.capacity && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1 text-gray-600 text-[11px] sm:text-xs">
                            <Users size={12} className="text-gray-400" aria-hidden />
                            {plan.capacity}
                          </span>
                        )}
                      </div>
                      <div
                        className={
                          'mt-auto inline-flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase ' +
                          (DETAIL_PUBLISHED
                            ? 'text-textMain group-hover:text-textLight transition-colors'
                            : 'text-gray-400')
                        }
                      >
                        {DETAIL_PUBLISHED ? '詳細を見る' : '詳細ページ準備中'}
                        {DETAIL_PUBLISHED && (
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        )}
                      </div>
                    </div>
                  </>
                );

                return DETAIL_PUBLISHED ? (
                  <Link
                    key={plan.slug}
                    href={`/experience-plans/${plan.slug}`}
                    className={cardClass}
                  >
                    {cardInner}
                  </Link>
                ) : (
                  <div
                    key={plan.slug}
                    className={cardClass + ' cursor-default'}
                    aria-disabled="true"
                  >
                    {cardInner}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bottom CTA */}
        <section className="container mx-auto px-4 sm:px-6 md:px-12 mt-16 sm:mt-24">
          <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 sm:p-10 md:p-12 text-center">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
              CONTACT
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-textMain mb-4 tracking-[0.08em]">
              プラン内容のカスタマイズもご相談ください
            </h2>
            <p className="font-serif text-sm sm:text-base text-textLight leading-relaxed mb-8">
              人数・日程・食事・送迎時間など、ご希望に合わせて柔軟にご相談いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/reserve"
                className="inline-block px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors font-body text-xs tracking-widest uppercase text-center"
              >
                ご予約・お問い合わせ
              </Link>
              <Link
                href="/"
                className="inline-block px-8 py-4 border border-gray-300 text-textMain hover:border-textMain transition-colors font-body text-xs tracking-widest uppercase text-center"
              >
                トップへ戻る
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
