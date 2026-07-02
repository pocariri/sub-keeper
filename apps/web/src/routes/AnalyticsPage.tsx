import { isPremiumActive } from '@sub-keeper/core';
import { useProfile } from '../lib/useProfile';
import { PremiumLock } from './PremiumLock';
import { PagePlaceholder } from './PagePlaceholder';

export function AnalyticsPage() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <section className="page">
        <h1 className="page__title">분석</h1>
        <div className="skeleton page__section">
          <div className="skeleton__line" style={{ height: 160 }} />
        </div>
      </section>
    );
  }

  if (!isPremiumActive(profile)) {
    return (
      <section className="page">
        <h1 className="page__title" style={{ marginBottom: 'var(--sp-6)' }}>
          분석
        </h1>
        <PremiumLock
          title="카테고리별 지출 분석"
          description="구독 지출을 카테고리별 비중으로 한눈에 봅니다. 프리미엄에서 열립니다."
        />
      </section>
    );
  }

  return (
    <PagePlaceholder title="분석" note="카테고리별 지출 비중 차트 (결제 연동 후 구현)" />
  );
}
