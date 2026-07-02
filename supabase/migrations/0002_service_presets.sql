-- ============================================================
-- 0002_service_presets.sql
-- 서비스 프리셋(인기 구독 미리 채우기) — 0001 스키마 실행 후에 실행할 것
-- (public.billing_cycle enum 에 의존)
-- ============================================================

-- ------------------------------------------------------------
-- service_presets : 전 사용자 공유 참조 데이터
--   구독 추가 시 이름/금액/통화/카테고리/주기를 자동으로 채워주기 위한 목록
--   읽기 = 로그인 사용자 전체 / 쓰기 = 서비스 롤(관리자·시드)만
-- ------------------------------------------------------------
create table public.service_presets (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null unique,          -- 서비스명 (검색/자동완성 키)
  category              text not null,                 -- 앱 카테고리 문자열
  default_amount        numeric(12,2),                 -- 대표 요금 (예시값, 사용자가 수정 가능)
  default_currency      text not null default 'KRW',
  default_billing_cycle public.billing_cycle not null default 'monthly',
  logo_url              text,                           -- 로고 이미지 (선택, 추후 채움)
  is_active             boolean not null default true,
  sort_order            int not null default 100,       -- 작을수록 목록 상단
  created_at            timestamptz not null default now()
);

create index idx_service_presets_active on public.service_presets(is_active, sort_order);

alter table public.service_presets enable row level security;

-- 로그인 사용자는 활성 프리셋만 조회 가능. 쓰기 정책 없음 → 클라이언트 쓰기 불가.
create policy "service_presets_read_authenticated"
  on public.service_presets for select
  to authenticated
  using (is_active = true);

-- ------------------------------------------------------------
-- 시드 데이터
--  ⚠️ default_amount 는 "예시값"입니다. 실제 요금제로 업데이트하세요.
--     (요금은 수시로 바뀌고, 사용자도 추가 시 직접 수정할 수 있습니다.)
--  on conflict(name) do nothing → 재실행해도 중복 안 생김
-- ------------------------------------------------------------
insert into public.service_presets
  (name, category, default_amount, default_currency, default_billing_cycle, sort_order)
values
  ('Netflix',            '엔터테인먼트(OTT·음악)', 13500, 'KRW', 'monthly', 10),
  ('YouTube Premium',    '엔터테인먼트(OTT·음악)', 14900, 'KRW', 'monthly', 20),
  ('Spotify',            '엔터테인먼트(OTT·음악)', 10900, 'KRW', 'monthly', 30),
  ('Disney+',            '엔터테인먼트(OTT·음악)',  9900, 'KRW', 'monthly', 40),
  ('TVING',              '엔터테인먼트(OTT·음악)',  9500, 'KRW', 'monthly', 50),
  ('Wavve',              '엔터테인먼트(OTT·음악)',  7900, 'KRW', 'monthly', 60),
  ('Watcha',             '엔터테인먼트(OTT·음악)',  7900, 'KRW', 'monthly', 70),
  ('쿠팡 와우 멤버십',    '쇼핑/멤버십',            7890, 'KRW', 'monthly', 80),
  ('네이버 플러스 멤버십','쇼핑/멤버십',            4900, 'KRW', 'monthly', 90),
  ('ChatGPT Plus',       '생산성/업무',              20, 'USD', 'monthly', 100),
  ('Notion',             '생산성/업무',           null,   'USD', 'monthly', 110),
  ('Microsoft 365',      '생산성/업무',           89000, 'KRW', 'yearly',  120),
  ('Google One',         '클라우드/저장소',        2400, 'KRW', 'monthly', 130),
  ('iCloud+',            '클라우드/저장소',        1100, 'KRW', 'monthly', 140)
on conflict (name) do nothing;
