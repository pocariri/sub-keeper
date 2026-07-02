import { useCallback, useEffect, useState } from 'react';
import { listSubscriptions } from '@sub-keeper/core';
import type { Subscription } from '@sub-keeper/core';
import { supabase } from './supabase';

export interface UseSubscriptions {
  items: Subscription[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** 본인 구독 목록을 로드/재로드하는 훅 (대시보드·구독 페이지 공용) */
export function useSubscriptions(): UseSubscriptions {
  const [items, setItems] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!supabase) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setItems(await listSubscriptions(supabase));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}
