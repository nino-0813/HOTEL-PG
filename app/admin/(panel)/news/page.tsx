'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Plus, Save, ArrowLeft, ExternalLink, Upload } from 'lucide-react';
import { NEWS_CATEGORIES, type NewsArticle, type NewsInput, formatNewsDate } from '@/lib/news';
import NewsImage from '@/components/NewsImage';
import NewsBodyEditor from '@/components/admin/NewsBodyEditor';

const field = 'mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-textMain focus:border-textMain focus:outline-none focus:ring-1 focus:ring-textMain';
const emptyArticle = (): NewsInput => ({ title: '', slug: '', date: new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date()), category: 'お知らせ', tags: [], image: '', body: '', published: false });

type Draft = NewsInput & { id?: string; updatedAt?: string; sample?: boolean };
async function compressImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('JPEG・PNG・WebP画像を選んでください。');
  if (file.size > 10 * 1024 * 1024) throw new Error('画像は10MB以下にしてください。');
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 1400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('画像を処理できませんでした。');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const result = canvas.toDataURL('image/jpeg', 0.8);
    if (result.length > 900000) throw new Error('画像が大きすぎます。小さな画像で再度お試しください。');
    return result;
  } finally { bitmap.close(); }
}

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [filter, setFilter] = useState('すべて');
  const heading = useRef<HTMLHeadingElement>(null);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/news', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setArticles(json.articles); setLocal(json.local);
    } catch (e) { setError(e instanceof Error ? e.message : '読み込みに失敗しました。'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!dirty) return;
    const guard = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    const navigate = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.target !== '_blank' && !window.confirm('保存していない変更があります。移動しますか？')) e.preventDefault();
    };
    window.addEventListener('beforeunload', guard); document.addEventListener('click', navigate, true);
    return () => { window.removeEventListener('beforeunload', guard); document.removeEventListener('click', navigate, true); };
  }, [dirty]);
  const open = (article?: NewsArticle) => {
    if (dirty && !window.confirm('保存していない変更を破棄しますか？')) return;
    setDraft(article ? { ...article } : emptyArticle()); setTags(article?.tags.join(', ') ?? ''); setDirty(false); setMessage(''); setError('');
    requestAnimationFrame(() => heading.current?.focus());
  };
  const change = <K extends keyof Draft>(key: K, value: Draft[K]) => { setDraft(d => d && { ...d, [key]: value }); setDirty(true); setMessage(''); };
  const back = () => { if (!dirty || window.confirm('保存していない変更を破棄しますか？')) { setDraft(null); setDirty(false); setError(''); setMessage(''); } };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); if (!draft || saving || uploading) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...draft, tags: tags.split(/[,、\n]/).map(t => t.trim().replace(/^#/, '')).filter(Boolean) }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      const article = json.article as NewsArticle;
      setDraft(article); setTags(article.tags.join(', ')); setDirty(false);
      setArticles(rows => [article, ...rows.filter(a => a.id !== article.id)]);
      setMessage(article.published ? '公開しました。トップとお知らせ一覧に反映されています。' : '下書きを保存しました。公開ページには表示されません。');
    } catch (e) { setError(e instanceof Error ? e.message : '保存に失敗しました。'); }
    finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-5xl">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div><p className="mb-2 text-xs tracking-widest text-gray-500">NEWS MANAGEMENT</p><h1 ref={heading} tabIndex={-1} className="font-serif text-2xl focus:outline-none">{draft ? draft.id ? 'お知らせを編集' : '新しいお知らせ' : 'お知らせ'}</h1></div>
      {draft ? <button type="button" onClick={back} disabled={saving || uploading} className="inline-flex min-h-11 items-center gap-2 px-3 text-sm hover:underline"><ArrowLeft size={18} />管理一覧へ</button> : <button type="button" disabled={loading || !!error} onClick={() => open()} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-textMain px-5 text-sm text-white disabled:opacity-40"><Plus size={18} />お知らせを作成</button>}
    </div>
    {local && <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">ローカル確認モードです。このパソコンに保存され、本番サイトには反映されません。サンプル記事は実際の告知ではありません。</p>}
    {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}{!draft && <button type="button" onClick={() => void load()} className="ml-4 min-h-11 underline">再読み込み</button>}</div>}
    {message && <p role="status" className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">{message}</p>}
    {draft ? <form onSubmit={save}>
      <fieldset disabled={saving || uploading} className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-8 disabled:opacity-70">
        <label className="block text-sm font-medium">タイトル（必須）<input required maxLength={120} className={field} value={draft.title} onChange={e => change('title', e.target.value)} /></label>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block text-sm font-medium">日付（必須）<input type="date" required className={field} value={draft.date} onChange={e => change('date', e.target.value)} /><span className="mt-2 block text-xs font-normal text-gray-500">表示・並び順に使用します。予約投稿ではありません。</span></label>
          <label className="block text-sm font-medium">ジャンル<select className={field} value={draft.category} onChange={e => change('category', e.target.value as NewsInput['category'])}>{NEWS_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></label>
        </div>
        <label className="block text-sm font-medium">タグ<input className={field} value={tags} placeholder="例：因島, サイクリング, 秋の旅" onChange={e => { setTags(e.target.value); setDirty(true); }} /><span className="mt-2 block text-xs font-normal text-gray-500">カンマで区切って8個まで。1個24文字以内。一覧での絞り込みに使います。</span></label>
        <label className="block text-sm font-medium">記事URL（必須）<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} className={field} value={draft.slug} placeholder="例：autumn-cycling-2026" onChange={e => change('slug', e.target.value)} /><span className="mt-2 block text-xs font-normal text-gray-500">/news/{draft.slug || '記事のURL'}　公開後の変更は以前のリンクが使えなくなるためご注意ください。</span></label>
        <div><p className="text-sm font-medium">見出し画像</p><p className="mt-2 text-xs leading-6 text-gray-500">JPEG・PNG・WebP（10MBまで）。適切なサイズへ自動縮小します。未設定の場合はホテル名を表示します。</p>
          <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm"><Upload size={16} />画像を選択<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={async e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; setUploading(true); setError(''); try { change('image', await compressImage(file)); } catch (error) { setError(error instanceof Error ? error.message : '画像を読み込めません。'); } finally { setUploading(false); } }} /></label>
          <label className="mt-4 block text-sm">または画像URL<input type="text" className={field} value={draft.image.startsWith('data:') ? '' : draft.image} placeholder="https://... または /images/..." onChange={e => change('image', e.target.value)} /></label>
          <div className="mt-4 max-w-sm"><NewsImage src={draft.image} /></div>
          {draft.image && <button type="button" onClick={() => change('image', '')} className="mt-2 min-h-11 px-2 text-sm underline">画像を外す</button>}
        </div>
        <NewsBodyEditor key={draft.id ?? 'new'} value={draft.body} onChange={body => change('body', body)} disabled={saving || uploading} />
        <label className="flex min-h-12 items-start gap-3 rounded-lg bg-gray-50 p-4"><input type="checkbox" className="mt-1 h-5 w-5" checked={draft.published} onChange={e => change('published', e.target.checked)} /><span className="text-sm leading-6">公開する<span className="block text-xs text-gray-500">チェックを外して保存すると下書きに戻り、公開ページから非表示になります。</span></span></label>
      </fieldset>
      <div className="sticky bottom-0 mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50/95 py-4">
        <span className="text-xs text-gray-500">{dirty ? '未保存の変更があります' : draft.id ? '保存済み' : '新規記事'}</span>
        <div className="flex flex-wrap gap-3">{draft.id && !dirty && draft.published && <a target="_blank" rel="noopener noreferrer" href={`/news/${draft.slug}`} className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-gray-300 px-4 text-sm">公開ページ <ExternalLink size={16} /></a>}<button disabled={saving || uploading} className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-textMain px-6 text-sm text-white disabled:opacity-50"><Save size={18} />{uploading ? '画像を処理中…' : saving ? '保存中…' : draft.published ? '保存して公開' : '下書きを保存'}</button></div>
      </div>
    </form> : <>
      <div className="mb-5 flex flex-wrap gap-2">{['すべて', '公開中', '下書き'].map(f => <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`min-h-11 rounded-lg border px-4 text-sm ${filter === f ? 'border-textMain bg-textMain text-white' : 'border-gray-200 bg-white'}`}>{f}</button>)}</div>
      {loading ? <p role="status" className="py-12 text-center text-gray-500">読み込み中…</p> : <div className="space-y-3">{articles.filter(a => filter === 'すべて' || (filter === '公開中' ? a.published : !a.published)).map(a => <button key={a.id} type="button" onClick={() => open(a)} className="block w-full rounded-xl border border-gray-200 bg-white p-5 text-left transition-colors hover:border-gray-500"><div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500"><span className={`rounded px-2 py-1 ${a.published ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{a.published ? '公開中' : '下書き'}</span><time dateTime={a.date}>{formatNewsDate(a.date)}</time><span>{a.category}</span>{a.sample && <span>サンプル</span>}</div><h2 className="font-serif text-lg">{a.title}</h2><p className="mt-3 text-xs text-gray-500">{a.tags.map(t => `#${t}`).join('　')}</p></button>)}{!articles.some(a => filter === 'すべて' || (filter === '公開中' ? a.published : !a.published)) && <p className="py-12 text-center text-gray-500">お知らせはまだありません。</p>}</div>}
    </>}
  </div>;
}
