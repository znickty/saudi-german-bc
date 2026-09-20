type BeyondDict = { title: string; p1: string; p2: string; p3: string; p4: string };

export default function BeyondTrade({ t }: { t: BeyondDict }) {
  return (
    <section className="section">
      <div className="pattern-bg green" aria-hidden />
      <div className="container">
        <h2>{t.title}</h2>
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <p>{t.p3}</p>
        <p>{t.p4}</p>
      </div>
    </section>
  );
}