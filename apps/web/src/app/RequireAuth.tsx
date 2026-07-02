import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from './session';
import { isSupabaseConfigured } from '../lib/supabase';
import '../styles/app.css';

/**
 * 인증 게이팅.
 * - Supabase 미설정(개발 중): 셸을 그대로 보여준다(배너로 안내).
 * - 설정됨 + 세션 없음: /login 으로.
 */
export function RequireAuth() {
  const { session, loading } = useSession();

  if (!isSupabaseConfigured) return <Outlet />;
  if (loading) {
    return <div className="center-screen">불러오는 중…</div>;
  }
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}
