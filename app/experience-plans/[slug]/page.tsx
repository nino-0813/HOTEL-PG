import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Clock, Sparkles, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { EXPERIENCE_PLANS } from '@/constants';

type Params = { slug: string };

/**
 * 体験プランの詳細LPページ公開フラグ。
 * false のあいだはこのページは常に 404 を返します。
 * 準備が整ったら true に変更してください。
 */
const IS_PUBLISHED = false;

export function generateStaticParams(): Params[] {
  // 未公開時は静的生成のパラメータも返さない
  if (!IS_PUBLISHED) return [];
  return EXPERIENCE_PLANS.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const plan = EXPERIENCE_PLANS.find((p) => p.slug === slug);
  if (!plan) {
    return { title: '体験プラン | HOTEL PG' };
  }
  return {
    title: `${plan.title} | 体験プラン | HOTEL PG`,
    description: plan.description,
    openGraph: {
      title: `${plan.title} | 体験プラン | HOTEL PG`,
      description: plan.description,
      images: plan.heroImage ? [{ url: plan.heroImage }] : undefined,
    },
  };
}

export default async function ExperiencePlanDetailPage(
  { params }: { params: Promise<Params> },
) {
  if (!IS_PUBLISHED) {
    notFound();
  }
  const { slug } = await params;
  const plan = EXPERIENCE_PLANS.find((p) => p.slug === slug);
  if (!plan) {
    notFound();
  }

  return (
    <div className="min-h-screen relative bg-white">
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32 bg-white">
        {/* Hero */}
        <section className="relative">
          <div className="relative h-[55vh] sm:h-[65vh] min-h-[420px] w-full overflow-hidden bg-gray-200">
            <Image
              src={plan.heroImage}
              alt={plan.heroImageAlt ?? plan.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        </section>

        {/* Lead + meta */}
        <section className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl mt-14 sm:mt-20">
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-1.5 text-gray-700 text-xs sm:text-sm">
              <Clock size={14} className="text-gray-400" aria-hidden />
              {plan.duration}
            </span>
            {plan.capacity && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-1.5 text-gray-700 text-xs sm:text-sm">
                <Users size={14} className="text-gray-400" aria-hidden />
                {plan.capacity}
              </span>
            )}
            {plan.priceLabel && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-1.5 text-gray-700 text-xs sm:text-sm">
                <Sparkles size={14} className="text-gray-400" aria-hidden />
                {plan.priceLabel}
              </span>
            )}
          </div>
          <p className="font-serif text-base sm:text-lg text-textMain leading-loose tracking-wide">
            {plan.lead}
          </p>
        </section>

        {/* Highlights */}
        {plan.highlights.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl mt-16 sm:mt-24">
            <div className="text-center mb-10 sm:mb-12">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
                HIGHLIGHTS
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.08em]">
                このプランのいいところ
              </h2>
              <div className="w-12 h-[1px] bg-gray-300 mt-4 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {plan.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-white border border-gray-200 p-5 sm:p-6"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-textMain text-white font-display text-sm flex items-center justify-center mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-serif text-sm sm:text-base text-gray-700 leading-relaxed">
                    {h}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Story sections (alternating) */}
        {plan.sections.length > 0 && (
          <section className="mt-20 sm:mt-28">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-6xl space-y-16 sm:space-y-24">
              {plan.sections.map((sec, i) => {
                const reverse = i % 2 === 1;
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center ${
                      reverse ? 'md:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    {sec.image && (
                      <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                        <Image
                          src={sec.image}
                          alt={sec.imageAlt ?? sec.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-body text-[11px] sm:text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">
                        {String(i + 1).padStart(2, '0')} / {String(plan.sections.length).padStart(2, '0')}
                      </p>
                      <h3 className="font-display text-2xl sm:text-3xl font-light text-textMain tracking-[0.06em] leading-snug mb-5">
                        {sec.title}
                      </h3>
                      <p className="font-serif text-sm sm:text-base text-gray-700 leading-loose whitespace-pre-line">
                        {sec.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Schedule */}
        {plan.schedule.length > 0 && (
          <section className="mt-20 sm:mt-28">
            <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
              <div className="text-center mb-10 sm:mb-12">
                <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">
                  TIMETABLE
                </p>
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-textMain tracking-[0.08em]">
                  1日の流れ
                </h2>
                <div className="w-12 h-[1px] bg-gray-300 mt-4 mx-auto"></div>
              </div>

              <ol className="relative border-l border-gray-200 ml-3 sm:ml-4 space-y-10 sm:space-y-12">
                {plan.schedule.map((item, i) => (
                  <li key={i} className="ml-6 sm:ml-8">
                    <span className="absolute -left-2 sm:-left-2.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-textMain border-4 border-background" />
                    <div className="font-display text-base sm:text-lg font-medium text-textMain tracking-wider mb-1">
                      {item.time}
                    </div>
                    <h3 className="font-serif text-lg sm:text-xl text-textMain mb-2">
                      {item.title}
                    </h3>
                    <p className="font-serif text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    {item.image && (
                      <div className="relative aspect-[16/9] w-full max-w-md bg-gray-100 overflow-hidden mt-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 90vw, 28rem"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {/* Includes / Options / Notes */}
        <section className="mt-20 sm:mt-28">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <h3 className="font-display text-xl sm:text-2xl font-light text-textMain mb-5 tracking-[0.08em]">
                  プランに含まれるもの
                </h3>
                <ul className="space-y-3">
                  {plan.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check size={18} className="text-textMain flex-shrink-0 mt-0.5" />
                      <span className="font-serif text-sm sm:text-base text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.options && plan.options.length > 0 && (
                <div className="bg-white border border-gray-200 p-6 sm:p-8">
                  <h3 className="font-display text-xl sm:text-2xl font-light text-textMain mb-5 tracking-[0.08em]">
                    オプション・別料金
                  </h3>
                  <ul className="space-y-3">
                    {plan.options.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Sparkles size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                        <span className="font-serif text-sm sm:text-base text-gray-700 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {plan.notes && plan.notes.length > 0 && (
              <div className="mt-8 sm:mt-10 bg-gray-50 border border-gray-200 p-6 sm:p-8">
                <h3 className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-4">
                  NOTES / ご注意
                </h3>
                <ul className="space-y-2 list-disc list-inside">
                  {plan.notes.map((note, i) => (
                    <li
                      key={i}
                      className="font-serif text-xs sm:text-sm text-gray-600 leading-relaxed"
                    >
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {plan.relatedLinks && plan.relatedLinks.length > 0 && (
              <div className="mt-8 sm:mt-10 space-y-3">
                {plan.relatedLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body text-sm text-textMain underline underline-offset-4 hover:text-textLight transition-colors"
                  >
                    {link.label}
                    <ArrowRight size={14} className="flex-shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-20 sm:mt-28">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-4xl">
            <div className="bg-textMain text-white p-8 sm:p-12 md:p-16 text-center">
              <p className="font-body text-xs tracking-[0.25em] uppercase text-white/70 mb-4">
                RESERVATION
              </p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.08em] mb-4">
                この体験プランを予約する
              </h2>
              <p className="font-serif text-sm sm:text-base text-white/85 leading-relaxed mb-8 max-w-2xl mx-auto">
                日程・人数・オプション（オードブル等）の詳細は、ご予約・お問い合わせフォームよりご連絡ください。スケジュール調整・カスタマイズもご相談いただけます。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/reserve"
                  className="inline-block px-10 py-4 bg-white text-textMain hover:bg-gray-100 transition-colors font-body text-xs tracking-widest uppercase"
                >
                  ご予約・お問い合わせ
                </Link>
                <Link
                  href="/experience-plans"
                  className="inline-flex items-center gap-2 px-10 py-4 border border-white/40 text-white hover:bg-white/10 transition-colors font-body text-xs tracking-widest uppercase"
                >
                  <ArrowLeft size={14} />
                  体験プラン一覧へ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
