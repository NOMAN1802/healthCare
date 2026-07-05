import { Resend } from "resend";
import nodemailer from "nodemailer";
import config from "../config";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// ── Resend (production) ───────────────────────────────────────────────────────

const resendApiKey = process.env.RESEND_API_KEY ?? "";

const sendViaResend = async (payload: EmailPayload): Promise<void> => {
  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: "healthBridge <onboarding@resend.dev>", // works without domain verification
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
  if (error) throw new Error(error.message);
  console.log(`[Email] Sent via Resend: "${payload.subject}" → ${payload.to}`);
};

// ── Ethereal (dev fallback) ───────────────────────────────────────────────────

let _etherealTransporter: nodemailer.Transporter | null = null;

const sendViaEthereal = async (payload: EmailPayload): Promise<void> => {
  if (!_etherealTransporter) {
    const account = await nodemailer.createTestAccount();
    _etherealTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    });
    console.log("[Email] No RESEND_API_KEY — using Ethereal:", account.user);
  }

  const info = await _etherealTransporter.sendMail({
    from: '"healthBridge [Dev]" <no-reply@healthbridge.dev>',
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });

  console.log(`[Email] Sent (Ethereal): "${payload.subject}" → ${payload.to}`);
  console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
};

// ── Public API ────────────────────────────────────────────────────────────────

const sendEmail = async (payload: EmailPayload): Promise<void> => {
  try {
    if (resendApiKey) {
      await sendViaResend(payload);
    } else {
      await sendViaEthereal(payload);
    }
  } catch (err: any) {
    console.error(`[Email] Failed "${payload.subject}" → ${payload.to}:`, err?.message ?? err);
    throw err;
  }
};

export default sendEmail;
