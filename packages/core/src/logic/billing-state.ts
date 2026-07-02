/**
 * 구독 상태 머신 (prd-payment.md §4).
 *
 *   free ─(payment_success)→ active
 *   active ─(cancel)→ canceled ─(period_end)→ free
 *   active ─(renewal_failed)→ past_due ─(retry_success)→ active
 *                                       └(retry_exhausted)→ free
 *
 * 해지(cancel)는 즉시 차단하지 않고 기간 말까지 프리미엄 유지 → canceled 상태.
 */

/** 계정 관점의 구독 상태 (free 포함) */
export type SubscriptionState = 'free' | 'active' | 'canceled' | 'past_due';

export type BillingEvent =
  | 'payment_success'
  | 'cancel'
  | 'period_end'
  | 'renewal_failed'
  | 'retry_success'
  | 'retry_exhausted';

const TRANSITIONS: Record<
  SubscriptionState,
  Partial<Record<BillingEvent, SubscriptionState>>
> = {
  free: { payment_success: 'active' },
  active: { cancel: 'canceled', renewal_failed: 'past_due' },
  canceled: { period_end: 'free', payment_success: 'active' },
  past_due: { retry_success: 'active', retry_exhausted: 'free', cancel: 'canceled' },
};

/** 다음 상태 (해당 이벤트가 없으면 현재 상태 유지) */
export function nextBillingState(
  state: SubscriptionState,
  event: BillingEvent,
): SubscriptionState {
  return TRANSITIONS[state][event] ?? state;
}

/**
 * 해당 상태에서 프리미엄 기능 접근 가능한지.
 * canceled: 기간 말까지 유지 / past_due: 재시도 기간 동안 유지. free 만 차단.
 * (최종 신뢰 판정은 서버의 plan/current_period_end — prd-payment.md §2·§8)
 */
export function hasPremiumAccess(state: SubscriptionState): boolean {
  return state !== 'free';
}
