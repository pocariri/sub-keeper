import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSupabaseClient, resolveSupabaseEnv } from '@sub-keeper/core';

// 모바일: 세션은 AsyncStorage 에 저장, URL 세션 감지는 비활성(소셜 로그인은 딥링크로 처리).
// ⚠️ 실제 화면(로그인 등)에서 import 해 사용. Phase 1 placeholder 는 아직 사용하지 않음.
const { url, anonKey } = resolveSupabaseEnv({
  url: process.env.EXPO_PUBLIC_SUPABASE_URL,
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

export const supabase = createSupabaseClient({
  url,
  anonKey,
  storage: AsyncStorage,
  detectSessionInUrl: false,
});
