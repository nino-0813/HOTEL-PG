import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AdminBookingsDeprecatedPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl sm:text-3xl text-textMain tracking-[0.08em]">予約一覧</h1>
      <p className="mt-4 font-serif text-sm text-textLight leading-relaxed">
        公開サイトからの予約・空室は SaaS 側で管理しています。この管理画面の一覧は利用していません。
      </p>
      <p className="mt-3 font-serif text-sm text-gray-500 leading-relaxed">
        予約の確認は SaaS の管理ツールまたは運用フローをご利用ください。
      </p>
      <div className="mt-8">
        <Link
          href="/admin/blog"
          className="inline-flex font-display text-xs tracking-[0.2em] uppercase text-white bg-textMain px-6 py-3 rounded-lg hover:bg-textLight transition-colors"
        >
          管理トップへ
        </Link>
      </div>
    </div>
  );
}
