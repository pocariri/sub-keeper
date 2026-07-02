/**
 * 서비스 프리셋 관련 순수 로직 (웹·모바일 공유).
 * 카테고리 라벨↔id 매핑, 검색 필터, 폼 자동채움 변환.
 */
import { CATEGORIES } from '../constants/categories';
import type { CategoryId } from '../types/subscription';
import type { ServicePreset, SubscriptionPrefill } from '../types/preset';

/** DB의 카테고리 라벨 문자열 → CategoryId. 매칭 실패 시 'etc'. */
export function categoryIdFromLabel(label: string): CategoryId {
  return CATEGORIES.find((c) => c.label === label)?.id ?? 'etc';
}

/** 프리셋 목록을 이름으로 검색(대소문자 무시, 부분 일치). 빈 검색어면 전체 반환. */
export function filterPresets(
  presets: ServicePreset[],
  query: string,
): ServicePreset[] {
  const q = query.trim().toLowerCase();
  if (!q) return presets;
  return presets.filter((p) => p.name.toLowerCase().includes(q));
}

/** 프리셋 → 새 구독 폼 자동채움 값 (다음 결제일·결제수단·메모는 사용자 입력) */
export function presetToPrefill(preset: ServicePreset): SubscriptionPrefill {
  return {
    serviceName: preset.name,
    amount: preset.defaultAmount,
    currency: preset.defaultCurrency,
    billingCycle: preset.defaultBillingCycle,
    category: preset.category,
  };
}
