import { sortSubscriptions, daysUntil, formatMoney } from '@sub-keeper/core';
import { useSubscriptions } from '../lib/useSubscriptions';
import { categoryLabel } from '../lib/labels';

function ddayLabel(d: number): string {
  if (d < 0) return '지남';
  if (d === 0) return '오늘';
  return `D-${d}`;
}

export function RenewalsPage() {
  const { items, loading, error } = useSubscriptions();

  // 활성 구독을 결제일 임박 순(오름차순)으로 — 기간 필터 없음 (prd-landing.md 4.5)
  const list = sortSubscriptions(
    items.filter((s) => s.isActive),
    'renewal',
  );

  return (
    <section className="page">
      <h1 className="page__title">갱신 임박</h1>
      <p className="page__subtitle">다음 결제일이 가까운 순</p>

      <div className="page__section">
        {loading ? (
          <div className="skeleton">
            <div className="skeleton__line" />
            <div className="skeleton__line" />
            <div className="skeleton__line" />
          </div>
        ) : error ? (
          <p className="state state--error">
            불러오지 못했습니다. 잠시 후 다시 시도해 주세요. ({error})
          </p>
        ) : list.length === 0 ? (
          <div className="empty">
            <p className="empty__text">예정된 갱신이 없어요. 활성 구독을 추가하면 여기에 표시됩니다.</p>
          </div>
        ) : (
          <ul className="renewals">
            {list.map((s) => {
              const d = daysUntil(s.nextBillingAt);
              const urgent = d <= 3;
              return (
                <li key={s.id} className="renewal">
                  <span className={urgent ? 'dday dday--urgent' : 'dday'}>{ddayLabel(d)}</span>
                  <div className="renewal__main">
                    <div className="renewal__name">{s.serviceName}</div>
                    <div className="renewal__meta">
                      {categoryLabel(s.category)} · {s.nextBillingAt}
                    </div>
                  </div>
                  <div className="renewal__price">{formatMoney(s.amount, s.currency)}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
