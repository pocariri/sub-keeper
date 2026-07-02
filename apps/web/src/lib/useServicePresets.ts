import { useEffect, useState } from 'react';
import { listServicePresets } from '@sub-keeper/core';
import type { ServicePreset } from '@sub-keeper/core';
import { supabase } from './supabase';

export interface UseServicePresets {
  presets: ServicePreset[];
  loading: boolean;
  error: string | null;
}

/** 서비스 프리셋(공유 참조 데이터) 로드 훅 — 구독 추가 시 프리셋 선택용 */
export function useServicePresets(): UseServicePresets {
  const [presets, setPresets] = useState<ServicePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    setError(null);
    listServicePresets(supabase)
      .then((p) => {
        if (alive) setPresets(p);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  return { presets, loading, error };
}
