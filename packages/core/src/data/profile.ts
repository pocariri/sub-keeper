import type { SupabaseClient } from '../baas/client';
import type { Profile, Plan, UserRole } from '../types/user';

interface ProfileRow {
  id: string;
  email: string | null;
  plan: Plan;
  premium_until: string | null;
  role: UserRole | null;
  created_at: string;
}

function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? '',
    plan: row.plan,
    premiumUntil: row.premium_until,
    role: row.role ?? 'user',
    createdAt: row.created_at,
  };
}

/** 현재 로그인 사용자의 프로필 (RLS 로 본인 행만 조회). 없으면 null. */
export async function getProfile(client: SupabaseClient): Promise<Profile | null> {
  const { data, error } = await client.from('profiles').select('*').maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProfile(data as ProfileRow) : null;
}

/**
 * 전체 회원 프로필 (가입일 오름차순) — 관리자 화면용.
 * 범위는 RLS 가 통제: 관리자(admin_read_all_profiles)면 전체, 일반 사용자면 본인 1행.
 */
export async function listAllProfiles(client: SupabaseClient): Promise<Profile[]> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as ProfileRow[]).map(rowToProfile);
}
