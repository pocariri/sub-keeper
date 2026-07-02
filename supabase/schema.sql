-- sub-keeper 데이터베이스 스키마 (prd-app.md 3.2 기준)
-- 실행: Supabase 대시보드 → SQL Editor 에 붙여넣고 Run.
-- 재실행 가능하도록 가드 처리되어 있음.

-- ── enums ────────────────────────────────────────────────
do $$ begin
  create type public.plan as enum ('free', 'premium');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.billing_cycle as enum ('weekly', 'monthly', 'yearly', 'custom');
exception when duplicate_object then null; end $$;

-- ── profiles (auth.users 와 1:1) ─────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  plan          public.plan not null default 'free',
  premium_until timestamptz,
  created_at    timestamptz not null default now()
);

-- ── subscriptions ────────────────────────────────────────
create table if not exists public.subscriptions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles (id) on delete cascade,
  service_name    text not null,
  amount          numeric(12, 2) not null check (amount >= 0),
  currency        text not null,
  billing_cycle   public.billing_cycle not null,
  custom_days     int check (custom_days is null or custom_days > 0),
  next_billing_at date not null,
  category        text not null check (category in (
                    'entertainment','productivity','cloud','education','news',
                    'game','shopping','health','finance','etc')),
  payment_method  text not null,
  memo            text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint custom_days_required
    check (billing_cycle <> 'custom' or custom_days is not null)
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);
create index if not exists subscriptions_next_billing_idx
  on public.subscriptions (user_id, next_billing_at);

-- ── RLS: 각 사용자는 본인 데이터만 ───────────────────────
alter table public.profiles       enable row level security;
alter table public.subscriptions  enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "subs_select_own" on public.subscriptions;
create policy "subs_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "subs_insert_own" on public.subscriptions;
create policy "subs_insert_own" on public.subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "subs_update_own" on public.subscriptions;
create policy "subs_update_own" on public.subscriptions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "subs_delete_own" on public.subscriptions;
create policy "subs_delete_own" on public.subscriptions
  for delete using (auth.uid() = user_id);

-- ── 가입 시 profile 자동 생성 ────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── updated_at 자동 갱신 ─────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();
