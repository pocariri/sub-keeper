import { NavLink, useNavigate } from 'react-router-dom';
import { APP_SECTIONS, isAdmin, type SectionId } from '@sub-keeper/core';
import { useSession } from './session';
import { useProfile } from '../lib/useProfile';
import { signOut } from '../lib/auth';

/** 섹션 id → 웹 라우트 경로 (경로는 플랫폼별이라 웹에서 매핑) */
const PATHS: Record<SectionId, string> = {
  dashboard: '/app',
  subscriptions: '/app/subscriptions',
  analytics: '/app/analytics',
  renewals: '/app/renewals',
  profile: '/app/profile',
};

export function Sidebar() {
  const { session } = useSession();
  const { profile } = useProfile();
  const navigate = useNavigate();

  async function onLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="sidebar">
      <div className="sidebar__brand">sub-keeper</div>

      {APP_SECTIONS.map((section) => (
        <NavLink
          key={section.id}
          to={PATHS[section.id]}
          end={section.id === 'dashboard'}
          className={({ isActive }) => (isActive ? 'nav-item is-active' : 'nav-item')}
        >
          {section.label}
          {section.premiumOnly ? <span className="nav-item__premium"> · 프리미엄</span> : null}
        </NavLink>
      ))}

      {/* 관리자에게만 노출 — 경로는 웹 전용이라 APP_SECTIONS 에 넣지 않음 */}
      {isAdmin(profile) ? (
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? 'nav-item is-active' : 'nav-item')}
        >
          관리자
        </NavLink>
      ) : null}

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
  );
}
