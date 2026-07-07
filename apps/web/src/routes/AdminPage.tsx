import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { colors } from '@sub-keeper/core';
import type { SignupTrendPoint } from '@sub-keeper/core';
import { useAdminOverview } from '../lib/useAdminOverview';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR');
}

/** 'YYYY-MM' → 'YY.MM' (축 라벨) */
function monthLabel(month: string): string {
  return month.slice(2).replace('-', '.');
}

/** 관리자 대시보드 — 지표·가입 추이·회원 목록 (읽기 전용, prd-admin 3장) */
export function AdminPage() {
  const { overview, loading, error } = useAdminOverview();

  return (
    <section className="page">
      <h1 className="page__title">관리자</h1>
      <p className="page__subtitle">서비스 지표와 회원 현황 · 읽기 전용</p>

      {loading ? (
        <div className="skeleton page__section">
          <div className="skeleton__line" style={{ height: 96 }} />
          <div className="skeleton__line" style={{ height: 220 }} />
          <div className="skeleton__line" style={{ height: 160 }} />
        </div>
      ) : error ? (
        <p className="state state--error" style={{ marginTop: 'var(--sp-6)' }}>
          지표를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. ({error})
        </p>
      ) : overview ? (
        <>
          {/* 핵심 지표 */}
          <div className="stat-grid">
            <Stat label="총 회원" value={`${overview.totalMembers}명`} />
            <Stat
              label="프리미엄 이용률"
              value={`${Math.round(overview.premiumRate * 100)}%`}
              sub={`프리미엄 ${overview.premiumMembers}명 / 총 ${overview.totalMembers}명`}
            />
            <Stat
              label="활성 구독"
              value={`${overview.activeSubscriptions}개`}
              sub={`전체 ${overview.totalSubscriptions}개`}
            />
          </div>

          {/* 신규 가입 추이 */}
          <div className="page__section">
            <div className="field-label">신규 가입 추이 (최근 6개월)</div>
            <div className="panel" style={{ marginTop: 'var(--sp-3)' }}>
              <SignupChart data={overview.signupTrend} />
            </div>
          </div>

          {/* 결제 지표 — 결제 모듈 이후 */}
          <div className="page__section">
            <div className="field-label">결제 지표</div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--sp-4)',
                marginTop: 'var(--sp-3)',
              }}
            >
              <div className="empty" style={{ flex: 1, minWidth: 240 }}>
                <p className="empty__text">매출 추이 — 결제 데이터가 쌓이면 표시됩니다.</p>
              </div>
              <div className="empty" style={{ flex: 1, minWidth: 240 }}>
                <p className="empty__text">해지율 — 결제 데이터가 쌓이면 표시됩니다.</p>
              </div>
            </div>
          </div>

          {/* 회원 목록 */}
          <div className="page__section">
            <div className="field-label">회원 목록</div>
            {overview.members.length === 0 ? (
              <div className="empty" style={{ marginTop: 'var(--sp-3)' }}>
                <p className="empty__text">아직 가입한 회원이 없어요.</p>
              </div>
            ) : (
              <div className="table-scroll" style={{ marginTop: 'var(--sp-3)' }}>
                <table className="subs-table">
                  <thead>
                    <tr>
                      <th>이메일</th>
                      <th>플랜</th>
                      <th>구독</th>
                      <th>활성 구독</th>
                      <th>가입일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.members.map((m) => (
                      <tr key={m.id}>
                        <td>{m.email || m.id}</td>
                        <td>{m.premiumActive ? '프리미엄' : '무료'}</td>
                        <td className="subs-table__num">{m.subscriptionCount}</td>
                        <td className="subs-table__num">
                          {m.activeSubscriptionCount === 0 ? (
                            <span className="subs-table__muted">0</span>
                          ) : (
                            m.activeSubscriptionCount
                          )}
                        </td>
                        <td>{formatDate(m.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
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

/** 월별 신규 가입 바 차트 — 단일 시리즈·무채색(토큰 gray 램프만) */
function SignupChart({ data }: { data: SignupTrendPoint[] }) {
  if (!data.some((d) => d.count > 0)) {
    return <p className="state">최근 6개월 신규 가입이 없어요.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid vertical={false} stroke={colors.gray[200]} />
        <XAxis
          dataKey="month"
          tickFormatter={monthLabel}
          tickLine={false}
          axisLine={{ stroke: colors.gray[200] }}
          tick={{ fill: colors.gray[500], fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: colors.gray[500], fontSize: 12 }}
        />
        <Tooltip cursor={{ fill: colors.gray[100] }} content={<ChartTip />} />
        <Bar dataKey="count" fill={colors.gray[700]} radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: colors.white,
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: 8,
        padding: '6px 10px',
        fontSize: 13,
        color: colors.gray[900],
      }}
    >
      {monthLabel(String(label))} · 신규 {payload[0]?.value ?? 0}명
    </div>
  );
}
