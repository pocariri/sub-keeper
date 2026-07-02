/**
 * 서비스 프리셋 도메인 타입.
 * DB 스키마(prd-app.md 3.2)의 `service_presets` 테이블과 대응.
 * 전 사용자 공유·읽기 전용 참조 데이터 — 구독 추가 시 입력을 미리 채우는 용도.
 */
import type { BillingCycle, CurrencyCode, CategoryId } from './subscription';

/** 인기 서비스 프리셋 1건 (읽기 전용) */
export interface ServicePreset {
  id: string;
  /** 서비스명 (검색/자동완성 키) */
  name: string;
  /** 앱 카테고리 — DB의 라벨 문자열을 CategoryId 로 매핑해 보관 */
  category: CategoryId;
  /** 대표 요금(예시값). 없을 수 있음 → 사용자가 직접 입력 */
  defaultAmount: number | null;
  defaultCurrency: CurrencyCode;
  defaultBillingCycle: BillingCycle;
  logoUrl: string | null;
  sortOrder: number;
}

/**
 * 프리셋 선택 시 폼(새 구독)에 자동으로 채울 값.
 * 다음 결제일·결제수단·메모는 사용자가 입력하므로 여기 포함하지 않는다.
 */
export interface SubscriptionPrefill {
  serviceName: string;
  amount: number | null;
  currency: CurrencyCode;
  billingCycle: BillingCycle;
  category: CategoryId;
}
