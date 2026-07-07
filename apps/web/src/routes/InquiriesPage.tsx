import { useState } from 'react';
import type { Inquiry } from '@sub-keeper/core';
import { useInquiries } from '../lib/useInquiries';
import { InquiryForm } from './InquiryForm';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR');
}

export function InquiriesPage() {
  const { items, loading, error, reload } = useInquiries();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="page page--narrow">
      <div className="page__head">
        <h1 className="page__title">문의하기</h1>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="ui-btn ui-btn--primary"
        >
          문의 작성
        </button>
      </div>

      <p className="page__subtitle">궁금한 점을 남기면 답변을 여기서 확인할 수 있어요.</p>

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
        ) : items.length === 0 ? (
          <div className="empty">
            <p className="empty__text">아직 남긴 문의가 없어요.</p>
            <div className="empty__action">
              <button
                type="button"
                className="ui-btn ui-btn--primary"
                onClick={() => setFormOpen(true)}
              >
                문의 작성
              </button>
            </div>
          </div>
        ) : (
          <ul className="inquiries">
            {items.map((inq) => (
              <InquiryItem key={inq.id} inquiry={inq} />
            ))}
          </ul>
        )}
      </div>

      {formOpen ? (
        <InquiryForm
          onCancel={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            void reload();
          }}
        />
      ) : null}
    </section>
  );
}

function InquiryItem({ inquiry }: { inquiry: Inquiry }) {
  const answered = inquiry.status === 'answered';
  return (
    <li className="inquiry">
      <div className="inquiry__head">
        <span className={answered ? 'inquiry__status inquiry__status--answered' : 'inquiry__status'}>
          {answered ? '답변 완료' : '답변 대기'}
        </span>
        <h2 className="inquiry__title">{inquiry.title}</h2>
        <span className="inquiry__meta">{formatDate(inquiry.createdAt)}</span>
      </div>
      <p className="inquiry__body">{inquiry.body}</p>
      {inquiry.answer ? (
        <div className="inquiry__answer">
          <div className="inquiry__answer-label">
            답변
            {inquiry.answeredAt ? ` · ${formatDate(inquiry.answeredAt)}` : ''}
          </div>
          <p className="inquiry__answer-body">{inquiry.answer}</p>
        </div>
      ) : null}
    </li>
  );
}
