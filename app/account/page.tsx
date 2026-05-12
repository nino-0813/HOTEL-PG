import Link from 'next/link';

/** Supabase Auth は使用しない。 */
export default function AccountPage() {
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-lg">
        <h1 className="font-display text-2xl sm:text-3xl font-light text-textMain tracking-[0.08em]">
          マイページ
        </h1>
        <p className="font-serif text-sm text-textLight mt-4 leading-relaxed">
          マイページ機能は現在準備中です。ご予約は各お部屋のページからお願いいたします。
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex font-display text-xs sm:text-sm tracking-[0.2em] uppercase text-white bg-textMain px-8 py-4 hover:bg-textLight transition-colors duration-300 rounded"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
