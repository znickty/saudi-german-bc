type SupportDict = {
  title: string; subtitle: string; intro: string; lead: string;
  s1: string; s2: string; s3: string; s4: string; s5: string;
  s6: string; s7: string; s8: string; s9: string;
  freeBadge: string; freeTitle: string; freeP1: string; freeP2: string; freeP3: string;
  memNote: string; memCta: string;
};

export default function CouncilSupport({ t }: { t: SupportDict }) {
  const items = [t.s1, t.s2, t.s3, t.s4, t.s5, t.s6, t.s7, t.s8, t.s9];

  return (
    <section id="support" className="section">
      <div className="pattern-bg brown" aria-hidden />
      <div className="container">
        <h2>{t.title}</h2>
        <h3 style={{ color: "var(--palm-green)" }}>{t.subtitle}</h3>
        <p>{t.intro}</p>
        <p>{t.lead}</p>

        <div className="grid-2" style={{ marginTop: "1.5rem" }}>
          <div className="card">
            <ul>
              {items.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card">
            <ul>
              {items.slice(5).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
          <span className="free-badge">{t.freeBadge}</span>
          <h3>{t.freeTitle}</h3>
          <p>{t.freeP1}</p>
          <p>{t.freeP2}</p>
          <p>{t.freeP3}</p>
        </div>

        <div className="membership-note" id="membership">
          <p><strong>{t.memNote}</strong></p>
          <a href="#investor-form" className="btn btn-secondary">{t.memCta}</a>
        </div>
      </div>
    </section>
  );
}