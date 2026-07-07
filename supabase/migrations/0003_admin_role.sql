-- ============================================================
-- 0003_admin_role.sql
-- 관리자 역할 + 관리자용 조회 정책 — 0001 스키마 실행 후에 실행할 것
-- ============================================================

-- ------------------------------------------------------------
-- 1. profiles 에 역할 컬럼 추가 ('user' | 'admin')
-- ------------------------------------------------------------
alter table public.profiles
  add column if not exists role text not null default 'user';

alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'admin'));

-- ------------------------------------------------------------
-- 2. "현재 사용자가 관리자인가?" 헬퍼 함수
--    RLS 정책에서 재사용. security definer 로 무한재귀 방지.
-- ------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- 3. 관리자 조회 정책
--    관리자는 전체 profiles / subscriptions 를 읽을 수 있다.
--    (기존 "본인 데이터만" 정책은 그대로 두고, 관리자용 select 정책을 추가)
--    ※ 읽기 전용만 부여 — 관리자에게 타인 데이터 수정/삭제 권한은 주지 않음.
-- ------------------------------------------------------------
create policy "admin_read_all_profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "admin_read_all_subscriptions"
  on public.subscriptions for select
  using (public.is_admin());

-- ============================================================
-- 4. 관리자 계정 승격 (시연용 — 본인 계정 하나만)
--    ⚠️ 먼저 그 이메일로 회원가입해서 profiles 행이 생긴 뒤에 실행할 것.
--    아래 이메일을 본인 관리자 계정으로 바꾸세요.
-- ============================================================
-- update public.profiles set role = 'admin'
--   where email = 'your-admin@example.com';
