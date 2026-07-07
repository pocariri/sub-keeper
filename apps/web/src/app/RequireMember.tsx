import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '@sub-keeper/core';
import { useProfile } from '../lib/useProfile';
import { isSupabaseConfigured } from '../lib/supabase';
import '../styles/app.css';

/**
 * 회원 화면 게이팅 — RequireAuth 안쪽에 중첩(로그인은 이미 보장됨).
 * 관리자/회원 화면 완전 분리: admin 은 회원 화면(/app)을 쓰지 않으므로 /admin 으로 보낸다.
 * - Supabase 미설정(개발 중): 기존 가드들과 동일하게 바이패스.
 */
export function RequireMember() {
  const { profile, loading } = useProfile();

  if (!isSupabaseConfigured) return <Outlet />;
  if (loading) {
    return <div className="center-screen">불러오는 중…</div>;
  }
  if (isAdmin(profile)) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
