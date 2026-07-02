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
 * 무채색 램프 (minimal-design 스킬 기준, 강조색 없음).
 *   gray[900]=ink(니어블랙 본문) … gray[400]=뮤트, gray[300]=진한 하네어라인,
 *   gray[200]=하네어라인, gray[100]=미묘한 블록, gray[50]=페이지 배경(오프화이트).
 */
export const colors = {
  black: '#17181A', // 니어블랙 (순흑 대신)
  white: '#FFFFFF', // surface 전용 (페이지 배경으로 쓰지 말 것 → gray[50])
  gray: {
    50: '#FAFAFA', // bg — 페이지 배경(오프화이트)
    100: '#F2F3F4', // bg-subtle — hover/미묘한 블록
    200: '#E6E7E9', // line — 하네어라인 보더
    300: '#D7D9DC', // line-strong — 진한 하네어라인
    400: '#9A9DA3', // 플레이스홀더/뮤트
    500: '#6B6E73', // 보조 텍스트
    600: '#55585C', // 강조 보조 텍스트
    700: '#3F4145', // 강조 텍스트/아이콘 (ink-700)
    800: '#24262A', // 강한 텍스트
    900: '#17181A', // 기본 텍스트 (니어블랙, ink-900)
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

/** 모서리 반경 */
export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

/** 타이포그래피 (size/lineHeight, px) */
export const typography = {
  fontFamily: {
    base: 'system-ui, -apple-system, sans-serif',
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
