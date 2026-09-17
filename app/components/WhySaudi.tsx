const opportunities = [
  "Establish manufacturing or assembly operations closer to major Saudi customers.",
  "Participate more competitively in Saudi localization and industrial-development programs.",
  "Reduce transportation distances, delivery times, and exposure to international supply-chain disruption.",
  "Gain more direct access to large projects in energy, infrastructure, water, mobility, mining, healthcare, food production, defense, digital technology, and advanced manufacturing.",
  "Serve Saudi Arabia and use the Kingdom as a platform for expansion into the Gulf, the Middle East, Africa, and other surrounding markets.",
  "Combine German technology, engineering, quality, and intellectual property with Saudi capital, market access, industrial land, infrastructure, and manufacturing capacity.",
  "Develop products and services specifically adapted to Saudi and regional requirements.",
  "Build long-term customer relationships through a genuine local presence.",
  "Benefit from the Kingdom's young population, growing technical workforce, competitive energy position, modern logistics infrastructure, and ambitious national-development programs.",
];

export default function WhySaudi() {
  return (
    <section id="why-saudi" className="section">
      <div className="container">
        <h2>Why Saudi Arabia Is a Strategic Manufacturing and Investment Base</h2>
        <p>
          Saudi Arabia is undergoing an extensive economic and industrial transformation.
          The Kingdom is actively developing its manufacturing base, strengthening local
          supply chains, expanding non-oil industries, and encouraging international
          companies to invest, manufacture, transfer technology, and build lasting local
          capabilities.
        </p>
        <p>For German companies, this creates opportunities to:</p>
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
        <p style={{ marginTop: "2rem" }}>
          The economic case will naturally vary by sector and project. Our role is to help
          each interested German company examine the opportunity realistically and identify
          where a Saudi investment or manufacturing presence can produce a genuine
          competitive advantage.
        </p>
      </div>
    </section>
  );
}