-- Auth / Profiles
-- Supabase ダッシュボードの SQL Editor で実行してください。
-- 目的: auth.users と紐づく public.profiles を作り、サインアップ時に自動作成する

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by the user"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Profiles are updatable by the user"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Bookings
-- Stripe Checkout success 後に、ユーザー自身の予約履歴として保存する

create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  room_key text not null,
  checkin_date date,
  checkout_date date,
  adults integer not null default 1,
  children integer not null default 0,
  infants integer not null default 0,
  total_price integer,
  stripe_session_id text not null unique,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

-- 既存テーブルに後から追加する場合（安全に実行可能）
alter table public.bookings
  add column if not exists adults integer not null default 1,
  add column if not exists children integer not null default 0,
  add column if not exists infants integer not null default 0,
  add column if not exists total_price integer;

alter table public.bookings enable row level security;

create policy "Bookings are viewable by the user"
  on public.bookings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Bookings are insertable by the user"
  on public.bookings for insert
  to authenticated
  with check (auth.uid() = user_id);

-- External blocks (Rakuten Oyado etc.)

create table if not exists public.external_blocks (
  id uuid primary key default gen_random_uuid(),
  room_key text not null,
  blocked_date_start date not null,
  blocked_date_end date not null,
  source text not null default 'rakuten_oyado',
  external_uid text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.external_blocks enable row level security;


