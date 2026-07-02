// 소개(랜딩) 페이지 콘텐츠/목업. 순수 UI 콘텐츠이므로 apps/web 에 둔다.
// ⚠️ 가격 등 도메인 상수는 하드코딩하지 않고 @sub-keeper/core 에서 파생한다.
import { PREMIUM_PRICE_KRW } from '@sub-keeper/core';

export const PRODUCT = {
  name: '구독 모아',
  tagline: '흩어진 구독, 한 곳에서 관리하세요',
  subtext:
    '결제일과 총액을 자동으로 정리하고, 갱신되기 전에 미리 알려드립니다. 통화가 섞여 있어도 결제일 기준 환율로 환산해 한눈에 보여줍니다.',
};

export const NAV: { id: string; label: string }[] = [
  { id: 'features', label: '기능' },
  { id: 'preview', label: '미리보기' },
  { id: 'plans', label: '요금제' },
  { id: 'pricing', label: '가격' },
  { id: 'faq', label: 'FAQ' },
];

export interface Feature {
  title: string;
  desc: string;
  badge?: string;
}

export const FEATURES: Feature[] = [
  { title: '구독 통합 관리', desc: '흩어진 구독을 추가·수정·삭제하며 한 곳에서 정리합니다.' },
  { title: '대시보드', desc: '등록한 구독을 한눈에 보고, 이번 달 총액을 바로 확인합니다.' },
  { title: '카테고리별 분석 차트', desc: '어디에 얼마나 쓰는지 카테고리별로 시각화해 보여줍니다.' },
  { title: '갱신 임박 목록', desc: '곧 결제될 구독을 미리 모아 보여줘 예상치 못한 결제를 막습니다.' },
  { title: '푸시 알림', desc: '갱신·결제일을 미리 알림으로 받아 놓치지 않습니다.', badge: '예정' },
  { title: '다중 통화 지원', desc: '통화가 섞여 있어도 결제일 기준 환율로 환산해 합산합니다.' },
];

export const SUBSCRIPTION_FIELDS = [
  '서비스명',
  '금액',
  '결제 주기',
  '다음 결제일',
  '카테고리',
  '결제수단',
  '메모',
];

export const MOCK_SUBSCRIPTIONS = [
  { name: 'Netflix', category: '엔터테인먼트', cycle: '월', price: '17,000원', due: 'D-2' },
  { name: 'Spotify', category: '음악', cycle: '월', price: '10,900원', due: 'D-5' },
  { name: 'iCloud+', category: '클라우드', cycle: '월', price: '3,300원', due: 'D-9' },
  { name: 'ChatGPT Plus', category: '생산성', cycle: '월', price: '$20.00', due: 'D-12' },
  { name: 'YouTube Premium', category: '엔터테인먼트', cycle: '월', price: '14,900원', due: 'D-18' },
];

export const MOCK_CATEGORIES = [
  { label: '엔터테인먼트', ratio: 0.42 },
  { label: '생산성', ratio: 0.26 },
  { label: '음악', ratio: 0.18 },
  { label: '클라우드', ratio: 0.14 },
];

export const MOCK_UPCOMING = [
  { name: 'Netflix', date: '7월 2일', price: '17,000원', due: 'D-2' },
  { name: 'Spotify', date: '7월 5일', price: '10,900원', due: 'D-5' },
  { name: 'iCloud+', date: '7월 9일', price: '3,300원', due: 'D-9' },
];

export interface PlanFeatureRow {
  label: string;
  free: string | boolean;
  premium: string | boolean;
}

export const PLAN_FEATURES: PlanFeatureRow[] = [
  { label: '구독 등록', free: '최대 10개', premium: '무제한' },
  { label: '결제일 보기', free: true, premium: true },
  { label: '총액 보기', free: true, premium: true },
  { label: '갱신 알림', free: false, premium: true },
  { label: '카테고리 분석', free: false, premium: true },
  { label: '연간 리포트', free: false, premium: true },
  { label: '해지 추천', free: false, premium: true },
];

// 가격은 core 단일 소스에서 파생 (하드코딩 금지)
export const PRICING = {
  monthly: { price: `${PREMIUM_PRICE_KRW.monthly.toLocaleString()}원`, period: '월' },
  yearly: {
    price: `${PREMIUM_PRICE_KRW.yearly.toLocaleString()}원`,
    period: '연',
    note: '연간 결제 시 약 2개월분 할인',
  },
  trial: '무료 체험 기간 없음',
};

export const FAQS = [
  {
    q: '무료 플랜으로 몇 개까지 등록할 수 있나요?',
    a: '무료 플랜에서는 구독을 최대 10개까지 등록할 수 있습니다. 더 많은 구독을 관리하려면 프리미엄으로 업그레이드하세요. 프리미엄은 등록 개수에 제한이 없습니다.',
  },
  {
    q: '통화가 다른 구독도 합산되나요?',
    a: '네. 통화가 섞여 있어도 각 구독의 결제일 기준 환율로 환산해 총액에 합산합니다. 달러·엔·유로 등 서로 다른 통화의 구독도 하나의 기준 통화로 모아 볼 수 있습니다.',
  },
  {
    q: '결제일 알림은 어떻게 받나요?',
    a: '갱신·결제일이 다가오면 푸시 알림으로 미리 알려드립니다. 갱신 알림은 프리미엄 플랜에서 제공됩니다. (푸시 알림은 출시 예정 기능입니다.)',
  },
  {
    q: '언제든 해지할 수 있나요?',
    a: '네. 프리미엄 구독은 약정 없이 언제든 해지할 수 있으며, 해지 후에도 남은 결제 기간까지는 프리미엄 기능을 그대로 이용할 수 있습니다.',
  },
];
