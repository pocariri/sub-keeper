import { z } from 'zod';
import type { SubscriptionInput } from '../types/subscription';

/** 구독 입력값 검증 스키마 — CRUD 폼(웹·모바일 공통)에서 사용 */
export const subscriptionInputSchema = z
  .object({
    serviceName: z.string().min(1, '서비스명을 입력하세요'),
    amount: z.number().nonnegative('금액은 0 이상이어야 합니다'),
    currency: z.enum(['KRW', 'USD', 'EUR', 'JPY']),
    billingCycle: z.enum(['weekly', 'monthly', 'yearly', 'custom']),
    customDays: z.number().int().positive().nullable(),
    nextBillingAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 합니다'),
    category: z.enum([
      'entertainment',
      'productivity',
      'cloud',
      'education',
      'news',
      'game',
      'shopping',
      'health',
      'finance',
      'etc',
    ]),
    paymentMethod: z.string().min(1, '결제수단을 입력하세요'),
    memo: z.string().nullable(),
    isActive: z.boolean(),
  })
  .refine(
    (v) => v.billingCycle !== 'custom' || v.customDays != null,
    { message: 'custom 주기에서는 customDays가 필요합니다', path: ['customDays'] },
  );

/** zod 추론 타입이 도메인 타입과 일치하는지 컴파일 타임 확인 */
export type SubscriptionInputSchema = z.infer<typeof subscriptionInputSchema>;
const _typeCheck: SubscriptionInput = {} as SubscriptionInputSchema;
void _typeCheck;
