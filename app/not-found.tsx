import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen relative">
      <div className="bg-noise" />
      <Header />
      <main className="relative w-full pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-12 text-center">
          <h1 className="font-display text-3xl text-textMain mb-6">ページが見つかりません</h1>
          <p className="text-gray-500 mb-8">お探しのページは存在しないか、移動した可能性があります。</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-sm tracking-[0.2em] uppercase text-textMain border-b border-textMain pb-1 hover:opacity-70 transition-opacity"
          >
            トップへ戻る
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
