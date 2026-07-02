import type { CategoryId, Subscription } from '../types/subscription';

/** 카테고리별 집계 결과 1건 */
export interface CategoryBreakdown {
  category: CategoryId;
  /** base 통화로 환산된 월 합계 */
  total: number;
  count: number;
}

/**
 * 카테고리별 지출 비중 집계 (분석 차트용, 프리미엄).
 * TODO(분석 단계): currency.convert + 카테고리 그룹핑으로 환산 합계 구현.
 */
export function categoryBreakdown(
  subscriptions: Subscription[],
): CategoryBreakdown[] {
  void subscriptions;
  throw new Error('categoryBreakdown: not implemented (분석 단계)');
}

/**
 * 갱신 임박 목록 — 오늘부터 withinDays 이내 결제 예정 활성 구독, 결제일 오름차순.
 * @param now 기준 시각 (테스트용, 기본 현재)
 */
export function upcomingRenewals(
  subscriptions: Subscription[],
  withinDays: number,
  now: Date = new Date(),
): Subscription[] {
  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + withinDays);
  return subscriptions
    .filter((s) => s.isActive)
    .filter((s) => {
      const d = new Date(`${s.nextBillingAt}T00:00:00Z`);
      return d >= today && d <= end;
    })
    .sort((a, b) => a.nextBillingAt.localeCompare(b.nextBillingAt));
}
