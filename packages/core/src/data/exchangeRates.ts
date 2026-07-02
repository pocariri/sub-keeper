import type { SupabaseClient } from '../baas/client';
import type { CurrencyCode } from '../types/subscription';
import type { ExchangeRate } from '../logic/currency';

interface ExchangeRateRow {
  base_currency: string;
  quote_currency: string;
  rate: number | string;
  as_of_date: string;
}

/** 환율 목록 조회 (가격순 정렬·총액 환산용). 현재 테이블 비어있으면 []. */
export async function getExchangeRates(
  client: SupabaseClient,
): Promise<ExchangeRate[]> {
  const { data, error } = await client.from('exchange_rates').select('*');
  if (error) throw new Error(error.message);
  return (data as ExchangeRateRow[]).map((r) => ({
    base: r.base_currency as CurrencyCode,
    quote: r.quote_currency as CurrencyCode,
    rate: Number(r.rate),
    asOfDate: r.as_of_date,
  }));
}
