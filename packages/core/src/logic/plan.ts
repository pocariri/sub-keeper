import type { Profile } from '../types/user';
import { FREE_SUBSCRIPTION_LIMIT } from '../constants/plans';

/** 프리미엄이 현재 유효한지 (plan=premium 이고 만료 전이거나 무기한) */
export function isPremiumActive(
  profile: Profile | null,
  now: Date = new Date(),
): boolean {
  if (!profile || profile.plan !== 'premium') return false;
  if (!profile.premiumUntil) return true;
  return new Date(profile.premiumUntil).getTime() > now.getTime();
}

/** 플랜별 구독 등록 한도 (무료 10개, 프리미엄 무제한) */
export function subscriptionLimit(profile: Profile | null): number {
  return isPremiumActive(profile) ? Infinity : FREE_SUBSCRIPTION_LIMIT;
}

/** 구독을 더 추가할 수 있는지 (현재 개수 기준) */
export function canAddSubscription(
  profile: Profile | null,
  currentCount: number,
): boolean {
  return currentCount < subscriptionLimit(profile);
}
