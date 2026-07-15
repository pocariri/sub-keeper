# 핸드오버 문서

> 작성: 2026-07-15 16:34
> 한 줄 요약: 배포 사이트에서 구글 로그인 후 대시보드로 안 가던 문제를 두 단계로 해결했다 — (1) 지난 세션의 수정본이 커밋 안 돼 있던 것을 커밋+푸시, (2) 그 후 드러난 Vercel 404를 SPA fallback(`vercel.json`)으로 수정. 배포 사이트 최종 확인은 아직 사용자 몫.

## ✅ 지금까지 한 일
- **문제 신고 접수**: 사용자가 Vercel 배포 주소에서 구글 로그인하면 대시보드(`/app`)가 아니라 랜딩 페이지(`/`)로 떨어진다고 보고.
- **원인 1 — 수정본 미배포**: 지난 세션에서 고친 코드(`redirectTo`를 `/app`으로)가 **커밋되지 않은 채 로컬에만** 있었고, Vercel은 옛날 코드를 서빙 중이었다. 사용자 승인 받아 변경 4개 파일 + 핸드오버/설계 문서를 커밋 `7517dc7`로 묶어 푸시함.
- **원인 2 — Vercel 404**: 배포 후 구글 로그인하니 이번엔 Vercel 404(NOT_FOUND) 화면이 뜸. 이 앱은 SPA(주소 이동을 브라우저 안 자바스크립트가 처리하는 방식)라서 `/app` 같은 경로는 서버에 실제 파일이 없는데, 구글 로그인 후엔 브라우저가 서버에 `/app`을 직접 요청하기 때문. 모든 경로 요청을 `index.html`로 되돌리는 **`vercel.json`(rewrite 설정)** 을 추가해 해결 — 커밋 `adbc63a` 푸시. 이걸로 `/app`에서 새로고침해도 404가 나던 잠재 버그도 함께 해결됨.
- **vercel.json 을 두 곳에 배치**: Vercel 프로젝트의 Root Directory 설정(저장소 루트인지 `apps/web`인지)을 알 수 없어서 **저장소 루트와 `apps/web/` 양쪽에 같은 파일**을 넣음. 해당되는 위치의 파일만 적용되고 나머지는 무시되므로 부작용 없음.

## 📍 현재 상태
- 로컬 작업 트리 깨끗함(모든 변경 커밋·푸시 완료, `main` = origin/main = `adbc63a`). 이 HANDOVER.md 수정본만 새로 생김.
- 푸시 직후라 Vercel 자동 배포가 돌았을 것 — **배포 사이트에서 구글 로그인 최종 테스트는 아직 안 됨**(사용자가 확인 예정이었음).
- 로컬 기준 구글/이메일 로그인 모두 정상(지난 세션에서 검증).

## ▶️ 다음에 할 일
1. **사용자**: 배포 사이트에서 ① 구글 로그인 → 바로 대시보드(`/app`)가 뜨는지, ② 대시보드에서 새로고침해도 404가 안 나는지 확인. 실패 시 아래 "주의할 점"의 체크리스트 순서로 볼 것.
2. **사용자(선택)**: Vercel 대시보드 → 프로젝트 Settings → Root Directory 값을 확인해서 알려주면, 두 개 중 안 쓰는 `vercel.json` 하나를 정리할 수 있음(급하지 않음).
3. (로드맵) **결제 모듈**(`prd-payment.md`, PG 연동/Edge Functions)이 다음 큰 덩어리. 그 외: 관리자 회원 상세, 분석 차트(결제 후), 환율 시드, `apps/web/_introduce-src/` 정리.

## ⚠️ 주의할 점
- **커밋/푸시 규칙**: 원래 이 프로젝트는 사용자가 직접 커밋/푸시한다. 이번 세션은 사용자가 명시적으로 "해달라"고 해서 클로드가 두 번 커밋+푸시했음(GitHub 푸시 = Vercel 자동 배포).
- **그래도 구글 로그인 후 이동이 이상하면** 순서대로 확인:
  1. Vercel 배포가 최신 커밋(`adbc63a`)으로 완료됐는지 (Vercel 대시보드 Deployments).
  2. Supabase 대시보드 → Authentication → URL Configuration → **Redirect URLs**에 Vercel 도메인이 `https://도메인/**` 형태(**뒤에 `/**` 와일드카드 필수**)로 있는지. 없으면 Site URL로 떨어짐.
  3. 구글 OAuth 동의 화면이 "테스트" 게시 상태면 등록된 테스트 사용자만 로그인 가능(Google Cloud Console에서 확인).
- **vercel.json 두 개는 의도된 것**: Root Directory를 알기 전까지 양쪽 유지. 지우려면 Vercel 설정 확인 후 안 쓰는 쪽만 지울 것.
- 구글 버튼 아이콘은 디자인 규칙(무채색) 때문에 단색 그레이 G — 사용자가 컬러 원본을 원하면 `LoginPage.tsx`의 `GoogleMark` SVG에서 `fill` 4개만 바꾸면 됨.
- API 키·시크릿 값은 이 문서에 없음. 웹 환경변수는 `apps/web/.env`(커밋 금지), 구글 Client Secret은 Supabase 대시보드에만 있음.

## 📂 관련 파일
- `vercel.json`, `apps/web/vercel.json` — SPA fallback rewrite(모든 경로 → index.html). 이번 세션 신규. 내용 동일, Root Directory에 맞는 쪽만 적용됨.
- `apps/web/src/lib/auth.ts` — 로그인/가입/구글 로그인 함수. `signInWithGoogle()`의 `redirectTo`가 `/app`(이번에 커밋됨).
- `apps/web/src/routes/LoginPage.tsx` — 로그인 화면 + 단색 구글 `GoogleMark` SVG(이번에 커밋됨).
- `apps/web/src/routes/auth.css` — 로그인 화면 스타일, `.auth__gmark`(이번에 커밋됨).
- `docs/superpowers/specs/2026-07-15-google-login-design.md` — 구글 로그인 작업 설계 문서.
- `CLAUDE.md` — 프로젝트 규칙·진행 상태(Google provider 설정 완료 반영됨).
