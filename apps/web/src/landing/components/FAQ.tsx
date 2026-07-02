import { useState } from 'react';
import { Section } from './Section';
import { FAQS } from '../content';

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <Section id="faq" eyebrow="FAQ" title="자주 묻는 질문">
      <ul className="faq" role="list">
        {FAQS.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          const btnId = `faq-btn-${i}`;
          return (
            <li key={item.q} className="faq__item">
              <h3 className="faq__q">
                <button
                  id={btnId}
                  type="button"
                  className="faq__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className={`faq__icon ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={`faq__panel ${isOpen ? 'is-open' : ''}`}
                hidden={!isOpen}
              >
                <p>{item.a}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
