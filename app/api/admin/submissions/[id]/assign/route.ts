import { NextResponse } from "next/server";
import { getSession, canAssign } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  const { id } = await params;

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!canAssign(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { memberId, note } = await req.json();
  if (!memberId) {
    return NextResponse.json({ error: "memberId required" }, { status: 400 });
  }

  const member = await queryOne<{
    id: number; full_name: string; committee_email: string | null; role: string;
  }>(
    `SELECT id, full_name, committee_email, role
     FROM admin_users
     WHERE id = ? AND is_active = 1
       AND role IN ('main_committee','general_committee')
     LIMIT 1`,
    [memberId]
  );
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  await query(
    `UPDATE investor_interests
     SET assigned_committee_member_id = ?, assigned_at = NOW(), status = 'review'
     WHERE id = ?`,
    [memberId, id]
  );

  await query(
    `INSERT INTO submission_activity (submission_id, submission_type, admin_id, action, note)
     VALUES (?, 'investor', ?, 'assigned', ?)`,
    [
      id,
      Number(session.sub),
      `Assigned to ${member.full_name} (${member.committee_email ?? "no email"}). ${note ?? ""}`,
    ]
  );

  return NextResponse.json({ ok: true, member });
}