import type { CurrencyCode, Subscription } from '../types/subscription';

/** 결제일 기준 환율 1건 — prd-app.md 3.2 exchange_rates */
export interface ExchangeRate {
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  asOfDate: string;
}

/** 한 달로 환산한 금액 (구독 자체 통화 기준, 환율 미적용) */
export function monthlyAmount(sub: Pick<Subscription, 'amount' | 'billingCycle' | 'customDays'>): number {
  switch (sub.billingCycle) {
    case 'weekly':
      return (sub.amount * 52) / 12;
    case 'monthly':
      return sub.amount;
    case 'yearly':
      return sub.amount / 12;
    case 'custom':
      return sub.customDays ? (sub.amount * (365 / 12)) / sub.customDays : sub.amount;
  }
}

/** 1년으로 환산한 금액 (구독 자체 통화 기준) */
export function yearlyAmount(sub: Pick<Subscription, 'amount' | 'billingCycle' | 'customDays'>): number {
  return monthlyAmount(sub) * 12;
}

/**
 * 활성 구독을 통화별로 월/연 환산 합계. 환율 없이 통화별로 나눠 합산(혼합 통화 안전).
 * 단일 환산 총액이 필요하면 monthlyTotal(base, rates) 사용.
 */
export function totalsByCurrency(
  subscriptions: Subscription[],
  period: 'monthly' | 'yearly',
): Partial<Record<CurrencyCode, number>> {
  const out: Partial<Record<CurrencyCode, number>> = {};
  for (const sub of subscriptions) {
    if (!sub.isActive) continue;
    const amount = period === 'monthly' ? monthlyAmount(sub) : yearlyAmount(sub);
    out[sub.currency] = (out[sub.currency] ?? 0) + amount;
  }
  return out;
}

/** 통화 환산 (결제일 기준 환율 — prd-app.md 3.5). 환율 없으면 throw. */
export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: ExchangeRate[],
): number {
  if (from === to) return amount;
  const direct = rates.find((r) => r.base === from && r.quote === to);
  if (direct) return amount * direct.rate;
  const inverse = rates.find((r) => r.base === to && r.quote === from);
  if (inverse) return amount / inverse.rate;
  throw new Error(`환율 정보 없음: ${from} → ${to}`);
}

/** base 통화로 환산한 월 총액 (환율 필요) */
export function monthlyTotal(
  subscriptions: Subscription[],
  base: CurrencyCode,
  rates: ExchangeRate[],
): number {
  return subscriptions
    .filter((s) => s.isActive)
    .reduce((sum, s) => sum + convert(monthlyAmount(s), s.currency, base, rates), 0);
}

/** base 통화로 환산한 연 총액 (환율 필요) */
export function yearlyTotal(
  subscriptions: Subscription[],
  base: CurrencyCode,
  rates: ExchangeRate[],
): number {
  return monthlyTotal(subscriptions, base, rates) * 12;
}

/** 통화 표기 포맷 (KRW 정수, 그 외 소수 2자리 — Intl 기본) */
export function formatMoney(amount: number, currency: CurrencyCode): string {
  try {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'KRW' || currency === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString()} ${currency}`;
  }
}
