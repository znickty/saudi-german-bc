import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession, canAssign, canViewAll } from "@/lib/auth";
import { queryOne, query } from "@/lib/db";
import { listCommitteeMembers } from "@/lib/admin";
import AssignPanel from "./AssignPanel";
import WorkflowEditor from "./WorkflowEditor";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function SubmissionDetail({ params }: PageProps) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect("/admin/login");

  const sub = await queryOne<any>(
    "SELECT * FROM investor_interests WHERE id = ? LIMIT 1",
    [id]
  );
  if (!sub) notFound();

  if (
    !canViewAll(session.role) &&
    Number(sub.assigned_committee_member_id) !== Number(session.sub)
  ) {
    redirect("/admin");
  }

  const activity = await query<any>(
    `SELECT a.*, u.full_name AS admin_name
     FROM submission_activity a
     LEFT JOIN admin_users u ON u.id = a.admin_id
     WHERE a.submission_id = ? AND a.submission_type = 'investor'
     ORDER BY a.created_at DESC
     LIMIT 100`,
    [id]
  );

  const members = canAssign(session.role) ? await listCommitteeMembers() : [];

  return (
    <>
      <header className="admin-header">
        <div>
          <Link href="/admin" style={{ fontSize: ".85rem", opacity: .7 }}>← Back to Dashboard</Link>
          <h1 style={{ marginTop: ".4rem" }}>#{sub.id} · {sub.company_name}</h1>
          <p>
            Submitted {new Date(sub.created_at).toLocaleString()} ·{" "}
            <span className={`pill ${sub.status}`}>{sub.status.replace("_", " ")}</span>
          </p>
        </div>
      </header>

      <div className="detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <Section title="Company Information">
            <KV k="Investor type" v={capitalize(sub.investor_type)} />
            <KV k="Country of origin" v={sub.country_origin} />
            <KV k="Website" v={sub.website} />
            <KV k="Year established" v={sub.year_established} />
            <KV k="Headquarters" v={sub.headquarters} />
            <KV k="Contact person" v={sub.contact_person} />
            <KV k="Position" v={sub.position} />
            <KV k="Business email" v={sub.business_email} />
            <KV k="Telephone" v={sub.telephone} />
            <KV k="Company size" v={sub.company_size} />
            <KV k="Primary industry" v={sub.primary_industry} />
            <KV k="Main products" v={sub.main_products} />
            <KV k="Current markets" v={sub.current_markets} />
          </Section>

          <Section title="Saudi Arabia Interest">
            <KV k="Opportunity" v={sub.opportunity_description} />
            <KV k="Reason for Saudi" v={sub.reason_for_saudi} />
            <KV k="Target industries" v={sub.target_industries} />
            <KV k="Preferred geography" v={sub.preferred_geography} />
            <KV k="Investment range" v={sub.investment_range} />
            <KV k="Timeframe" v={sub.implementation_timeframe} />
            <KV k="Project stage" v={sub.project_stage} />
          </Section>

          <Section title="Preferred Cooperation">
            <KV k="Types" v={
              Array.isArray(sub.cooperation_types)
                ? sub.cooperation_types.join(", ")
                : sub.cooperation_types
            } />
            <KV k="Partner type" v={sub.partner_type} />
            <KV k="Partner capabilities" v={sub.partner_capabilities} />
            <KV k="Required resources" v={sub.required_resources} />
            <KV k="Desired contribution" v={sub.desired_contribution} />
            <KV k="German contribution" v={sub.german_contribution} />
            <KV k="Exclusivity" v={sub.exclusivity} />
            <KV k="Ready for intro" v={sub.ready_for_intro ? "Yes" : "No"} />
          </Section>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {canAssign(session.role) && (
            <AssignPanel
              id={sub.id}
              members={members}
              currentAssignee={sub.assigned_committee_member_id}
            />
          )}

          <WorkflowEditor
            id={sub.id}
            initial={{
              status: sub.status,
              sector_tag: sub.sector_tag ?? "",
              assigned_to: sub.assigned_to ?? "",
              internal_notes: sub.internal_notes ?? "",
            }}
          />

          <div className="card">
            <h3 className="section-title">Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
              <Link
                href={`/admin/email/new?to=${encodeURIComponent(sub.business_email)}&subject=${encodeURIComponent("Re: Your interest in Saudi Arabia")}&submissionId=${sub.id}`}
                className="btn btn-primary"
              >
                ✉️ Email this contact
              </Link>
            </div>
          </div>

          <Section title="Activity Log">
            {activity.length === 0 && (
              <p style={{ opacity: .7, fontWeight: 300, margin: 0 }}>No activity yet.</p>
            )}
            {activity.map((a: any) => (
              <div key={a.id} className="activity-item">
                <strong>{a.action}</strong>
                {a.admin_name && <> · {a.admin_name}</>}
                {a.note && <div style={{ opacity: .8 }}>{a.note}</div>}
                <span className="when">{new Date(a.created_at).toLocaleString()}</span>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3 className="section-title">{title}</h3>
      {children}
    </div>
  );
}

function KV({ k, v }: { k: string; v: any }) {
  return (
    <div className="kv-row">
      <div className="k">{k}</div>
      <div className="v">{v == null || v === "" ? "—" : String(v)}</div>
    </div>
  );
}

function capitalize(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1) : "";
}