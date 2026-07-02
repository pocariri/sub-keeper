import { supabase } from './supabase';

/**
 * 웹 인증 액션. core 가 만든 supabase 클라이언트를 경유한다
 * (앱은 @supabase/supabase-js 를 직접 import 하지 않음 — CLAUDE.md 규칙).
 * 데이터 CRUD 래퍼는 이후 packages/core 로 이동 예정.
 */

function requireClient() {
  if (!supabase) {
    throw new Error('Supabase 가 설정되지 않았습니다. apps/web/.env 를 확인하세요.');
  }
  return supabase;
}

export function signInWithPassword(email: string, password: string) {
  return requireClient().auth.signInWithPassword({ email, password });
}

export function signUpWithPassword(email: string, password: string) {
  return requireClient().auth.signUp({ email, password });
}

export function signInWithGoogle() {
  return requireClient().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

/**
 * 활성화된 외부 로그인 provider 조회 (GoTrue 공개 설정).
 * provider 가 꺼져 있으면 로그인 화면에서 해당 버튼을 숨기는 데 사용.
 */
export async function fetchEnabledProviders(): Promise<{ google: boolean }> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return { google: false };
  try {
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: anonKey },
    });
    const data = (await res.json()) as { external?: { google?: boolean } };
    return { google: Boolean(data.external?.google) };
  } catch {
    return { google: false };
  }
}
