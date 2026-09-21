"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";

type FormDict = {
  title: string; subtitle: string; intro: string;
  typeLabel: string; typeGerman: string; typeSaudi: string;
  freeBadge: string; freeNote: string;
  companyInfo: string; companyName: string; website: string;
  yearEstablished: string; headquarters: string; contactPerson: string;
  position: string; businessEmail: string; telephone: string;
  companySize: string; selectOption: string; primaryIndustry: string;
  mainProducts: string; currentMarkets: string;
  saudiInterest: string; opportunity: string; reason: string;
  targetIndustries: string; preferredGeography: string;
  investmentRange: string; timeframe: string; projectStage: string;
  cooperation: string; cooperationLead: string;
  partnerReq: string; partnerType: string; partnerCapabilities: string;
  requiredResources: string; desiredContribution: string; yourContribution: string;
  exclusivity: string; exclYes: string; exclNo: string; exclMaybe: string;
  readyForIntro: string; disclaimer: string;
  submit: string; submitting: string; success: string; error: string;
};

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

export default function InvestorForm({ t, lang }: { t: FormDict; lang: Locale }) {
  const [type, setType] = useState<"german" | "saudi">("german");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const cooperationTypes = Array.from(
      form.querySelectorAll<HTMLInputElement>('input[name="cooperationTypes"]:checked')
    ).map((el) => el.value);

    const payload = {
      locale: lang,
      investorType: type,
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
      if (!res.ok) throw new Error(data.error || t.error);
      setSuccess(t.success);
      form.reset();
      setType("german");
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="investor-form" className="section" style={{ background: "linear-gradient(180deg, #f1eedb, #ffffff)" }}>
      <div className="pattern-bg green" aria-hidden />
      <div className="container">
        <h2>{t.title}</h2>
        <h3>{t.subtitle}</h3>
        <p>{t.intro}</p>

        <span className="free-badge">{t.freeBadge}</span>
        <p style={{ fontWeight: 300 }}>{t.freeNote}</p>

        <form className="form-wrap" onSubmit={handleSubmit} lang={lang}>
          {/* Investor Type */}
          <div className="field" style={{ marginBottom: "1.5rem" }}>
            <label>{t.typeLabel}</label>
            <div className="investor-type-toggle">
              <label className={type === "german" ? "active" : ""}>
                <input
                  type="radio"
                  name="investorType"
                  value="german"
                  checked={type === "german"}
                  onChange={() => setType("german")}
                />
                {t.typeGerman}
              </label>
              <label className={type === "saudi" ? "active" : ""}>
                <input
                  type="radio"
                  name="investorType"
                  value="saudi"
                  checked={type === "saudi"}
                  onChange={() => setType("saudi")}
                />
                {t.typeSaudi}
              </label>
            </div>
          </div>

          <h3>{t.companyInfo}</h3>
          <div className="form-grid">
            <div className="field"><label>{t.companyName}</label><input name="companyName" required /></div>
            <div className="field"><label>{t.website}</label><input name="website" type="url" placeholder="https://" /></div>
            <div className="field"><label>{t.yearEstablished}</label><input name="yearEstablished" type="number" min="1800" max="2100" /></div>
            <div className="field"><label>{t.headquarters}</label><input name="headquarters" /></div>
            <div className="field"><label>{t.contactPerson}</label><input name="contactPerson" required /></div>
            <div className="field"><label>{t.position}</label><input name="position" /></div>
            <div className="field"><label>{t.businessEmail}</label><input name="businessEmail" type="email" required /></div>
            <div className="field"><label>{t.telephone}</label><input name="telephone" /></div>
            <div className="field">
              <label>{t.companySize}</label>
              <select name="companySize" defaultValue="">
                <option value="">{t.selectOption}</option>
                <option>1-10</option><option>11-50</option><option>51-250</option>
                <option>251-1000</option><option>1000+</option>
              </select>
            </div>
            <div className="field"><label>{t.primaryIndustry}</label><input name="primaryIndustry" /></div>
          </div>
          <div className="field"><label>{t.mainProducts}</label><textarea name="mainProducts" /></div>
          <div className="field"><label>{t.currentMarkets}</label><textarea name="currentMarkets" /></div>

          <h3 style={{ marginTop: "2rem" }}>{t.saudiInterest}</h3>
          <div className="field"><label>{t.opportunity}</label><textarea name="opportunityDescription" /></div>
          <div className="field"><label>{t.reason}</label><textarea name="reasonForSaudi" /></div>
          <div className="form-grid">
            <div className="field"><label>{t.targetIndustries}</label><input name="targetIndustries" /></div>
            <div className="field"><label>{t.preferredGeography}</label><input name="preferredGeography" /></div>
            <div className="field"><label>{t.investmentRange}</label><input name="investmentRange" /></div>
            <div className="field"><label>{t.timeframe}</label><input name="implementationTimeframe" /></div>
            <div className="field"><label>{t.projectStage}</label><input name="projectStage" /></div>
          </div>

          <h3 style={{ marginTop: "2rem" }}>{t.cooperation}</h3>
          <p style={{ fontWeight: 300 }}>{t.cooperationLead}</p>
          <div className="checkboxes">
            {cooperationOptions.map((opt) => (
              <label key={opt}>
                <input type="checkbox" name="cooperationTypes" value={opt} />
                {opt}
              </label>
            ))}
          </div>

          <h3 style={{ marginTop: "2rem" }}>{t.partnerReq}</h3>
          <div className="form-grid">
            <div className="field"><label>{t.partnerType}</label><input name="partnerType" /></div>
            <div className="field"><label>{t.partnerCapabilities}</label><input name="partnerCapabilities" /></div>
            <div className="field"><label>{t.requiredResources}</label><input name="requiredResources" /></div>
            <div className="field"><label>{t.desiredContribution}</label><input name="desiredContribution" /></div>
            <div className="field"><label>{t.yourContribution}</label><input name="germanContribution" /></div>
            <div className="field">
              <label>{t.exclusivity}</label>
              <select name="exclusivity" defaultValue="maybe">
                <option value="yes">{t.exclYes}</option>
                <option value="no">{t.exclNo}</option>
                <option value="maybe">{t.exclMaybe}</option>
              </select>
            </div>
          </div>
          <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: ".5rem" }}>
            <input type="checkbox" name="readyForIntro" id="readyForIntro" style={{ width: "auto" }} />
            <label htmlFor="readyForIntro" style={{ margin: 0 }}>{t.readyForIntro}</label>
          </div>

          <div className="disclaimer">{t.disclaimer}</div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t.submitting : t.submit}
            </button>
          </div>

          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </section>
  );
}