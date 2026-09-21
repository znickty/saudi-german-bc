import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listAllAdmins } from "@/lib/admin";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  chairman: "Chairman",
  main_committee: "Main Committee",
  general_committee: "General Committee",
};

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");

  const users = await listAllAdmins();

  return (
    <>
      <header className="admin-header">
        <div>
          <h1>Users</h1>
          <p>{users.length} account{users.length === 1 ? "" : "s"}</p>
        </div>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Login email</th>
              <th>Committee email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.full_name}</strong></td>
                <td>{u.email}</td>
                <td>{u.committee_email ?? "—"}</td>
                <td>{ROLE_LABEL[u.role] ?? u.role}</td>
                <td>
                  <span className={`pill ${u.is_active ? "active" : "closed"}`}>
                    {u.is_active ? "Active" : "Disabled"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}