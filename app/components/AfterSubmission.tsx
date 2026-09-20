type AfterDict = {
  title: string;
  s1Title: string; s1Body: string;
  s2Title: string; s2Body: string;
  s3Title: string; s3Body: string;
  s4Title: string; s4Body: string;
  s5Title: string; s5Body: string;
};

export default function AfterSubmission({ t }: { t: AfterDict }) {
  const steps = [
    { title: t.s1Title, body: t.s1Body },
    { title: t.s2Title, body: t.s2Body },
    { title: t.s3Title, body: t.s3Body },
    { title: t.s4Title, body: t.s4Body },
    { title: t.s5Title, body: t.s5Body },
  ];

  return (
    <section className="section">
      <div className="pattern-bg blue" aria-hidden />
      <div className="container">
        <h2>{t.title}</h2>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{i + 1}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}