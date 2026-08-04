import Link from 'next/link';

/** 旧サイト内チェックアウトは廃止。予約は各部屋ページの RoomBookingCalendar → SaaS のみ。 */
export default function CheckoutDeprecatedPage() {
  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-lg">
        <h1 className="font-display text-2xl sm:text-3xl font-light text-textMain tracking-[0.08em]">
          ご予約について
        </h1>
        <p className="font-serif text-sm text-textLight mt-4 leading-relaxed">
          現在は各部屋ページのカレンダーから予約してください。日程を選び、「予約へ進む」から決済ページへお進みいただけます。
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
            トップへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
