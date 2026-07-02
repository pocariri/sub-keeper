import { useState } from 'react';
import {
  deleteSubscription,
  canAddSubscription,
  isPremiumActive,
  sortSubscriptions,
  presetToPrefill,
  FREE_SUBSCRIPTION_LIMIT,
} from '@sub-keeper/core';
import type { Subscription, SubscriptionSort, SubscriptionPrefill } from '@sub-keeper/core';
import { supabase } from '../lib/supabase';
import { useSubscriptions } from '../lib/useSubscriptions';
import { useProfile } from '../lib/useProfile';
import { useExchangeRates } from '../lib/useExchangeRates';
import { SubscriptionTable } from './SubscriptionTable';
import { SubscriptionForm } from './SubscriptionForm';
import { PresetPicker } from './PresetPicker';
import { SortSelect } from './SortSelect';

/** 열려 있는 모달 상태 */
type Modal =
  | null
  | { kind: 'picker' }
  | { kind: 'form'; initial: Subscription | null; prefill: SubscriptionPrefill | null };

export function SubscriptionsPage() {
  const { items, loading, error, reload } = useSubscriptions();
  const { profile } = useProfile();
  const rates = useExchangeRates();
  const [modal, setModal] = useState<Modal>(null);
  const [sort, setSort] = useState<SubscriptionSort>('renewal');

  const premium = isPremiumActive(profile);
  const atLimit = !canAddSubscription(profile, items.length);
  const sorted = sortSubscriptions(items, sort, rates);

  function openAdd() {
    setModal({ kind: 'picker' });
  }

  async function onDelete(s: Subscription) {
    if (!supabase) return;
    if (!window.confirm(`"${s.serviceName}" 구독을 삭제할까요?`)) return;
    try {
      await deleteSubscription(supabase, s.id);
      await reload();
    } catch (e) {
      window.alert(`삭제하지 못했습니다: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return (
    <section className="page">
      <div className="page__head">
        <h1 className="page__title">구독</h1>
        <button
          type="button"
          onClick={openAdd}
          disabled={atLimit}
          title={atLimit ? '무료 플랜 한도에 도달했습니다' : undefined}
          className="ui-btn ui-btn--primary"
        >
          구독 추가
        </button>
      </div>

      <p className="page__subtitle">
        {items.length}개 등록됨
        {premium ? ' · 프리미엄(무제한)' : ` · 무료 플랜 최대 ${FREE_SUBSCRIPTION_LIMIT}개`}
        {atLimit ? ' · 한도 도달, 프리미엄에서 무제한' : ''}
      </p>

      <div className="page__section">
        {loading ? (
          <div className="skeleton">
            <div className="skeleton__line" />
            <div className="skeleton__line" />
            <div className="skeleton__line" />
          </div>
        ) : error ? (
          <p className="state state--error">
            구독을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. ({error})
          </p>
        ) : items.length === 0 ? (
          <div className="empty">
            <p className="empty__text">아직 등록한 구독이 없어요.</p>
            <div className="empty__action">
              <button type="button" className="ui-btn ui-btn--primary" onClick={openAdd} disabled={atLimit}>
                구독 추가
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="list-head list-head--end">
              <SortSelect value={sort} onChange={setSort} />
            </div>
            <div className="table-scroll">
              <SubscriptionTable
                items={sorted}
                onEdit={(s) => setModal({ kind: 'form', initial: s, prefill: null })}
                onDelete={onDelete}
              />
            </div>
          </>
        )}
      </div>

      {modal?.kind === 'picker' ? (
        <PresetPicker
          onSelect={(p) => setModal({ kind: 'form', initial: null, prefill: presetToPrefill(p) })}
          onManual={() => setModal({ kind: 'form', initial: null, prefill: null })}
          onCancel={() => setModal(null)}
        />
      ) : null}

      {modal?.kind === 'form' ? (
        <SubscriptionForm
          initial={modal.initial}
          prefill={modal.prefill}
          onCancel={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            void reload();
          }}
        />
      ) : null}
    </section>
  );
}
