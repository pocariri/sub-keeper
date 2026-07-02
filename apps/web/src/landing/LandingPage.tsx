import './landing.css';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Preview } from './components/Preview';
import { Plans } from './components/Plans';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';

/**
 * 소개(랜딩) 페이지 — 비로그인 공개 진입점 "/".
 * 모든 스타일은 .lp 래퍼 스코프 안에서만 적용된다(앱 화면 무영향).
 */
export function LandingPage() {
  return (
    <div className="lp">
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <Preview />
        <Plans />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
