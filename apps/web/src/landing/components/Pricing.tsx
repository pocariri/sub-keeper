import { Link } from 'react-router-dom';
import { Section } from './Section';
import { PRICING } from '../content';

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="가격"
      title="단순한 가격, 숨은 비용 없음"
      lead={`${PRICING.trial} · 언제든 해지 가능`}
      className="section--muted"
    >
      <div className="price-grid">
        <article className="price-card">
          <h3 className="price-card__name">무료</h3>
          <p className="price-card__price">
            <span className="price-card__amount">0원</span>
          </p>
          <p className="price-card__desc">구독 10개까지, 결제일·총액 보기까지 무료로 제공합니다.</p>
          <Link className="btn btn--ghost btn--block" to="/signup">
            무료로 시작하기
          </Link>
        </article>

        <article className="price-card price-card--featured">
          <h3 className="price-card__name">프리미엄</h3>
          <p className="price-card__price">
            <span className="price-card__amount">{PRICING.monthly.price}</span>
            <span className="price-card__period">/ {PRICING.monthly.period}</span>
          </p>
          <p className="price-card__yearly">
            또는 연 {PRICING.yearly.price} · <em>{PRICING.yearly.note}</em>
          </p>
          <p className="price-card__desc">무제한 등록 · 갱신 알림 · 카테고리 분석 · 연간 리포트 · 해지 추천</p>
          <Link className="btn btn--solid btn--block" to="/signup">
            프리미엄 시작하기
          </Link>
        </article>
      </div>
    </Section>
  );
}
