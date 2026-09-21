import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Council Admin</h1>
        <p>Sign in to review submissions and coordinate with the committee.</p>
        <LoginForm />
      </div>
    </div>
  );
}