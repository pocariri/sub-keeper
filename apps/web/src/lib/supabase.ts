import { createSupabaseClient } from '@sub-keeper/core';
import type { SupabaseClient } from '@sub-keeper/core';

// 웹은 기본 저장소(localStorage) + URL 세션 감지(OAuth 리다이렉트) 사용.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * .env 가 아직 안 채워졌어도 앱 셸은 떠야 하므로 클라이언트는 nullable.
 * 설정 전에는 배너로 안내하고, 세션은 null 로 둔다.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createSupabaseClient({ url, anonKey })
  : null;
