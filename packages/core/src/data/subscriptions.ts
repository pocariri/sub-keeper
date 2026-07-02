import type { SupabaseClient } from '../baas/client';
import type {
  Subscription,
  SubscriptionInput,
  BillingCycle,
  CurrencyCode,
  CategoryId,
} from '../types/subscription';

/** DB 행(snake_case) 형태 */
interface SubscriptionRow {
  id: string;
  user_id: string;
  service_name: string;
  amount: number | string;
  currency: string;
  billing_cycle: BillingCycle;
  custom_days: number | null;
  next_billing_at: string;
  category: string;
  payment_method: string | null;
  memo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TABLE = 'subscriptions';

function rowToSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    serviceName: row.service_name,
    amount: Number(row.amount),
    currency: row.currency as CurrencyCode,
    billingCycle: row.billing_cycle,
    customDays: row.custom_days,
    nextBillingAt: row.next_billing_at,
    category: row.category as CategoryId,
    paymentMethod: row.payment_method ?? '',
    memo: row.memo,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** 도메인 입력 → DB 컬럼(snake_case) */
function inputToColumns(input: SubscriptionInput) {
  return {
    service_name: input.serviceName,
    amount: input.amount,
    currency: input.currency,
    billing_cycle: input.billingCycle,
    custom_days: input.customDays,
    next_billing_at: input.nextBillingAt,
    category: input.category,
    payment_method: input.paymentMethod,
    memo: input.memo,
    is_active: input.isActive,
  };
}

/** 본인 구독 목록 (다음 결제일 오름차순) */
export async function listSubscriptions(
  client: SupabaseClient,
): Promise<Subscription[]> {
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('next_billing_at', { ascending: true });
  if (error) throw new Error(error.message);
  return (data as SubscriptionRow[]).map(rowToSubscription);
}

/** 구독 추가 (user_id 는 현재 세션에서 채움 → RLS insert 정책 충족) */
export async function createSubscription(
  client: SupabaseClient,
  input: SubscriptionInput,
): Promise<Subscription> {
  const {
    data: { user },
    error: userErr,
  } = await client.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await client
    .from(TABLE)
    .insert({ ...inputToColumns(input), user_id: user.id })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToSubscription(data as SubscriptionRow);
}

/** 구독 수정 */
export async function updateSubscription(
  client: SupabaseClient,
  id: string,
  input: SubscriptionInput,
): Promise<Subscription> {
  const { data, error } = await client
    .from(TABLE)
    .update(inputToColumns(input))
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToSubscription(data as SubscriptionRow);
}

/** 구독 삭제 */
export async function deleteSubscription(
  client: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await client.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
