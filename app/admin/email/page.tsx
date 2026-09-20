import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EmailInbox() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const threads = await query<any>(
    `SELECT t.id, t.subject, t.submission_id, t.updated_at
     FROM email_threads t
     WHERE t.created_by = ?
     ORDER BY t.updated_at DESC LIMIT 200`,
    [Number(session.sub)]
  );

  return (
    <main style={{ minHeight: "100vh", background: "#f1eedb", padding: "2rem 0" }}>
      <div className="container">
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Email Inbox</h1>
        <p style={{ marginBottom: "2rem", fontWeight: 300 }}>
          Send and receive messages from your Council address.
        </p>

        <Link href="/admin/email/new" className="btn btn-primary">Compose New</Link>

        <div style={{ background: "#fff", borderRadius: 16, marginTop: "1.5rem", overflow: "hidden" }}>
          {threads.length === 0 && (
            <p style={{ padding: "2rem", fontWeight: 300 }}>No threads yet.</p>
          )}
          {threads.map((t) => (
            <Link
              key={t.id}
              href={`/admin/email/${t.id}`}
              style={{ display: "block", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(57,34,49,.06)" }}
            >
              <strong>{t.subject}</strong>
              <div style={{ fontSize: ".85rem", opacity: .7 }}>
                {t.submission_id ? `Submission #${t.submission_id} · ` : ""}
                Updated {new Date(t.updated_at).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}