import { NextResponse } from "next/server";
import { findAdminByEmail, verifyPassword, touchLastLogin } from "../../../lib/admin";
import { createSession } from "../../../lib/auth";

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
    // constant-ish time: always compare against something
    const ok = admin
      ? await verifyPassword(password, admin.password_hash)
      : await verifyPassword(password, "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv");

    if (!admin || !ok) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    await createSession({
      sub: String(admin.id),
      email: admin.email,
      name: admin.full_name ?? admin.email,
      role: admin.role,
    });

    await touchLastLogin(admin.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}