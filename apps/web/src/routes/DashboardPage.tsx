import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  totalsByCurrency,
  formatMoney,
  sortSubscriptions,
  FREE_SUBSCRIPTION_LIMIT,
} from '@sub-keeper/core';
import type { CurrencyCode, SubscriptionSort } from '@sub-keeper/core';
import { useSubscriptions } from '../lib/useSubscriptions';
import { useExchangeRates } from '../lib/useExchangeRates';
import { SubscriptionTable } from './SubscriptionTable';
import { SortSelect } from './SortSelect';

export function DashboardPage() {
  const { items, loading, error } = useSubscriptions();
  const rates = useExchangeRates();
  const [sort, setSort] = useState<SubscriptionSort>('renewal');

  const monthly = totalsByCurrency(items, 'monthly');
  const yearly = totalsByCurrency(items, 'yearly');
  const currencies = Object.keys(monthly) as CurrencyCode[];
  const activeCount = items.filter((s) => s.isActive).length;
  const sorted = sortSubscriptions(items, sort, rates);

  return (
    <section className="page">
      <h1 className="page__title">대시보드</h1>

      {error ? (
        <p className="state state--error" style={{ marginTop: 'var(--sp-6)' }}>
          구독을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. ({error})
        </p>
      ) : loading ? (
        <>
          <div className="stat-grid">
            <div className="stat">
              <div className="stat__label">월 환산 총액</div>
              <div className="skeleton" style={{ marginTop: 'var(--sp-2)' }}>
                <div className="skeleton__line" style={{ height: 28, width: 120 }} />
              </div>
            </div>
          </div>
          <div className="skeleton page__section">
            <div className="skeleton__line" />
            <div className="skeleton__line" />
            <div className="skeleton__line" />
          </div>
        </>
      ) : (
        <>
          {/* 총액 카드 (통화별) */}
          <div className="stat-grid">
            {currencies.length === 0 ? (
              <Stat label="월 환산 총액" value="—" />
            ) : (
              currencies.map((c) => (
                <Stat
                  key={c}
                  label={`월 환산 총액 (${c})`}
                  value={formatMoney(monthly[c] ?? 0, c)}
                  sub={`연 ${formatMoney(yearly[c] ?? 0, c)}`}
                />
              ))
            )}
            <Stat
              label="등록 구독"
              value={`${activeCount}개`}
              sub={`무료 플랜 최대 ${FREE_SUBSCRIPTION_LIMIT}개`}
            />
          </div>

          {/* 목록 */}
          <div className="page__section">
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="list-head">
                  <span className="list-head__label">구독 목록</span>
                  <SortSelect value={sort} onChange={setSort} />
                </div>
                <div className="table-scroll">
                  <SubscriptionTable items={sorted} />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      {sub ? <div className="stat__sub">{sub}</div> : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty">
      <p className="empty__text">아직 등록한 구독이 없어요.</p>
      <div className="empty__action">
        <Link className="ui-btn ui-btn--primary" to="/app/subscriptions">
          첫 구독 추가
        </Link>
      </div>
    </div>
  );
}
