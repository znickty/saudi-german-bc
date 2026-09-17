const supportItems = [
  "Reviewing the company's initial investment interest and Saudi market objectives.",
  "Helping the company clarify its proposed Saudi value proposition.",
  "Identifying possible Saudi sectors, applications, and areas of demand.",
  "Searching for suitable Saudi business, industrial, or investment partners.",
  "Facilitating initial introductions between relevant German and Saudi parties.",
  "Supporting early discussions concerning joint ventures, manufacturing, licensing, localization, and technology cooperation.",
  "Helping the parties understand each other's commercial expectations and capabilities.",
  "Directing companies toward relevant authorities, industrial bodies, or specialist advisers when required.",
  "Supporting the development of a practical pathway for further engagement.",
];

export default function CouncilSupport() {
  return (
    <section id="support" className="section">
      <div className="container">
        <h2>How the Council Supports Investors</h2>
        <h3 style={{ color: "var(--primary-green)" }}>Practical Facilitation from Interest to Opportunity</h3>
        <p>
          We help move credible investor interest toward a focused bilateral business
          discussion by clarifying the opportunity, identifying relevant counterparts, and
          facilitating the first steps.
        </p>
        <p>Depending on the nature and readiness of the proposal, our assistance may include:</p>
        <div className="grid-2" style={{ marginTop: "1.5rem" }}>
          <div className="card">
            <ul>
              {supportItems.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="card">
            <ul>
              {supportItems.slice(5).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        <div style={{ marginTop: "2.5rem" }}>
          <span className="free-badge">Free of Charge</span>
          <h3>Our Support Is Free of Charge</h3>
          <p>
            There is no charge for submitting an expression of interest or for the Council's
            initial facilitation and partner-identification support. We do not charge German
            companies a commission for introducing them to potential Saudi partners, and we
            do not require payment simply to have an opportunity reviewed.
          </p>
          <p>
            Our purpose is to strengthen bilateral economic relations and support the creation
            of meaningful Saudi–German investments, manufacturing projects, technology
            partnerships, and commercially sustainable joint ventures.
          </p>
          <p>
            If a project later requires independent legal, financial, technical, licensing,
            feasibility, or professional advisory services, such services may need to be
            separately commissioned by the participating company. Any such requirement
            should be clearly disclosed and agreed upon directly with the relevant service
            provider.
          </p>
        </div>

        <div className="membership-note" id="membership">
          <p>
            <strong>Ordinary Council Membership</strong> remains available as a secondary
            section for those who wish to join the Council network. It does not compete with
            the primary investment and manufacturing objective.
          </p>
          <a href="#investor-form" className="btn btn-secondary">Learn About Membership</a>
        </div>
      </div>
    </section>
  );
}