import type { ReactNode } from 'react';

// 섹션 공통 래퍼 — 일관된 제목/여백 위계 제공
export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  className = '',
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
  className?: string;
}) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={titleId}>
      <div className="container">
        <header className="section__head">
          {eyebrow ? <p className="section__eyebrow">{eyebrow}</p> : null}
          <h2 id={titleId} className="section__title">
            {title}
          </h2>
          {lead ? <p className="section__lead">{lead}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}
