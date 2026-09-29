'use client';
import { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import { NEWS_BODY_PREFIX, readNewsBody, safeNewsLink } from '@/lib/news-body';
import NewsBody, { newsBodyClass } from '@/components/NewsBody';

export default function NewsBodyEditor({ value, onChange, disabled }: { value: string; onChange: (body: string) => void; disabled: boolean }) {
  const [preview, setPreview] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [linkError, setLinkError] = useState('');
  const [, redraw] = useState(0);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, code: false, codeBlock: false, link: { openOnClick: false, autolink: false, defaultProtocol: 'https', isAllowedUri: safeNewsLink } }), TextStyle, FontSize],
    content: readNewsBody(value),
    editorProps: { attributes: { class: `${newsBodyClass} min-h-[320px] p-5 sm:p-8 outline-none`, role: 'textbox', 'aria-label': '本文', 'aria-multiline': 'true', 'aria-required': 'true' } },
    onUpdate: ({ editor }) => onChange(NEWS_BODY_PREFIX + JSON.stringify(editor.getJSON())),
    onTransaction: () => redraw(n => n + 1),
  });
  useEffect(() => { editor?.setEditable(!disabled); }, [editor, disabled]);
  // Saving normalizes the JSON. Only replace content when it actually differs, preserving selection while typing.
  useEffect(() => {
    if (editor && NEWS_BODY_PREFIX + JSON.stringify(editor.getJSON()) !== value) {
      const incoming = readNewsBody(value);
      if (JSON.stringify(incoming) !== JSON.stringify(editor.getJSON())) editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [value, editor]);
  if (!editor) return <p className="p-6 text-sm text-gray-500">エディターを準備しています…</p>;
  const button = (label: string, action: () => void, active = false, unavailable = false) => <button key={label} type="button" title={label} aria-pressed={active} disabled={disabled || unavailable} onMouseDown={e => e.preventDefault()} onClick={action} className={`min-h-11 rounded-md border px-3 text-sm disabled:opacity-35 ${active ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-200 bg-white hover:bg-gray-100'}`}>{label}</button>;
  const applyLink = () => {
    if (!safeNewsLink(url.trim())) { setLinkError('https://から始まるURLなどを入力してください。'); return; }
    const href = url.trim();
    if (editor.state.selection.empty && !editor.isActive('link')) editor.chain().focus().insertContent({ type: 'text', text: href, marks: [{ type: 'link', attrs: { href } }] }).run();
    else editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setLinkOpen(false);
  };
  return <div>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><span className="text-sm font-medium">本文（必須）</span><div className="flex gap-2">{button('編集', () => setPreview(false), !preview)}{button('プレビュー', () => setPreview(true), preview)}</div></div>
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-gray-600">
      {!preview && <>
        <div role="toolbar" aria-label="本文の書式" className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3">
          <select aria-label="段落の種類" disabled={disabled} className="min-h-11 max-w-full rounded-md border border-gray-200 bg-white px-2 text-sm" value={editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : 'p'} onChange={e => e.target.value === 'p' ? editor.chain().focus().setParagraph().run() : editor.chain().focus().setHeading({ level: Number(e.target.value) as 2 | 3 }).run()}><option value="p">標準の段落</option><option value="2">大見出し</option><option value="3">小見出し</option></select>
          <select aria-label="文字サイズ" disabled={disabled} className="min-h-11 rounded-md border border-gray-200 bg-white px-2 text-sm" value={editor.getAttributes('textStyle').fontSize || ''} onChange={e => e.target.value ? editor.chain().focus().setFontSize(e.target.value).run() : editor.chain().focus().unsetFontSize().run()}><option value="">標準サイズ</option><option value="14px">小（14）</option><option value="16px">通常（16）</option><option value="20px">中（20）</option><option value="24px">大（24）</option><option value="32px">特大（32）</option></select>
          {button('太字', () => { editor.chain().focus().toggleBold().run(); }, editor.isActive('bold'))}
          {button('斜体', () => { editor.chain().focus().toggleItalic().run(); }, editor.isActive('italic'))}
          {button('下線', () => { editor.chain().focus().toggleUnderline().run(); }, editor.isActive('underline'))}
          {button('取消線', () => { editor.chain().focus().toggleStrike().run(); }, editor.isActive('strike'))}
          {button('リンク', () => { setUrl(editor.getAttributes('link').href || ''); setLinkError(''); setLinkOpen(true); }, editor.isActive('link'))}
          {button('箇条書き', () => { editor.chain().focus().toggleBulletList().run(); }, editor.isActive('bulletList'))}
          {button('番号付き', () => { editor.chain().focus().toggleOrderedList().run(); }, editor.isActive('orderedList'))}
          {button('引用', () => { editor.chain().focus().toggleBlockquote().run(); }, editor.isActive('blockquote'))}
          {button('区切り線', () => { editor.chain().focus().setHorizontalRule().run(); })}
          {button('書式を解除', () => { editor.chain().focus().unsetAllMarks().clearNodes().run(); })}
          {button('元に戻す', () => { editor.chain().focus().undo().run(); }, false, !editor.can().undo())}
          {button('やり直す', () => { editor.chain().focus().redo().run(); }, false, !editor.can().redo())}
        </div>
        {linkOpen && <div className="border-b border-gray-200 bg-gray-50 p-4"><label className="block text-sm">リンク先URL<input autoFocus type="text" value={url} disabled={disabled} onChange={e => setUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyLink(); } if (e.key === 'Escape') { e.preventDefault(); setLinkOpen(false); editor.commands.focus(); } }} placeholder="https://example.com" className="mt-2 w-full rounded-md border border-gray-300 px-3 py-3 text-base" /></label>{linkError && <p role="alert" className="mt-2 text-sm text-red-700">{linkError}</p>}<div className="mt-3 flex flex-wrap gap-2">{button('リンクを適用', applyLink)}{button('リンクを解除', () => { editor.chain().focus().extendMarkRange('link').unsetLink().run(); setLinkOpen(false); })}{button('閉じる', () => { setLinkOpen(false); editor.commands.focus(); })}</div></div>}
      </>}
      <div hidden={preview}><EditorContent editor={editor} /></div>
      {preview && <div className="min-h-[320px] p-5 sm:p-8"><NewsBody body={value} /></div>}
      <div className="border-t border-gray-100 px-4 py-3 text-right text-xs text-gray-500">{editor.getText().length.toLocaleString()} / 30,000文字</div>
    </div>
    <p className="mt-3 text-xs leading-6 text-gray-500">文字を選択して書式やリンクを設定できます。Enterで段落、Shift＋Enterで改行。プレビューで公開時の見え方を確認できます。</p>
  </div>;
}
