-- ブログ記事テーブル（ブロック形式の本文を JSON で保持）
-- Supabase ダッシュボードの SQL Editor で実行してください。

create table if not exists public.blog_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  content text not null default '[]',
  excerpt text,
  image_url text,
  note_url text unique,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_articles_published
  on public.blog_articles (is_published, published_at desc)
  where is_published = true;

create index if not exists idx_blog_articles_slug on public.blog_articles (slug);

alter table public.blog_articles enable row level security;

create policy "Allow public read published"
  on public.blog_articles for select
  to anon
  using (is_published = true);

create policy "Allow all for anon" on public.blog_articles for all to anon using (true) with check (true);
