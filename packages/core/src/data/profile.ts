import type { SupabaseClient } from '../baas/client';
import type { Profile, Plan } from '../types/user';

interface ProfileRow {
  id: string;
  email: string | null;
  plan: Plan;
  premium_until: string | null;
  created_at: string;
}

function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email ?? '',
    plan: row.plan,
    premiumUntil: row.premium_until,
    createdAt: row.created_at,
  };
}

/** 현재 로그인 사용자의 프로필 (RLS 로 본인 행만 조회). 없으면 null. */
export async function getProfile(client: SupabaseClient): Promise<Profile | null> {
  const { data, error } = await client.from('profiles').select('*').maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToProfile(data as ProfileRow) : null;
}
