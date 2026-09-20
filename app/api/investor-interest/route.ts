import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.companyName || !body.contactPerson || !body.businessEmail) {
      return NextResponse.json(
        { error: "companyName, contactPerson and businessEmail are required." },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO investor_interests (
        investor_type, country_origin,
        company_name, website, year_established, headquarters,
        contact_person, position, business_email, telephone,
        company_size, primary_industry, main_products, current_markets,
        opportunity_description, reason_for_saudi, target_industries,
        preferred_geography, investment_range, implementation_timeframe,
        project_stage, cooperation_types,
        partner_type, partner_capabilities, required_resources,
        desired_contribution, german_contribution, exclusivity,
        ready_for_intro
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
      body.investorType ?? "german",
      body.countryOrigin ?? null,
      body.companyName,
      body.website ?? null,
      body.yearEstablished ?? null,
      body.headquarters ?? null,
      body.contactPerson,
      body.position ?? null,
      body.businessEmail,
      body.telephone ?? null,
      body.companySize ?? null,
      body.primaryIndustry ?? null,
      body.mainProducts ?? null,
      body.currentMarkets ?? null,
      body.opportunityDescription ?? null,
      body.reasonForSaudi ?? null,
      body.targetIndustries ?? null,
      body.preferredGeography ?? null,
      body.investmentRange ?? null,
      body.implementationTimeframe ?? null,
      body.projectStage ?? null,
      JSON.stringify(body.cooperationTypes ?? []),
      body.partnerType ?? null,
      body.partnerCapabilities ?? null,
      body.requiredResources ?? null,
      body.desiredContribution ?? null,
      body.germanContribution ?? null,
      body.exclusivity ?? "maybe",
      body.readyForIntro ? 1 : 0,
    ];

    const pool = getPool();
    const [result] = await pool.execute(sql, values);

    return NextResponse.json({
      ok: true,
      id: (result as any).insertId,
      message: "Submission received. Our team will review and follow up.",
    });
  } catch (err) {
    console.error("Investor interest submit error:", err);
    return NextResponse.json(
      { error: "Submission failed. Please try again later." },
      { status: 500 }
    );
  }
}