import { SUBSCRIPTION_SORTS } from '@sub-keeper/core';
import type { SubscriptionSort } from '@sub-keeper/core';

export function SortSelect({
  value,
  onChange,
}: {
  value: SubscriptionSort;
  onChange: (sort: SubscriptionSort) => void;
}) {
  return (
    <select
      className="ui-select ui-select--sm"
      value={value}
      onChange={(e) => onChange(e.target.value as SubscriptionSort)}
      aria-label="정렬 기준"
    >
      {SUBSCRIPTION_SORTS.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
