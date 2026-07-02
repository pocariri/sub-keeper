import { useEffect, useState } from 'react';
import { getExchangeRates } from '@sub-keeper/core';
import type { ExchangeRate } from '@sub-keeper/core';
import { supabase } from './supabase';

/** 환율 목록 로드 훅 (가격순 정렬의 KRW 환산용). 없으면 빈 배열. */
export function useExchangeRates(): ExchangeRate[] {
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    getExchangeRates(supabase)
      .then((r) => {
        if (alive) setRates(r);
      })
      .catch(() => {
        /* 환율 없어도 정렬은 원금액 폴백으로 동작 */
      });
    return () => {
      alive = false;
    };
  }, []);

  return rates;
}
