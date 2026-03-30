'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Block, BlockType, BlogArticle, BlogPost } from '@/types';
import { uploadBlogImage, fileToDataUrl } from '@/lib/upload';
import * as blogSupabase from '@/lib/blog-supabase';
import { fetchEmbedData } from '@/lib/embed-ogp';
import { useCms } from '@/context/CmsContext';
import {
  Save, ArrowLeft, Plus, Trash2, Type, Heading1, Heading2, Image as ImageIcon,
  List, ListOrdered, Quote, Code, Minus, Link as LinkIcon, ChevronDown, ChevronUp, Eye, Edit3, Upload,
} from 'lucide-react';

const blockId = () => `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

function createBlock(type: BlockType): Block {
  const base: Block = { id: blockId(), type };
  switch (type) {
    case 'paragraph': case 'quote': case 'code': return { ...base, content: '' };
    case 'heading1': case 'heading2': return { ...base, content: '', textAlign: 'left' };
    case 'image': return { ...base, imageUrl: '' };
    case 'bulletList': case 'numberedList': return { ...base, listItems: [''] };
    case 'divider': return base;
    case 'embed': return { ...base, embedData: { url: '' } };
    default: return { ...base, content: '' };
  }
}

const slugify = (s: string) => s.replace(/\s+/g, '-').replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff-]/g, '').toLowerCase() || 'post';

const emptyPost = (): BlogPost => ({
  id: '', title: '', excerpt: '', content: '', date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
  author: 'HOTEL PG', category: 'お知らせ', slug: '', tags: [],
});

function insertAtCursor(ref: React.RefObject<HTMLTextAreaElement | null>, setContent: (fn: (prev: string) => string) => void, before: string, after: string, placeholder?: string) {
  const ta = ref.current;
  if (!ta) return;
  const value = ta.value, start = ta.selectionStart, end = ta.selectionEnd, selected = value.slice(start, end);
  const text = placeholder ?? (selected || 'テキスト'), inserted = `${before}${text}${after}`;
  const next = value.slice(0, start) + inserted + value.slice(end);
  setContent(() => next);
  setTimeout(() => { ta.focus(); ta.setSelectionRange(start + inserted.length, start + inserted.length); }, 0);
}

const BLOCK_MENU: { type: BlockType; label: string; icon: React.ReactNode }[] = [
  { type: 'paragraph', label: '段落', icon: <Type size={14} /> }, { type: 'heading1', label: '見出し1', icon: <Heading1 size={14} /> },
  { type: 'heading2', label: '見出し2', icon: <Heading2 size={14} /> }, { type: 'image', label: '画像', icon: <ImageIcon size={14} /> },
  { type: 'bulletList', label: '箇条書き', icon: <List size={14} /> }, { type: 'numberedList', label: '番号付きリスト', icon: <ListOrdered size={14} /> },
  { type: 'quote', label: '引用', icon: <Quote size={14} /> }, { type: 'code', label: 'コード', icon: <Code size={14} /> },
  { type: 'divider', label: '区切り線', icon: <Minus size={14} /> }, { type: 'embed', label: '埋め込み', icon: <LinkIcon size={14} /> },
];

export default function AdminBlogEditor() {
  const params = useParams<{ id?: string }>(), id = params?.id, pathname = usePathname(), router = useRouter();
  const isNew = pathname === '/admin/blog/new' || id === 'new' || !id;
  const [, setArticle] = useState<BlogArticle | null>(null);
  const [title, setTitle] = useState(''), [excerpt, setExcerpt] = useState(''), [imageUrl, setImageUrl] = useState(''), [slug, setSlug] = useState(''), [noteUrl, setNoteUrl] = useState('');
  const [publishedAt, setPublishedAt] = useState(''), [isPublished, setIsPublished] = useState(false), [blocks, setBlocks] = useState<Block[]>([]);
  const [saving, setSaving] = useState(false), [uploading, setUploading] = useState(false), [loadError, setLoadError] = useState<string | null>(null);
  const [metaOpen, setMetaOpen] = useState(false), [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null), [pendingImageBlockIndex, setPendingImageBlockIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null), featuredImageInputRef = useRef<HTMLInputElement>(null), bodyRef = useRef<HTMLTextAreaElement>(null);
  const configured = blogSupabase.isSupabaseConfigured(), cms = useCms();
  const [markdownForm, setMarkdownForm] = useState<BlogPost>(emptyPost()), [markdownViewMode, setMarkdownViewMode] = useState<'edit' | 'preview'>('edit'), [markdownUploading, setMarkdownUploading] = useState(false), [markdownMetaOpen, setMarkdownMetaOpen] = useState(false);

  useEffect(() => {
    if (!configured) return;
    if (isNew) { setBlocks([createBlock('paragraph')]); setTitle(''); setExcerpt(''); setImageUrl(''); setSlug(''); setNoteUrl(''); setPublishedAt(''); setIsPublished(false); setArticle(null); setLoadError(null); return; }
    if (!id) return;
    let cancelled = false;
    blogSupabase.getBlogArticleById(id).then((a) => {
      if (cancelled) return;
      if (!a) { setLoadError('記事が見つかりません'); return; }
      setArticle(a); setTitle(a.title); setExcerpt(a.excerpt ?? ''); setImageUrl(a.image_url ?? ''); setSlug(a.slug ?? ''); setNoteUrl(a.note_url ?? '');
      setPublishedAt(a.published_at ? a.published_at.slice(0, 16) : ''); setIsPublished(a.is_published);
      try { const parsed = JSON.parse(a.content || '[]'); setBlocks(Array.isArray(parsed) && parsed.length > 0 ? parsed : [createBlock('paragraph')]); } catch { setBlocks([createBlock('paragraph')]); }
      setLoadError(null);
    });
    return () => { cancelled = true; };
  }, [configured, isNew, id]);

  const insertBlockAfter = useCallback((index: number, type: BlockType) => { setBlocks((prev) => [...prev.slice(0, index + 1), createBlock(type), ...prev.slice(index + 1)]); setMenuOpenIndex(null); }, []);
  const deleteBlock = useCallback((index: number) => { setBlocks((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index))); setMenuOpenIndex(null); }, []);
  const updateBlock = useCallback((index: number, patch: Partial<Block>) => { setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b))); }, []);
  const goBack = () => router.push('/admin/blog');

  const handleSave = async () => {
    if (!configured || !title.trim() || blocks.length === 0) return;
    const content = JSON.stringify(blocks), slugVal = slug.trim() || slugify(title);
    const payload = { title: title.trim(), content, excerpt: excerpt.trim() || null, image_url: imageUrl.trim() || null, note_url: noteUrl.trim() || null, published_at: publishedAt ? new Date(publishedAt).toISOString() : null, is_published: isPublished, slug: slugVal };
    setSaving(true);
    if (isNew) { const created = await blogSupabase.createBlogArticle(payload); setSaving(false); if (created) goBack(); }
    else if (id) { const updated = await blogSupabase.updateBlogArticle(id, payload); setSaving(false); if (updated) goBack(); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = ''; const idx = pendingImageBlockIndex; setPendingImageBlockIndex(null);
    if (!file?.type.startsWith('image/') || idx == null) return;
    setUploading(true);
    try { let url = await uploadBlogImage(file); if (!url) url = await fileToDataUrl(file); if (url) updateBlock(idx, { imageUrl: url }); else alert('画像のアップロードに失敗しました。'); }
    catch (err) { console.error(err); alert('画像のアップロード中にエラーが発生しました。'); }
    finally { setUploading(false); }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = '';
    if (!file?.type.startsWith('image/')) return;
    setUploading(true);
    try { let url = await uploadBlogImage(file); if (!url || !url.includes('http')) url = await fileToDataUrl(file); if (url) setImageUrl(url); else alert('画像のアップロードに失敗しました。'); }
    catch (err) { console.error(err); alert('画像のアップロード中にエラーが発生しました。'); }
    finally { setUploading(false); }
  };

  const handleEmbedFetch = async (blockIndex: number, url: string) => { if (!url.trim()) return; const data = await fetchEmbedData(url.trim()); if (data) updateBlock(blockIndex, { embedData: data }); };

  useEffect(() => {
    if (configured) return;
    if (isNew) { setMarkdownForm(emptyPost()); return; }
    if (!id) return;
    const post = cms.blogPosts.find((p) => p.id === id);
    if (post) setMarkdownForm({ ...post }); else if (cms.blogPosts.length > 0) router.replace('/admin/blog');
  }, [configured, isNew, id, cms.blogPosts, router]);

  const setMarkdownContent = useCallback((fn: (prev: string) => string) => setMarkdownForm((f) => ({ ...f, content: fn(f.content) })), []);

  const handleMarkdownSave = async () => {
    if (!markdownForm.title.trim()) return;
    const slugVal = markdownForm.slug.trim() || slugify(markdownForm.title), next = { ...markdownForm, slug: slugVal };
    const nextPosts = isNew ? [{ ...next, id: String(Math.max(0, ...cms.blogPosts.map((p) => parseInt(p.id, 10) || 0)) + 1) }, ...cms.blogPosts] : cms.blogPosts.map((p) => (p.id === markdownForm.id ? next : p));
    cms.setBlogPosts(nextPosts); setSaving(true); await cms.save({ blogPosts: nextPosts }); setSaving(false); goBack();
  };

  const handleMarkdownImageUpload = () => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/*';
    input.onchange = async (ev) => {
      const file = (ev.target as HTMLInputElement).files?.[0]; if (!file || !file.type.startsWith('image/')) return;
      setMarkdownUploading(true);
      try { if (blogSupabase.isSupabaseConfigured()) { const url = await uploadBlogImage(file); if (url) insertAtCursor(bodyRef, setMarkdownContent, '\n\n![', `](${url})\n\n`, '代替テキスト'); } else { const dataUrl = await fileToDataUrl(file); insertAtCursor(bodyRef, setMarkdownContent, '\n\n![', `](${dataUrl})\n\n`, '代替テキスト'); } }
      finally { setMarkdownUploading(false); }
    };
    input.click();
  };

  if (!configured) return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-4rem)]">
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3"><button onClick={goBack} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" aria-label="一覧に戻る"><ArrowLeft size={18} /></button><h2 className="font-display text-lg text-textMain">{isNew ? '新規記事の作成' : '記事を編集'}</h2></div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 max-w-5xl mx-auto space-y-6">
        <input value={markdownForm.title} onChange={(e) => setMarkdownForm((f) => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))} className="w-full border-0 border-b border-gray-200 rounded-none px-0 py-3 text-2xl font-display font-light text-textMain placeholder:text-gray-300 focus:ring-0 focus:border-textMain" placeholder="記事のタイトル" />
        <textarea value={markdownForm.excerpt} onChange={(e) => setMarkdownForm((f) => ({ ...f, excerpt: e.target.value }))} className="w-full border-0 border-b border-gray-100 rounded-none px-0 py-2 text-sm text-gray-500 placeholder:text-gray-300 focus:ring-0 focus:border-gray-300 resize-none" placeholder="リード文・抜粋" rows={2} />
        <div><div className="flex items-center justify-between gap-2 mb-3"><div className="flex flex-wrap items-center gap-1"><span className="text-xs text-gray-400 mr-2">Markdown:</span>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '\n\n## ', '\n\n', '見出し2')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" title="見出し2"><Type size={16} /></button>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '\n\n### ', '\n\n', '見出し3')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg text-sm font-bold" title="見出し3">H3</button>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '**', '**')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" title="太字"><Type size={16} className="font-bold" /></button>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '*', '*')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" title="斜体"><Type size={16} className="italic" /></button>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '\n\n- ', '\n- ', '項目')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" title="リスト"><List size={16} /></button>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '\n\n> ', '\n\n', '引用')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" title="引用"><Quote size={16} /></button>
          <button type="button" onClick={() => insertAtCursor(bodyRef, setMarkdownContent, '[', '](URL)', 'リンクテキスト')} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" title="リンク"><LinkIcon size={16} /></button>
          <button type="button" onClick={handleMarkdownImageUpload} disabled={markdownUploading} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg disabled:opacity-50" title="画像を挿入"><ImageIcon size={16} /></button></div>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden"><button type="button" onClick={() => setMarkdownViewMode('edit')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${markdownViewMode === 'edit' ? 'bg-gray-100 text-textMain' : 'text-gray-500 hover:bg-gray-50'}`}><Edit3 size={12} />編集</button><button type="button" onClick={() => setMarkdownViewMode('preview')} className={`px-3 py-1.5 text-xs flex items-center gap-1 ${markdownViewMode === 'preview' ? 'bg-gray-100 text-textMain' : 'text-gray-500 hover:bg-gray-50'}`}><Eye size={12} />プレビュー</button></div></div>
        {markdownViewMode === 'edit' ? <textarea ref={bodyRef} value={markdownForm.content} onChange={(e) => setMarkdownForm((f) => ({ ...f, content: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-4 text-sm font-mono text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 resize-y min-h-[320px] leading-relaxed" placeholder={'本文を Markdown で入力。'} rows={16} /> : <div className="border border-gray-200 rounded-xl bg-gray-50/50 px-4 py-6 min-h-[320px]"><div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-textMain prose-p:font-serif prose-p:text-textLight prose-p:leading-relaxed prose-a:text-textMain prose-a:underline"><ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownForm.content.trim() || '_（本文がありません）_'}</ReactMarkdown></div></div>}</div>
        <div className="border-t border-gray-100 pt-4"><button type="button" onClick={() => setMarkdownMetaOpen(!markdownMetaOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-textMain">{markdownMetaOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}記事の設定</button>
        {markdownMetaOpen && <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-xs text-gray-500 mb-1">URLスラッグ</label><input value={markdownForm.slug} onChange={(e) => setMarkdownForm((f) => ({ ...f, slug: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" placeholder="example-post" /></div><div><label className="block text-xs text-gray-500 mb-1">日付</label><input value={markdownForm.date} onChange={(e) => setMarkdownForm((f) => ({ ...f, date: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="2025.01.15" /></div><div><label className="block text-xs text-gray-500 mb-1">カテゴリ</label><input value={markdownForm.category} onChange={(e) => setMarkdownForm((f) => ({ ...f, category: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="お知らせ" /></div></div><div><label className="block text-xs text-gray-500 mb-1">アイキャッチ画像</label><input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; e.target.value = ''; if (!file?.type.startsWith('image/')) return; setMarkdownUploading(true); try { if (blogSupabase.isSupabaseConfigured()) { const url = await uploadBlogImage(file); if (url) setMarkdownForm((f) => ({ ...f, image: url })); } else { const dataUrl = await fileToDataUrl(file); setMarkdownForm((f) => ({ ...f, image: dataUrl })); } } finally { setMarkdownUploading(false); } }} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={markdownUploading} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-textMain hover:bg-gray-50 disabled:opacity-60">{markdownUploading ? 'アップロード中…' : <><Upload size={14} /> ファイルを選択</>}</button>{markdownForm.image && <><div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 inline-block mr-2"><img src={markdownForm.image} alt="" className="w-full h-full object-cover" /></div><button type="button" onClick={() => setMarkdownForm((f) => ({ ...f, image: undefined }))} className="text-xs text-gray-500 hover:text-red-600">削除</button></>}<input value={markdownForm.image ?? ''} onChange={(e) => setMarkdownForm((f) => ({ ...f, image: e.target.value || undefined }))} className="mt-2 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" placeholder="または画像URLを直接入力" /></div><div><label className="block text-xs text-gray-500 mb-1">タグ（カンマ区切り）</label><input value={Array.isArray(markdownForm.tags) ? markdownForm.tags.join(', ') : ''} onChange={(e) => setMarkdownForm((f) => ({ ...f, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="因島, 瀬戸内" /></div></div>}</div>
      </div>
      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 flex gap-2 justify-end shrink-0 bg-gray-50/80"><button onClick={goBack} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">キャンセル</button><button onClick={handleMarkdownSave} disabled={saving || !markdownForm.title.trim()} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333] disabled:opacity-50 disabled:pointer-events-none"><Save size={16} />{saving ? '保存中…' : '保存'}</button></div>
    </div>
  );

  if (loadError && !isNew) return <div className="bg-white rounded-xl border border-gray-200 p-8 text-center"><p className="text-gray-600 mb-4">{loadError}</p><button onClick={goBack} className="px-4 py-2 bg-gray-100 rounded-lg text-sm text-textMain hover:bg-gray-200">一覧に戻る</button></div>;

  return (
    <div className="flex flex-col max-h-[calc(100vh-4rem)]">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /><input ref={featuredImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleFeaturedImageUpload} />
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex items-center justify-between shrink-0"><div className="flex items-center gap-3"><button onClick={goBack} className="p-2 text-gray-500 hover:text-textMain hover:bg-gray-100 rounded-lg" aria-label="一覧に戻る"><ArrowLeft size={18} /></button><h2 className="font-display text-lg text-textMain">{isNew ? '新規記事の作成' : '記事を編集'}</h2></div></div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 max-w-5xl mx-auto space-y-6">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onBlur={(e) => !slug && setSlug(slugify(e.target.value))} className="w-full border-0 border-b border-gray-200 rounded-none px-0 py-3 text-2xl font-display font-light text-textMain placeholder:text-gray-300 focus:ring-0 focus:border-textMain" placeholder="記事のタイトル" />
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full border-0 border-b border-gray-100 rounded-none px-0 py-2 text-sm text-gray-500 placeholder:text-gray-300 focus:ring-0 focus:border-gray-300 resize-none" placeholder="リード文・抜粋" rows={2} />
        <div className="space-y-2">{blocks.map((block, idx) => (
          <div key={block.id} className="group flex gap-2 items-start"><div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100"><div className="relative"><button type="button" onClick={() => setMenuOpenIndex(menuOpenIndex === idx ? null : idx)} className="p-1.5 text-gray-400 hover:text-textMain hover:bg-gray-100 rounded" title="ブロックを追加"><Plus size={16} /></button>{menuOpenIndex === idx && <div className="absolute left-0 top-full mt-1 py-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10 min-w-[180px] max-h-[400px] overflow-y-auto">{BLOCK_MENU.map(({ type: t, label, icon }) => <button key={t} type="button" onClick={() => insertBlockAfter(idx, t)} className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-textMain flex items-center gap-2.5"><span className="text-gray-400 flex-shrink-0">{icon}</span><span>{label}</span></button>)}</div>}</div>{blocks.length > 1 && <button type="button" onClick={() => deleteBlock(idx)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="削除"><Trash2 size={14} /></button>}</div><div className="flex-1 min-w-0 border border-gray-100 rounded-lg p-2 focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-200">
          {block.type === 'paragraph' && <textarea value={block.content ?? ''} onChange={(e) => updateBlock(idx, { content: e.target.value })} className="w-full text-sm resize-none border-0 focus:ring-0 p-1" placeholder="本文を入力..." rows={2} />}
          {(block.type === 'heading1' || block.type === 'heading2') && (
            <div className="space-y-1">
              <input value={block.content ?? ''} onChange={(e) => updateBlock(idx, { content: e.target.value })} className="w-full text-base font-medium border-0 focus:ring-0 p-1" placeholder={block.type === 'heading1' ? '見出し1' : '見出し2'} />
              <select value={block.textAlign ?? 'left'} onChange={(e) => updateBlock(idx, { textAlign: (e.target.value as 'left' | 'center' | 'right') })} className="text-xs text-gray-500">
                <option value="left">左</option><option value="center">中央</option><option value="right">右</option>
              </select>
            </div>
          )}
          {block.type === 'image' && <div className="space-y-2"><button type="button" onClick={() => { setPendingImageBlockIndex(idx); fileInputRef.current?.click(); }} disabled={uploading} className="text-sm text-gray-500 hover:text-textMain border border-dashed border-gray-200 rounded px-2 py-1">{uploading ? 'アップロード中...' : '画像を選択'}</button>{block.imageUrl && <img src={block.imageUrl} alt="" className="max-h-32 rounded object-cover" />}</div>}
          {(block.type === 'bulletList' || block.type === 'numberedList') && <div className="space-y-1">{(block.listItems ?? ['']).map((item, i) => <div key={i} className="flex gap-1"><span className="text-gray-400 text-sm">{block.type === 'numberedList' ? `${i + 1}.` : '•'}</span><input value={item} onChange={(e) => updateBlock(idx, { listItems: (block.listItems ?? ['']).map((it, j) => (j === i ? e.target.value : it)) })} className="flex-1 text-sm border-0 focus:ring-0 p-1" /></div>)}<button type="button" onClick={() => updateBlock(idx, { listItems: [...(block.listItems ?? ['']), ''] })} className="text-xs text-gray-500 hover:text-textMain">+ 項目を追加</button></div>}
          {block.type === 'quote' && <textarea value={block.content ?? ''} onChange={(e) => updateBlock(idx, { content: e.target.value })} className="w-full text-sm resize-none border-0 focus:ring-0 p-1 italic" placeholder="引用文" rows={2} />}
          {block.type === 'code' && <textarea value={block.content ?? ''} onChange={(e) => updateBlock(idx, { content: e.target.value })} className="w-full text-sm font-mono resize-none border-0 focus:ring-0 p-1 bg-gray-50 rounded" placeholder="コード" rows={4} />}
          {block.type === 'divider' && <div className="border-t border-gray-200 my-2" />}
          {block.type === 'embed' && <div className="space-y-2 text-sm"><input type="url" value={block.embedData?.url ?? ''} onChange={(e) => updateBlock(idx, { embedData: { ...block.embedData, url: e.target.value } })} placeholder="https://..." className="w-full border border-gray-200 rounded px-2 py-1" /><button type="button" onClick={() => handleEmbedFetch(idx, block.embedData?.url ?? '')} className="text-gray-500 hover:text-textMain">URL から情報を取得</button>{block.embedData?.title && <div className="border rounded p-2 bg-gray-50"><p className="font-medium">{block.embedData.title}</p>{block.embedData.description && <p className="text-xs text-gray-500 line-clamp-1">{block.embedData.description}</p>}{block.embedData?.image && <img src={block.embedData.image} alt="" className="mt-1 max-h-20 rounded object-cover" />}</div>}</div>}
        </div></div>))}</div>
        <div className="border-t border-gray-100 pt-4"><button type="button" onClick={() => setMetaOpen(!metaOpen)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-textMain">{metaOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}記事の設定</button>{metaOpen && <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100"><div><label className="block text-xs text-gray-500 mb-1">URLスラッグ</label><input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" placeholder="example-post" /></div><div><label className="block text-xs text-gray-500 mb-1">アイキャッチ画像</label><div className="flex flex-wrap items-center gap-2 mb-2"><button type="button" onClick={() => featuredImageInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-textMain hover:bg-gray-50 disabled:opacity-60">{uploading ? 'アップロード中...' : <><Upload size={14} /> ファイルを選択</>}</button>{imageUrl && <><div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"><img src={imageUrl} alt="" className="w-full h-full object-cover" /></div><button type="button" onClick={() => setImageUrl('')} className="text-xs text-gray-500 hover:text-red-600">削除</button></>}</div><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono" placeholder="または画像URLを直接入力" /></div><div><label className="block text-xs text-gray-500 mb-1">公開日時</label><input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" /></div><div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} /><span className="text-sm">公開する</span></label></div><div><label className="block text-xs text-gray-500 mb-1">note URL（任意）</label><input value={noteUrl} onChange={(e) => setNoteUrl(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" placeholder="https://note.com/..." /></div></div>}</div>
      </div>
      <div className="px-4 sm:px-6 py-3 border-t border-gray-100 flex gap-2 justify-end shrink-0 bg-gray-50/80"><button onClick={goBack} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">キャンセル</button><button onClick={handleSave} disabled={saving || !title.trim()} className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333] disabled:opacity-50 disabled:pointer-events-none"><Save size={16} />{saving ? '保存中…' : '保存'}</button></div>
    </div>
  );
}
