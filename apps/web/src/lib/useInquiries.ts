import { useCallback, useEffect, useState } from 'react';
import { listInquiries } from '@sub-keeper/core';
import type { Inquiry } from '@sub-keeper/core';
import { supabase } from './supabase';

export interface UseInquiries {
  items: Inquiry[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** 본인 문의 목록을 로드/재로드하는 훅 */
export function useInquiries(): UseInquiries {
  const [items, setItems] = useState<Inquiry[]>([]);
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
      setItems(await listInquiries(supabase));
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
