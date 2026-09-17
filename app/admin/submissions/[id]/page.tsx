import { redirect, notFound } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { queryOne, query } from "../../../lib/db";
import Link from "next/link";
import SubmissionEditor from "./SubmissionEditor";

export const dynamic = "force-dynamic";

export default async function SubmissionDetail({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const sub = await queryOne<any>(
    "SELECT * FROM investor_interests WHERE id = ? LIMIT 1",
    [params.id]
  );
  if (!sub) notFound();

  const activity = await query<any>(
    "SELECT * FROM submission_activity WHERE submission_id = ? ORDER BY created_at DESC LIMIT 50",
    [params.id]
  );

  return (
    <main style={{ minHeight: "100vh", background: "#f1eedb", padding: "2rem 0" }}>
      <div className="container">
        <Link href="/admin" style={{ fontWeight: 500, opacity: .75 }}>← Back to dashboard</Link>

        <header style={{ margin: "1rem 0 2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: ".25rem" }}>
            #{sub.id} · {sub.company_name}
          </h1>
          <p style={{ margin: 0, fontWeight: 300, opacity: .8 }}>
            Submitted {new Date(sub.created_at).toLocaleString()}
          </p>
        </header>

        <div className="grid-2">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Section title="Company Information">
              <KV label="Website" value={sub.website} />
              <KV label="Year established" value={sub.year_established} />
              <KV label="Headquarters" value={sub.headquarters} />
              <KV label="Contact person" value={sub.contact_person} />
              <KV label="Position" value={sub.position} />
              <KV label="Business email" value={sub.business_email} />
              <KV label="Telephone" value={sub.telephone} />
              <KV label="Company size" value={sub.company_size} />
              <KV label="Primary industry" value={sub.primary_industry} />
              <KV label="Main products" value={sub.main_products} />
              <KV label="Current markets" value={sub.current_markets} />
            </Section>

            <Section title="Saudi Arabia Interest">
              <KV label="Opportunity" value={sub.opportunity_description} />
              <KV label="Reason for Saudi" value={sub.reason_for_saudi} />
              <KV label="Target industries" value={sub.target_industries} />
              <KV label="Preferred geography" value={sub.preferred_geography} />
              <KV label="Investment range" value={sub.investment_range} />
              <KV label="Timeframe" value={sub.implementation_timeframe} />
              <KV label="Project stage" value={sub.project_stage} />
            </Section>

            <Section title="Preferred Cooperation">
              <KV
                label="Types"
                value={
                  Array.isArray(sub.cooperation_types)
                    ? sub.cooperation_types.join(", ")
                    : sub.cooperation_types
                }
              />
              <KV label="Partner type" value={sub.partner_type} />
              <KV label="Partner capabilities" value={sub.partner_capabilities} />
              <KV label="Required resources" value={sub.required_resources} />
              <KV label="Desired contribution" value={sub.desired_contribution} />
              <KV label="German contribution" value={sub.german_contribution} />
              <KV label="Exclusivity" value={sub.exclusivity} />
              <KV label="Ready for intro" value={sub.ready_for_intro ? "Yes" : "No"} />
            </Section>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <SubmissionEditor
              id={sub.id}
              initial={{
                status: sub.status,
                sector_tag: sub.sector_tag ?? "",
                assigned_to: sub.assigned_to ?? "",
                internal_notes: sub.internal_notes ?? "",
              }}
            />

            <Section title="Activity Log">
              {activity.length === 0 && (
                <p style={{ margin: 0, fontWeight: 300, opacity: .7 }}>No activity yet.</p>
              )}
              {activity.map((a: any) => (
                <div
                  key={a.id}
                  style={{
                    padding: ".6rem 0",
                    borderBottom: "1px solid rgba(57,34,49,.06)",
                    fontSize: ".9rem",
                  }}
                >
                  <strong>{a.action}</strong>
                  {a.note && <> — {a.note}</>}
                  <div style={{ opacity: .6, fontSize: ".78rem" }}>
                    {new Date(a.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </Section>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3 style={{ marginBottom: "1rem" }}>{title}</h3>
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: any }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "1rem", padding: ".4rem 0", borderBottom: "1px solid rgba(57,34,49,.05)" }}>
      <div style={{ fontWeight: 500, fontSize: ".88rem", opacity: .75 }}>{label}</div>
      <div style={{ fontWeight: 300, fontSize: ".95rem", whiteSpace: "pre-wrap" }}>
        {value == null || value === "" ? "—" : String(value)}
      </div>
    </div>
  );
}