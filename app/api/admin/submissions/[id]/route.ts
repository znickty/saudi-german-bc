import { NextResponse } from "next/server";
import { getSession, canViewAll } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await queryOne<any>(
    "SELECT * FROM investor_interests WHERE id = ? LIMIT 1",
    [params.id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // general_committee can only read their own assignments
  if (
    !canViewAll(session.role) &&
    Number(row.assigned_committee_member_id) !== Number(session.sub)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const activity = await query<any>(
    `SELECT * FROM submission_activity
     WHERE submission_id = ? AND submission_type = 'investor'
     ORDER BY created_at DESC LIMIT 100`,
    [params.id]
  );

  return NextResponse.json({ submission: row, activity });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await queryOne<any>(
    "SELECT assigned_committee_member_id FROM investor_interests WHERE id = ?",
    [params.id]
  );
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    !canViewAll(session.role) &&
    Number(existing.assigned_committee_member_id) !== Number(session.sub)
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const allowed = ["status", "sector_tag", "assigned_to", "internal_notes"];
  const sets: string[] = [];
  const values: any[] = [];

  for (const key of allowed) {
    if (key in body) {
      sets.push(`${key} = ?`);
      values.push(body[key] ?? null);
    }
  }
  if (!sets.length) return NextResponse.json({ ok: true, unchanged: true });

  values.push(params.id);
  await query(`UPDATE investor_interests SET ${sets.join(", ")} WHERE id = ?`, values);

  await query(
    `INSERT INTO submission_activity (submission_id, submission_type, admin_id, action, note)
     VALUES (?, 'investor', ?, ?, ?)`,
    [params.id, Number(session.sub), body.__action ?? "update", body.__note ?? null]
  );

  const updated = await queryOne(
    "SELECT * FROM investor_interests WHERE id = ? LIMIT 1",
    [params.id]
  );
  return NextResponse.json({ ok: true, submission: updated });
}