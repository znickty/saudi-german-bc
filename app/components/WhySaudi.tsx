type WhyDict = {
  title: string;
  intro: string;
  lead: string;
  opp1: string; opp2: string; opp3: string; opp4: string; opp5: string;
  opp6: string; opp7: string; opp8: string; opp9: string;
  footer: string;
};

export default function WhySaudi({ t }: { t: WhyDict }) {
  const opportunities = [
    t.opp1, t.opp2, t.opp3, t.opp4, t.opp5,
    t.opp6, t.opp7, t.opp8, t.opp9,
  ];

  return (
    <section id="why-saudi" className="section">
      <div className="pattern-bg blue" aria-hidden />
      <div className="container">
        <h2>{t.title}</h2>
        <p>{t.intro}</p>
        <p>{t.lead}</p>
        <div className="grid-2" style={{ marginTop: "2rem" }}>
          <div className="card">
            <ul>
              {opportunities.slice(0, 5).map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
          <div className="card">
            <ul>
              {opportunities.slice(5).map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
        </div>
        <p style={{ marginTop: "2rem" }}>{t.footer}</p>
      </div>
    </section>
  );
}