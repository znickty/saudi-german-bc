import { NextResponse } from "next/server";
import { getSession, canAssign } from "@/lib/auth";
import { listCommitteeMembers } from "@/lib/admin";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!canAssign(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const members = await listCommitteeMembers();
  return NextResponse.json({ members });
}