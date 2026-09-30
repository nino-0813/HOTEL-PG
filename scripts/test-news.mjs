// npm run dev を起動したローカル保存モード専用。テスト記事は終了時に復元します。
import assert from 'node:assert/strict';
import { readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
const origin = 'http://localhost:3003';
let cookie = '';
async function api(path, method = 'GET', body, opts = {}) {
  return fetch(`${origin}${path}`, { method, headers: { ...(cookie ? { cookie } : {}), ...(body ? { 'Content-Type': 'application/json', origin } : {}), ...opts }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
assert.equal((await api('/api/admin/news')).status, 401);
const login = await api('/api/admin/session', 'POST', { password: process.env.NEWS_TEST_ADMIN_PASSWORD ?? 'admin' });
assert.equal(login.status, 200, 'Use NEWS_TEST_ADMIN_PASSWORD if the local admin password is configured.');
cookie = login.headers.get('set-cookie').split(';')[0];
const initial = await (await api('/api/admin/news')).json();
assert.equal(initial.local, true, 'This test must only run with local news storage.');
const path = '.local/news.json';
let backup;
try { backup = await readFile(path); } catch (e) { if (e.code !== 'ENOENT') throw e; }
try {
  const input = { title: '動作確認用お知らせ', slug: 'news-integration-test', date: '2026-09-30', category: 'イベント', tags: ['テスト', '因島'], image: '', body: '保存と公開の動作確認です。', published: false };
  assert.equal((await api('/api/admin/news', 'POST', input, { origin: 'https://example.com' })).status, 403);
  assert.equal((await api('/api/admin/news', 'POST', { ...input, slug: '../bad' })).status, 400);
  const created = await api('/api/admin/news', 'POST', input);
  assert.equal(created.status, 200);
  let article = (await created.json()).article;
  let publicList = await (await api('/api/public/news')).json();
  assert.ok(!publicList.articles.some(a => a.slug === input.slug), 'draft must not leak');
  let detail = await (await api(`/news/${input.slug}`)).text();
  assert.ok(!detail.includes(input.body), 'draft detail must not expose body');
  assert.equal((await api('/api/admin/news', 'POST', input)).status, 409, 'slug must be unique');
  const previous = article;
  const published = await api('/api/admin/news', 'POST', { ...article, published: true });
  assert.equal(published.status, 200);
  article = (await published.json()).article;
  assert.equal((await api('/api/admin/news', 'POST', { ...previous, title: 'stale edit' })).status, 409);
  publicList = await (await api('/api/public/news')).json();
  assert.equal(publicList.articles[0].slug, input.slug);
  const home = await (await api('/')).text();
  const section = home.match(/<section id="news"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.equal((section.match(/<article>/g) ?? []).length, 3, 'home shows the published test article and the two initial announcements');
  assert.ok(section.includes(input.title));
  assert.ok(section.includes('もっと見る'));
  const filtered = await (await api(`/news?category=${encodeURIComponent('イベント')}&tag=${encodeURIComponent('テスト')}`)).text();
  const visible = filtered.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert.ok(visible.includes(input.title));
  assert.ok(!visible.includes('しまなみを巡る、サイクリングの旅'));
  detail = await (await api(`/news/${input.slug}`)).text();
  assert.ok(detail.includes(input.body));
  const prefix = 'hotel-pg-richtext-v1:';
  const rich = { type: 'doc', content: [
    { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '旅のご案内' }] },
    { type: 'paragraph', content: [{ type: 'text', text: '詳しい情報', marks: [{ type: 'bold' }, { type: 'underline' }, { type: 'textStyle', attrs: { fontSize: '24px' } }, { type: 'link', attrs: { href: 'https://example.com/info' } }] }] },
    { type: 'horizontalRule' },
    { type: 'bulletList', content: [{ type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: '持ち物' }] }] }] }
  ] };
  const richSave = await api('/api/admin/news', 'POST', { ...article, body: prefix + JSON.stringify(rich) });
  assert.equal(richSave.status, 200);
  article = (await richSave.json()).article;
  assert.ok(article.body.includes('24px'));
  detail = (await (await api(`/news/${input.slug}`)).text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  assert.ok(detail.includes('<h2>旅のご案内</h2>'));
  assert.ok(detail.includes('href="https://example.com/info"'));
  assert.ok(detail.includes('font-size:24px'));
  assert.ok(detail.includes('<u><strong>詳しい情報</strong></u>'));
  assert.ok(detail.includes('<hr') && detail.includes('<ul><li>'));
  rich.content[1].content[0].marks[3].attrs.href = 'javascript:alert(1)';
  assert.equal((await api('/api/admin/news', 'POST', { ...article, body: prefix + JSON.stringify(rich) })).status, 400);
  assert.equal((await api('/api/admin/news', 'POST', { ...article, body: prefix + JSON.stringify({ type: 'doc', content: [{ type: 'paragraph' }] }) })).status, 400);
  const hidden = await api('/api/admin/news', 'POST', { ...article, published: false });
  assert.equal(hidden.status, 200);
  publicList = await (await api('/api/public/news')).json();
  assert.ok(!publicList.articles.some(a => a.slug === input.slug));
  console.log('PASS: auth, origin checks, validation, create, draft isolation, duplicate slug, publish, conflict detection, latest 3, category/tag filtering, detail, rich-text persistence/rendering, unsafe link rejection, empty body validation and unpublish.');
} finally {
  if (backup) { await mkdir('.local', { recursive: true }); await writeFile(path, backup); }
  else await unlink(path).catch(e => { if (e.code !== 'ENOENT') throw e; });
}
