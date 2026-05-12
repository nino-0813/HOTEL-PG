import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '団体プラン | HOTEL PG',
  description: 'サークル・イベント・企業研修など、団体でのご宿泊・お問い合わせのご案内です。',
};

export default function GroupPlansPage() {
  return (
    <div className="min-h-screen relative">
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 sm:pt-28 pb-20 sm:pb-32">
        <div className="relative bg-gradient-to-b from-gray-50 to-background py-16 sm:py-24 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-3xl">
            <p className="font-body text-xs tracking-[0.25em] uppercase text-gray-500 mb-4 text-center">GROUP STAY</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-textMain mb-8 tracking-[0.08em] text-center">
              団体プラン
            </h1>
            <p className="font-serif text-base text-textLight leading-relaxed text-center mb-10">
              団体向けのご案内内容は現在準備中です。お急ぎの場合はお電話またはお問い合わせフォームよりご連絡ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/#stay-plans"
                className="inline-block px-8 py-4 border border-gray-300 text-textMain hover:border-textMain transition-colors font-body text-xs tracking-widest uppercase text-center"
              >
                トップへ戻る
              </Link>
              <Link
                href="/#reservation"
                className="inline-block px-8 py-4 bg-textMain text-white hover:bg-textLight transition-colors font-body text-xs tracking-widest uppercase text-center"
              >
                ご予約・お問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
