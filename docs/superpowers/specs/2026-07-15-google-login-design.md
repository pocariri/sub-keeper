# Google 소셜 로그인 활성화 — 설계

날짜: 2026-07-15 · 상태: 승인됨

## 배경

- 로그인 화면(`LoginPage`)에 Google 버튼과 `signInWithGoogle()`(`apps/web/src/lib/auth.ts`)은 이미 구현돼 있음.
- Supabase Google provider가 미설정이라 `fetchEnabledProviders()`가 false를 반환 → 버튼 자동 숨김.
- 따라서 본 작업은 **1줄 코드 변경 + 외부 설정**으로 구성된다.

## 코드 변경 (이 저장소)

- `apps/web/src/lib/auth.ts` — `signInWithGoogle()`의 `redirectTo`를
  `window.location.origin` → `` `${window.location.origin}/app` ``으로 변경.
  Google 로그인 완료 후 랜딩(`/`)이 아닌 앱 대시보드(`/app`)로 직행한다.
- 그 외 코드 변경 없음:
  - Google 버튼은 provider 활성화 시 `fetchEnabledProviders`가 감지해 자동 표시.
  - profile 생성 트리거 `on_auth_user_created`는 `auth.users` insert 기준이라 OAuth 가입에도 동작.
  - 같은 이메일의 기존 이메일 가입 계정은 Supabase가 동일 계정으로 자동 연결(이메일 확인된 경우).

## 외부 설정 (사용자 수행 — 대시보드)

MCP 도구에는 auth provider 설정 기능이 없어 대시보드에서 직접 수행한다.

1. **Google Cloud Console** (console.cloud.google.com)
   - OAuth 동의 화면 구성(External, 앱 이름·이메일만 필수).
   - 사용자 인증 정보 → OAuth 클라이언트 ID → 유형 "웹 애플리케이션".
   - 승인된 리디렉션 URI: `https://qekewagjqegaoywmnubu.supabase.co/auth/v1/callback`
   - 발급된 Client ID / Client Secret 확보.
2. **Supabase 대시보드 → Authentication → Providers → Google**
   - Enable + Client ID / Client Secret 입력.
3. **Supabase 대시보드 → Authentication → URL Configuration → Redirect URLs**
   - `http://localhost:5173/**`
   - `https://<Vercel 배포 도메인>/**`
   - 허용 목록에 없으면 `redirectTo`가 무시되고 Site URL로 떨어진다.

## 검증

- dev 서버에서 로그인 화면에 Google 버튼이 자동 표시되는지 확인.
- 실제 Google 로그인 → `/app` 랜딩 확인.
- 신규 Google 가입 시 `profiles` 행 생성 확인(MCP `execute_sql`).
