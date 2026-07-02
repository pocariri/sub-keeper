import { useEffect, useState } from 'react';
import { filterPresets, formatMoney } from '@sub-keeper/core';
import type { ServicePreset } from '@sub-keeper/core';
import { useServicePresets } from '../lib/useServicePresets';
import { CYCLE_LABELS, categoryLabel } from '../lib/labels';

interface Props {
  /** 프리셋 선택 */
  onSelect: (preset: ServicePreset) => void;
  /** 프리셋 없이 빈 폼으로 직접 입력 */
  onManual: () => void;
  onCancel: () => void;
}

function presetMeta(p: ServicePreset): string {
  const cat = categoryLabel(p.category);
  if (p.defaultAmount == null) return `${cat} · 요금 직접 입력`;
  return `${cat} · ${formatMoney(p.defaultAmount, p.defaultCurrency)} / ${CYCLE_LABELS[p.defaultBillingCycle]}`;
}

export function PresetPicker({ onSelect, onManual, onCancel }: Props) {
  const { presets, loading, error } = useServicePresets();
  const [query, setQuery] = useState('');

  // Esc 로 닫기
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  const results = filterPresets(presets, query);

  return (
    <div className="form-overlay" onClick={onCancel}>
      <div
        className="form-panel"
        role="dialog"
        aria-label="구독 추가 — 서비스 선택"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="preset-head">
          <h2 className="form-title">구독 추가</h2>
          <button type="button" className="ui-btn ui-btn--secondary ui-btn--sm" onClick={onManual}>
            직접 입력
          </button>
        </div>
        <p className="form-hint">서비스를 고르면 이름·금액·통화·카테고리·주기가 채워져요.</p>

        <input
          className="ui-input"
          type="search"
          placeholder="서비스 검색 (예: Netflix)"
          aria-label="서비스 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />

        {loading ? (
          <div className="skeleton">
            <div className="skeleton__line" />
            <div className="skeleton__line" />
            <div className="skeleton__line" />
          </div>
        ) : error ? (
          <p className="state state--error">
            프리셋을 불러오지 못했습니다. “직접 입력”으로 추가할 수 있어요. ({error})
          </p>
        ) : results.length === 0 ? (
          <p className="state">
            {query.trim()
              ? '검색 결과가 없어요. “직접 입력”으로 추가하세요.'
              : '표시할 프리셋이 없어요. “직접 입력”으로 추가하세요.'}
          </p>
        ) : (
          <ul className="preset-list">
            {results.map((p) => (
              <li key={p.id}>
                <button type="button" className="preset-item" onClick={() => onSelect(p)}>
                  <span className="preset-item__name">{p.name}</span>
                  <span className="preset-item__meta">{presetMeta(p)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
