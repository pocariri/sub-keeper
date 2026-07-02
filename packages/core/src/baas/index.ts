export { createSupabaseClient } from './client';
export type {
  SupabaseClient,
  SupabaseConfig,
  AuthStorage,
} from './client';
export { resolveSupabaseEnv } from './env';

// 앱이 @supabase/supabase-js 를 직접 import 하지 않도록 auth 타입은 core 가 재export
export type { Session, User, AuthError } from '@supabase/supabase-js';
