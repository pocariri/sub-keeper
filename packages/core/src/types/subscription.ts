/**
 * 구독 관련 도메인 타입.
 * DB 스키마(prd-app.md 3.2)의 `subscriptions` 테이블과 대응.
 */

/** 결제 주기 */
export type BillingCycle = 'weekly' | 'monthly' | 'yearly' | 'custom';

/** 통화 코드 (필요 시 확장). 총액 합산은 결제일 기준 환율로 환산 — prd-app.md 3.5 */
export type CurrencyCode = 'KRW' | 'USD' | 'EUR' | 'JPY';

/** 기본 카테고리 식별자 — 값 목록은 constants/categories.ts */
export type CategoryId =
  | 'entertainment'
  | 'productivity'
  | 'cloud'
  | 'education'
  | 'news'
  | 'game'
  | 'shopping'
  | 'health'
  | 'finance'
  | 'etc';

/** 저장된 구독 1건 */
export interface Subscription {
  id: string;
  userId: string;
  serviceName: string;
  amount: number;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  /** billingCycle === 'custom' 일 때 주기(일). 그 외에는 null */
  customDays: number | null;
  /** 다음 결제일 (YYYY-MM-DD) */
  nextBillingAt: string;
  category: CategoryId;
  paymentMethod: string;
  memo: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 구독 생성/수정 입력값 (id·타임스탬프·userId 제외) */
export type SubscriptionInput = Omit<
  Subscription,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;
