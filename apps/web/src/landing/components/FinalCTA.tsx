import { Link } from 'react-router-dom';
import { PRODUCT } from '../content';

export function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="cta-title">
      <div className="container final-cta__inner">
        <h2 id="cta-title" className="final-cta__title">
          오늘부터 구독을 한 곳에서
        </h2>
        <p className="final-cta__sub">
          {PRODUCT.name}로 결제일과 총액을 정리하고, 다음 갱신을 미리 챙기세요.
        </p>
        <div className="final-cta__actions">
          <Link className="btn btn--solid btn--lg" to="/signup">
            무료로 시작하기
          </Link>
          <Link className="btn btn--ghost btn--lg" to="/login">
            로그인
          </Link>
        </div>
        <p className="final-cta__note">소셜 로그인 · 아이디/비밀번호 로그인 모두 지원</p>
      </div>
    </section>
  );
}
