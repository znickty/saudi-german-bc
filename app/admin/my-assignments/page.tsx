import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MyAssignments() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const rows = await query<any>(
    `SELECT id, investor_type, company_name, contact_person, business_email,
            status, sector_tag, created_at
     FROM investor_interests
     WHERE assigned_committee_member_id = ?
     ORDER BY created_at DESC`,
    [Number(session.sub)]
  );

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>My Assignments</h1>
          <p>{rows.length} submission{rows.length === 1 ? "" : "s"} assigned to you</p>
        </div>
      </header>

      {rows.length === 0 ? (
        <div className="admin-table-wrap">
          <p style={{ padding: "2.5rem", textAlign: "center", fontWeight: 300 }}>
            No assignments yet.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
          {rows.map((r: any) => (
            <div key={r.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ minWidth: 260 }}>
                <strong>#{r.id} · {r.company_name}</strong>
                <div style={{ fontSize: ".85rem", opacity: .75, marginTop: 2 }}>
                  {r.contact_person} · {r.business_email}
                </div>
                <div style={{ marginTop: ".4rem" }}>
                  <span className={`pill ${r.status}`}>{r.status.replace("_", " ")}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <Link href={`/admin/submissions/${r.id}`} className="btn btn-secondary btn-sm">
                  View
                </Link>
                <Link
                  href={`/admin/email/new?to=${encodeURIComponent(r.business_email)}&subject=${encodeURIComponent("Re: Your interest in Saudi Arabia")}&submissionId=${r.id}`}
                  className="btn btn-primary btn-sm"
                >
                  Email
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}