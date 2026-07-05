// ─── Date/time helpers ───────────────────────────────────────────────────────

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleString("en-US", opts);

const fmtDate = (iso: string) =>
  fmt(iso, { year: "numeric", month: "long", day: "numeric" });

const fmtTime = (iso: string) =>
  fmt(iso, { hour: "2-digit", minute: "2-digit", hour12: true });

// ─── Layout shell ────────────────────────────────────────────────────────────

const shell = (preheader: string, body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>healthBridge</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <!-- preheader (hidden) -->
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
              🏥 healthBridge
            </div>
            <div style="color:rgba(255,255,255,0.75);font-size:13px;margin-top:4px;">
              Healthcare Platform
            </div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            ${body}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              This is an automated message from healthBridge. Please do not reply to this email.
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#94a3b8;">
              &copy; ${new Date().getFullYear()} healthBridge Healthcare Platform. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ─── Reusable components ─────────────────────────────────────────────────────

const badge = (label: string, bg: string, color = "#fff") =>
  `<span style="display:inline-block;background:${bg};color:${color};padding:5px 16px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">${label}</span>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:10px 0;font-size:13px;color:#64748b;font-weight:500;border-bottom:1px solid #f1f5f9;width:45%;">${label}</td>
    <td style="padding:10px 0;font-size:13px;color:#1e293b;font-weight:600;border-bottom:1px solid #f1f5f9;text-align:right;">${value}</td>
  </tr>`;

const infoTable = (rows: string) => `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    ${rows}
  </table>`;

const alert = (color: string, borderColor: string, textColor: string, content: string) => `
  <div style="background:${color};border:1px solid ${borderColor};border-radius:8px;padding:16px;margin-top:20px;">
    <p style="margin:0;font-size:13px;color:${textColor};line-height:1.6;">${content}</p>
  </div>`;

// ─── 1. Appointment Booked ────────────────────────────────────────────────────

export const appointmentBookedTemplate = (data: {
  patientName: string;
  doctorName: string;
  doctorDesignation: string;
  startDateTime: string;
  endDateTime: string;
  fee: number;
  videoCallingId: string;
}) => {
  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      ${badge("Appointment Booked", "#6366f1")}
    </div>

    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
      Your appointment is confirmed! 🎉
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Hi <strong>${data.patientName}</strong>, your appointment has been booked successfully.
      Please complete the payment within <strong>30 minutes</strong> to secure your slot.
    </p>

    ${infoTable(
      row("Doctor", data.doctorName) +
      row("Designation", data.doctorDesignation) +
      row("Date", fmtDate(data.startDateTime)) +
      row("Time", `${fmtTime(data.startDateTime)} – ${fmtTime(data.endDateTime)}`) +
      row("Consultation Fee", `৳${data.fee}`) +
      row("Payment Status", "⏳ Pending")
    )}

    ${alert(
      "#fefce8", "#fde047", "#854d0e",
      "⚠️ <strong>Action Required:</strong> Your slot is reserved for 30 minutes. Please complete payment from your appointments dashboard to confirm the booking. Unpaid appointments are automatically cancelled."
    )}`;

  return {
    subject: "✅ Appointment Booked Successfully – healthBridge",
    html: shell(`Your appointment with ${data.doctorName} is booked. Complete payment to confirm.`, body),
  };
};

// ─── 2. Payment Confirmed ────────────────────────────────────────────────────

export const paymentConfirmedTemplate = (data: {
  patientName: string;
  doctorName: string;
  doctorDesignation: string;
  startDateTime: string;
  endDateTime: string;
  fee: number;
  transactionId: string;
}) => {
  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      ${badge("Payment Confirmed", "#16a34a")}
    </div>

    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
      Payment successful! 💳
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Hi <strong>${data.patientName}</strong>, your payment has been received and your appointment is
      now fully confirmed. See you soon!
    </p>

    ${infoTable(
      row("Doctor", data.doctorName) +
      row("Designation", data.doctorDesignation) +
      row("Date", fmtDate(data.startDateTime)) +
      row("Time", `${fmtTime(data.startDateTime)} – ${fmtTime(data.endDateTime)}`) +
      row("Amount Paid", `৳${data.fee}`) +
      row("Transaction ID", `<span style="font-family:monospace;font-size:11px;">${data.transactionId}</span>`) +
      row("Status", '<span style="color:#16a34a;font-weight:700;">✅ PAID</span>')
    )}

    ${alert(
      "#f0fdf4", "#86efac", "#166534",
      "💡 <strong>Reminder:</strong> You can join the video call directly from your <strong>Appointments</strong> dashboard. The join button becomes active <strong>10 minutes before</strong> your scheduled time."
    )}`;

  return {
    subject: "💳 Payment Confirmed – healthBridge",
    html: shell(`Payment of ৳${data.fee} confirmed for your appointment with ${data.doctorName}.`, body),
  };
};

// ─── 3. Appointment Cancelled ────────────────────────────────────────────────

export const appointmentCancelledTemplate = (data: {
  patientName: string;
  doctorName: string;
  startDateTime: string;
  endDateTime: string;
}) => {
  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      ${badge("Appointment Cancelled", "#dc2626")}
    </div>

    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
      Your appointment has been cancelled
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Hi <strong>${data.patientName}</strong>, your appointment scheduled below has been cancelled.
      If this was unexpected, please contact our support team.
    </p>

    ${infoTable(
      row("Doctor", data.doctorName) +
      row("Date", fmtDate(data.startDateTime)) +
      row("Time", `${fmtTime(data.startDateTime)} – ${fmtTime(data.endDateTime)}`) +
      row("Status", '<span style="color:#dc2626;font-weight:700;">❌ CANCELLED</span>')
    )}

    ${alert(
      "#fef2f2", "#fca5a5", "#991b1b",
      "💰 If you paid for this appointment, a <strong>full refund</strong> will be processed within 5–7 business days to your original payment method. You can rebook anytime from our platform."
    )}`;

  return {
    subject: "❌ Appointment Cancelled – healthBridge",
    html: shell(`Your appointment with ${data.doctorName} has been cancelled.`, body),
  };
};

// ─── 4. Appointment Completed ────────────────────────────────────────────────

export const appointmentCompletedTemplate = (data: {
  patientName: string;
  doctorName: string;
  doctorDesignation: string;
  startDateTime: string;
}) => {
  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      ${badge("Appointment Completed", "#0891b2")}
    </div>

    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
      Appointment completed successfully 🎊
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Hi <strong>${data.patientName}</strong>, your appointment with <strong>${data.doctorName}</strong>
      has been marked as completed. We hope you had a great experience!
    </p>

    ${infoTable(
      row("Doctor", data.doctorName) +
      row("Designation", data.doctorDesignation) +
      row("Date", fmtDate(data.startDateTime)) +
      row("Status", '<span style="color:#0891b2;font-weight:700;">✅ COMPLETED</span>')
    )}

    ${alert(
      "#eff6ff", "#bfdbfe", "#1e40af",
      "📋 <strong>Next Steps:</strong> Your doctor may issue a prescription through the platform — check your <strong>Prescriptions</strong> section. We'd also love to hear your feedback — please leave a <strong>review</strong> for your doctor from your dashboard!"
    )}`;

  return {
    subject: "🎉 Appointment Completed – healthBridge",
    html: shell(`Your appointment with ${data.doctorName} is complete.`, body),
  };
};

// ─── 5. Appointment In Progress ──────────────────────────────────────────────

export const appointmentInProgressTemplate = (data: {
  patientName: string;
  doctorName: string;
  startDateTime: string;
  endDateTime: string;
}) => {
  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      ${badge("Appointment Starting Now", "#d97706")}
    </div>

    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
      Your appointment is starting! 🟡
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Hi <strong>${data.patientName}</strong>, your appointment with <strong>${data.doctorName}</strong>
      is now in progress. Please join the video call immediately.
    </p>

    ${infoTable(
      row("Doctor", data.doctorName) +
      row("Time", `${fmtTime(data.startDateTime)} – ${fmtTime(data.endDateTime)}`) +
      row("Status", '<span style="color:#d97706;font-weight:700;">🟡 IN PROGRESS</span>')
    )}

    ${alert(
      "#fffbeb", "#fde68a", "#92400e",
      "📹 Go to your <strong>Appointments</strong> dashboard and click the <strong>video camera icon</strong> to join your session now."
    )}`;

  return {
    subject: "🟡 Your Appointment Is Starting Now – healthBridge",
    html: shell(`Join your video call with ${data.doctorName} now.`, body),
  };
};

// ─── 6. Prescription Issued ──────────────────────────────────────────────────

export const prescriptionIssuedTemplate = (data: {
  patientName: string;
  doctorName: string;
  doctorDesignation: string;
  appointmentDate: string;
  instructions: string;
  followUpDate?: string | null;
}) => {
  const followUp = data.followUpDate ? fmtDate(data.followUpDate) : null;

  // Render each line of instructions as a list item
  const instructionItems = data.instructions
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map(
      (line) =>
        `<tr><td style="padding:8px 0;font-size:14px;color:#1e293b;border-bottom:1px solid #f1f5f9;line-height:1.6;">
          <span style="color:#6366f1;font-weight:700;margin-right:8px;">•</span>${line}
        </td></tr>`
    )
    .join("");

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      ${badge("New Prescription", "#6366f1")}
    </div>

    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">
      Your prescription is ready 💊
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6;">
      Hi <strong>${data.patientName}</strong>, your doctor has reviewed your appointment and issued
      a prescription. Please follow the instructions carefully.
    </p>

    ${infoTable(
      row("Prescribed by", data.doctorName) +
      row("Designation", data.doctorDesignation) +
      row("Appointment Date", fmtDate(data.appointmentDate)) +
      (followUp ? row("Follow-up Date", `<span style="color:#d97706;font-weight:700;">📅 ${followUp}</span>`) : "")
    )}

    <!-- Instructions box -->
    <div style="margin:24px 0 0;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.8px;">
        📋 Doctor's Instructions
      </p>
      <div style="background:#f8faff;border:1px solid #e0e7ff;border-radius:8px;padding:20px 20px 12px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${instructionItems ||
            `<tr><td style="padding:8px 0;font-size:14px;color:#1e293b;line-height:1.6;">${data.instructions}</td></tr>`
          }
        </table>
      </div>
    </div>

    ${
      followUp
        ? alert(
            "#fffbeb", "#fde68a", "#92400e",
            `📅 <strong>Follow-up Reminder:</strong> Please schedule a follow-up visit on <strong>${followUp}</strong>. You can book your next appointment directly from the healthBridge platform.`
          )
        : ""
    }

    ${alert(
      "#eff6ff", "#bfdbfe", "#1e40af",
      "💊 You can view and download this prescription anytime from the <strong>Prescriptions</strong> section in your patient dashboard. Keep this email for your records."
    )}`;

  return {
    subject: "💊 New Prescription from Your Doctor – healthBridge",
    html: shell(
      `Dr. ${data.doctorName} has issued a prescription for you.`,
      body
    ),
  };
};
