import { PRODUCT } from '../content';

export function Footer() {
  const year = 2026;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__logo">{PRODUCT.name}</p>
          <p className="footer__tagline">흩어진 구독, 한 곳에서.</p>
        </div>

        <nav className="footer__cols" aria-label="푸터">
          <div className="footer__col">
            <p className="footer__col-title">제품</p>
            <a href="#features">기능</a>
            <a href="#plans">요금제</a>
            <a href="#pricing">가격</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">회사</p>
            <a href="#main">소개</a>
            <a href="#main">블로그</a>
            <a href="#main">문의</a>
          </div>
          <div className="footer__col">
            <p className="footer__col-title">약관</p>
            <a href="#main">이용약관</a>
            <a href="#main">개인정보처리방침</a>
          </div>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p>
          © {year} {PRODUCT.name}. All rights reserved.
        </p>
        <p className="footer__meta">서울특별시 · contact@subkeeper.example</p>
      </div>
    </footer>
  );
}
