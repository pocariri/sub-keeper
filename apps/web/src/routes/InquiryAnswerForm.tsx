import { useState, type FormEvent } from 'react';
import { inquiryAnswerSchema, answerInquiry } from '@sub-keeper/core';
import { supabase } from '../lib/supabase';
import type { AdminInquiry } from '../lib/useAdminInquiries';

interface Props {
  inquiry: AdminInquiry;
  onSaved: () => void;
  onCancel: () => void;
}

/** 관리자 답변 작성/수정 모달 */
export function InquiryAnswerForm({ inquiry, onSaved, onCancel }: Props) {
  const editing = inquiry.status === 'answered';
  const [answer, setAnswer] = useState(inquiry.answer ?? '');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const parsed = inquiryAnswerSchema.safeParse({ answer });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? '입력을 확인하세요');
      return;
    }
    setFieldError(null);

    if (!supabase) {
      setSubmitError('Supabase 가 설정되지 않았습니다.');
      return;
    }

    setBusy(true);
    try {
      await answerInquiry(supabase, inquiry.id, parsed.data.answer);
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
        <h2 className="form-title">{editing ? '답변 수정' : '답변 작성'}</h2>

        {/* 질문 요약 — 사용자 화면의 답변 블록과 같은 회색 블록 스타일 재사용 */}
        <div className="inquiry__answer" style={{ marginTop: 0 }}>
          <div className="inquiry__answer-label">
            {inquiry.email} · {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
          </div>
          <p className="inquiry__answer-body" style={{ fontWeight: 500 }}>
            {inquiry.title}
          </p>
          <p className="inquiry__answer-body">{inquiry.body}</p>
        </div>

        <label className="form-field">
          <span className="form-field__label">답변</span>
          <textarea
            className="ui-textarea"
            rows={6}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="사용자에게 보낼 답변을 입력하세요."
          />
          {fieldError ? <span className="form-field__error">{fieldError}</span> : null}
        </label>

        {submitError ? <p className="form-error">저장하지 못했습니다: {submitError}</p> : null}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="ui-btn ui-btn--secondary">
            취소
          </button>
          <button type="submit" disabled={busy} className="ui-btn ui-btn--primary">
            {busy ? '저장 중…' : editing ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
