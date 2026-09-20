import Image from "next/image";

type HeroDict = {
  eyebrow: string;
  title: string;
  p1: string;
  p2: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export default function Hero({ t }: { t: HeroDict }) {
  return (
    <section className="hero">
      <div className="pattern-bg green" aria-hidden />
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-eyebrow">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <div className="btn-group">
            <a href="#investor-form" className="btn btn-primary">{t.ctaPrimary}</a>
            <a href="#why-saudi" className="btn btn-secondary">{t.ctaSecondary}</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-logos">
            <Image src="/logomark.png" alt="SGBC" width={260} height={260} priority />
            <div className="hero-logos-divider" />
            <Image src="/fsc-logo.svg" alt="Federation of Saudi Chambers" width={180} height={180} priority />
          </div>
        </div>
      </div>
    </section>
  );
}