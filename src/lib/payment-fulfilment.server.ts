// Server-only fulfilment helper: runs when a Paystack payment is verified as
// successful, either via the callback verify endpoint or the webhook. Idempotent.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const REFERRAL_REWARD_PERCENT = 20; // % off next enrolment for the referrer
const REFERRAL_REWARD_DAYS = 90;

async function generateInvoicePdf(input: {
  invoiceNumber: string;
  paidAt: Date;
  billTo: { name: string; email: string };
  courseTitle: string;
  amount: number; // final paid
  discount: number;
  couponCode?: string | null;
  reference: string;
}) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4 portrait
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  const vetiver = rgb(31 / 255, 77 / 255, 60 / 255);
  const ochre = rgb(200 / 255, 148 / 255, 31 / 255);
  const ink = rgb(26 / 255, 31 / 255, 28 / 255);
  const muted = rgb(100 / 255, 110 / 255, 105 / 255);

  const fmt = (n: number) =>
    "NGN " + new Intl.NumberFormat("en-NG", { maximumFractionDigits: 2 }).format(n);

  // Header band
  page.drawRectangle({ x: 0, y: 782, width: 595, height: 60, color: vetiver });
  page.drawText("LOVETECH AGROFINANCE & DEVELOPMENT LTD", { x: 40, y: 812, size: 12, font: bold, color: rgb(1, 1, 1) });
  page.drawText("Tax Invoice / Receipt", { x: 40, y: 794, size: 10, font: italic, color: rgb(230/255, 220/255, 190/255) });
  page.drawText(input.invoiceNumber, { x: 595 - 40 - bold.widthOfTextAtSize(input.invoiceNumber, 12), y: 812, size: 12, font: bold, color: rgb(1, 1, 1) });

  // Company block
  let y = 760;
  page.drawText("27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja", { x: 40, y, size: 9, font: serif, color: muted });
  y -= 12;
  page.drawText("info@lovetechgroup.com.ng · www.lovetechgroup.com.ng", { x: 40, y, size: 9, font: serif, color: muted });
  y -= 12;
  page.drawText("RC: 9535107 · TIN: 2623772591480", { x: 40, y, size: 9, font: serif, color: muted });

  // Meta right
  const metaX = 380;
  let my = 760;
  page.drawText("Invoice date", { x: metaX, y: my, size: 8, font: bold, color: ink });
  my -= 12;
  page.drawText(input.paidAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), { x: metaX, y: my, size: 10, font: serif, color: ink });
  my -= 18;
  page.drawText("Payment reference", { x: metaX, y: my, size: 8, font: bold, color: ink });
  my -= 12;
  page.drawText(input.reference, { x: metaX, y: my, size: 9, font: serif, color: ink });

  // Bill to
  y = 700;
  page.drawText("BILL TO", { x: 40, y, size: 9, font: bold, color: ochre });
  y -= 14;
  page.drawText(input.billTo.name, { x: 40, y, size: 12, font: bold, color: ink });
  y -= 12;
  page.drawText(input.billTo.email, { x: 40, y, size: 10, font: serif, color: muted });

  // Table
  const tableTop = 640;
  page.drawRectangle({ x: 40, y: tableTop - 4, width: 515, height: 24, color: rgb(245/255, 240/255, 220/255) });
  page.drawText("DESCRIPTION", { x: 48, y: tableTop + 4, size: 9, font: bold, color: vetiver });
  page.drawText("AMOUNT", { x: 470, y: tableTop + 4, size: 9, font: bold, color: vetiver });

  y = tableTop - 24;
  page.drawText(input.courseTitle, { x: 48, y, size: 11, font: bold, color: ink });
  y -= 14;
  page.drawText("Course enrolment · LoveTech Agro Academy", { x: 48, y, size: 9, font: italic, color: muted });
  const gross = input.amount + input.discount;
  page.drawText(fmt(gross), { x: 555 - serif.widthOfTextAtSize(fmt(gross), 11), y: y + 14, size: 11, font: serif, color: ink });

  y -= 24;
  page.drawLine({ start: { x: 40, y: y + 10 }, end: { x: 555, y: y + 10 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });

  // Totals
  const rightLabel = (label: string, val: string, ypos: number, big = false) => {
    const s = big ? 13 : 10;
    const f = big ? bold : serif;
    page.drawText(label, { x: 380, y: ypos, size: s, font: f, color: ink });
    page.drawText(val, { x: 555 - f.widthOfTextAtSize(val, s), y: ypos, size: s, font: f, color: big ? vetiver : ink });
  };
  rightLabel("Subtotal", fmt(gross), y);
  y -= 16;
  if (input.discount > 0) {
    rightLabel(`Discount${input.couponCode ? " (" + input.couponCode + ")" : ""}`, "-" + fmt(input.discount), y);
    y -= 16;
  }
  y -= 6;
  page.drawLine({ start: { x: 380, y: y + 12 }, end: { x: 555, y: y + 12 }, thickness: 0.5, color: ink });
  rightLabel("Total paid", fmt(input.amount), y, true);

  // Payment status
  y -= 40;
  page.drawRectangle({ x: 40, y: y - 6, width: 120, height: 22, color: rgb(220/255, 240/255, 225/255) });
  page.drawText("PAID", { x: 88, y: y + 2, size: 12, font: bold, color: vetiver });
  page.drawText("via Paystack", { x: 170, y: y + 3, size: 10, font: italic, color: muted });

  // Footer
  page.drawLine({ start: { x: 40, y: 80 }, end: { x: 555, y: 80 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.85) });
  page.drawText("Thank you for learning with LoveTech Agro Academy.", { x: 40, y: 60, size: 10, font: italic, color: vetiver });
  page.drawText("This is a computer-generated invoice. No signature required.", { x: 40, y: 46, size: 8, font: serif, color: muted });

  return new Uint8Array(await pdf.save());
}

export async function fulfilPayment(reference: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Load payment + enrolment + course
  const { data: payment } = await supabaseAdmin
    .from("academy_payments")
    .select("id, enrolment_id, course_id, amount, currency, user_email, paid_at, status, invoice_pdf_url")
    .eq("paystack_reference", reference)
    .maybeSingle();
  if (!payment) return { ok: false, reason: "payment_not_found" as const };

  const paidAt = payment.paid_at ? new Date(payment.paid_at) : new Date();

  const { data: enrolment } = await supabaseAdmin
    .from("academy_enrolments")
    .select("id, user_id, full_name, email, coupon_code, discount_amount, referral_code, course_id")
    .eq("id", payment.enrolment_id)
    .maybeSingle();
  if (!enrolment) return { ok: false, reason: "enrolment_not_found" as const };
  if (!enrolment.user_id) return { ok: false, reason: "enrolment_no_user" as const };
  const enrolUserId = enrolment.user_id;

  const { data: course } = await supabaseAdmin
    .from("academy_courses")
    .select("id, title")
    .eq("id", payment.course_id)
    .maybeSingle();

  // ------- Coupon redemption -------
  if (enrolment.coupon_code) {
    const code = enrolment.coupon_code.toUpperCase();
    const { data: coupon } = await supabaseAdmin
      .from("academy_coupons")
      .select("id, used_count")
      .eq("code", code)
      .maybeSingle();
    if (coupon) {
      // Idempotent: unique(coupon_id, enrolment_id)
      const { error: redErr } = await supabaseAdmin.from("academy_coupon_redemptions").insert({
        coupon_id: coupon.id,
        enrolment_id: enrolment.id,
        user_id: enrolUserId,
        discount_amount: Number(enrolment.discount_amount ?? 0),
      });
      if (!redErr) {
        await supabaseAdmin
          .from("academy_coupons")
          .update({ used_count: (coupon.used_count ?? 0) + 1 })
          .eq("id", coupon.id);
      }
    }
  }

  // ------- Referral conversion + reward -------
  if (enrolment.referral_code) {
    const code = enrolment.referral_code.toUpperCase();
    const { data: referrer } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, email")
      .eq("referral_code", code)
      .maybeSingle();

    if (referrer && referrer.id !== enrolUserId) {
      // Only create a referral row once per enrolment
      const { data: existing } = await supabaseAdmin
        .from("academy_referrals")
        .select("id, status, reward_coupon_id")
        .eq("referred_enrolment_id", enrolment.id)
        .maybeSingle();

      let referralId = existing?.id;
      if (!existing) {
        const { data: ins } = await supabaseAdmin
          .from("academy_referrals")
          .insert({
            referrer_user_id: referrer.id,
            referred_user_id: enrolUserId,
            referred_enrolment_id: enrolment.id,
            referral_code: code,
            status: "converted",
          })
          .select("id")
          .single();
        referralId = ins?.id;
      }

      // Issue reward coupon if not already
      if (referralId && !existing?.reward_coupon_id) {
        const rewardCode = "REF-" + code + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
        const expires = new Date(Date.now() + REFERRAL_REWARD_DAYS * 86400 * 1000);
        const { data: newCoupon } = await supabaseAdmin
          .from("academy_coupons")
          .insert({
            code: rewardCode,
            kind: "percent",
            value: REFERRAL_REWARD_PERCENT,
            max_uses: 1,
            expires_at: expires.toISOString(),
            issued_to_user_id: referrer.id,
            source: "referral",
            notes: `Reward for referring ${enrolment.full_name ?? enrolment.email}`,
            active: true,
          })
          .select("id")
          .single();
        if (newCoupon) {
          await supabaseAdmin
            .from("academy_referrals")
            .update({ status: "rewarded", reward_coupon_id: newCoupon.id })
            .eq("id", referralId);
        }
      }
    }
  }

  // ------- Invoice PDF (idempotent) -------
  const firstFulfilment = !payment.invoice_pdf_url;
  if (firstFulfilment) {
    const invoiceNumber = "INV-" + paidAt.getFullYear() + "-" + payment.id.slice(0, 8).toUpperCase();
    const bytes = await generateInvoicePdf({
      invoiceNumber,
      paidAt,
      billTo: { name: enrolment.full_name ?? "Learner", email: enrolment.email ?? payment.user_email ?? "" },
      courseTitle: course?.title ?? "Course enrolment",
      amount: Number(payment.amount),
      discount: Number(enrolment.discount_amount ?? 0),
      couponCode: enrolment.coupon_code,
      reference,
    });
    const path = `${enrolUserId}/${payment.id}.pdf`;
    const up = await supabaseAdmin.storage
      .from("invoices")
      .upload(path, bytes, { contentType: "application/pdf", upsert: true });
    if (!up.error) {
      await supabaseAdmin
        .from("academy_payments")
        .update({ invoice_pdf_url: path, invoice_number: invoiceNumber })
        .eq("id", payment.id);
    }
  }

  // ------- Email confirmations (once, gated by first fulfilment) -------
  if (firstFulfilment) {
    try {
      const { sendLearnerReceiptEmail, sendAdminNewEnrolmentEmail } = await import("@/lib/emails.server");
      const siteOrigin = process.env.SITE_ORIGIN ?? "https://lovetechgroup.lovable.app";
      const learnerEmail = enrolment.email ?? payment.user_email ?? "";
      if (learnerEmail) {
        await sendLearnerReceiptEmail({
          learnerEmail,
          learnerName: enrolment.full_name ?? "there",
          courseTitle: course?.title ?? "Course enrolment",
          amountPaid: Number(payment.amount),
          discount: Number(enrolment.discount_amount ?? 0),
          couponCode: enrolment.coupon_code,
          reference,
          dashboardUrl: `${siteOrigin}/academy/dashboard`,
          receiptUrl: `${siteOrigin}/academy/receipt?payment=success&ref=${encodeURIComponent(reference)}`,
        });
      }
      await sendAdminNewEnrolmentEmail({
        learnerName: enrolment.full_name ?? "Learner",
        learnerEmail,
        courseTitle: course?.title ?? "Course enrolment",
        amountPaid: Number(payment.amount),
        reference,
      });
    } catch (e) {
      console.warn("[fulfilment] email send failed:", e instanceof Error ? e.message : e);
    }
  }

  return { ok: true as const };
}
