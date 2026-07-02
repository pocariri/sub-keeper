import { useEffect, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT, NAV } from '../content';
import { useSession } from '../../app/session';

export function Header() {
  const { session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 현재 보고 있는 섹션 감지(스크롤 스파이)
  useEffect(() => {
    const sections = NAV.map((item) => document.getElementById(item.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!sections.length) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        });
        let best = '';
        let bestRatio = -1;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        });
        if (best) setActiveId(best);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <a
          className="header__logo"
          href="#main"
          onClick={(e) => handleNav(e, 'main')}
          aria-label={`${PRODUCT.name} 홈`}
        >
          {PRODUCT.name}
        </a>

        <nav className={`header__nav ${menuOpen ? 'is-open' : ''}`} aria-label="주요 섹션">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={activeId === item.id ? 'is-active' : ''}
              aria-current={activeId === item.id ? 'true' : undefined}
              onClick={(e) => handleNav(e, item.id)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          {session ? (
            <Link className="btn btn--solid" to="/app">
              앱으로 가기
            </Link>
          ) : (
            <>
              <Link className="btn btn--ghost" to="/login">
                로그인
              </Link>
              <Link className="btn btn--solid" to="/signup">
                가입
              </Link>
            </>
          )}
        </div>

        <button
          className="header__menu-toggle"
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
