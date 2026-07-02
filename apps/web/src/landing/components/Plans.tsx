import { Link } from 'react-router-dom';
import { Section } from './Section';
import { PLAN_FEATURES } from '../content';

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="cell cell--yes" aria-label="제공">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path
            d="M3 8.5l3 3 7-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="cell cell--no" aria-label="미제공">
        —
      </span>
    );
  }
  return <span className="cell cell--text">{value}</span>;
}

export function Plans() {
  return (
    <Section
      id="plans"
      eyebrow="요금제 비교"
      title="무료로 시작하고, 필요할 때 프리미엄으로"
      lead="작게 쓰기에는 무료로 충분합니다. 알림·분석·리포트가 필요해지면 프리미엄으로 올리세요."
    >
      <div className="plan-table" role="table" aria-label="무료와 프리미엄 요금제 비교">
        <div className="plan-table__row plan-table__row--head" role="row">
          <span className="plan-table__th" role="columnheader">
            구분
          </span>
          <span className="plan-table__th" role="columnheader">
            무료
          </span>
          <span className="plan-table__th plan-table__th--featured" role="columnheader">
            프리미엄
          </span>
        </div>

        {PLAN_FEATURES.map((row) => (
          <div className="plan-table__row" role="row" key={row.label}>
            <span className="plan-table__rowlabel" role="rowheader">
              {row.label}
            </span>
            <span className="plan-table__cell" role="cell">
              <Cell value={row.free} />
            </span>
            <span className="plan-table__cell plan-table__cell--featured" role="cell">
              <Cell value={row.premium} />
            </span>
          </div>
        ))}

        <div className="plan-table__row plan-table__row--foot" role="row">
          <span className="plan-table__rowlabel" role="rowheader" />
          <span className="plan-table__cell" role="cell">
            <Link className="btn btn--ghost" to="/signup">
              무료로 시작
            </Link>
          </span>
          <span className="plan-table__cell plan-table__cell--featured" role="cell">
            <Link className="btn btn--solid" to="/signup">
              프리미엄 시작
            </Link>
          </span>
        </div>
      </div>
    </Section>
  );
}
