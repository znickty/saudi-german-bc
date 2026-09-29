import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendMailResult = {
  id: string;
  messageId: string; // alias for compatibility with old callers
};

export async function sendMail(opts: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  cc?: string;
  replyTo?: string;
  from?: string;
  fromName?: string;
}): Promise<SendMailResult> {
  const fromEmail =
    opts.from ||
    process.env.RESEND_FROM_EMAIL ||
    "notifications@saudigermanbc.org";
  const fromName =
    opts.fromName ||
    process.env.RESEND_FROM_NAME ||
    "Saudi German Business Council";

  const { data, error } = await resend.emails.send({
    from: `${fromName} <${fromEmail}>`,
    to: opts.to,
    cc: opts.cc,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  return {
    id: data!.id,
    messageId: data!.id, // alias
  };
}
