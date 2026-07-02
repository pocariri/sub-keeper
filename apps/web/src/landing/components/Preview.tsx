import { Section } from './Section';
import { MOCK_SUBSCRIPTIONS, MOCK_CATEGORIES, MOCK_UPCOMING } from '../content';

function DashboardMock() {
  return (
    <figure className="mock">
      <figcaption className="mock__bar">
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__title">대시보드</span>
      </figcaption>
      <div className="mock__body">
        <div className="mock__summary">
          <div>
            <p className="mock__summary-label">이번 달 총액</p>
            <p className="mock__summary-value">63,100원</p>
          </div>
          <div>
            <p className="mock__summary-label">등록 구독</p>
            <p className="mock__summary-value">5개</p>
          </div>
        </div>
        <ul className="mock__list" role="list">
          {MOCK_SUBSCRIPTIONS.map((s) => (
            <li key={s.name} className="mock__row">
              <span className="mock__avatar" aria-hidden="true">
                {s.name.charAt(0)}
              </span>
              <span className="mock__row-main">
                <span className="mock__row-name">{s.name}</span>
                <span className="mock__row-sub">
                  {s.category} · {s.cycle}간
                </span>
              </span>
              <span className="mock__row-price">{s.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

function ChartMock() {
  return (
    <figure className="mock">
      <figcaption className="mock__bar">
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__title">카테고리별 분석</span>
      </figcaption>
      <div className="mock__body">
        <ul className="bars" role="list">
          {MOCK_CATEGORIES.map((c) => (
            <li key={c.label} className="bars__item">
              <span className="bars__label">{c.label}</span>
              <span className="bars__track" aria-hidden="true">
                <span className="bars__fill" style={{ width: `${Math.round(c.ratio * 100)}%` }} />
              </span>
              <span className="bars__value">{Math.round(c.ratio * 100)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

function UpcomingMock() {
  return (
    <figure className="mock">
      <figcaption className="mock__bar">
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__dot" />
        <span className="mock__title">갱신 임박</span>
      </figcaption>
      <div className="mock__body">
        <ul className="mock__list" role="list">
          {MOCK_UPCOMING.map((u) => (
            <li key={u.name} className="mock__row">
              <span className="mock__row-main">
                <span className="mock__row-name">{u.name}</span>
                <span className="mock__row-sub">{u.date} 결제 예정</span>
              </span>
              <span className="mock__due">{u.due}</span>
              <span className="mock__row-price">{u.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

export function Preview() {
  return (
    <Section
      id="preview"
      eyebrow="화면 미리보기"
      title="복잡한 구독이, 한 화면에 정리됩니다"
      lead="대시보드에서 총액을, 분석 차트에서 지출 패턴을, 갱신 임박 목록에서 다가오는 결제를 확인하세요."
      className="section--muted"
    >
      <div className="preview-grid">
        <DashboardMock />
        <div className="preview-stack">
          <ChartMock />
          <UpcomingMock />
        </div>
      </div>
    </Section>
  );
}
