"use client";

import { useState } from "react";

const cooperationOptions = [
  "Wholly owned Saudi operation",
  "Saudi–German joint venture",
  "Saudi investment partner",
  "Manufacturing partner",
  "Contract-manufacturing arrangement",
  "Technology licensing",
  "Technology transfer",
  "Local assembly",
  "Distribution followed by localization",
  "Regional service or maintenance center",
  "Research, training, or competence center",
  "Other form of cooperation",
];

export default function InvestorForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const cooperationTypes = Array.from(
      (e.currentTarget.querySelectorAll('input[name="cooperationTypes"]:checked') as NodeListOf<HTMLInputElement>)
    ).map((el) => el.value);

    const payload = {
      companyName: fd.get("companyName"),
      website: fd.get("website"),
      yearEstablished: fd.get("yearEstablished"),
      headquarters: fd.get("headquarters"),
      contactPerson: fd.get("contactPerson"),
      position: fd.get("position"),
      businessEmail: fd.get("businessEmail"),
      telephone: fd.get("telephone"),
      companySize: fd.get("companySize"),
      primaryIndustry: fd.get("primaryIndustry"),
      mainProducts: fd.get("mainProducts"),
      currentMarkets: fd.get("currentMarkets"),
      opportunityDescription: fd.get("opportunityDescription"),
      reasonForSaudi: fd.get("reasonForSaudi"),
      targetIndustries: fd.get("targetIndustries"),
      preferredGeography: fd.get("preferredGeography"),
      investmentRange: fd.get("investmentRange"),
      implementationTimeframe: fd.get("implementationTimeframe"),
      projectStage: fd.get("projectStage"),
      cooperationTypes,
      partnerType: fd.get("partnerType"),
      partnerCapabilities: fd.get("partnerCapabilities"),
      requiredResources: fd.get("requiredResources"),
      desiredContribution: fd.get("desiredContribution"),
      germanContribution: fd.get("germanContribution"),
      exclusivity: fd.get("exclusivity"),
      readyForIntro: fd.get("readyForIntro") === "on",
    };

    try {
      const res = await fetch("/api/investor-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSuccess(`Thank you. Your submission has been received (Ref #${data.id}). Our team will follow up shortly.`);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="investor-form" className="section" style={{ background: "linear-gradient(180deg, #f1eedb, #ffffff)" }}>
        <div className="pattern-bg green" aria-hidden />
      <div className="container">
        <h2>German Investor Interest</h2>
        <h3>Tell Us What Your Company Can Bring to Saudi Arabia</h3>
        <p>
          German companies interested in investing, manufacturing, establishing a joint
          venture, licensing technology, or finding a Saudi partner are invited to submit an
          expression of interest. You do not need a completed feasibility study or final
          investment decision — early-stage interest is welcome.
        </p>

        <span className="free-badge">Free of Charge</span>
        <p style={{ fontWeight: 300 }}>
          Submission and initial facilitation are provided free of charge. The Saudi–German
          Business Council does not charge an introduction fee or commission for connecting
          German companies with prospective Saudi partners.
        </p>

        <form className="form-wrap" onSubmit={handleSubmit}>
          <h3>Company Information</h3>
          <div className="form-grid">
            <div className="field"><label>Company name *</label><input name="companyName" required /></div>
            <div className="field"><label>Website</label><input name="website" type="url" placeholder="https://" /></div>
            <div className="field"><label>Year established</label><input name="yearEstablished" type="number" min="1800" max="2100" /></div>
            <div className="field"><label>Headquarters location</label><input name="headquarters" /></div>
            <div className="field"><label>Contact person *</label><input name="contactPerson" required /></div>
            <div className="field"><label>Position</label><input name="position" /></div>
            <div className="field"><label>Business email *</label><input name="businessEmail" type="email" required /></div>
            <div className="field"><label>Telephone number</label><input name="telephone" /></div>
            <div className="field">
              <label>Company size</label>
              <select name="companySize" defaultValue="">
                <option value="">Select…</option>
                <option>1-10</option><option>11-50</option><option>51-250</option>
                <option>251-1000</option><option>1000+</option>
              </select>
            </div>
            <div className="field"><label>Primary industry</label><input name="primaryIndustry" /></div>
          </div>
          <div className="field"><label>Main products, technologies, or services</label><textarea name="mainProducts" /></div>
          <div className="field"><label>Current international markets</label><textarea name="currentMarkets" /></div>

          <h3 style={{ marginTop: "2rem" }}>Saudi Arabia Interest</h3>
          <div className="field"><label>Description of the proposed Saudi opportunity</label><textarea name="opportunityDescription" /></div>
          <div className="field"><label>Reason for considering Saudi Arabia</label><textarea name="reasonForSaudi" /></div>
          <div className="form-grid">
            <div className="field"><label>Target Saudi industries or customers</label><input name="targetIndustries" /></div>
            <div className="field"><label>Preferred geographical area, if known</label><input name="preferredGeography" /></div>
            <div className="field"><label>Expected investment range, if available</label><input name="investmentRange" /></div>
            <div className="field"><label>Proposed implementation timeframe</label><input name="implementationTimeframe" /></div>
            <div className="field"><label>Current stage of the project</label><input name="projectStage" /></div>
          </div>

          <h3 style={{ marginTop: "2rem" }}>Preferred Form of Cooperation</h3>
          <p style={{ fontWeight: 300 }}>Select one or more:</p>
          <div className="checkboxes">
            {cooperationOptions.map((opt) => (
              <label key={opt}>
                <input type="checkbox" name="cooperationTypes" value={opt} />
                {opt}
              </label>
            ))}
          </div>

          <h3 style={{ marginTop: "2rem" }}>Partner Requirements</h3>
          <div className="form-grid">
            <div className="field"><label>Type of Saudi partner required</label><input name="partnerType" /></div>
            <div className="field"><label>Preferred Saudi partner capabilities</label><input name="partnerCapabilities" /></div>
            <div className="field"><label>Required manufacturing facilities or technical resources</label><input name="requiredResources" /></div>
            <div className="field"><label>Desired contribution from the Saudi partner</label><input name="desiredContribution" /></div>
            <div className="field"><label>Contribution offered by the German company</label><input name="germanContribution" /></div>
            <div className="field">
              <label>Whether exclusivity may be considered</label>
              <select name="exclusivity" defaultValue="maybe">
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="maybe">Maybe</option>
              </select>
            </div>
          </div>
          <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
            <input type="checkbox" name="readyForIntro" id="readyForIntro" style={{ width: "auto" }} />
            <label htmlFor="readyForIntro" style={{ margin: 0 }}>The company is ready for an introductory meeting</label>
          </div>

          <div className="disclaimer">
            Please do not submit trade secrets, proprietary designs, or other highly
            confidential technical information at this preliminary stage. If the opportunity
            requires an exchange of sensitive information, the parties may first agree on
            appropriate confidentiality arrangements.
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting…" : "Submit German Investor Interest"}
            </button>
          </div>

          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </section>
  );
}