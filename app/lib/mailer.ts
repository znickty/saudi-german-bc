import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export function getMailer(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  from: string;
  fromName?: string;
  to: string;
  cc?: string;
  subject: string;
  text: string;
  html?: string;
  inReplyTo?: string;
  references?: string;
}) {
  const displayName = opts.fromName || process.env.SMTP_FROM_NAME || "SGBC";
  return getMailer().sendMail({
    from: `${displayName} <${opts.from}>`,
    to: opts.to,
    cc: opts.cc,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    inReplyTo: opts.inReplyTo,
    references: opts.references,
  });
}