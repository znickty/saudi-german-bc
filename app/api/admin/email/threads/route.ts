import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await query<any>(
    "SELECT committee_email, email FROM admin_users WHERE id = ?",
    [Number(session.sub)]
  );
  const myEmail = me[0]?.committee_email || me[0]?.email;

  const threads = await query(
    `SELECT t.id, t.subject, t.submission_id, t.updated_at,
            (SELECT COUNT(*) FROM email_messages m WHERE m.thread_id = t.id) AS message_count,
            (SELECT body FROM email_messages m WHERE m.thread_id = t.id ORDER BY sent_at DESC LIMIT 1) AS last_body
     FROM email_threads t
     WHERE t.created_by = ? OR EXISTS (
       SELECT 1 FROM email_messages m
       WHERE m.thread_id = t.id AND (m.from_email = ? OR m.to_email = ? OR m.cc_email LIKE CONCAT('%', ?, '%'))
     )
     ORDER BY t.updated_at DESC
     LIMIT 200`,
    [Number(session.sub), myEmail, myEmail, myEmail]
  );

  return NextResponse.json({ threads });
}