import { redirect } from "next/navigation";
import { getSession } from "../lib/auth";
import { query } from "../lib/db";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";

type Row = {
  id: number;
  company_name: string;
  contact_person: string;
  business_email: string;
  primary_industry: string | null;
  sector_tag: string | null;
  status: string;
  assigned_to: string | null;
  created_at: string;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; sector?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const where: string[] = [];
  const params: any[] = [];
  if (searchParams.status && searchParams.status !== "all") {
    where.push("status = ?");
    params.push(searchParams.status);
  }
  if (searchParams.q) {
    where.push("(company_name LIKE ? OR contact_person LIKE ? OR business_email LIKE ?)");
    const like = `%${searchParams.q}%`;
    params.push(like, like, like);
  }
  if (searchParams.sector) {
    where.push("sector_tag = ?");
    params.push(searchParams.sector);
  }

  const rows = await query<Row>(
    `SELECT id, company_name, contact_person, business_email,
            primary_industry, sector_tag, status, assigned_to, created_at
     FROM investor_interests
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY created_at DESC
     LIMIT 200`,
    params
  );

  const counts = await query<{ status: string; c: number }>(
    "SELECT status, COUNT(*) AS c FROM investor_interests GROUP BY status"
  );
  const countsMap = Object.fromEntries(counts.map((r) => [r.status, r.c]));
  const total = Object.values(countsMap).reduce((a, b) => a + b, 0);

  return (
    <main style={{ minHeight: "100vh", background: "#f1eedb", padding: "2rem 0" }}>
      <div className="container">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: ".25rem" }}>Submission Dashboard</h1>
            <p style={{ margin: 0, fontWeight: 300 }}>
              Signed in as <strong>{session.name}</strong> ({session.role})
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          <div className="card">
            <div style={{ fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>
              Total
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>{total}</div>
          </div>
          <div className="card">
            <div style={{ fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>
              New
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>
              {countsMap["new"] ?? 0}
            </div>
          </div>
          <div className="card">
            <div style={{ fontSize: ".8rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 500 }}>
              In progress
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700 }}>
              {(countsMap["review"] ?? 0) + (countsMap["assessment"] ?? 0) + (countsMap["partner_search"] ?? 0)}
            </div>
          </div>
        </div>

        <form
          method="get"
          style={{
            display: "flex", gap: ".75rem", flexWrap: "wrap",
            marginBottom: "1.5rem", background: "#fff", padding: "1rem", borderRadius: 16,
          }}
        >
          <input
            name="q"
            placeholder="Search company / contact / email"
            defaultValue={searchParams.q ?? ""}
            style={{ flex: 1, minWidth: 220, padding: ".6rem .9rem", borderRadius: 10, border: "1px solid rgba(57,34,49,.16)", background: "#f1eedb" }}
          />
          <select
            name="status"
            defaultValue={searchParams.status ?? "all"}
            style={{ padding: ".6rem .9rem", borderRadius: 10, border: "1px solid rgba(57,34,49,.16)", background: "#f1eedb" }}
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="review">Review</option>
            <option value="assessment">Assessment</option>
            <option value="partner_search">Partner Search</option>
            <option value="introduced">Introduced</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <button className="btn btn-primary" type="submit" style={{ padding: ".6rem 1.4rem" }}>
            Filter
          </button>
        </form>

        <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(57,34,49,.08)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".95rem" }}>
            <thead>
              <tr style={{ background: "#392231", color: "#f1eedb", textAlign: "left" }}>
                <th style={{ padding: ".8rem 1rem" }}>ID</th>
                <th style={{ padding: ".8rem 1rem" }}>Company</th>
                <th style={{ padding: ".8rem 1rem" }}>Contact</th>
                <th style={{ padding: ".8rem 1rem" }}>Industry</th>
                <th style={{ padding: ".8rem 1rem" }}>Status</th>
                <th style={{ padding: ".8rem 1rem" }}>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: "2rem", textAlign: "center", fontWeight: 300 }}>
                    No submissions yet.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(57,34,49,.06)" }}>
                  <td style={{ padding: ".8rem 1rem", fontWeight: 500 }}>#{r.id}</td>
                  <td style={{ padding: ".8rem 1rem" }}>{r.company_name}</td>
                  <td style={{ padding: ".8rem 1rem" }}>
                    {r.contact_person}
                    <div style={{ fontSize: ".8rem", opacity: .7 }}>{r.business_email}</div>
                  </td>
                  <td style={{ padding: ".8rem 1rem" }}>{r.primary_industry ?? "—"}</td>
                  <td style={{ padding: ".8rem 1rem" }}>
                    <span
                      style={{
                        background: statusColor(r.status),
                        color: "#fff",
                        padding: ".2rem .7rem",
                        borderRadius: 20,
                        fontSize: ".78rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {r.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: ".8rem 1rem", fontSize: ".85rem", opacity: .8 }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: ".8rem 1rem" }}>
                    <Link href={`/admin/submissions/${r.id}`} className="btn btn-secondary" style={{ padding: ".35rem .9rem", fontSize: ".85rem" }}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function statusColor(status: string) {
  switch (status) {
    case "new": return "#1c94d3";
    case "review": return "#956d48";
    case "assessment": return "#ffbb21";
    case "partner_search": return "#02be41";
    case "introduced": return "#02be41";
    case "active": return "#392231";
    case "closed": return "#777";
    default: return "#777";
  }
}