type PathwaysDict = {
  title: string;
  p1Title: string; p1Body: string; p1Lead: string;
  p1List1: string; p1List2: string; p1List3: string; p1List4: string; p1List5: string;
  p1List6: string; p1List7: string; p1List8: string; p1List9: string;
  p2Title: string; p2Body: string; p2Body2: string; p2Lead: string;
  p2List1: string; p2List2: string; p2List3: string; p2List4: string;
  p2List5: string; p2List6: string; p2List7: string; p2List8: string;
  cta: string;
};

export default function Pathways({ t }: { t: PathwaysDict }) {
  const p1List = [t.p1List1, t.p1List2, t.p1List3, t.p1List4, t.p1List5,
                  t.p1List6, t.p1List7, t.p1List8, t.p1List9];
  const p2List = [t.p2List1, t.p2List2, t.p2List3, t.p2List4,
                  t.p2List5, t.p2List6, t.p2List7, t.p2List8];

  return (
    <section id="pathways" className="section">
      <div className="pattern-bg brown" aria-hidden />
      <div className="container">
        <h2>{t.title}</h2>
        <div className="grid-2" style={{ marginTop: "2rem" }}>
          <div className="pathway">
            <h3>{t.p1Title}</h3>
            <p>{t.p1Body}</p>
            <p>{t.p1Lead}</p>
            <ul>
              {p1List.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
            <a href="#investor-form" className="btn btn-primary">{t.cta}</a>
          </div>
          <div className="pathway blue">
            <h3>{t.p2Title}</h3>
            <p>{t.p2Body}</p>
            <p>{t.p2Body2}</p>
            <p>{t.p2Lead}</p>
            <ul>
              {p2List.map((li, i) => <li key={i}>{li}</li>)}
            </ul>
            <a href="#investor-form" className="btn btn-primary">{t.cta}</a>
          </div>
        </div>
      </div>
    </section>
  );
}