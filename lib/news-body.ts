// Structured rich text lives in the existing body column; older plain text remains readable.
export const NEWS_BODY_PREFIX = 'hotel-pg-richtext-v1:';
export const FONT_SIZES = ['14px', '16px', '20px', '24px', '32px'];
export type BodyNode = { type: string; text?: string; attrs?: Record<string, unknown>; marks?: BodyNode[]; content?: BodyNode[] };
export function safeNewsLink(value: unknown): value is string {
  if (typeof value !== 'string' || /[\s\\\u0000-\u001f]/.test(value)) return false;
  return /^(https?:\/\/[^/]+|mailto:[^@]+@[^@]+|tel:\+?[\d-]+|\/(?!\/)[^\s]*|#[^\s]+)$/i.test(value) || /^https?:\/\/[^/]+\//i.test(value);
}
export function readNewsBody(body: string): BodyNode {
  if (!body.startsWith(NEWS_BODY_PREFIX)) return { type: 'doc', content: body.split(/\n\s*\n/).map(p => ({ type: 'paragraph', content: p.split('\n').flatMap((line, i) => [...(i ? [{ type: 'hardBreak' }] : []), ...(line ? [{ type: 'text', text: line }] : [])]) })) };
  const raw = JSON.parse(body.slice(NEWS_BODY_PREFIX.length));
  let count = 0;
  function clean(n: BodyNode, depth = 0, mark = false): BodyNode {
    if (!n || typeof n !== 'object' || ++count > 12000 || depth > 30) throw new Error('本文の構造を確認してください。');
    const types = mark ? ['bold', 'italic', 'underline', 'strike', 'link', 'textStyle'] : ['doc', 'paragraph', 'heading', 'text', 'hardBreak', 'horizontalRule', 'bulletList', 'orderedList', 'listItem', 'blockquote'];
    if (!types.includes(n.type)) throw new Error('本文に未対応の書式が含まれています。');
    const out: BodyNode = { type: n.type };
    if (n.type === 'text') { if (typeof n.text !== 'string') throw new Error('本文を確認してください。'); out.text = n.text; }
    if (n.type === 'heading') out.attrs = { level: n.attrs?.level === 3 ? 3 : 2 };
    if (n.type === 'orderedList') out.attrs = { start: Number.isInteger(n.attrs?.start) && Number(n.attrs?.start) > 0 && Number(n.attrs?.start) < 10000 ? n.attrs?.start : 1 };
    if (n.type === 'link') {
      if (!safeNewsLink(n.attrs?.href)) throw new Error('リンクはhttp(s)・メール・電話・サイト内URLを指定してください。');
      out.attrs = { href: n.attrs!.href };
    }
    if (n.type === 'textStyle') out.attrs = { fontSize: FONT_SIZES.includes(String(n.attrs?.fontSize)) ? n.attrs!.fontSize : null };
    if (n.content) { if (!Array.isArray(n.content)) throw new Error('本文を確認してください。'); out.content = n.content.map(c => clean(c, depth + 1)); }
    if (n.marks) { if (!Array.isArray(n.marks)) throw new Error('本文を確認してください。'); out.marks = n.marks.map(m => clean(m, depth + 1, true)); }
    return out;
  }
  if (raw?.type !== 'doc') throw new Error('本文を確認してください。');
  return clean(raw);
}
export function bodyText(node: BodyNode): string { return (node.text ?? '') + (node.content ?? []).map(bodyText).join(''); }
export function normalizeNewsBody(body: string) {
  const doc = readNewsBody(body);
  if (!bodyText(doc).trim()) throw new Error('本文を入力してください。');
  if (bodyText(doc).length > 30000) throw new Error('本文は30,000文字以内にしてください。');
  return body.startsWith(NEWS_BODY_PREFIX) ? NEWS_BODY_PREFIX + JSON.stringify(doc) : body;
}
