import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { queryOne, execute } from "@/lib/db";
import { sendMail } from "@/lib/mailer";

const VERIFIED_DOMAIN = "saudigermanbc.org";
const FALLBACK_FROM = process.env.RESEND_FROM_EMAIL || `notifications@${VERIFIED_DOMAIN}`;

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

  const me = await queryOne<{
    id: number;
    full_name: string;
    committee_email: string | null;
    email: string;
  }>(
    "SELECT id, full_name, committee_email, email FROM admin_users WHERE id = ?",
    [Number(session.sub)]
  );
  if (!me) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // ---- Pick a valid sender ----
  let fromEmail: string;
  if (me.committee_email && me.committee_email.endsWith("@" + VERIFIED_DOMAIN)) {
    fromEmail = me.committee_email;
  } else {
    console.warn(
      `[email/send] User ${me.id} has no valid committee_email (got "${me.committee_email}"). Using fallback.`
    );
    fromEmail = FALLBACK_FROM;
  }

  // ---- Create thread if new ----
  let thread = threadId ? Number(threadId) : null;
  if (!thread) {
    const result = await execute(
      `INSERT INTO email_threads (submission_id, subject, created_by)
       VALUES (?, ?, ?)`,
      [submissionId ?? null, subject, me.id]
    );
    thread = result.insertId;
  }

  // ---- Send ----
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
    console.error("Resend send failed:", err);
    return NextResponse.json(
      { error: err.message || "Email could not be sent." },
      { status: 502 }
    );
  }

  // ---- Persist outbound ----
  const messageId = info.id ?? info.messageId ?? null;

  const msgResult = await execute(
    `INSERT INTO email_messages
      (thread_id, direction, from_email, from_name, subject, body, message_id)
     VALUES (?, 'outbound', ?, ?, ?, ?, ?)`,
    [thread, fromEmail, me.full_name, subject, body, messageId]
  );
  const messageRowId = msgResult.insertId;

  await execute(
    `INSERT INTO email_recipients (message_id, recipient_type, email)
     VALUES (?, 'to', ?)`,
    [messageRowId, to]
  );
  if (cc) {
    await execute(
      `INSERT INTO email_recipients (message_id, recipient_type, email)
       VALUES (?, 'cc', ?)`,
      [messageRowId, cc]
    );
  }

  await execute(
    `UPDATE email_threads SET last_message_at = NOW() WHERE id = ?`,
    [thread]
  );

  return NextResponse.json({
    ok: true,
    threadId: thread,
    messageId,
    from: fromEmail,
  });
}