import { redirect } from "next/navigation";
import { getSession, canViewAll } from "@/lib/auth";
import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SubmissionsList({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; investorType?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { status, q, investorType } = await searchParams;

  const where: string[] = [];
  const params: any[] = [];
  if (!canViewAll(session.role)) {
    where.push("assigned_committee_member_id = ?");
    params.push(Number(session.sub));
  }
  if (status && status !== "all") { where.push("status = ?"); params.push(status); }
  if (investorType && investorType !== "all") {
    where.push("investor_type = ?"); params.push(investorType);
  }
  if (q) {
    where.push("(company_name LIKE ? OR contact_person LIKE ? OR business_email LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const rows = await query<any>(
    `SELECT id, investor_type, company_name, contact_person, business_email,
            primary_industry, status, created_at
     FROM investor_interests
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY created_at DESC
     LIMIT 300`,
    params
  );

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>All Submissions</h1>
          <p>{rows.length} results</p>
        </div>
        <Link href="/admin" className="btn btn-secondary">Back to Dashboard</Link>
      </header>

      <form method="get" className="filter-bar">
        <input
          type="search"
          name="q"
          placeholder="Search…"
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
        <button className="btn btn-primary">Filter</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Company</th><th>Contact</th><th>Type</th>
              <th>Status</th><th>Created</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="empty">No submissions found.</td></tr>
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
                <td style={{ textTransform: "capitalize" }}>{r.investor_type}</td>
                <td><span className={`pill ${r.status}`}>{r.status.replace("_", " ")}</span></td>
                <td className="sub">{new Date(r.created_at).toLocaleDateString()}</td>
                <td>
                  <Link href={`/admin/submissions/${r.id}`} className="btn btn-secondary btn-sm">
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