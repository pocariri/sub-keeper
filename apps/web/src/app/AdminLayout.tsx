import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSession } from './session';
import { signOut } from '../lib/auth';
import { isSupabaseConfigured } from '../lib/supabase';
import '../styles/app.css';

/** 관리자 전용 섹션 (웹 전용 경로 — 회원용 APP_SECTIONS 와 분리) */
const ADMIN_NAV = [
  { to: '/admin', label: '대시보드', end: true },
  { to: '/admin/inquiries', label: '문의 관리', end: false },
];

/** 관리자 전용 셸 — 회원용 AppLayout/Sidebar 와 같은 클래스 재사용, 메뉴만 관리자용 */
export function AdminLayout() {
  const { session } = useSession();
  const navigate = useNavigate();

  async function onLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar__brand">
          구독모아<span className="nav-item__premium"> · 관리자</span>
        </div>

        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'nav-item is-active' : 'nav-item')}
          >
            {item.label}
          </NavLink>
        ))}

        {session ? (
          <div className="sidebar__foot">
            <div className="sidebar__email">{session.user.email ?? session.user.id}</div>
            <button
              type="button"
              onClick={onLogout}
              className="ui-btn ui-btn--secondary ui-btn--sm"
              style={{ width: '100%' }}
            >
              로그아웃
            </button>
          </div>
        ) : null}
      </nav>

      <div className="app__body">
        {!isSupabaseConfigured ? (
          <div className="app__banner">
            Supabase 환경변수가 설정되지 않았습니다 · <code>apps/web/.env</code> 를 채워주세요
          </div>
        ) : null}
        <main className="app__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
