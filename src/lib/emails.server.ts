// Server-only email sender using Resend. Keeps the surface small: two
// templates (learner enrolment receipt, admin notification) invoked from
// payment fulfilment. Silently no-ops when RESEND_API_KEY is not configured
// so local/preview builds don't fail; logs a warning.

const FROM = process.env.RESEND_FROM ?? "LoveTech Academy <onboarding@resend.dev>";
const ADMIN_TO = process.env.ADMIN_NOTIFICATIONS_EMAIL ?? "info@lovetechgroup.com.ng";

type SendInput = {
  to: string | string[];
  subject: string;
  html: string;
  bcc?: string | string[];
  replyTo?: string;
};

async function sendEmail(input: SendInput): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[emails] RESEND_API_KEY not configured — skipping email send.");
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(input.to) ? input.to : [input.to],
        bcc: input.bcc ? (Array.isArray(input.bcc) ? input.bcc : [input.bcc]) : undefined,
        subject: input.subject,
        html: input.html,
        reply_to: input.replyTo,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.warn(`[emails] Resend send failed (${res.status}): ${body}`);
      return { ok: false, error: `${res.status}: ${body}` };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.warn(`[emails] Resend exception: ${msg}`);
    return { ok: false, error: msg };
  }
}

const fmtNgn = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const shell = (title: string, inner: string) => `<!doctype html><html><body style="margin:0;padding:0;background:#f6f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1F2933;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f5f0;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">
        <tr><td style="background:#0F8A5F;padding:20px 28px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.85;">LoveTech Agro Academy</div>
          <div style="font-family:Georgia,serif;font-size:22px;margin-top:4px;">${title}</div>
        </td></tr>
        <tr><td style="padding:28px;">${inner}</td></tr>
        <tr><td style="padding:20px 28px;background:#fafafa;color:#5a635a;font-size:12px;">
          LoveTech Agrofinance &amp; Development Ltd · 27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja<br/>
          <a href="mailto:info@lovetechgroup.com.ng" style="color:#0F8A5F;">info@lovetechgroup.com.ng</a> · +234 802 606 5189
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#0F8A5F;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:6px;font-size:14px;">${label}</a>`;

export type LearnerReceiptInput = {
  learnerEmail: string;
  learnerName: string;
  courseTitle: string;
  amountPaid: number;
  discount: number;
  couponCode?: string | null;
  reference: string;
  dashboardUrl: string;
  receiptUrl: string;
};

export async function sendLearnerReceiptEmail(i: LearnerReceiptInput) {
  const gross = i.amountPaid + i.discount;
  const inner = `
    <p style="font-size:15px;margin:0 0 12px;">Hi ${escapeHtml(i.learnerName || "there")},</p>
    <p style="font-size:15px;margin:0 0 16px;">Your payment for <strong>${escapeHtml(i.courseTitle)}</strong> was received. Your enrolment is now active.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eee;border-radius:8px;margin:16px 0;">
      <tr><td style="padding:12px 16px;border-bottom:1px solid #eee;color:#5a635a;">Course</td><td style="padding:12px 16px;border-bottom:1px solid #eee;text-align:right;font-weight:600;">${escapeHtml(i.courseTitle)}</td></tr>
      <tr><td style="padding:12px 16px;border-bottom:1px solid #eee;color:#5a635a;">Subtotal</td><td style="padding:12px 16px;border-bottom:1px solid #eee;text-align:right;">${fmtNgn(gross)}</td></tr>
      ${i.discount > 0 ? `<tr><td style="padding:12px 16px;border-bottom:1px solid #eee;color:#5a635a;">Discount${i.couponCode ? ` (${escapeHtml(i.couponCode)})` : ""}</td><td style="padding:12px 16px;border-bottom:1px solid #eee;text-align:right;color:#B45309;">-${fmtNgn(i.discount)}</td></tr>` : ""}
      <tr><td style="padding:14px 16px;color:#1F2933;font-weight:700;">Total paid</td><td style="padding:14px 16px;text-align:right;font-weight:700;font-size:16px;color:#0F8A5F;">${fmtNgn(i.amountPaid)}</td></tr>
      <tr><td style="padding:10px 16px;color:#5a635a;font-size:12px;border-top:1px solid #eee;">Reference</td><td style="padding:10px 16px;text-align:right;font-family:monospace;font-size:12px;border-top:1px solid #eee;">${escapeHtml(i.reference)}</td></tr>
    </table>
    <p style="margin:20px 0;">${btn(i.dashboardUrl, "Go to my dashboard")} &nbsp; <a href="${i.receiptUrl}" style="color:#0F8A5F;font-weight:600;text-decoration:none;">View receipt</a></p>
    <p style="font-size:14px;color:#5a635a;margin:20px 0 0;">Next steps: watch for our WhatsApp cohort invite, then begin Module 1 at your own pace. Questions? Just reply to this email.</p>
  `;
  return sendEmail({
    to: i.learnerEmail,
    subject: `Payment received — ${i.courseTitle}`,
    html: shell("Payment received ✅", inner),
    bcc: ADMIN_TO,
    replyTo: "info@lovetechgroup.com.ng",
  });
}

export async function sendAdminNewEnrolmentEmail(i: {
  learnerName: string;
  learnerEmail: string;
  courseTitle: string;
  amountPaid: number;
  reference: string;
}) {
  const inner = `
    <p style="font-size:15px;margin:0 0 12px;">A new paid enrolment just came in.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eee;border-radius:8px;">
      <tr><td style="padding:10px 14px;color:#5a635a;">Learner</td><td style="padding:10px 14px;text-align:right;font-weight:600;">${escapeHtml(i.learnerName)}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a635a;border-top:1px solid #eee;">Email</td><td style="padding:10px 14px;text-align:right;border-top:1px solid #eee;">${escapeHtml(i.learnerEmail)}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a635a;border-top:1px solid #eee;">Course</td><td style="padding:10px 14px;text-align:right;border-top:1px solid #eee;">${escapeHtml(i.courseTitle)}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a635a;border-top:1px solid #eee;">Amount</td><td style="padding:10px 14px;text-align:right;border-top:1px solid #eee;font-weight:700;color:#0F8A5F;">${fmtNgn(i.amountPaid)}</td></tr>
      <tr><td style="padding:10px 14px;color:#5a635a;border-top:1px solid #eee;">Reference</td><td style="padding:10px 14px;text-align:right;border-top:1px solid #eee;font-family:monospace;font-size:12px;">${escapeHtml(i.reference)}</td></tr>
    </table>
  `;
  return sendEmail({
    to: ADMIN_TO,
    subject: `New enrolment · ${i.courseTitle} · ${fmtNgn(i.amountPaid)}`,
    html: shell("New paid enrolment", inner),
  });
}

function escapeHtml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
