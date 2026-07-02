import type { Subscription, CurrencyCode } from '../types/subscription';
import { convert, type ExchangeRate } from './currency';

export type SubscriptionSort = 'renewal' | 'price_asc' | 'price_desc';

/** 정렬 옵션 목록 (웹·모바일 공용 라벨 소스) */
export const SUBSCRIPTION_SORTS: { key: SubscriptionSort; label: string }[] = [
  { key: 'renewal', label: '갱신 임박순' },
  { key: 'price_asc', label: '낮은 가격순' },
  { key: 'price_desc', label: '높은 가격순' },
];

/** 가격 비교 기준 통화 (prd-landing.md 4.2) */
const BASE_CURRENCY: CurrencyCode = 'KRW';

/** 가격 비교용 KRW 환산값. 환율 없으면 원금액으로 폴백. */
function priceInBase(sub: Subscription, rates: ExchangeRate[]): number {
  try {
    return convert(sub.amount, sub.currency, BASE_CURRENCY, rates);
  } catch {
    return sub.amount;
  }
}

/**
 * 구독 목록 정렬 (원본 불변, 새 배열 반환).
 * - renewal: 다음 결제일 오름차순(임박 순)
 * - price_asc/price_desc: 금액을 KRW 로 환산한 값 기준
 */
export function sortSubscriptions(
  subscriptions: Subscription[],
  sort: SubscriptionSort,
  rates: ExchangeRate[] = [],
): Subscription[] {
  const items = [...subscriptions];
  switch (sort) {
    case 'renewal':
      return items.sort((a, b) => a.nextBillingAt.localeCompare(b.nextBillingAt));
    case 'price_asc':
      return items.sort((a, b) => priceInBase(a, rates) - priceInBase(b, rates));
    case 'price_desc':
      return items.sort((a, b) => priceInBase(b, rates) - priceInBase(a, rates));
  }
}
