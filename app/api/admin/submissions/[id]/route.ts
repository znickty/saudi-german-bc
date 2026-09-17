import { NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import { query, queryOne } from "../../../../lib/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await queryOne(
    "SELECT * FROM investor_interests WHERE id = ? LIMIT 1",
    [params.id]
  );
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const activity = await query(
    "SELECT * FROM submission_activity WHERE submission_id = ? ORDER BY created_at DESC",
    [params.id]
  );

  return NextResponse.json({ submission: row, activity });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  await query(
    `UPDATE investor_interests SET ${sets.join(", ")} WHERE id = ?`,
    values
  );

  // log activity
  await query(
    `INSERT INTO submission_activity (submission_id, admin_id, action, note)
     VALUES (?, ?, ?, ?)`,
    [
      params.id,
      Number(session.sub),
      body.__action ?? "update",
      body.__note ?? null,
    ]
  );

  const updated = await queryOne(
    "SELECT * FROM investor_interests WHERE id = ? LIMIT 1",
    [params.id]
  );
  return NextResponse.json({ ok: true, submission: updated });
}