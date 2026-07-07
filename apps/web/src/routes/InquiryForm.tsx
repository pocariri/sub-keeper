import { useState, type FormEvent, type ReactNode } from 'react';
import { inquiryInputSchema, createInquiry } from '@sub-keeper/core';
import { supabase } from '../lib/supabase';

interface Props {
  onSaved: () => void;
  onCancel: () => void;
}

export function InquiryForm({ onSaved, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const parsed = inquiryInputSchema.safeParse({ title, body });
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
      await createInquiry(supabase, parsed.data);
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
        <h2 className="form-title">문의 작성</h2>
        <p className="form-hint">답변이 등록되면 문의 목록에서 확인할 수 있어요.</p>

        <Field label="제목" error={errors.title}>
          <input
            className="ui-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="무엇이 궁금한가요?"
          />
        </Field>

        <Field label="내용" error={errors.body}>
          <textarea
            className="ui-textarea"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="상황을 자세히 적을수록 정확한 답변을 받을 수 있어요."
          />
        </Field>

        {submitError ? <p className="form-error">등록하지 못했습니다: {submitError}</p> : null}

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="ui-btn ui-btn--secondary">
            취소
          </button>
          <button type="submit" disabled={busy} className="ui-btn ui-btn--primary">
            {busy ? '등록 중…' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {error ? <span className="form-field__error">{error}</span> : null}
    </label>
  );
}
