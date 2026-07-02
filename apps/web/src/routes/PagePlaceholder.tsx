/** 화면 미구현 구간용 공통 placeholder */
export function PagePlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <section className="page">
      <h1 className="page__title">{title}</h1>
      <p className="page__subtitle">{note}</p>
    </section>
  );
}
