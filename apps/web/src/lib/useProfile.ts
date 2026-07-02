import { useCallback, useEffect, useState } from 'react';
import { getProfile } from '@sub-keeper/core';
import type { Profile } from '@sub-keeper/core';
import { supabase } from './supabase';

export interface UseProfile {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/** 현재 사용자 프로필(플랜 포함) 로드 훅 */
export function useProfile(): UseProfile {
  const [profile, setProfile] = useState<Profile | null>(null);
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
      setProfile(await getProfile(supabase));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { profile, loading, error, reload };
}
