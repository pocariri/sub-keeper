import { useCallback, useEffect, useState } from 'react';
import { listAllProfiles, listAllSubscriptions, buildAdminOverview } from '@sub-keeper/core';
import type { AdminOverview } from '@sub-keeper/core';
import { supabase } from './supabase';

export interface UseAdminOverview {
  overview: AdminOverview | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * 관리자 대시보드 집계 훅.
 * 전체 profiles + subscriptions 를 병렬 조회해 core 집계로 변환.
 * (관리자가 아니면 RLS 가 본인 데이터만 반환 — 화면 진입 자체는 RequireAdmin 이 막음)
 */
export function useAdminOverview(): UseAdminOverview {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [profiles, subscriptions] = await Promise.all([
        listAllProfiles(supabase),
        listAllSubscriptions(supabase),
      ]);
      setOverview(buildAdminOverview(profiles, subscriptions));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { overview, loading, error, reload };
}
