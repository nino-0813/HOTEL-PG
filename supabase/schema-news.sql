-- サーバー専用の service_role クライアント経由でのみ読み書きします。
create table if not exists public.site_news (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 120),
  date date not null,
  category text not null check (category in ('お知らせ', 'イベント', '宿泊プラン', '施設・サービス', '周辺情報')),
  tags text[] not null default '{}',
  image text not null default '',
  body text not null,
  published boolean not null default false,
  "updatedAt" text not null
);
create index if not exists site_news_public_date on public.site_news (published, date desc);
alter table public.site_news enable row level security;
revoke all on public.site_news from anon, authenticated;
grant all on public.site_news to service_role;
-- 公開APIは published = true の記事のみ返します。クライアントからの直接編集は許可しません。
