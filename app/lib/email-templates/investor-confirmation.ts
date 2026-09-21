import { Locale } from "@/i18n/config";

type Payload = {
  locale: Locale;
  to: string;
  contactPerson: string;
  companyName: string;
  submissionId: number;
  investorType: "german" | "saudi" | "other";
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const copy = {
  en: {
    subject: "We have received your submission — Saudi German Business Council",
    preview: "Thank you for reaching out to the Saudi–German Business Council.",
    greeting: (name: string) => `Dear ${name},`,
    thanks: (company: string) =>
      `Thank you for submitting your interest through the Saudi–German Business Council on behalf of ${company}.`,
    received: "Your submission has been received.",
    ref: "Reference number",
    next: "What happens next",
    step1: "Our team will review your submission carefully.",
    step2: "We will assess its relevance to Saudi demand and industrial priorities.",
    step3: "Where appropriate, we will look for suitable partners on both sides.",
    step4: "You will hear from us if we need more information, and we will propose next steps if there is a fit.",
    freeNote:
      "Submission and initial facilitation are provided free of charge. The Council does not charge an introduction fee or commission for connecting companies with prospective partners.",
    confidentiality:
      "If your project requires an exchange of sensitive information, the parties may first agree on appropriate confidentiality arrangements.",
    signoff: "Kind regards,",
    team: "The Saudi–German Business Council",
    tagline: "German Excellence. Saudi Opportunity. Regional Growth.",
  },
  ar: {
    subject: "لقد استلمنا طلبك — مجلس الأعمال السعودي الألماني",
    preview: "شكرًا لتواصلك مع مجلس الأعمال السعودي الألماني.",
    greeting: (name: string) => `عزيزي ${name}،`,
    thanks: (company: string) =>
      `شكرًا لتقديمك اهتمامك من خلال مجلس الأعمال السعودي الألماني بالنيابة عن ${company}.`,
    received: "تم استلام طلبك.",
    ref: "رقم المرجع",
    next: "ما يحدث بعد ذلك",
    step1: "سيراجع فريقنا طلبك بعناية.",
    step2: "سنقيّم مدى صلته بالطلب السعودي والأولويات الصناعية.",
    step3: "عند الاقتضاء، سنبحث عن شركاء مناسبين من الجانبين.",
    step4: "سنعاود التواصل معك إذا احتجنا إلى مزيد من المعلومات، وسنقترح الخطوات التالية إن وُجد توافق.",
    freeNote:
      "التقديم والتسهيل الأولي مجانيان. لا يفرض المجلس رسوم تعريف أو عمولة لربط الشركات بشركاء محتملين.",
    confidentiality:
      "إذا تطلب مشروعك تبادل معلومات حساسة، يجوز للأطراف الاتفاق أولاً على ترتيبات سرية مناسبة.",
    signoff: "مع أطيب التحيات،",
    team: "مجلس الأعمال السعودي الألماني",
    tagline: "التميز الألماني. الفرصة السعودية. النمو الإقليمي.",
  },
  de: {
    subject: "Wir haben Ihre Einreichung erhalten — Saudi German Business Council",
    preview: "Vielen Dank für Ihre Kontaktaufnahme mit dem Saudi–German Business Council.",
    greeting: (name: string) => `Sehr geehrte/r ${name},`,
    thanks: (company: string) =>
      `Vielen Dank, dass Sie Ihr Interesse über den Saudi–German Business Council im Namen von ${company} eingereicht haben.`,
    received: "Ihre Einreichung ist eingegangen.",
    ref: "Referenznummer",
    next: "Wie es weitergeht",
    step1: "Unser Team prüft Ihre Einreichung sorgfältig.",
    step2: "Wir bewerten die Relevanz für saudische Nachfrage und industrielle Prioritäten.",
    step3: "Wo angemessen, suchen wir geeignete Partner auf beiden Seiten.",
    step4: "Wir melden uns, falls wir weitere Informationen benötigen, und schlagen nächste Schritte vor, wenn eine Passung besteht.",
    freeNote:
      "Einreichung und anfängliche Erleichterung sind kostenfrei. Der Council berechnet keine Vermittlungsgebühr oder Provision für die Verbindung von Unternehmen mit potenziellen Partnern.",
    confidentiality:
      "Wenn Ihr Projekt den Austausch sensibler Informationen erfordert, können die Parteien zunächst geeignete Vertraulichkeitsvereinbarungen treffen.",
    signoff: "Mit freundlichen Grüßen,",
    team: "Saudi–German Business Council",
    tagline: "Deutsche Exzellenz. Saudi Chance. Regionales Wachstum.",
  },
} as const;

export function buildInvestorConfirmationEmail(p: Payload) {
  const c = copy[p.locale];
  const dir = p.locale === "ar" ? "rtl" : "ltr";
  const align = p.locale === "ar" ? "right" : "left";

  const logoUrl = `${SITE_URL}/email/logo.png`;
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="${p.locale}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${c.subject}</title>
</head>
<body style="margin:0;padding:0;background:#f1eedb;font-family:'IBM Plex Sans Arabic','IBM Plex Sans',Arial,sans-serif;color:#392231;">
  <div style="display:none;max-height:0;overflow:hidden;">${c.preview}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1eedb;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="620" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(57,34,49,0.08);">
          <!-- HEADER -->
          <tr>
            <td style="background:#392231;padding:24px 32px;text-align:center;">
              <img src="${logoUrl}" alt="Saudi German Business Council" width="260" style="display:block;margin:0 auto;max-width:100%;height:auto;" />
            </td>
          </tr>

          <!-- ACCENT BAR -->
          <tr>
            <td style="height:6px;background:linear-gradient(90deg,#02be41 0%,#02be41 33%,#dd281a 33%,#dd281a 66%,#1c94d3 66%,#1c94d3 100%);"></td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:36px 40px 8px 40px;text-align:${align};">
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#392231;">
                ${c.greeting(escapeHtml(p.contactPerson))}
              </p>
              <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#392231;">
                ${c.thanks(escapeHtml(p.companyName))}
              </p>

              <!-- Reference badge -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0;">
                <tr>
                  <td style="background:#f1eedb;border-radius:12px;padding:12px 18px;">
                    <span style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#956d48;font-weight:600;">
                      ${c.ref}
                    </span>
                    <div style="font-size:20px;font-weight:700;color:#392231;margin-top:2px;">
                      SGBC-${String(p.submissionId).padStart(6, "0")}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#02be41;font-weight:600;">
                ${c.received}
              </p>

              <!-- Next steps -->
              <h2 style="margin:0 0 12px 0;font-size:18px;color:#392231;font-weight:700;">${c.next}</h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                ${[c.step1, c.step2, c.step3, c.step4].map((s, i) => `
                  <tr>
                    <td valign="top" style="width:36px;padding:0 0 10px 0;">
                      <div style="width:26px;height:26px;border-radius:50%;background:#02be41;color:#fff;font-weight:700;font-size:13px;line-height:26px;text-align:center;display:inline-block;">${i + 1}</div>
                    </td>
                    <td valign="top" style="padding:0 0 10px 0;font-size:15px;line-height:1.55;color:#392231;">
                      ${s}
                    </td>
                  </tr>
                `).join("")}
              </table>

              <!-- Free note -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin:22px 0 6px 0;">
                <tr>
                  <td style="background:rgba(2,190,65,0.08);border-left:4px solid #02be41;padding:14px 16px;border-radius:10px;font-size:14px;line-height:1.55;color:#392231;">
                    ${c.freeNote}
                  </td>
                </tr>
              </table>

              <!-- Confidentiality -->
              <p style="margin:14px 0 24px 0;font-size:13px;line-height:1.55;color:#956d48;">
                ${c.confidentiality}
              </p>
            </td>
          </tr>

          <!-- SIGN-OFF -->
          <tr>
            <td style="padding:0 40px 32px 40px;text-align:${align};">
              <p style="margin:0 0 4px 0;font-size:15px;color:#392231;">${c.signoff}</p>
              <p style="margin:0;font-size:15px;font-weight:700;color:#392231;">${c.team}</p>
              <p style="margin:4px 0 0 0;font-size:13px;color:#956d48;">${c.tagline}</p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f1eedb;padding:20px 40px;text-align:center;font-size:12px;color:#956d48;line-height:1.6;">
              <div style="margin-bottom:6px;">
                <a href="${SITE_URL}" style="color:#392231;text-decoration:none;font-weight:600;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
              </div>
              © ${year} Saudi German Business Council · مجلس الأعمال السعودي الألماني
            </td>
          </tr>
        </table>

        <div style="max-width:620px;margin:14px auto 0 auto;font-size:11px;color:#956d48;text-align:center;line-height:1.5;">
          ${p.locale === "ar"
            ? "هذا البريد أُرسل تلقائيًا بعد تقديم طلبك. يُرجى عدم الرد مباشرة على هذه الرسالة."
            : p.locale === "de"
            ? "Diese E-Mail wurde automatisch nach Ihrer Einreichung versendet. Bitte antworten Sie nicht direkt."
            : "This email was sent automatically after your submission. Please do not reply directly."}
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `${c.greeting(p.contactPerson)}
${c.thanks(p.companyName)}

${c.ref}: SGBC-${String(p.submissionId).padStart(6, "0")}

${c.received}

${c.next}:
1. ${c.step1}
2. ${c.step2}
3. ${c.step3}
4. ${c.step4}

${c.freeNote}

${c.confidentiality}

${c.signoff}
${c.team}
${c.tagline}
`;

  return { subject: c.subject, html, text };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}