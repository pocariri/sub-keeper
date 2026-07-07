import { Link, useNavigate } from 'react-router-dom';
import { isPremiumActive, FREE_SUBSCRIPTION_LIMIT } from '@sub-keeper/core';
import { useSession } from '../app/session';
import { useProfile } from '../lib/useProfile';
import { signOut } from '../lib/auth';
import { UpgradeButton } from './PremiumLock';

const PREMIUM_BENEFITS = [
  '구독 무제한 등록',
  '갱신 임박 알림',
  '카테고리 분석 차트',
  '연간 리포트',
  '해지 추천',
];

export function ProfilePage() {
  const { session } = useSession();
  const { profile, loading, error } = useProfile();
  const navigate = useNavigate();
  const premium = isPremiumActive(profile);

  async function onLogout() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <section className="page page--narrow">
      <h1 className="page__title">내 정보</h1>

      {loading ? (
        <div className="skeleton page__section">
          <div className="skeleton__line" style={{ height: 24, width: 200 }} />
          <div className="skeleton__line" style={{ height: 120 }} />
        </div>
      ) : error ? (
        <p className="state state--error" style={{ marginTop: 'var(--sp-6)' }}>
          정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. ({error})
        </p>
      ) : (
        <>
          {/* 계정 */}
          <div className="page__section">
            <div className="field-label">이메일</div>
            <div className="field-value">{session?.user.email ?? profile?.email ?? '-'}</div>
          </div>

          {/* 플랜 카드 */}
          <div className="panel" style={{ marginTop: 'var(--sp-8)' }}>
            <div className="field-label">현재 플랜</div>
            <div className="plan-name">{premium ? '프리미엄' : '무료'}</div>

            {premium ? (
              <p className="page__subtitle">
                {profile?.premiumUntil
                  ? `만료일: ${new Date(profile.premiumUntil).toLocaleDateString('ko-KR')}`
                  : '프리미엄 혜택을 이용 중입니다.'}
              </p>
            ) : (
              <>
                <p className="page__subtitle">
                  무료 플랜: 구독 최대 {FREE_SUBSCRIPTION_LIMIT}개. 프리미엄으로 아래 기능이 열립니다.
                </p>
                <ul className="benefit-list">
                  {PREMIUM_BENEFITS.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <UpgradeButton />
              </>
            )}
          </div>

          {/* 지원 */}
          <div className="page__section">
            <div className="field-label">지원</div>
            <Link to="/app/inquiries" className="ui-btn ui-btn--secondary">
              문의하기
            </Link>
          </div>

          {/* 계정 액션 */}
          <div className="page__section">
            <button type="button" onClick={onLogout} className="ui-btn ui-btn--secondary">
              로그아웃
            </button>
          </div>
        </>
      )}
    </section>
  );
}
