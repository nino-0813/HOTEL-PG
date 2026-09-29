import { ArrowRight } from 'lucide-react';
import { listNews } from '@/lib/news-store';
import NewsCard from './NewsCard';

export default async function NewsSection() {
  let failed = false;
  const articles = await listNews().catch(() => { failed = true; return []; });
  return (
    <section id="news" aria-labelledby="news-heading" className="scroll-mt-20 px-6 py-16 sm:px-10 sm:pb-20 sm:pt-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center sm:mb-14">
          <p className="mb-3 font-display text-sm tracking-[0.3em] text-textLight">NEWS</p>
          <h2 id="news-heading" className="font-serif text-2xl font-normal tracking-[0.25em] text-textMain sm:text-3xl">お知らせ</h2>
        </div>
        {articles.length ? <div aria-label="最新のお知らせ" className="-mx-2 grid snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-5 overflow-x-auto overscroll-x-contain px-2 pb-4 pt-2 [scrollbar-width:thin] [&>article]:min-w-0 [&>article]:snap-start md:mx-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:gap-x-8 md:gap-y-10 md:overflow-visible md:p-0">
          {articles.slice(0, 3).map(article => <NewsCard key={article.id} article={article} />)}
        </div> : <p className="py-8 text-center font-serif text-textLight">{failed ? '現在、お知らせを読み込めません。時間をおいて再度ご確認ください。' : '新しいお知らせは、こちらでご案内します。'}</p>}
        <div className="mt-8 flex justify-end border-t border-divider pt-4 sm:mt-10">
          <a href="/news" className="inline-flex min-h-12 items-center gap-6 px-2 font-serif text-sm tracking-widest text-textMain hover:text-textLight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
            もっと見る <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
