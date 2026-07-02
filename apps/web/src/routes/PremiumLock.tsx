import { useState } from 'react';
import { PREMIUM_PRICE_KRW } from '@sub-keeper/core';

/** 프리미엄 결제 진입점 (결제 모듈은 다음 단계 — 지금은 안내만) */
export function UpgradeButton() {
  const [notice, setNotice] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setNotice(true)} className="ui-btn ui-btn--primary">
        프리미엄 업그레이드 · 월 {PREMIUM_PRICE_KRW.monthly.toLocaleString()}원
      </button>
      {notice ? (
        <p className="upgrade__note">
          결제는 다음 단계에서 추가됩니다. (연 {PREMIUM_PRICE_KRW.yearly.toLocaleString()}원)
        </p>
      ) : null}
    </div>
  );
}

/** 프리미엄 전용 기능 잠금 UI (무료 사용자에게 표시) */
export function PremiumLock({ title, description }: { title: string; description: string }) {
  return (
    <div className="lock">
      <span className="lock__tag">프리미엄 전용</span>
      <h2 className="lock__title">{title}</h2>
      <p className="lock__desc">{description}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <UpgradeButton />
      </div>
    </div>
  );
}
