import bcrypt from "bcryptjs";
import { queryOne, query } from "./db";
import type { Role } from "./auth";

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  role: Role;
  committee_email: string | null;
  title: string | null;
  department: string | null;
  phone: string | null;
  is_active: 0 | 1;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export async function findAdminByEmail(email: string) {
  return queryOne<AdminUser>(
    "SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1",
    [email]
  );
}

export async function findAdminById(id: number | string) {
  return queryOne<AdminUser>(
    "SELECT * FROM admin_users WHERE id = ? AND is_active = 1 LIMIT 1",
    [id]
  );
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function touchLastLogin(id: number) {
  await query("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?", [id]);
}

export async function listCommitteeMembers() {
  return query<Pick<AdminUser, "id" | "full_name" | "role" | "committee_email" | "title">>(
    `SELECT id, full_name, role, committee_email, title
     FROM admin_users
     WHERE is_active = 1 AND role IN ('main_committee','general_committee')
     ORDER BY full_name ASC`
  );
}

export async function listAllAdmins() {
  return query<Pick<AdminUser, "id" | "email" | "full_name" | "role" | "committee_email" | "is_active" | "created_at">>(
    `SELECT id, email, full_name, role, committee_email, is_active, created_at
     FROM admin_users ORDER BY created_at ASC`
  );
}