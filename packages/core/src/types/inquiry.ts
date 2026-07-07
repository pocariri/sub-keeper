/**
 * 1:1 문의 도메인 타입.
 * DB 스키마(supabase/migrations/0004_inquiries.sql)의 `inquiries` 테이블과 대응.
 */

/** 문의 상태 — 답변 전(open) / 답변 완료(answered) */
export type InquiryStatus = 'open' | 'answered';

/** 저장된 문의 1건 */
export interface Inquiry {
  id: string;
  userId: string;
  title: string;
  body: string;
  status: InquiryStatus;
  /** 관리자 답변 (없으면 null) */
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** 문의 작성 입력값 */
export type InquiryInput = Pick<Inquiry, 'title' | 'body'>;
