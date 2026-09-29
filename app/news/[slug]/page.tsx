import NewsBody from '@/components/NewsBody';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsImage from '@/components/NewsImage';
import NewsGallery from '@/components/NewsGallery';
import { formatNewsDate } from '@/lib/news';
import { findNews } from '@/lib/news-store';
import { BREAKFAST_GALLERY_IMAGES } from '@/data/news';
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await findNews(slug);
  return { title: article ? article.title : 'お知らせが見つかりません', ...(article?.sample ? { robots: { index: false, follow: false } } : {}) };
}
export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await findNews(slug);
  if (!article) notFound();
  return <><Header /><main className="min-h-screen bg-background px-6 pb-24 pt-28 text-textMain sm:pt-36">
    <article className="mx-auto max-w-3xl">
      <nav aria-label="パンくずリスト" className="mb-12 flex flex-wrap items-center gap-4 text-sm text-textLight"><a href="/" className="inline-flex min-h-11 items-center hover:underline">HOME</a><span aria-hidden="true">→</span><a href="/news" className="inline-flex min-h-11 items-center hover:underline">お知らせ</a></nav>
      <div className="flex flex-wrap items-center gap-4 text-sm text-textLight"><time dateTime={article.date}>{formatNewsDate(article.date)}</time><a href={`/news?category=${encodeURIComponent(article.category)}`} className="underline underline-offset-4">{article.category}</a></div>
      <h1 className="mb-10 mt-5 font-serif text-2xl leading-relaxed tracking-wider sm:text-3xl">{article.title}</h1>
      {article.sample && <p className="mb-8 border-l-2 border-divider pl-4 text-sm text-textLight">ローカル確認用のサンプル記事です。</p>}
      <div className="mb-6 flex flex-wrap gap-4 text-sm text-textLight">{article.tags.map(tag => <a key={tag} href={`/news?tag=${encodeURIComponent(tag)}`} className="inline-flex min-h-11 items-center hover:underline">#{tag}</a>)}</div>
      {article.slug === 'breakfast-price-revision-2026'
        ? <NewsGallery images={BREAKFAST_GALLERY_IMAGES} title={article.title} />
        : <NewsImage src={article.image} sizes="(min-width: 768px) 768px, 100vw" />}
      <div className="py-10"><NewsBody body={article.body} /></div>
      <div className="border-t border-divider pt-8"><a href="/news" className="inline-flex min-h-11 items-center text-sm tracking-widest hover:underline">← お知らせ一覧へ</a></div>
    </article>
  </main><Footer /></>;
}
