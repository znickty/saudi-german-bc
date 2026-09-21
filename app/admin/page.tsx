import { redirect } from "next/navigation";
import { getSession, canViewAll } from "@/lib/auth";
import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  investor_type: "german" | "saudi" | "other";
  company_name: string;
  contact_person: string;
  business_email: string;
  primary_industry: string | null;
  sector_tag: string | null;
  status: string;
  assigned_committee_member_id: number | null;
  assigned_to: string | null;
  created_at: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sector?: string; investorType?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { status, q, sector, investorType } = await searchParams;

  const where: string[] = [];
  const params: any[] = [];

  if (!canViewAll(session.role)) {
    where.push("assigned_committee_member_id = ?");
    params.push(Number(session.sub));
  }
  if (status && status !== "all") { where.push("status = ?"); params.push(status); }
  if (sector) { where.push("sector_tag = ?"); params.push(sector); }
  if (investorType && investorType !== "all") {
    where.push("investor_type = ?"); params.push(investorType);
  }
  if (q) {
    where.push("(company_name LIKE ? OR contact_person LIKE ? OR business_email LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const rows = await query<Row>(
    `SELECT id, investor_type, company_name, contact_person, business_email,
            primary_industry, sector_tag, status,
            assigned_committee_member_id, assigned_to, created_at
     FROM investor_interests
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY created_at DESC
     LIMIT 200`,
    params
  );

  const counts = await query<{ status: string; c: number }>(
    `SELECT status, COUNT(*) AS c FROM investor_interests
     ${!canViewAll(session.role) ? "WHERE assigned_committee_member_id = " + Number(session.sub) : ""}
     GROUP BY status`
  );
  const countsMap = Object.fromEntries(counts.map((r) => [r.status, r.c]));
  const total = Object.values(countsMap).reduce((a, b) => a + b, 0);

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Submission Dashboard</h1>
          <p>
            Signed in as <strong>{session.name}</strong> · {session.role.replace("_", " ")}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href="/admin/email/new" className="btn btn-secondary">Compose Email</Link>
          <Link href="/admin/submissions" className="btn btn-primary">View All</Link>
        </div>
      </header>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total</div>
          <div className="value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="label">New</div>
          <div className="value">{countsMap["new"] ?? 0}</div>
        </div>
        <div className="stat-card">
          <div className="label">In Progress</div>
          <div className="value">
            {(countsMap["review"] ?? 0) +
             (countsMap["assessment"] ?? 0) +
             (countsMap["partner_search"] ?? 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Active</div>
          <div className="value">{countsMap["active"] ?? 0}</div>
        </div>
      </div>

      <form method="get" className="filter-bar">
        <input
          type="search"
          name="q"
          placeholder="Search company, contact or email…"
          defaultValue={q ?? ""}
        />
        <select name="status" defaultValue={status ?? "all"}>
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="review">Review</option>
          <option value="assessment">Assessment</option>
          <option value="partner_search">Partner Search</option>
          <option value="introduced">Introduced</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
        <select name="investorType" defaultValue={investorType ?? "all"}>
          <option value="all">All types</option>
          <option value="german">German</option>
          <option value="saudi">Saudi</option>
          <option value="other">Other</option>
        </select>
        <button className="btn btn-primary" type="submit">Filter</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">No submissions yet.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td><strong>#{r.id}</strong></td>
                <td>
                  {r.company_name}
                  {r.primary_industry && <span className="sub">{r.primary_industry}</span>}
                </td>
                <td>
                  {r.contact_person}
                  <span className="sub">{r.business_email}</span>
                </td>
                <td>
                  <span style={{ textTransform: "capitalize", fontSize: ".85rem" }}>
                    {r.investor_type}
                  </span>
                </td>
                <td>
                  <span className={`pill ${r.status}`}>
                    {r.status.replace("_", " ")}
                  </span>
                </td>
                <td className="sub">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td>
                  <Link
                    href={`/admin/submissions/${r.id}`}
                    className="btn btn-secondary btn-sm"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}