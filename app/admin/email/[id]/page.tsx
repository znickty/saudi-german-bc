import { redirect, notFound } from "next/navigation";
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
    "SELECT * FROM email_threads WHERE id = ?",
    [id],
  );
  if (!thread) notFound();

  const messages = await query<any>(
    "SELECT * FROM email_messages WHERE thread_id = ? ORDER BY sent_at ASC",
    [id],
  );

  return (
    <main
      style={{ minHeight: "100vh", background: "#f1eedb", padding: "2rem 0" }}
    >
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontSize: "1.8rem", marginBottom: ".5rem" }}>
          {thread.subject}
        </h1>
        <p style={{ fontWeight: 300, opacity: 0.75 }}>
          {thread.submission_id
            ? `Submission #${thread.submission_id}`
            : "General"}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          {messages.map((m: any) => (
            <div key={m.id} className="card">
              <div
                style={{
                  fontSize: ".85rem",
                  opacity: 0.75,
                  marginBottom: ".5rem",
                }}
              >
                <strong>{m.from_email}</strong> → {m.to_email}
                {m.cc_email && <> · cc: {m.cc_email}</>}
                <span style={{ float: "right" }}>
                  {new Date(m.sent_at).toLocaleString()}
                </span>
              </div>
              <div style={{ whiteSpace: "pre-wrap", fontWeight: 300 }}>
                {m.body}
              </div>
            </div>
          ))}
        </div>

        <ReplyBox
          threadId={thread.id}
          to={messages[messages.length - 1]?.from_email}
          subject={`Re: ${thread.subject}`}
        />
      </div>
    </main>
  );
}
