import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import { buildInvestorConfirmationEmail } from "@/lib/email-templates/investor-confirmation";
import { locales, defaultLocale, type Locale } from "@/i18n/config";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Required fields
    if (!body.companyName || !body.contactPerson || !body.businessEmail) {
      return NextResponse.json(
        { error: "companyName, contactPerson and businessEmail are required." },
        { status: 400 }
      );
    }

    // Locale — fall back to default if missing/invalid
    const localeInput = String(body.locale || "").toLowerCase();
    const locale: Locale = (locales as readonly string[]).includes(localeInput)
      ? (localeInput as Locale)
      : defaultLocale;

    const investorType: "german" | "saudi" | "other" =
      body.investorType === "saudi" ? "saudi" :
      body.investorType === "other" ? "other" : "german";

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
      investorType,
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
    const submissionId = (result as any).insertId as number;

    // ---- Send confirmation email (fire and forget, log errors) ----
    const { subject, html, text } = buildInvestorConfirmationEmail({
      locale,
      to: body.businessEmail,
      contactPerson: body.contactPerson,
      companyName: body.companyName,
      submissionId,
      investorType,
    });

    try {
      await sendMail({
        to: body.businessEmail,
        subject,
        html,
        text,
      });
    } catch (mailErr) {
      // Do not fail the submission if the email fails
      console.error("Confirmation email failed:", mailErr);
    }

    return NextResponse.json({
      ok: true,
      id: submissionId,
      message: "Submission received. A confirmation email has been sent.",
    });
  } catch (err) {
    console.error("Investor interest submit error:", err);
    return NextResponse.json(
      { error: "Submission failed. Please try again later." },
      { status: 500 }
    );
  }
}