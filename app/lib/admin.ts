import bcrypt from "bcryptjs";
import { queryOne, query } from "./db";

export type AdminUser = {
  id: number;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: "admin" | "reviewer";
  is_active: 0 | 1;
};

export async function findAdminByEmail(email: string) {
  return queryOne<AdminUser>(
    "SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1",
    [email]
  );
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function touchLastLogin(id: number) {
  await query("UPDATE admin_users SET last_login_at = NOW() WHERE id = ?", [id]);
}