import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import { query, queryOne } from "../../../../../lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin" && session.role !== "chairman") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { memberId, note } = await req.json();
  if (!memberId) return NextResponse.json({ error: "memberId required" }, { status: 400 });

  const member = await queryOne<any>(
    "SELECT id, full_name, committee_email FROM admin_users WHERE id = ? AND is_active = 1",
    [memberId]
  );
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  await query(
    `UPDATE investor_interests
     SET assigned_committee_member_id = ?, assigned_at = NOW(), status = 'review'
     WHERE id = ?`,
    [memberId, params.id]
  );

  await query(
    `INSERT INTO submission_activity (submission_id, admin_id, action, note)
     VALUES (?, ?, 'assigned', ?)`,
    [params.id, Number(session.sub), `Assigned to ${member.full_name} (${member.committee_email}). ${note ?? ""}`]
  );

  return NextResponse.json({ ok: true, member });
}