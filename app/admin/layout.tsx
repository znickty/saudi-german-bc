// app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import type { Metadata } from "next";
import "@/globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/icon.svg", sizes: "16x16", type: "image/svg+xml" },
    ]
    
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className="admin-body">
        {!session ? (
          // Login page or unauthenticated state bypasses the shell
          children
        ) : (
          <div className="admin-shell">
            <AdminSidebar
              name={session.name}
              email={session.email}
              role={session.role}
              committeeEmail={session.committeeEmail ?? null}
            />
            <main className="admin-main">{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}