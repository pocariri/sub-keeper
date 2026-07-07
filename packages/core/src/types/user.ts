/**
 * 사용자/플랜 도메인 타입.
 * DB 스키마(prd-app.md 3.2)의 `profiles` 테이블과 대응.
 */

/** 요금제 */
export type Plan = 'free' | 'premium';

/** 사용자 역할 — 0003_admin_role.sql 의 profiles.role 과 대응 */
export type UserRole = 'user' | 'admin';

/** 사용자 프로필 (auth user id 와 동일한 id) */
export interface Profile {
  id: string;
  email: string;
  plan: Plan;
  /** 프리미엄 만료 시각 (ISO). free 이면 null */
  premiumUntil: string | null;
  role: UserRole;
  createdAt: string;
}
