-- HOTEL PG CMS: Supabase で編集をフロントに反映するためのテーブル
-- Supabase ダッシュボードの SQL Editor でこのファイルの内容を実行してください。

create table if not exists public.cms_content (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- 匿名アクセスを許可（anon key で読み書きする場合）
alter table public.cms_content enable row level security;

create policy "Allow public read"
  on public.cms_content for select
  to anon
  using (true);

create policy "Allow public insert and update"
  on public.cms_content for all
  to anon
  using (true)
  with check (true);
