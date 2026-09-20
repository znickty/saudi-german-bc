import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyAssignments() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const rows = await query<any>(
    `SELECT id, company_name, contact_person, business_email, status, created_at
     FROM investor_interests
     WHERE assigned_committee_member_id = ?
     ORDER BY created_at DESC`,
    [Number(session.sub)]
  );

  return (
    <main style={{ minHeight: "100vh", background: "#f1eedb", padding: "2rem 0" }}>
      <div className="container">
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>My Assignments</h1>

        {rows.length === 0 && (
          <p style={{ fontWeight: 300 }}>No assignments yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {rows.map((r: any) => (
            <div key={r.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>#{r.id} — {r.company_name}</strong>
                <div style={{ fontSize: ".9rem", opacity: .8 }}>
                  {r.contact_person} · {r.business_email}
                </div>
              </div>
              <div style={{ display: "flex", gap: ".5rem" }}>
                <Link href={`/admin/submissions/${r.id}`} className="btn btn-secondary" style={{ padding: ".35rem .9rem", fontSize: ".85rem" }}>
                  View
                </Link>
                <Link
                  href={`/admin/email/new?to=${encodeURIComponent(r.business_email)}&submissionId=${r.id}&subject=${encodeURIComponent("Re: Your interest in Saudi Arabia")}`}
                  className="btn btn-primary"
                  style={{ padding: ".35rem .9rem", fontSize: ".85rem" }}
                >
                  Email
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}