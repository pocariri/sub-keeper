import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * 인증 세션을 저장할 스토리지. 플랫폼별 구현을 주입한다.
 * - 웹: 미지정(기본 localStorage 사용)
 * - 모바일: @react-native-async-storage/async-storage 주입
 */
export interface AuthStorage {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
  removeItem(key: string): void | Promise<void>;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  /** 세션 저장소. 모바일에서 AsyncStorage 주입 */
  storage?: AuthStorage;
  /**
   * URL 해시에서 OAuth 세션을 감지할지 여부.
   * 웹 = true(기본), 모바일 = false (딥링크로 별도 처리).
   */
  detectSessionInUrl?: boolean;
}

/**
 * BaaS(Supabase) 클라이언트 생성 골격.
 * 앱은 이 함수만 사용하고 @supabase/supabase-js 를 직접 import 하지 않는다(CLAUDE.md 규칙).
 *
 * TODO(다음 단계): Database 제네릭 타입 연결, 인증/DB 래퍼 함수 추가.
 */
export function createSupabaseClient(config: SupabaseConfig): SupabaseClient {
  return createClient(config.url, config.anonKey, {
    auth: {
      storage: config.storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: config.detectSessionInUrl ?? true,
    },
  });
}

export type { SupabaseClient };
