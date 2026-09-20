import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listAllAdmins, hashPassword } from "@/lib/admin";
import { query, queryOne } from "@/lib/db";

// GET — list all users (admin only)
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const users = await listAllAdmins();
  return NextResponse.json({ users });
}

// POST — create a new user (admin only)
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, password, full_name, role, committee_email, title, department } = await req.json();

  if (!email || !password || !full_name || !role) {
    return NextResponse.json(
      { error: "email, password, full_name, role are required." },
      { status: 400 }
    );
  }

  const existing = await queryOne("SELECT id FROM admin_users WHERE email = ?", [email]);
  if (existing) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const hash = await hashPassword(password);
  const result = await query<any>(
    `INSERT INTO admin_users
      (email, password_hash, full_name, role, committee_email, title, department)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [email, hash, full_name, role, committee_email ?? null, title ?? null, department ?? null]
  );

  return NextResponse.json({ ok: true, id: (result as any).insertId });
}