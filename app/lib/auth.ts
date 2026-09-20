import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);
const cookieName = process.env.AUTH_COOKIE_NAME || "sgbc_admin_session";

// ---- single source of truth for roles ----
export const ROLES = ["admin", "chairman", "main_committee", "general_committee"] as const;
export type Role = (typeof ROLES)[number];

export type SessionPayload = {
  sub: string;        // admin_users.id (string form)
  email: string;      // login email
  name: string;       // full_name
  role: Role;
  committeeEmail?: string | null;
};

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

// ---- permission helpers ----
export function canAssign(role: Role): boolean {
  return role === "admin" || role === "chairman";
}

export function canViewAll(role: Role): boolean {
  return role === "admin" || role === "chairman" || role === "main_committee";
}

export function isCommitteeMember(role: Role): boolean {
  return role === "main_committee" || role === "general_committee";
}