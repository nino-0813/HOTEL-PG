import type { NewsArticle } from '@/lib/news';
import { formatNewsDate } from '@/lib/news';
import NewsImage from './NewsImage';

export default function NewsCard({ article }: { article: NewsArticle }) {
  return <article>
    <a href={`/news/${article.slug}`} className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-textMain">
      <NewsImage src={article.image} />
      <div className="mt-5 flex flex-wrap items-center gap-3 text-textLight">
        <time dateTime={article.date} className="font-body text-sm tracking-wider">{formatNewsDate(article.date)}</time>
        <span className="border border-divider px-2 py-1 text-xs">{article.category}</span>
      </div>
      <h3 className="mt-3 font-serif text-lg leading-relaxed tracking-wider text-textMain group-hover:underline underline-offset-4">{article.title}</h3>
    </a>
    <div className="mt-3 flex flex-wrap gap-x-3 text-xs text-textLight">
      {article.tags.map(tag => <a key={tag} href={`/news?tag=${encodeURIComponent(tag)}`} className="inline-flex min-h-11 items-center hover:underline">#{tag}</a>)}
      {article.sample && <span className="inline-flex min-h-11 items-center">サンプル</span>}
    </div>
  </article>;
}
