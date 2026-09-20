import { NextResponse } from "next/server";
import { getSession, canViewAll } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const sector = searchParams.get("sector");
  const investorType = searchParams.get("investorType");
  const q = searchParams.get("q");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: string[] = [];
  const params: any[] = [];

  // Role scoping: general_committee only sees their assignments
  if (!canViewAll(session.role)) {
    where.push("assigned_committee_member_id = ?");
    params.push(Number(session.sub));
  }

  if (status && status !== "all") { where.push("status = ?"); params.push(status); }
  if (sector) { where.push("sector_tag = ?"); params.push(sector); }
  if (investorType && investorType !== "all") {
    where.push("investor_type = ?"); params.push(investorType);
  }
  if (q) {
    where.push("(company_name LIKE ? OR contact_person LIKE ? OR business_email LIKE ?)");
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (from) { where.push("created_at >= ?"); params.push(from); }
  if (to) { where.push("created_at <= ?"); params.push(to); }

  const sql = `
    SELECT
      id, investor_type, country_origin,
      company_name, contact_person, business_email,
      primary_industry, sector_tag, status,
      assigned_to, assigned_committee_member_id,
      created_at, updated_at
    FROM investor_interests
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ORDER BY created_at DESC
    LIMIT 500
  `;

  const rows = await query(sql, params);
  return NextResponse.json({ submissions: rows });
}