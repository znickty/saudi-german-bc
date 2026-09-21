import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thread = await queryOne("SELECT * FROM email_threads WHERE id = ?", [id]);
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await query(
    `SELECT m.*,
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('type', r.recipient_type, 'email', r.email))
             FROM email_recipients r WHERE r.message_id = m.id) AS recipients
     FROM email_messages m
     WHERE m.thread_id = ?
     ORDER BY m.sent_at ASC`,
    [id]
  );

  return NextResponse.json({ thread, messages });
}