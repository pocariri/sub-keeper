/** 로그인 후 핵심 화면군 (웹 사이드바 / 모바일 하단 탭바 공통) — prd-landing.md 3 */
export type SectionId =
  | 'dashboard'
  | 'subscriptions'
  | 'analytics'
  | 'renewals'
  | 'profile';

export interface AppSection {
  id: SectionId;
  label: string;
  /** 프리미엄 전용 섹션 여부 (분석 등) */
  premiumOnly: boolean;
}

export const APP_SECTIONS = [
  { id: 'dashboard', label: '대시보드', premiumOnly: false },
  { id: 'subscriptions', label: '구독', premiumOnly: false },
  { id: 'analytics', label: '분석', premiumOnly: true },
  { id: 'renewals', label: '갱신', premiumOnly: false },
  { id: 'profile', label: '내 정보', premiumOnly: false },
] as const satisfies readonly AppSection[];
