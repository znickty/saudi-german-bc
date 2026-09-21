import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { queryOne, query } from "@/lib/db";
import ReplyBox from "./ReplyBox";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function ThreadView({ params }: PageProps) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect("/admin/login");

  const thread = await queryOne<any>(
    "SELECT * FROM email_threads WHERE id = ? LIMIT 1",
    [id]
  );
  if (!thread) notFound();

  const messages = await query<any>(
    `SELECT m.*,
       (SELECT JSON_ARRAYAGG(JSON_OBJECT('type', r.recipient_type, 'email', r.email))
        FROM email_recipients r WHERE r.message_id = m.id) AS recipients
     FROM email_messages m
     WHERE m.thread_id = ?
     ORDER BY m.sent_at ASC`,
    [id]
  );

  const last = messages[messages.length - 1];
  const replyTo = last?.direction === "outbound" ? null : last?.from_email;

  return (
    <>
      <header className="admin-header">
        <div>
          <Link href="/admin/email" style={{ fontSize: ".85rem", opacity: .7 }}>← Back to Email</Link>
          <h1 style={{ marginTop: ".4rem" }}>{thread.subject}</h1>
          <p>
            {thread.submission_id ? (
              <>
                From submission{" "}
                <Link href={`/admin/submissions/${thread.submission_id}`}>
                  #{thread.submission_id}
                </Link>
              </>
            ) : "General thread"}
          </p>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        {messages.map((m: any) => (
          <div key={m.id} className={`message-bubble ${m.direction}`}>
            <div className="meta">
              <span>
                <strong>{m.direction === "outbound" ? "From you" : "Received"}</strong>
                {" · "}
                {m.from_email}
              </span>
              <span>{new Date(m.sent_at).toLocaleString()}</span>
            </div>
            <div className="body">{m.body}</div>
          </div>
        ))}
      </div>

      {replyTo && (
        <ReplyBox
          threadId={thread.id}
          to={replyTo}
          subject={`Re: ${thread.subject}`}
        />
      )}
    </>
  );
}