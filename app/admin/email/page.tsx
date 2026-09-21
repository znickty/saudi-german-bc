import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EmailInbox() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const me = await query<any>(
    "SELECT committee_email, email FROM admin_users WHERE id = ?",
    [Number(session.sub)]
  );
  const myEmail = me[0]?.committee_email || me[0]?.email;

  const threads = await query<any>(
    `SELECT t.id, t.subject, t.submission_id, t.last_message_at,
            (SELECT COUNT(*) FROM email_messages m WHERE m.thread_id = t.id) AS message_count
     FROM email_threads t
     WHERE t.created_by = ? OR EXISTS (
       SELECT 1 FROM email_messages m
       WHERE m.thread_id = t.id
         AND (m.from_email = ? OR EXISTS (
           SELECT 1 FROM email_recipients r
           WHERE r.message_id = m.id AND r.email = ?
         ))
     )
     ORDER BY t.last_message_at DESC
     LIMIT 200`,
    [Number(session.sub), myEmail, myEmail]
  );

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Email</h1>
          <p>Send and receive from {myEmail}</p>
        </div>
        <Link href="/admin/email/new" className="btn btn-primary">Compose New</Link>
      </header>

      <div className="email-list">
        {threads.length === 0 && (
          <p style={{ padding: "2rem", textAlign: "center", fontWeight: 300, opacity: .7 }}>
            No threads yet.
          </p>
        )}
        {threads.map((t: any) => (
          <Link key={t.id} href={`/admin/email/${t.id}`} className="email-list-item">
            <strong>{t.subject}</strong>
            <small>
              {t.submission_id ? `Submission #${t.submission_id} · ` : ""}
              {t.message_count} message{t.message_count === 1 ? "" : "s"} ·{" "}
              {new Date(t.last_message_at).toLocaleString()}
            </small>
          </Link>
        ))}
      </div>
    </>
  );
}