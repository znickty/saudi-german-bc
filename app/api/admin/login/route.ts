import { NextResponse } from "next/server";
import { findAdminByEmail, verifyPassword, touchLastLogin } from "@/lib/admin";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await findAdminByEmail(email);

    // Constant-ish time: always hash-compare
    const ok = admin
      ? await verifyPassword(password, admin.password_hash)
      : await verifyPassword(password, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");

    if (!admin || !ok) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await createSession({
      sub: String(admin.id),
      email: admin.email,
      name: admin.full_name,
      role: admin.role,
      committeeEmail: admin.committee_email,
    });

    await touchLastLogin(admin.id);

    return NextResponse.json({ ok: true, role: admin.role });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}