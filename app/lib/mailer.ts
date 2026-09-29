import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const VERIFIED_DOMAIN = "saudigermanbc.org";
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || `notifications@${VERIFIED_DOMAIN}`;
const DEFAULT_NAME = process.env.RESEND_FROM_NAME || "Saudi German Business Council";

export type SendMailResult = { id: string; messageId: string };

function sanitizeFrom(from?: string): string {
  if (!from) return DEFAULT_FROM;
  if (!from.endsWith("@" + VERIFIED_DOMAIN)) {
    console.warn(
      `[mailer] Refusing to send from "${from}" — not on ${VERIFIED_DOMAIN}. Falling back to ${DEFAULT_FROM}.`
    );
    return DEFAULT_FROM;
  }
  return from;
}

// Either html or text is REQUIRED, and at least one must be a string
type Content =
  | { html: string; text?: string }
  | { html?: string; text: string };

type BaseOpts = {
  to: string;
  subject: string;
  cc?: string;
  replyTo?: string;
  from?: string;
  fromName?: string;
};

export type SendMailOpts = BaseOpts & Content;

export async function sendMail(opts: SendMailOpts): Promise<SendMailResult> {
  const fromEmail = sanitizeFrom(opts.from);
  const fromName = opts.fromName || DEFAULT_NAME;

  // Build payload — only include defined fields
  const payload = {
    from: `${fromName} <${fromEmail}>`,
    to: opts.to,
    subject: opts.subject,
    ...(opts.cc ? { cc: opts.cc } : {}),
    ...(opts.replyTo || fromEmail ? { replyTo: opts.replyTo || fromEmail } : {}),
    ...(opts.html ? { html: opts.html } : {}),
    ...(opts.text ? { text: opts.text } : {}),
  };

  const { data, error } = await resend.emails.send(
    payload as Parameters<typeof resend.emails.send>[0]
  );

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  return { id: data!.id, messageId: data!.id };
}