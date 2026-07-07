# CLAUDE.md — sub-keeper 개발 규칙

구독 관리 서비스. 웹 + 모바일 동시 지원. 상세 요구사항은 `prd-app.md`(아키텍처/스택/스키마), `prd-landing.md`(핵심 화면), `prd-payment.md`, `prd-admin.md` 참조.

## 모노레포 구조

```
apps/web       # React + Vite (@sub-keeper/web) — 웹 UI 전용
apps/mobile    # Expo / React Native (@sub-keeper/mobile) — 모바일 UI 전용
packages/core  # @sub-keeper/core — 공유 타입·로직·검증·BaaS 접근·디자인 토큰
```

## 핵심 규칙 (반드시 지킬 것)

1. **공유 우선**: 비즈니스 로직·타입·zod 검증·BaaS 접근은 **무조건 `packages/core`** 에 둔다.
   플랫폼별로 두는 것은 **UI 뿐**(웹 = DOM/CSS, 모바일 = React Native 컴포넌트).
2. **BaaS 직접 호출 금지**: 앱에서 `@supabase/supabase-js` 를 직접 import 하지 않는다.
   반드시 `@sub-keeper/core` 의 클라이언트/래퍼를 경유한다.
3. **로직 중복 금지**: 결제일 계산, 통화 환산, 카테고리 집계, 유효성 검증은 core 에 한 번만 구현하고 양쪽이 import 한다.
4. **모바일은 축소가 아님**: 모바일은 데스크탑 UI 축소가 아니라 폰 전용 레이아웃. 웹 = 사이드바, 모바일 = 하단 탭바.

## 디자인 규칙

- **정말 심플·미니멀. 강조색(accent) 사용 금지 → 무채색(블랙/화이트/그레이) 기반.**
- 색/간격/타이포 값은 임의로 쓰지 말고 `packages/core/src/design/tokens.ts` 를 단일 소스로 사용한다.
- 위계는 여백·타이포그래피로 표현. 다크모드는 선택 사항.

## 환경 변수 규약

- 웹: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (`apps/web/.env`)
- 모바일: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` (`apps/mobile/.env`)
- 각 앱의 `.env.example` 참고. 실제 `.env` 는 커밋 금지.

## 알려진 주의점

- **React 버전은 web/mobile 완전히 동일하게 고정.** React 19 는 `react` 와 `react-dom` 버전이
  정확히 같아야 하고(다르면 런타임에 "Incompatible React versions" 에러 → 빈 화면),
  pnpm hoist 로 워크스페이스 전체가 단일 `react` 를 공유한다. 현재 **19.2.3** 로 고정
  (mobile 은 Expo SDK 가 고정, web 은 이에 맞춤). 버전 올릴 땐 `apps/web` 과 `apps/mobile`
  의 `react`/`react-dom` 을 **함께** 바꾸고 `apps/web/node_modules/.vite` 캐시 삭제 후 재기동.
- pnpm 빌드 스크립트 허용은 `pnpm-workspace.yaml` 의 `allowBuilds` 에 둔다(package.json `pnpm` 필드는 무시됨).
- **"본인 데이터" 조회는 RLS 에만 맡기지 말고 반드시 auth uid 로 명시 필터**할 것.
  관리자 계정은 admin RLS(0003·0004)로 전체 행이 보이므로, 필터 없는 `select` 는 admin 에게
  남의 데이터까지 반환하고 `maybeSingle()` 은 다중 행 에러를 낸다(실제로 getProfile 이 깨져
  admin 이 일반 사용자처럼 보이는 버그 있었음). 전체 조회가 필요한 관리자용 함수는
  `listAll*` 로 따로 둔다.

## 자주 쓰는 명령어

```bash
pnpm install            # 전체 설치 (루트에서)
pnpm typecheck          # 전 패키지 타입체크
pnpm dev:web            # 웹 개발 서버
pnpm dev:mobile         # Expo 개발 서버
pnpm build:web          # 웹 프로덕션 빌드
```

## 진행 상태

- **Phase 1 (스캐폴딩) — 완료**: 모노레포·공유 패키지·Supabase 클라이언트 골격·placeholder 앱.
- **웹 네비게이션 셸 + 라우팅 — 완료**: `react-router-dom`, 좌측 사이드바(`apps/web/src/app`),
  5개 섹션 라우트(`apps/web/src/routes`, 모두 placeholder), `SessionProvider`(실제 supabase 세션 구독).
  섹션 목록은 `core` 공유 상수 `APP_SECTIONS`.
- **웹 인증 화면 — 완료(UI)**: `LoginPage`(이메일 로그인/회원가입 토글 + Google 소셜), `RequireAuth` 게이팅
  (Supabase 미설정 시 개발 바이패스), 사이드바 세션 표시 + 로그아웃. auth 래퍼는 `apps/web/src/lib/auth.ts`.
- **Supabase 연동 — 완료(웹)**: 프로젝트 `qekewagjqegaoywmnubu` 에 연결. `apps/web/.env` 작성됨(커밋 금지).
  MCP(`.mcp.json`, project 스코프)로 접근. DB는 이미 프로비저닝돼 있음 — 3개 테이블(profiles·subscriptions·exchange_rates),
  RLS 정책, 트리거(가입 시 profile 생성 `on_auth_user_created`, `updated_at`, **무료 10개 제한 `subscriptions_free_limit`**).
  → `supabase/schema.sql` 은 참고용이며 실제 DB가 더 완비됨(재실행 불필요).
  ⚠️ **이메일 확인(Confirm email) 켜져 있음** → 가입 후 메일 확인해야 로그인. **Google provider 미설정**(로그인 화면에서 버튼 자동 숨김; `fetchEnabledProviders`).
- **구독 데이터 계층 + 대시보드 + CRUD — 완료(웹)**:
  - core: `data/subscriptions.ts`(list/create/update/delete + snake↔camel 매핑, 클라이언트 주입식),
    `logic` 실제 구현(`nextBillingDate`·`monthlyAmount`/`yearlyAmount`·`totalsByCurrency`·`convert`·`monthlyTotal`·`upcomingRenewals`·`formatMoney`). `categoryBreakdown` 은 분석 단계 스텁 유지.
  - 웹: `DashboardPage`(통화별 월/연 총액 카드 + 목록 + 로딩/빈/에러), `SubscriptionsPage` + `SubscriptionForm`(zod 검증·카테고리 드롭다운·추가/수정/삭제), `useSubscriptions` 훅.
  - 사용자가 로그인→구독 추가→목록/결제일 로드까지 실제 동작 확인함.
- **갱신 임박·내 정보/게이팅·정렬 — 완료(웹)**:
  - `RenewalsPage`: 기간 필터 없이 **결제일 임박 순 단일 목록** + D-day 배지 (prd-landing 4.5 개정 반영).
  - `ProfilePage`: 플랜 표시 + 혜택/업그레이드(placeholder) + 로그아웃. `AnalyticsPage` 무료→잠금 UI. 구독 추가는 무료 한도 도달 시 비활성.
  - core: `getProfile`, `isPremiumActive`/`subscriptionLimit`/`canAddSubscription`, 결제 도메인 타입 + 상태머신(`billing-state`, 결제 UI는 미착수), **`sortSubscriptions`**(renewal / price_asc / price_desc, 가격순은 `convert`로 KRW 환산·환율 없으면 폴백) + `getExchangeRates`.
  - 웹 정렬: 대시보드·구독 목록에 `SortSelect`(낮은/높은 가격순·갱신 임박순). 라벨 소스 `SUBSCRIPTION_SORTS`(core).
  - 검증: typecheck·`build:web`·core 단위테스트(로직 13 + 정렬 5)·`/login` 렌더 OK.
- **소개(랜딩) 페이지 통합 + 라우팅 재구성 — 완료(웹)**:
  - 라우트: `/`=랜딩(공개), `/login`·`/signup`=인증, **`/app` 이하=보호 라우트**(대시보드·구독·분석·갱신·내정보). 미로그인 `/app`→`/login`.
  - `apps/web/src/landing/`: `LandingPage` + `components/*`(Header·Hero·Features·Preview·Plans·Pricing·FAQ·FinalCTA·Footer) + `content.ts`(문구/목업, 가격은 core `PREMIUM_PRICE_KRW` 파생) + `landing.css`.
  - 스타일: 이전 소개사이트(introduce-sub-keeper) CSS를 포팅하되 `:root`를 **core 토큰 값으로 매핑**, 전역 요소 규칙은 `.lp` 래퍼로 스코프 → **앱 화면 무영향**. 무채색 유지.
  - 소개사이트의 목(mock) `AuthModal`은 버리고 CTA는 실제 `/login`·`/signup`으로 연결. 로그인 상태면 헤더가 "앱으로 가기"(→`/app`).
  - `apps/web/_introduce-src/` 는 통합 후 삭제 대상(원본 소스).
- **1:1 문의 — 완료(웹, 사용자용)**:
  - core: `types/inquiry.ts`(`Inquiry`·`InquiryInput`·`InquiryStatus`), `validation/inquiry.ts`(`inquiryInputSchema`), `data/inquiries.ts`(`listInquiries`/`createInquiry`, 구독 데이터 계층과 동일 패턴).
  - 웹: `/app/inquiries`(`InquiriesPage`: 목록 + 상태 배지 "답변 대기/답변 완료" + 답변 블록, `InquiryForm` 오버레이 작성 폼, `useInquiries` 훅), 내 정보에 "지원 > 문의하기" 진입점(사이드바 미추가 — `APP_SECTIONS` 안 건드림).
  - DB `inquiries`(0004 마이그레이션)와 RLS 5개 정책은 원격에 이미 적용돼 있음을 확인. 본인 것만 조회는 RLS가 보장. 관리자 답변 UI는 prd-admin 몫(미착수).
- **관리자 라우트 골격 — 완료(웹)**:
  - core: `Profile`에 `role: UserRole('user'|'admin')` 추가(`types/user.ts`), `getProfile` 매핑에 role 포함, `logic/plan.ts`에 `isAdmin(profile)` 헬퍼.
  - 웹: `/admin` 이하 = `RequireAuth`(비로그인→`/login`) → `RequireAdmin`(비admin→`/app`, 미설정 시 개발 바이패스) → `AppLayout` → `AdminPage`(PagePlaceholder 자리표시). 사이드바 "관리자" NavLink는 admin에게만 렌더(`APP_SECTIONS` 안 건드림 — 웹 하드코딩).
  - 클라이언트 가드는 UX용, 데이터 보호는 0003의 `is_admin()` RLS. admin 계정: `admin01@admin.com`(수동 승격됨).
- **관리자 대시보드 — 완료(웹, 1차)**:
  - core: `listAllProfiles`(`data/profile.ts`, RLS가 범위 통제), `logic/admin.ts`의 `buildAdminOverview`(회원별 구독 집계·프리미엄 이용률·월별 가입 추이 6개월 제로필, 순수 함수). 구독 전체 조회는 기존 `listSubscriptions` 재사용(관리자면 RLS가 전체 반환).
  - 웹: `AdminPage` = KPI 스탯(총 회원·프리미엄 이용률·활성 구독) + **recharts 3.x** 신규 가입 추이 BarChart(무채색, 색은 core `tokens.colors.gray` 직접 전달 — SVG에 CSS var 불가) + 매출 추이/해지율 "준비 중" 빈 패널 + 회원 목록 테이블(`.subs-table` 재사용). `useAdminOverview` 훅.
  - ⚠️ recharts 추가로 웹 번들 ~925KB(gzip 266KB) — 필요 시 코드 스플리팅 후보. Expo 툴링이 react-dom@19.2.7 peer 경고를 내지만 웹 트리는 19.2.3 단일(무관).
  - 다음: 회원 상세/문의 답변 UI, 결제 후 매출·해지율 실데이터.
- 남은 것(웹): **결제 모듈**(prd-payment, PG/Edge Functions), **관리자 화면 내용**(prd-admin, 문의 답변 포함 — 라우트 골격은 완료), 분석 차트(결제 후), 환율 시드(현재 통화별 분리 표시), `_introduce-src` 정리.
- **모바일**: 사용자 요청 시까지 보류(현재 placeholder만). 공유 로직은 core에 준비됨.
- 로드맵: `prd-app.md` 11장.
