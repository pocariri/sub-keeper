# 구독 모아 (sub-keeper)

흩어진 구독을 한 곳에서 관리하는 서비스. 결제일·총액을 자동으로 정리하고, 갱신되기 전에 미리 알려줍니다. 통화가 섞여 있어도 결제일 기준 환율로 환산해 한눈에 보여줍니다.

웹과 모바일을 동시에 지원하도록 설계된 모노레포이며, 비즈니스 로직은 공유 패키지(`packages/core`)에 모으고 플랫폼별로는 UI만 둡니다.

---

## 기능

- **구독 통합 관리** — 구독을 추가·수정·삭제하며 한 곳에서 정리
- **대시보드** — 통화별 월/연 총액 카드 + 목록 (로딩·빈·에러 상태 처리)
- **갱신 임박 목록** — 결제일 임박 순으로 모아 D-day 배지 표시
- **다중 통화** — 결제일 기준 환율로 환산해 합산
- **정렬** — 가격순(낮은/높은) · 갱신 임박순
- **인증** — 이메일 로그인/회원가입 + Google 소셜(활성화 시)
- **무료/프리미엄 플랜** — 무료는 구독 10개 제한(DB 트리거로 강제)

> 결제 모듈·관리자·분석 차트는 로드맵에 있으며 아직 미구현입니다. 모바일 앱은 현재 placeholder 상태입니다.

---

## 모노레포 구조

```
apps/web        # React + Vite (@sub-keeper/web) — 웹 UI
apps/mobile     # Expo / React Native (@sub-keeper/mobile) — 모바일 UI (placeholder)
packages/core   # @sub-keeper/core — 공유 타입·로직·검증·BaaS 접근·디자인 토큰
supabase/       # schema.sql (참고용)
```

핵심 규칙: 비즈니스 로직·타입·zod 검증·Supabase 접근은 **모두 `packages/core`** 에 두고, 앱은 `@supabase/supabase-js` 를 직접 import 하지 않습니다. 자세한 개발 규칙은 [`CLAUDE.md`](./CLAUDE.md) 참조.

---

## 기술 스택

- **런타임**: Node ≥ 20, pnpm 11.9 (`packageManager` 에 고정)
- **웹**: React 19.2.3 · Vite 6 · React Router
- **모바일**: Expo / React Native (React 버전은 웹과 동일하게 고정)
- **백엔드(BaaS)**: Supabase (Auth · Postgres · RLS · 트리거)
- **검증**: zod
- **디자인**: 무채색·미니멀 (디자인 토큰 단일 소스: `packages/core/src/design/tokens.ts`)

---

## 시작하기

### 1. 설치

```bash
git clone <repo-url>
cd sub-keeper
pnpm install
```

> pnpm 이 없다면 `corepack enable` 을 실행하세요. `packageManager` 필드 기준으로 올바른 버전(11.9)이 자동으로 사용됩니다.

### 2. 환경 변수 (선택 — 기능까지 쓰려면 필요)

`.env` 없이도 앱은 실행됩니다. Supabase 가 설정되지 않으면 클라이언트가 비활성화되고, 개발 바이패스로 앱 화면을 둘러볼 수 있습니다(로그인·데이터 저장은 동작하지 않음).

실제 로그인·구독 저장까지 쓰려면 웹 환경 변수를 채웁니다:

```bash
cp apps/web/.env.example apps/web/.env
# apps/web/.env 를 열어 값 입력
```

| 변수 | 설명 |
|---|---|
| `VITE_SUPABASE_URL` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon(publishable) 키 |

모바일은 `apps/mobile/.env.example` 을 복사해 `EXPO_PUBLIC_SUPABASE_URL` · `EXPO_PUBLIC_SUPABASE_ANON_KEY` 를 사용합니다.

> ⚠️ 실제 `.env` 는 커밋하지 마세요(`.gitignore` 처리됨). anon 키는 클라이언트에 공개되는 publishable 키이며, 실제 데이터 보호는 Supabase **RLS 정책**이 담당합니다. `service_role` 키는 절대 클라이언트/저장소에 두지 않습니다.

### 3. 실행

```bash
pnpm dev:web        # 웹 개발 서버 → http://localhost:5173/
pnpm dev:mobile     # Expo 개발 서버 (모바일)
```

웹 접속 후 화면:
- `/` — 소개(랜딩) 페이지 (공개)
- `/login`, `/signup` — 인증
- `/app` 이하 — 대시보드·구독·분석·갱신·내 정보 (보호 라우트)

---

## 스크립트

루트에서 실행합니다.

| 명령 | 설명 |
|---|---|
| `pnpm install` | 전체 워크스페이스 설치 |
| `pnpm dev:web` | 웹 개발 서버 |
| `pnpm dev:mobile` | Expo(모바일) 개발 서버 |
| `pnpm build:web` | 웹 프로덕션 빌드 |
| `pnpm typecheck` | 전 패키지 타입체크 |

---

## 백엔드(Supabase)

앱은 Supabase 프로젝트에 연결됩니다. 스키마는 3개 테이블(`profiles` · `subscriptions` · `exchange_rates`), RLS 정책, 트리거(가입 시 프로필 생성, `updated_at`, 무료 10개 제한)로 구성됩니다.

- **같은 백엔드 공유**: 프로젝트 URL + anon 키를 전달받아 `.env` 에 넣으면 바로 사용 가능합니다(권장).
- **자체 백엔드 구성**: 새 Supabase 프로젝트를 만들고 [`supabase/schema.sql`](./supabase/schema.sql) 을 참고해 스키마를 적용합니다. `schema.sql` 은 참고용이며 실제 운영 DB에는 일부 트리거·정책이 추가로 반영돼 있을 수 있으니 확인이 필요합니다.

---

## 디자인 원칙

정말 심플·미니멀. 강조색(accent) 없이 무채색(블랙/화이트/그레이) 기반이며, 위계는 색이 아니라 크기·굵기·여백으로 표현합니다. 색·간격·타이포 값은 임의로 쓰지 않고 디자인 토큰(`packages/core/src/design/tokens.ts`, 웹 미러 `apps/web/src/styles/tokens.css`)을 단일 소스로 사용합니다.

---

## 진행 상태

- ✅ 모노레포 스캐폴딩 · 공유 패키지 · Supabase 클라이언트 골격
- ✅ 웹: 네비게이션 셸 · 인증 화면 · 대시보드 · 구독 CRUD · 갱신 임박 · 정렬 · 소개(랜딩) 페이지
- ⏳ 결제 모듈(PG/Edge Functions) · 관리자 · 분석 차트
- ⏳ 모바일 앱 (현재 placeholder — 공유 로직은 core 에 준비됨)

로드맵 상세는 `prd-app.md` 참조.
