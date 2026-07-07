import { useState } from 'react';
import type { InquiryStatus } from '@sub-keeper/core';
import { useAdminInquiries, type AdminInquiry } from '../lib/useAdminInquiries';
import { InquiryAnswerForm } from './InquiryAnswerForm';

type Filter = 'all' | InquiryStatus;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'open', label: '답변 대기' },
  { value: 'answered', label: '답변 완료' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR');
}

/** 관리자 문의 관리 — 전체 문의 목록·필터·답변 작성/수정 */
export function AdminInquiriesPage() {
  const { items, loading, error, reload } = useAdminInquiries();
  const [filter, setFilter] = useState<Filter>('all');
  const [target, setTarget] = useState<AdminInquiry | null>(null);

  const filtered = items.filter((q) => filter === 'all' || q.status === filter);
  // 답변 대기 먼저, 그 안에서는 최신순(목록이 이미 최신순으로 옴)
  const sorted = [...filtered].sort((a, b) =>
    a.status === b.status ? 0 : a.status === 'open' ? -1 : 1,
  );
  const openCount = items.filter((q) => q.status === 'open').length;

  return (
    <section className="page page--narrow">
      <div className="page__head">
        <h1 className="page__title">문의 관리</h1>
        <select
          className="ui-select ui-select--sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
          aria-label="문의 상태 필터"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <p className="page__subtitle">
        답변 대기 {openCount}건 · 전체 {items.length}건
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
            문의를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. ({error})
          </p>
        ) : sorted.length === 0 ? (
          <div className="empty">
            <p className="empty__text">
              {filter === 'open'
                ? '답변 대기 중인 문의가 없어요.'
                : filter === 'answered'
                  ? '답변 완료된 문의가 없어요.'
                  : '아직 들어온 문의가 없어요.'}
            </p>
          </div>
        ) : (
          <ul className="inquiries">
            {sorted.map((q) => (
              <li key={q.id} className="inquiry">
                <div className="inquiry__head">
                  <span
                    className={
                      q.status === 'answered'
                        ? 'inquiry__status inquiry__status--answered'
                        : 'inquiry__status'
                    }
                  >
                    {q.status === 'answered' ? '답변 완료' : '답변 대기'}
                  </span>
                  <h2 className="inquiry__title">{q.title}</h2>
                  <span className="inquiry__meta">
                    {q.email} · {formatDate(q.createdAt)}
                  </span>
                </div>
                <p className="inquiry__body">{q.body}</p>
                {q.answer ? (
                  <div className="inquiry__answer">
                    <div className="inquiry__answer-label">
                      답변
                      {q.answeredAt ? ` · ${formatDate(q.answeredAt)}` : ''}
                    </div>
                    <p className="inquiry__answer-body">{q.answer}</p>
                  </div>
                ) : null}
                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <button
                    type="button"
                    className="ui-btn ui-btn--secondary ui-btn--sm"
                    onClick={() => setTarget(q)}
                  >
                    {q.status === 'answered' ? '답변 수정' : '답변하기'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {target ? (
        <InquiryAnswerForm
          inquiry={target}
          onCancel={() => setTarget(null)}
          onSaved={() => {
            setTarget(null);
            void reload();
          }}
        />
      ) : null}
    </section>
  );
}
