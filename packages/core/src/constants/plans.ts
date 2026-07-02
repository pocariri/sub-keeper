/** 요금제 관련 상수 — prd-app.md 4.6 / 6 */

/** 무료 플랜 구독 등록 개수 제한 */
export const FREE_SUBSCRIPTION_LIMIT = 10;

/** 프리미엄 가격 (원) — 월 2,900 / 연 29,000, 무료 체험 없음 */
export const PREMIUM_PRICE_KRW = {
  monthly: 2900,
  yearly: 29000,
} as const;

/** 플랜별 기능 게이팅 (Phase 1: 참조용 플래그. UI 게이팅은 이후 단계에서 사용) */
export const PLAN_FEATURES = {
  free: {
    subscriptionLimit: FREE_SUBSCRIPTION_LIMIT,
    renewalAlerts: false,
    categoryAnalytics: false,
    annualReport: false,
    cancelSuggestions: false,
  },
  premium: {
    subscriptionLimit: Infinity,
    renewalAlerts: true,
    categoryAnalytics: true,
    annualReport: true,
    cancelSuggestions: true,
  },
} as const;
