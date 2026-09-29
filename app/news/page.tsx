import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { NEWS_CATEGORIES } from '@/lib/news';
import { listNews } from '@/lib/news-store';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'お知らせ', description: 'HOTEL PGの施設や宿泊プラン、因島・しまなみのイベントに関するお知らせ。', alternates: { canonical: '/news' } };

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string; page?: string }> }) {
  const query = await searchParams;
  const category = typeof query.category === 'string' ? query.category : '';
  const tag = typeof query.tag === 'string' ? query.tag : '';
  let failed = false;
  const articles = await listNews().catch(() => { failed = true; return []; });
  const tags = [...new Set(articles.flatMap(a => a.tags))].sort((a,b) => a.localeCompare(b, 'ja'));
  const filtered = articles.filter(a => (!category || a.category === category) && (!tag || a.tags.includes(tag)));
  const pages = Math.max(1, Math.ceil(filtered.length / 9));
  const page = Math.min(pages, Math.max(1, parseInt(query.page ?? '1', 10) || 1));
  const href = (c = category, t = tag, p = 1) => {
    const params = new URLSearchParams();
    if (c) params.set('category', c);
    if (t) params.set('tag', t);
    if (p > 1) params.set('page', String(p));
    return `/news${params.size ? `?${params}` : ''}`;
  };
  return <><Header /><main className="min-h-screen bg-background px-6 pb-24 pt-28 text-textMain sm:px-10 sm:pt-36">
    <div className="mx-auto max-w-6xl">
      <nav aria-label="パンくずリスト" className="flex items-center gap-4 text-xs text-textLight"><a href="/" className="inline-flex min-h-11 items-center hover:underline">HOME</a><span aria-hidden="true">／</span><span>お知らせ</span></nav>
      <header className="py-10 text-center sm:py-16"><p className="mb-3 font-display text-sm tracking-[0.3em] text-textLight">NEWS</p><h1 className="font-serif text-3xl tracking-[0.25em] sm:text-4xl">お知らせ</h1><p className="mt-5 font-serif text-sm leading-7 text-textLight">HOTEL PGと、島からのお便り。</p></header>
      <nav aria-label="お知らせのジャンル" className="flex flex-wrap justify-center gap-2 border-y border-divider py-5">
        {['', ...NEWS_CATEGORIES].map(c => <a key={c} href={href(c, '')} aria-current={category === c ? 'page' : undefined} className={`inline-flex min-h-11 items-center border px-4 text-sm transition-colors ${category === c ? 'border-textMain bg-textMain text-white' : 'border-transparent text-textLight hover:border-divider hover:text-textMain'}`}>{c || 'すべて'}</a>)}
      </nav>
      {tags.length > 0 && <nav aria-label="タグで絞り込み" className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-textLight"><span>タグで探す</span>{tags.map(t => <a key={t} href={href(category, tag === t ? '' : t)} aria-current={tag === t ? 'page' : undefined} className={`inline-flex min-h-11 items-center hover:underline ${tag === t ? 'font-bold text-textMain underline underline-offset-4' : ''}`}>#{t}</a>)}</nav>}
      <div className="mb-8 mt-8 flex items-center justify-between text-sm text-textLight"><p>{filtered.length}件のお知らせ{tag && ` ／ #${tag}`}</p>{(category || tag) && <a href="/news" className="inline-flex min-h-11 items-center underline underline-offset-4">絞り込みを解除</a>}</div>
      {failed ? <div role="alert" className="py-12 text-center"><p>お知らせを読み込めませんでした。</p><a href={href()} className="mt-4 inline-flex min-h-11 items-center underline">再読み込み</a></div> : filtered.length ? <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice((page - 1) * 9, page * 9).map(article => <NewsCard key={article.id} article={article} />)}</div> : <p className="py-16 text-center font-serif text-textLight">{category || tag ? '該当するお知らせはありません。' : '現在、お知らせはありません。'}</p>}
      {pages > 1 && <nav aria-label="ページ切り替え" className="mt-14 flex justify-center gap-3">{page > 1 && <a href={href(category, tag, page - 1)} className="inline-flex min-h-11 items-center border border-divider px-5">前へ</a>}<span className="inline-flex min-h-11 items-center px-4">{page} / {pages}</span>{page < pages && <a href={href(category, tag, page + 1)} className="inline-flex min-h-11 items-center border border-divider px-5">次へ</a>}</nav>}
    </div>
  </main><Footer /></>;
}
