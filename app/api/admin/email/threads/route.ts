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
    `SELECT t.id, t.subject, t.submission_id, t.last_message_at, t.updated_at,
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

  return NextResponse.json({ threads });
}