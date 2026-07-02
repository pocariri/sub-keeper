import { Link } from 'react-router-dom';
import { PRODUCT } from '../content';

export function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <p className="hero__eyebrow">구독 관리 서비스</p>
        <h1 id="hero-title" className="hero__title">
          {PRODUCT.tagline}
        </h1>
        <p className="hero__subtext">{PRODUCT.subtext}</p>
        <div className="hero__actions">
          <Link className="btn btn--solid btn--lg" to="/signup">
            무료로 시작하기
          </Link>
          <button className="btn btn--ghost btn--lg" type="button" onClick={() => scrollTo('features')}>
            기능 살펴보기
          </button>
        </div>
        <p className="hero__note">무료 플랜으로 구독 10개까지 · 신용카드 필요 없음</p>
      </div>
    </section>
  );
}
