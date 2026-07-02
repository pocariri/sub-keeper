import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  CATEGORIES,
  subscriptionInputSchema,
  createSubscription,
  updateSubscription,
} from '@sub-keeper/core';
import type {
  Subscription,
  SubscriptionInput,
  SubscriptionPrefill,
  BillingCycle,
  CurrencyCode,
} from '@sub-keeper/core';
import { supabase } from '../lib/supabase';
import { CYCLE_LABELS } from '../lib/labels';

const CURRENCIES: CurrencyCode[] = ['KRW', 'USD', 'EUR', 'JPY'];
const CYCLES: BillingCycle[] = ['weekly', 'monthly', 'yearly', 'custom'];

interface Props {
  initial: Subscription | null;
  /** 새 구독일 때 프리셋에서 채워 넣을 초기값 (수정 시엔 무시) */
  prefill?: SubscriptionPrefill | null;
  onSaved: () => void;
  onCancel: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function SubscriptionForm({ initial, prefill = null, onSaved, onCancel }: Props) {
  const [serviceName, setServiceName] = useState(
    initial?.serviceName ?? prefill?.serviceName ?? '',
  );
  const [amount, setAmount] = useState(
    initial ? String(initial.amount) : prefill?.amount != null ? String(prefill.amount) : '',
  );
  const [currency, setCurrency] = useState<CurrencyCode>(
    initial?.currency ?? prefill?.currency ?? 'KRW',
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initial?.billingCycle ?? prefill?.billingCycle ?? 'monthly',
  );
  const [customDays, setCustomDays] = useState(initial?.customDays ? String(initial.customDays) : '');
  const [nextBillingAt, setNextBillingAt] = useState(initial?.nextBillingAt ?? todayISO());
  const [category, setCategory] = useState(
    initial?.category ?? prefill?.category ?? CATEGORIES[0].id,
  );
  const [paymentMethod, setPaymentMethod] = useState(initial?.paymentMethod ?? '');
  const [memo, setMemo] = useState(initial?.memo ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const input: SubscriptionInput = {
      serviceName: serviceName.trim(),
      amount: Number(amount),
      currency,
      billingCycle,
      customDays: billingCycle === 'custom' ? Number(customDays) : null,
      nextBillingAt,
      category,
      paymentMethod: paymentMethod.trim(),
      memo: memo.trim() ? memo.trim() : null,
      isActive,
    };

    const parsed = subscriptionInputSchema.safeParse(input);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (!fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});

    if (!supabase) {
      setSubmitError('Supabase 가 설정되지 않았습니다.');
      return;
    }

    setBusy(true);
    try {
      if (initial) {
        await updateSubscription(supabase, initial.id, parsed.data);
      } else {
        await createSubscription(supabase, parsed.data);
      }
      onSaved();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form-overlay" onClick={onCancel}>
      <form className="form-panel" onClick={(e) => e.stopPropagation()} onSubmit={onSubmit}>
        <h2 className="form-title">{initial ? '구독 수정' : '구독 추가'}</h2>
        {!initial && prefill ? (
          <p className="form-hint">
            {prefill.serviceName} 정보를 채웠어요. 다음 결제일·결제수단을 입력하고 필요하면 금액도
            수정하세요.
          </p>
        ) : null}

        <Field label="서비스명" error={errors.serviceName}>
          <input
            className="ui-input"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </Field>

        <div className="form-row">
          <Field label="금액" error={errors.amount} style={{ flex: 2 }}>
            <input
              className="ui-input"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Field>
          <Field label="통화" style={{ flex: 1 }}>
            <select
              className="ui-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="form-row">
          <Field label="결제 주기" style={{ flex: 1 }}>
            <select
              className="ui-select"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
            >
              {CYCLES.map((c) => (
                <option key={c} value={c}>
                  {CYCLE_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          {billingCycle === 'custom' ? (
            <Field label="주기(일)" error={errors.customDays} style={{ flex: 1 }}>
              <input
                className="ui-input"
                type="number"
                min="1"
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
              />
            </Field>
          ) : null}
        </div>

        <Field label="다음 결제일" error={errors.nextBillingAt}>
          <input
            className="ui-input"
            type="date"
            value={nextBillingAt}
            onChange={(e) => setNextBillingAt(e.target.value)}
          />
        </Field>

        <Field label="카테고리">
          <select
            className="ui-select"
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="결제수단" error={errors.paymentMethod}>
          <input
            className="ui-input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </Field>

        <Field label="메모 (선택)">
          <textarea
            className="ui-textarea"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </Field>

        <label className="form-check">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          활성 상태
        </label>

        {submitError ? <p className="form-error">저장하지 못했습니다: {submitError}</p> : null}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="ui-btn ui-btn--secondary">
            취소
          </button>
          <button type="submit" disabled={busy} className="ui-btn ui-btn--primary">
            {busy ? '저장 중…' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  style,
  children,
}: {
  label: string;
  error?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <label className="form-field" style={style}>
      <span className="form-field__label">{label}</span>
      {children}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
