-- ============================================================
-- 0004_inquiries.sql
-- 1:1 문의(QnA) — 본인 것만 조회, 관리자만 답변
-- 0001(profiles) + 0003(is_admin 함수) 실행 후에 실행할 것
-- ============================================================

-- ------------------------------------------------------------
-- inquiries : 사용자 1:1 문의
--   질문 1건에 답변 1개(관리자)를 컬럼으로 부착
-- ------------------------------------------------------------
create table public.inquiries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  body         text not null,
  status       text not null default 'open',       -- 'open' | 'answered'
  answer       text,                                 -- 관리자 답변 (없으면 null)
  answered_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint inquiries_status_check check (status in ('open', 'answered'))
);

create index idx_inquiries_user   on public.inquiries(user_id, created_at desc);
create index idx_inquiries_status on public.inquiries(status);

-- updated_at 자동 갱신 (0001의 set_updated_at 재사용)
create trigger inquiries_set_updated_at
  before update on public.inquiries
  for each row execute procedure public.set_updated_at();

alter table public.inquiries enable row level security;

-- ------------------------------------------------------------
-- RLS 정책
-- ------------------------------------------------------------

-- [조회] 본인 문의만. 단, 관리자는 전체 조회 가능.
create policy "inquiries_select_own_or_admin"
  on public.inquiries for select
  using (auth.uid() = user_id or public.is_admin());

-- [작성] 본인 명의로만 문의 등록 가능.
create policy "inquiries_insert_own"
  on public.inquiries for insert
  with check (auth.uid() = user_id);

-- [수정 - 관리자] 관리자는 답변/상태를 갱신할 수 있다.
create policy "inquiries_update_admin"
  on public.inquiries for update
  using (public.is_admin())
  with check (public.is_admin());

-- [수정 - 본인] 사용자는 아직 답변 안 된(open) 본인 문의만 수정 가능.
--   (답변 내용은 컬럼 단위로 강제하진 않음 — 필요 시 앱에서 답변 필드 미노출)
create policy "inquiries_update_own_open"
  on public.inquiries for update
  using (auth.uid() = user_id and status = 'open')
  with check (auth.uid() = user_id);

-- [삭제] 본인이 자기 문의 삭제 가능.
create policy "inquiries_delete_own"
  on public.inquiries for delete
  using (auth.uid() = user_id);
