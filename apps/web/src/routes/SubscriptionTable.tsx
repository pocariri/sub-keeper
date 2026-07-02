import { formatMoney } from '@sub-keeper/core';
import type { Subscription } from '@sub-keeper/core';
import { CYCLE_LABELS, categoryLabel } from '../lib/labels';

interface Props {
  items: Subscription[];
  onEdit?: (s: Subscription) => void;
  onDelete?: (s: Subscription) => void;
}

export function SubscriptionTable({ items, onEdit, onDelete }: Props) {
  const showActions = Boolean(onEdit || onDelete);
  return (
    <table className="subs-table">
      <thead>
        <tr>
          <th>서비스</th>
          <th>금액</th>
          <th>주기</th>
          <th>카테고리</th>
          <th>다음 결제일</th>
          <th>상태</th>
          {showActions ? <th></th> : null}
        </tr>
      </thead>
      <tbody>
        {items.map((s) => (
          <tr key={s.id}>
            <td>{s.serviceName}</td>
            <td className="subs-table__num">{formatMoney(s.amount, s.currency)}</td>
            <td>
              {CYCLE_LABELS[s.billingCycle]}
              {s.billingCycle === 'custom' && s.customDays ? ` (${s.customDays}일)` : ''}
            </td>
            <td>{categoryLabel(s.category)}</td>
            <td className="subs-table__num">{s.nextBillingAt}</td>
            <td className={s.isActive ? undefined : 'subs-table__muted'}>
              {s.isActive ? '활성' : '중지'}
            </td>
            {showActions ? (
              <td className="subs-table__actions">
                {onEdit ? (
                  <button type="button" onClick={() => onEdit(s)} className="ui-link">
                    수정
                  </button>
                ) : null}
                {onDelete ? (
                  <button
                    type="button"
                    onClick={() => onDelete(s)}
                    className="ui-link ui-link--muted"
                  >
                    삭제
                  </button>
                ) : null}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
