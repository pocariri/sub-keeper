/**
 * 결제/구독 정기결제 도메인 타입 (prd-payment.md §4·§6).
 * ⚠️ billing_key 등 시크릿은 서버 전용 — 클라이언트 타입에 포함하지 않는다.
 */

export type PlanType = 'monthly' | 'yearly';

/** 정기결제 상태 (prd-payment.md §4 상태머신) */
export type BillingStatus = 'active' | 'canceled' | 'past_due';

export type PaymentStatus = 'paid' | 'failed' | 'refunded';

export interface Billing {
  userId: string;
  planType: PlanType;
  status: BillingStatus;
  startedAt: string;
  /** 현재 결제 기간 종료 시각 (ISO) — 프리미엄 유지 기준 */
  currentPeriodEnd: string;
  canceledAt: string | null;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  /** 프리미엄 결제 통화는 KRW 고정 (prd-payment.md §6) */
  currency: 'KRW';
  status: PaymentStatus;
  paidAt: string;
  provider: string;
  receiptUrl: string | null;
}
