import type { CategoryId } from '../types/subscription';

export interface CategoryOption {
  id: CategoryId;
  label: string;
}

/** 구독 카테고리 드롭다운 기본 목록 — prd-app.md 3.4 */
export const CATEGORIES = [
  { id: 'entertainment', label: '엔터테인먼트(OTT·음악)' },
  { id: 'productivity', label: '생산성/업무' },
  { id: 'cloud', label: '클라우드/저장소' },
  { id: 'education', label: '교육' },
  { id: 'news', label: '뉴스/미디어' },
  { id: 'game', label: '게임' },
  { id: 'shopping', label: '쇼핑/멤버십' },
  { id: 'health', label: '건강/피트니스' },
  { id: 'finance', label: '금융' },
  { id: 'etc', label: '기타' },
] as const satisfies readonly CategoryOption[];
