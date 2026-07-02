/**
 * 각 플랫폼이 읽어온 원시 env 값을 검증한다.
 * (env 를 읽는 방식은 플랫폼마다 다르므로 — 웹 import.meta.env / 모바일 process.env —
 *  core 는 값 검증만 담당하고 읽기는 각 앱이 한다.)
 */
export function resolveSupabaseEnv(env: {
  url: string | undefined;
  anonKey: string | undefined;
}): { url: string; anonKey: string } {
  if (!env.url || !env.anonKey) {
    throw new Error(
      'Supabase 환경변수가 없습니다. 각 앱의 .env(.example) 를 확인하세요.',
    );
  }
  return { url: env.url, anonKey: env.anonKey };
}
