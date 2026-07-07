import { useCallback, useEffect, useState } from 'react';
import { listAllInquiries, listAllProfiles } from '@sub-keeper/core';
import type { Inquiry } from '@sub-keeper/core';
import { supabase } from './supabase';

/** 관리자 문의 목록 항목 — 문의 + 작성자 이메일 */
export type AdminInquiry = Inquiry & { email: string };

export interface UseAdminInquiries {
  items: AdminInquiry[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** 전체 문의 + 작성자 이메일 조인 훅 (관리자 문의 관리 화면용) */
export function useAdminInquiries(): UseAdminInquiries {
  const [items, setItems] = useState<AdminInquiry[]>([]);
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
      const [inquiries, profiles] = await Promise.all([
        listAllInquiries(supabase),
        listAllProfiles(supabase),
      ]);
      const emailById = new Map(profiles.map((p) => [p.id, p.email]));
      setItems(inquiries.map((q) => ({ ...q, email: emailById.get(q.userId) || q.userId })));
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
