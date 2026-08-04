import Link from 'next/link';

/** Supabase Auth は使用しない。ブックマークや旧リンクからのアクセス用。 */
export default function AuthDeprecatedPage() {
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-lg">
        <h1 className="font-display text-2xl sm:text-3xl font-light text-textMain tracking-[0.08em]">
          ログイン
        </h1>
        <p className="font-serif text-sm text-textLight mt-4 leading-relaxed">
          現在ログインは不要です。お宿のご予約・お支払いは、各お部屋のページにある空室カレンダーからお進みください。
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/rooms/pg1"
            className="inline-flex justify-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
          >
            お部屋ページへ（PG-I）
          </Link>
          <Link
            href="/reserve"
            className="inline-flex justify-center font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-textMain border border-gray-200 px-8 py-4 hover:border-gray-400 transition-colors duration-300 rounded"
          >
            トップの予約へ
          </Link>
        </div>
      </div>
    </main>
  );
}
