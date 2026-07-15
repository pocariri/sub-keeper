# 핸드오버 문서

> 작성: 2026-07-15 16:21
> 한 줄 요약: 구글 소셜 로그인을 실제로 켜고(설정 + 코드 1줄) 로그인 버튼에 단색 구글 "G" 아이콘을 추가했다. 실제 구글 계정으로 가입→로그인→프로필 생성까지 검증 완료.

## ✅ 지금까지 한 일
- **구글 로그인 활성화(설정)** — 사용자가 직접 수행: Google Cloud Console에서 OAuth 클라이언트(웹 애플리케이션) 생성, Supabase 대시보드에서 Google provider 켜고 Client ID/Secret 입력, Redirect URLs 허용 목록에 `http://localhost:5173/**`와 Vercel 배포 도메인 추가. 코드의 구글 버튼은 원래부터 있었고 provider가 꺼져 있어 숨겨져 있던 것 — 설정만으로 자동 표시됨.
- **로그인 후 이동 경로 변경(코드 1줄)** — 구글 로그인 완료 후 랜딩 페이지(`/`)가 아니라 앱 대시보드(`/app`)로 바로 이동하도록 `redirectTo` 수정. 이유: 로그인한 사람은 앱을 쓰러 온 것이므로.
- **동작 검증 완료** — Supabase 설정 API로 `google: true` 확인, 실제 구글 계정(wsdvbn011@gmail.com)으로 로그인 성공, DB에서 profiles 행 자동 생성(가입 트리거가 구글 가입에도 동작) 확인.
- **구글 버튼에 아이콘 추가** — "Google 로 계속하기" 버튼 앞에 구글 "G" 마크 SVG 추가. 프로젝트 디자인 규칙(무채색·브랜드 컬러 금지)에 따라 4색 로고가 아닌 **단색(그레이) G**로 넣음. 형태는 공식 로고와 동일.
- **문서 갱신** — CLAUDE.md의 "Google provider 미설정" 문구를 설정 완료로 갱신, 설계 문서를 `docs/superpowers/specs/`에 저장.

## 📍 현재 상태
- 구글 로그인 전 구간 정상 동작(로컬에서 확인). 이메일 로그인도 기존대로 동작.
- 전체 typecheck 통과.
- **커밋 안 됨** — 변경 파일 4개 + 새 폴더 1개가 작업 트리에 그대로 있음(아래 관련 파일 참고). 이 프로젝트는 사용자가 직접 커밋/푸시하는 규칙이며, GitHub에 푸시하면 Vercel에 자동 배포됨.
- 배포 사이트에서의 구글 로그인은 아직 실제로 테스트 안 함(Redirect URLs에 Vercel 도메인은 넣어뒀다고 함 — 푸시 후 한번 확인 필요).

## ▶️ 다음에 할 일
1. **사용자**: 변경사항 커밋 + 푸시 → Vercel 자동 배포 후, 배포 사이트에서 구글 로그인 한 번 테스트.
2. (CLAUDE.md의 남은 로드맵) **결제 모듈**(`prd-payment.md`, PG 연동/Edge Functions)이 다음 큰 덩어리. 그 외: 관리자 회원 상세, 분석 차트(결제 후), 환율 시드, `apps/web/_introduce-src/` 정리.

## ⚠️ 주의할 점
- **아이콘 색 결정**: 사용자가 "구글 아이콘 넣어달라"고 했을 때 디자인 규칙(유채색 금지) 때문에 단색 G로 넣었고, 컬러 원본을 원하면 `fill` 4개만 바꾸면 된다고 안내해둔 상태. 사용자가 컬러로 바꿔달라 할 수 있음.
- **Redirect URLs 허용 목록**(Supabase 대시보드 → Authentication → URL Configuration): 여기 없는 주소로는 로그인 후 이동이 안 되고 Site URL로 떨어짐. 새 도메인이 생기면 `https://도메인/**` 형태로 추가해야 함.
- 구글 OAuth 동의 화면이 "테스트" 게시 상태일 수 있음 — 이 경우 등록된 테스트 사용자만 로그인 가능하니, 다른 사람이 로그인 실패하면 Google Cloud Console에서 게시 상태를 확인할 것.
- 같은 이메일로 이미 이메일 가입한 계정이 있으면 Supabase가 같은 계정으로 자동 연결함(이메일 확인된 경우) — 별도 처리 불필요.
- API 키·시크릿 값은 이 문서에 없음. 웹 환경변수는 `apps/web/.env`에 있고(커밋 금지), 구글 Client Secret은 Supabase 대시보드에만 입력돼 있음.

## 📂 관련 파일
- `apps/web/src/lib/auth.ts` — 로그인/가입/구글 로그인 함수 모음. `signInWithGoogle()`의 `redirectTo`를 `/app`으로 변경(이번 수정).
- `apps/web/src/routes/LoginPage.tsx` — 로그인 화면. 단색 구글 `GoogleMark` SVG 컴포넌트 추가(이번 수정).
- `apps/web/src/routes/auth.css` — 로그인 화면 스타일. `.auth__gmark`(아이콘 크기·색) 추가(이번 수정).
- `CLAUDE.md` — 프로젝트 규칙·진행 상태. Google provider 설정 완료로 갱신(이번 수정).
- `docs/superpowers/specs/2026-07-15-google-login-design.md` — 이번 작업 설계 문서(신규).
