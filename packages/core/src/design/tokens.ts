/**
 * 디자인 토큰 (단일 소스). 웹/모바일이 각자 스타일 시스템으로 매핑해 사용한다.
 * 웹은 `apps/web/src/styles/tokens.css` 가 이 값을 CSS 변수로 그대로 미러링한다.
 *
 * 원칙(prd-app.md 8 / prd-landing.md 7 / minimal-design 스킬):
 *   - 무채색(블랙/화이트/그레이)만. **강조색(accent) 사용 금지.**
 *   - 위계는 색이 아니라 크기·굵기·여백으로.
 *   - 텍스트/배경 대비에 순흑(#000)·순백(#fff)을 그대로 쓰지 않는다.
 *     니어블랙(ink) + 오프화이트(bg) 램프를 쓴다. 순백은 카드/입력 표면(surface)에만.
 */

/**
 * 무채색 램프 (Claude Design 시안 '구독모아' 디자인 시스템 기준, 강조색 없음).
 * 시안 원값은 oklch 12단계 — RN 호환을 위해 sRGB hex 로 환산해 저장(주석에 oklch L 병기).
 *   gray[900]=ink(니어블랙 본문) … gray[400]=뮤트, gray[300]=기본 보더,
 *   gray[200]=하네어라인, gray[100]=미묘한 블록, gray[50]=페이지 배경(오프화이트).
 */
export const colors = {
  black: '#1E1E1E', // 니어블랙 (순흑 대신) = gray[900]
  white: '#FFFFFF', // 순백 — 배경/카드에 직접 쓰지 말 것(카드는 gray 램프 밖 #FBFBFB surface)
  gray: {
    50: '#F5F5F5', // bg — 페이지 배경 (oklch 0.971)
    100: '#EDEDED', // bg-subtle — hover/미묘한 블록 (0.945)
    200: '#E2E2E2', // line — 하네어라인 보더 (0.912)
    300: '#D1D1D1', // line-strong — 기본 보더 (0.860)
    400: '#ABABAB', // 플레이스홀더/뮤트 (0.740)
    500: '#868686', // 보조 텍스트(tertiary) (0.620)
    600: '#646464', // secondary 텍스트 (0.505)
    700: '#464646', // 강조 텍스트/아이콘 (0.395)
    800: '#2E2E2E', // 강한 텍스트 (0.300)
    900: '#1E1E1E', // 기본 텍스트 (니어블랙) (0.235)
    950: '#101010', // 가장 어두운 잉크 — primary hover (0.175)
  },
} as const;

/** 간격 스케일 (px 기준) */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

/** 모서리 반경 (시안: sm=칩, md=버튼/입력, lg=카드) */
export const radii = {
  none: 0,
  sm: 6,
  md: 10,
  lg: 14,
  full: 9999,
} as const;

/** 타이포그래피 (size/lineHeight, px) */
export const typography = {
  fontFamily: {
    base: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', Roboto, sans-serif",
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
} as const;

export const tokens = { colors, spacing, radii, typography } as const;
export type Tokens = typeof tokens;
