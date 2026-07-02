import type { SupabaseClient } from '../baas/client';
import type { BillingCycle, CurrencyCode } from '../types/subscription';
import type { ServicePreset } from '../types/preset';
import { categoryIdFromLabel } from '../logic/preset';

/** DB 행(snake_case) 형태 */
interface ServicePresetRow {
  id: string;
  name: string;
  category: string;
  default_amount: number | string | null;
  default_currency: string;
  default_billing_cycle: BillingCycle;
  logo_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

function rowToPreset(row: ServicePresetRow): ServicePreset {
  return {
    id: row.id,
    name: row.name,
    category: categoryIdFromLabel(row.category),
    defaultAmount: row.default_amount == null ? null : Number(row.default_amount),
    defaultCurrency: row.default_currency as CurrencyCode,
    defaultBillingCycle: row.default_billing_cycle,
    logoUrl: row.logo_url,
    sortOrder: row.sort_order,
  };
}

/**
 * 활성 서비스 프리셋 목록 (sort_order 오름차순, 동순위는 이름순).
 * 읽기 전용 공유 참조 데이터 — RLS 가 is_active=true 만 노출한다.
 */
export async function listServicePresets(
  client: SupabaseClient,
): Promise<ServicePreset[]> {
  const { data, error } = await client
    .from('service_presets')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as ServicePresetRow[]).map(rowToPreset);
}
