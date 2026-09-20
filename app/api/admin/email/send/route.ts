import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { threadId, submissionId, to, cc, subject, body } = await req.json();

  if (!to || !subject || !body) {
    return NextResponse.json(
      { error: "to, subject and body are required." },
      { status: 400 }
    );
  }

  const me = await queryOne<any>(
    "SELECT id, full_name, committee_email, email FROM admin_users WHERE id = ?",
    [Number(session.sub)]
  );
  if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const fromEmail = me.committee_email || me.email;

  let thread = threadId ? Number(threadId) : null;
  if (!thread) {
    const [res] = await query<any>(
      `INSERT INTO email_threads (submission_id, subject, created_by)
       VALUES (?, ?, ?)`,
      [submissionId ?? null, subject, me.id]
    );
    thread = (res as any).insertId;
  }

  let info;
  try {
    info = await sendMail({
      from: fromEmail,
      fromName: me.full_name,
      to,
      cc,
      subject,
      text: body,
    });
  } catch (err: any) {
    console.error("SMTP send failed:", err);
    return NextResponse.json(
      { error: "Email could not be sent. Check SMTP settings." },
      { status: 502 }
    );
  }

  const [msg] = await query<any>(
    `INSERT INTO email_messages
      (thread_id, direction, from_email, from_name, subject, body, message_id)
     VALUES (?, 'outbound', ?, ?, ?, ?, ?)`,
    [thread, fromEmail, me.full_name, subject, body, info.messageId]
  );

  await query(
    `INSERT INTO email_recipients (message_id, recipient_type, email)
     VALUES (?, 'to', ?)`,
    [(msg as any).insertId, to]
  );
  if (cc) {
    await query(
      `INSERT INTO email_recipients (message_id, recipient_type, email)
       VALUES (?, 'cc', ?)`,
      [(msg as any).insertId, cc]
    );
  }

  await query(
    `UPDATE email_threads SET last_message_at = NOW() WHERE id = ?`,
    [thread]
  );

  return NextResponse.json({ ok: true, threadId: thread, messageId: info.messageId });
}