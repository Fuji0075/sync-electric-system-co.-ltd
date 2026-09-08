import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
};

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

/**
 * Sends an email if SMTP_* env vars are configured; otherwise logs to the
 * console so the rest of the flow (saving the request, showing success to
 * the user) still works before real SMTP credentials are set up.
 */
export async function sendMail(input: SendMailInput): Promise<{ sent: boolean }> {
  const transport = getTransport();

  if (!transport) {
    console.warn(
      "[mail] SMTP not configured (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS) — skipping send.",
      { to: input.to, subject: input.subject }
    );
    return { sent: false };
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo,
    attachments: input.attachments,
  });

  return { sent: true };
}
