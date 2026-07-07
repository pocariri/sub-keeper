import { z } from 'zod';
import type { InquiryInput } from '../types/inquiry';

/** 문의 작성 입력값 검증 스키마 — 작성 폼(웹·모바일 공통)에서 사용 */
export const inquiryInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, '제목을 입력하세요')
    .max(200, '제목은 200자 이내로 입력하세요'),
  body: z
    .string()
    .trim()
    .min(1, '내용을 입력하세요')
    .max(2000, '내용은 2000자 이내로 입력하세요'),
});

/** zod 추론 타입이 도메인 타입과 일치하는지 컴파일 타임 확인 */
export type InquiryInputSchema = z.infer<typeof inquiryInputSchema>;
const _typeCheck: InquiryInput = {} as InquiryInputSchema;
void _typeCheck;

/** 관리자 답변 검증 스키마 */
export const inquiryAnswerSchema = z.object({
  answer: z
    .string()
    .trim()
    .min(1, '답변을 입력하세요')
    .max(2000, '답변은 2000자 이내로 입력하세요'),
});
export type InquiryAnswerSchema = z.infer<typeof inquiryAnswerSchema>;
