import type { Profile, Plan } from '../types/user';
import type { Subscription } from '../types/subscription';
import { isPremiumActive } from './plan';

/** 관리자 회원 목록 1행 */
export interface AdminMemberRow {
  id: string;
  email: string;
  plan: Plan;
  /** 만료 반영한 현재 프리미엄 유효 여부 */
  premiumActive: boolean;
  subscriptionCount: number;
  activeSubscriptionCount: number;
  createdAt: string;
}

/** 월별 신규 가입 수 (month = 'YYYY-MM') */
export interface SignupTrendPoint {
  month: string;
  count: number;
}

/** 관리자 대시보드 집계 결과 */
export interface AdminOverview {
  totalMembers: number;
  premiumMembers: number;
  /** 0~1. 회원 0명이면 0 */
  premiumRate: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  members: AdminMemberRow[];
  signupTrend: SignupTrendPoint[];
}

/** 가입 추이 창 크기 (개월) */
const TREND_MONTHS = 6;

function monthKey(d: Date): string {
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  return `${d.getUTCFullYear()}-${m}`;
}

/**
 * 관리자 대시보드용 집계 — 순수 함수.
 * profiles/subscriptions 는 관리자 권한으로 조회한 전체 데이터를 전제
 * (범위 자체는 DB RLS 가 통제).
 */
export function buildAdminOverview(
  profiles: Profile[],
  subscriptions: Subscription[],
  now: Date = new Date(),
): AdminOverview {
  const subsByUser = new Map<string, { total: number; active: number }>();
  for (const s of subscriptions) {
    const c = subsByUser.get(s.userId) ?? { total: 0, active: 0 };
    c.total += 1;
    if (s.isActive) c.active += 1;
    subsByUser.set(s.userId, c);
  }

  const members: AdminMemberRow[] = profiles.map((p) => {
    const c = subsByUser.get(p.id) ?? { total: 0, active: 0 };
    return {
      id: p.id,
      email: p.email,
      plan: p.plan,
      premiumActive: isPremiumActive(p, now),
      subscriptionCount: c.total,
      activeSubscriptionCount: c.active,
      createdAt: p.createdAt,
    };
  });

  const premiumMembers = members.filter((m) => m.premiumActive).length;

  // 최근 TREND_MONTHS 개월을 0으로 채운 뒤 월별 가입 수 집계 (UTC 기준)
  const trend = new Map<string, number>();
  for (let i = TREND_MONTHS - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    trend.set(monthKey(d), 0);
  }
  for (const p of profiles) {
    const key = monthKey(new Date(p.createdAt));
    if (trend.has(key)) trend.set(key, (trend.get(key) ?? 0) + 1);
  }

  return {
    totalMembers: profiles.length,
    premiumMembers,
    premiumRate: profiles.length === 0 ? 0 : premiumMembers / profiles.length,
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter((s) => s.isActive).length,
    members,
    signupTrend: [...trend.entries()].map(([month, count]) => ({ month, count })),
  };
}
