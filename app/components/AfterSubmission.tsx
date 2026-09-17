const steps = [
  { title: "Initial Review", text: "We review the company's capabilities, objectives, proposed activity, and preferred form of cooperation." },
  { title: "Opportunity Assessment", text: "We consider the proposal's relevance to Saudi demand, industrial priorities, potential customers, and localization opportunities." },
  { title: "Partner Identification", text: "Where appropriate, we seek Saudi companies or investors with compatible capabilities, resources, and strategic interests." },
  { title: "Initial Introduction", text: "Subject to mutual interest, we facilitate an introductory discussion between the German company and suitable Saudi counterparts." },
  { title: "Project Development", text: "The participating companies decide whether to progress toward a feasibility study, memorandum of understanding, joint venture, licensing arrangement, manufacturing agreement, or other commercial structure." },
];

export default function AfterSubmission() {
  return (
    <section className="section">
      <div className="container">
        <h2>What Happens After Submission?</h2>
        <div className="steps">
          {steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step-num">{i + 1}</div>
              <div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}