"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/lib/auth";

type Props = {
  name: string;
  email: string;
  role: Role;
  committeeEmail: string | null;
};

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  chairman: "Chairman",
  main_committee: "Main Committee",
  general_committee: "General Committee",
};

export default function AdminSidebar({ name, email, role, committeeEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const canViewAll =
    role === "admin" || role === "chairman" || role === "main_committee";

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="admin-sidebar">
      <div className="brand">
        <Image src="/logo-mono-white.png" alt="SGBC" width={44} height={44} />
        <div className="brand-name">
          Saudi German
          <small>Business Council</small>
        </div>
      </div>

      <nav className="admin-nav">
        <Link href="/admin" className={isActive("/admin") && pathname === "/admin" ? "active" : ""}>
          📊 Dashboard
        </Link>

        {canViewAll && (
          <Link href="/admin/submissions" className={isActive("/admin/submissions") ? "active" : ""}>
            📥 Submissions
          </Link>
        )}

        <Link
          href="/admin/my-assignments"
          className={isActive("/admin/my-assignments") ? "active" : ""}
        >
          📌 My Assignments
        </Link>

        <Link href="/admin/email" className={isActive("/admin/email") ? "active" : ""}>
          ✉️ Email
        </Link>

        <Link href="/admin/email/new" className={isActive("/admin/email/new") ? "active" : ""}>
          ➕ Compose
        </Link>

        {role === "admin" && (
          <Link href="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
            👥 Users
          </Link>
        )}
      </nav>

      <div className="admin-user">
        <div className="avatar">{initials || "U"}</div>
        <div className="info">
          <strong>{name}</strong>
          <span>{ROLE_LABEL[role]}</span>
        </div>
      </div>

      <button
        onClick={logout}
        className="btn btn-secondary"
        style={{
          width: "100%",
          padding: ".5rem",
          fontSize: ".85rem",
          color: "#f1eedb",
          borderColor: "rgba(241,238,219,.3)",
          background: "transparent",
        }}
      >
        Sign out
      </button>
    </aside>
  );
}