import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const thread = await queryOne("SELECT * FROM email_threads WHERE id = ?", [params.id]);
  if (!thread) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const messages = await query(
    "SELECT * FROM email_messages WHERE thread_id = ? ORDER BY sent_at ASC",
    [params.id]
  );

  return NextResponse.json({ thread, messages });
}