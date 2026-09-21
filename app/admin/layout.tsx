import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Login page bypasses the shell
  const session = await getSession();

  // If there's no session, still render children (login page handles its own UI)
  // but pages themselves enforce redirect. We only need to fetch session for the sidebar.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        name={session.name}
        email={session.email}
        role={session.role}
        committeeEmail={session.committeeEmail ?? null}
      />
      <main className="admin-main">{children}</main>
    </div>
  );
}