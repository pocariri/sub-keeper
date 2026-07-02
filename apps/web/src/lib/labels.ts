import { CATEGORIES } from '@sub-keeper/core';
import type { BillingCycle, CategoryId } from '@sub-keeper/core';

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: '주간',
  monthly: '월간',
  yearly: '연간',
  custom: '커스텀',
};

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
