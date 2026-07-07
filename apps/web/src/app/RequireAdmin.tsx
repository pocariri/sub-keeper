import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '@sub-keeper/core';
import { useProfile } from '../lib/useProfile';
import { isSupabaseConfigured } from '../lib/supabase';
import '../styles/app.css';

/**
 * 관리자 게이팅 — RequireAuth 안쪽에 중첩해서 사용(로그인은 이미 보장됨).
 * - Supabase 미설정(개발 중): RequireAuth 와 동일하게 바이패스.
 * - 프로필의 role 이 admin 이 아니면(로드 실패 포함) /app 으로.
 */
export function RequireAdmin() {
  const { profile, loading } = useProfile();

  if (!isSupabaseConfigured) return <Outlet />;
  if (loading) {
    return <div className="center-screen">불러오는 중…</div>;
  }
  if (!isAdmin(profile)) return <Navigate to="/app" replace />;
  return <Outlet />;
}
