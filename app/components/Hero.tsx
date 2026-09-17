import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="pattern-bg green" aria-hidden />
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-eyebrow">Saudi–German Business Council · EST 1997</span>
          <h1>
            Build in Saudi Arabia.<br />
            Grow Across the Region.
          </h1>
          <p>
            The Saudi–German Business Council connects German industrial strength,
            technology and expertise with the investment opportunities, manufacturing
            capabilities, market demand and long-term growth ambitions of Saudi Arabia.
          </p>
          <p>
            We invite German manufacturers, technology providers, engineering companies,
            Mittelstand businesses and international enterprises to consider Saudi Arabia
            not only as an export market, but also as a competitive base for manufacturing,
            investment, regional expansion and sustainable growth.
          </p>
          <div className="btn-group">
            <a href="#investor-form" className="btn btn-primary">Submit German Investor Interest</a>
            <a href="#why-saudi" className="btn btn-secondary">Explore Investment Opportunities</a>
          </div>
        </div>
        <div className="hero-image">
          <Image
            src="/logo-vertical.png"
            alt="Saudi German Business Council"
            width={420}
            height={420}
            className="hero-logo"
            priority
          />
        </div>
      </div>
    </section>
  );
}