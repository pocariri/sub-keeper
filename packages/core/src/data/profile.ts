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

/**
 * 현재 로그인 사용자의 프로필. 없으면 null.
 * 관리자는 RLS 로 전체 행이 보이므로(admin_read_all_profiles) 본인 id 로 명시 필터 —
 * RLS 에만 맡기면 maybeSingle 이 다중 행 에러를 낸다.
 */
export async function getProfile(client: SupabaseClient): Promise<Profile | null> {
  const {
    data: { user },
    error: userErr,
  } = await client.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  if (!user) return null;

  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
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
