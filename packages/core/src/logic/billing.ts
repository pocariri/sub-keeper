import type { BillingCycle } from '../types/subscription';

/**
 * 결제 주기에 따라 다음 결제일을 계산한다. (UTC 기준, YYYY-MM-DD)
 *
 * @param from    기준 결제일 (YYYY-MM-DD)
 * @param cycle   결제 주기
 * @param customDays cycle === 'custom' 일 때 주기(일)
 */
export function nextBillingDate(
  from: string,
  cycle: BillingCycle,
  customDays?: number | null,
): string {
  const d = new Date(`${from}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`유효하지 않은 날짜: ${from}`);
  }
  switch (cycle) {
    case 'weekly':
      d.setUTCDate(d.getUTCDate() + 7);
      break;
    case 'monthly':
      d.setUTCMonth(d.getUTCMonth() + 1);
      break;
    case 'yearly':
      d.setUTCFullYear(d.getUTCFullYear() + 1);
      break;
    case 'custom':
      if (!customDays || customDays <= 0) {
        throw new Error('custom 주기에는 customDays 가 필요합니다.');
      }
      d.setUTCDate(d.getUTCDate() + customDays);
      break;
  }
  return d.toISOString().slice(0, 10);
}

/**
 * 오늘부터 대상 날짜까지 남은 일수 (UTC 기준). 오늘=0, 어제=-1, 내일=1.
 * @param dateISO 대상 날짜 (YYYY-MM-DD)
 * @param now 기준 시각 (테스트용, 기본 현재)
 */
export function daysUntil(dateISO: string, now: Date = new Date()): number {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const target = new Date(`${dateISO}T00:00:00Z`).getTime();
  return Math.round((target - today) / 86_400_000);
}
