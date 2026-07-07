import type { SupabaseClient } from '../baas/client';
import type { Inquiry, InquiryInput, InquiryStatus } from '../types/inquiry';

/** DB 행(snake_case) 형태 */
interface InquiryRow {
  id: string;
  user_id: string;
  title: string;
  body: string;
  status: InquiryStatus;
  answer: string | null;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
}

const TABLE = 'inquiries';

function rowToInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    status: row.status,
    answer: row.answer,
    answeredAt: row.answered_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** 본인 문의 목록 (최신순) — RLS 가 본인 것만 반환 */
export async function listInquiries(client: SupabaseClient): Promise<Inquiry[]> {
  const { data, error } = await client
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as InquiryRow[]).map(rowToInquiry);
}

/** 문의 등록 (user_id 는 현재 세션에서 채움 → RLS insert 정책 충족) */
export async function createInquiry(
  client: SupabaseClient,
  input: InquiryInput,
): Promise<Inquiry> {
  const {
    data: { user },
    error: userErr,
  } = await client.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data, error } = await client
    .from(TABLE)
    .insert({ title: input.title, body: input.body, user_id: user.id })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return rowToInquiry(data as InquiryRow);
}
