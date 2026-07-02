import { Section } from './Section';
import { FEATURES, SUBSCRIPTION_FIELDS } from '../content';

export function Features() {
  return (
    <Section
      id="features"
      eyebrow="핵심 기능"
      title="구독 관리가 번거로운 이유, 하나씩 해결합니다"
      lead="결제일이 흩어져 있고, 총액이 가늠되지 않고, 갱신은 늘 갑작스럽습니다. 구독 모아가 그 일을 대신합니다."
    >
      <ul className="feature-grid" role="list">
        {FEATURES.map((f) => (
          <li key={f.title} className="feature-card">
            <div className="feature-card__head">
              <h3 className="feature-card__title">{f.title}</h3>
              {f.badge ? <span className="badge">{f.badge}</span> : null}
            </div>
            <p className="feature-card__desc">{f.desc}</p>
          </li>
        ))}
      </ul>

      <div className="feature-fields">
        <p className="feature-fields__label">구독 1건에 담기는 정보</p>
        <ul className="chips" role="list">
          {SUBSCRIPTION_FIELDS.map((field) => (
            <li key={field} className="chip">
              {field}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
