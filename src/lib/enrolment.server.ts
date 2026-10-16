// Server-only enrolment + payment start. Needs the privileged database key, so hosts
// without it (e.g. the Netlify custom domain) forward to the payments host instead.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { resolveBasePrice, couponDiscount } from "@/lib/pricing";
import type { EnrolSchema } from "@/lib/enrolment.functions";

export const DEFAULT_PAYMENTS_ORIGIN = "https://lovetechgroup.lovable.app";
const RETURN_HOSTS = [/^lovetechgroup\.com\.ng$/, /^www\.lovetechgroup\.com\.ng$/, /\.lovable\.app$/, /^localhost$/];

/** Host that holds the privileged key and runs payment recording/verification. */
export function paymentsOrigin(currentOrigin: string) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return currentOrigin;
  return (process.env.PAYMENTS_ORIGIN ?? DEFAULT_PAYMENTS_ORIGIN).replace(/\/$/, "");
}

/** Only send learners back to our own sites after payment. */
export function safeReturnOrigin(raw: string | null | undefined, fallback: string) {
  try {
    if (raw) { const u = new URL(raw); if (RETURN_HOSTS.some((r) => r.test(u.hostname))) return u.origin; }
  } catch { /* ignore */ }
  return fallback;
}

function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variable(s).");
  return createClient<Database>(url, key, { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } });
}

export async function runEnrolment(
  data: z.infer<typeof EnrolSchema>,
  userId: string,
  userClient: SupabaseClient<Database>,
  origin: string,
  returnOrigin: string,
) {

    // Public read for course (anon-readable via RLS)
    const publicClient = getPublicClient();
    const { data: course, error: cErr } = await publicClient
      .from("academy_courses")
      .select("id, title, discount_price, regular_price")
      .eq("slug", data.course_slug)
      .maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!course) throw new Error("Course not found");

    const { course_slug, coupon_code, referral_code, purchase_option, module_choice, ...rest } = data;

    // Price always comes from the saved course record (or configured module price), never the browser.
    const { basePrice, option, module: chosenModule } = resolveBasePrice(course_slug, course, purchase_option, module_choice);

    // ---- Apply coupon (server-side re-validation) ----
    let discountAmount = 0;
    let appliedCoupon: string | null = null;
    if (coupon_code && coupon_code.trim().length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const code = coupon_code.trim().toUpperCase();
      const { data: coupon } = await supabaseAdmin
        .from("academy_coupons")
        .select("id, kind, value, max_uses, used_count, expires_at, min_amount, course_id, active, issued_to_user_id")
        .eq("code", code)
        .maybeSingle();
      discountAmount = couponDiscount(coupon, basePrice, course.id, userId);
      if (discountAmount > 0) appliedCoupon = code;
    }
    const amount = Math.max(0, basePrice - discountAmount);

    // ---- Referral code (must not be self) ----
    let appliedReferral: string | null = null;
    if (referral_code && referral_code.trim().length > 0) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const refCode = referral_code.trim().toUpperCase();
      const { data: refProfile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("referral_code", refCode)
        .maybeSingle();
      if (refProfile && refProfile.id !== userId) appliedReferral = refCode;
    }

    // Insert enrolment as the authenticated user (RLS-scoped)
    const { data: enrol, error } = await userClient
      .from("academy_enrolments")
      .insert({
        ...rest,
        course_id: course.id,
        user_id: userId,
        payment_status: "pending_payment",
        access_status: "inactive",
        coupon_code: appliedCoupon,
        discount_amount: discountAmount,
        referral_code: appliedReferral,
        purchase_option: option,
        module_choice: chosenModule,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    // Payment rows are written server-side only (service role)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: payErr } = await supabaseAdmin.from("academy_payments").insert({
      enrolment_id: enrol.id,
      course_id: course.id,
      user_email: data.email,
      amount,
      currency: "NGN",
      status: "initiated",
      payment_provider: "paystack",
    });
    // Never open a Paystack checkout without a payment record, or the charge can't be matched later.
    if (payErr) {
      console.error("[enrol] payment record insert failed", payErr.message);
      throw new Error("We couldn't start your payment. Please try again or contact support.");
    }

    const paystackKey = process.env.PAYSTACK_SECRET_KEY;

    // Free enrolment (100% coupon) — mark paid immediately and run fulfilment.
    if (amount <= 0) {
      const ref = `FREE-${enrol.id.slice(0, 8).toUpperCase()}-${Date.now()}`;
      await supabaseAdmin
        .from("academy_payments")
        .update({ status: "success", paid_at: new Date().toISOString(), paystack_reference: ref })
        .eq("enrolment_id", enrol.id);
      await supabaseAdmin
        .from("academy_enrolments")
        .update({ payment_status: "paid", access_status: "active" })
        .eq("id", enrol.id);
      const { fulfilPayment } = await import("@/lib/payment-fulfilment.server");
      await fulfilPayment(ref);
      return { ok: true, stubbed: false, free: true, authorization_url: null, enrolment_id: enrol.id, redirect_to: `/academy/receipt?payment=success&ref=${encodeURIComponent(ref)}` };
    }

    if (!paystackKey) {
      return {
        ok: true,
        stubbed: true,
        message:
          "You're registered. Payment is opening soon — our team will contact you shortly with payment details.",
        enrolment_id: enrol.id,
      };
    }

    // Live Paystack init (staging refuses any non-test key)
    const { assertPaystackKeyAllowed } = await import("@/lib/environment.server");
    assertPaystackKeyAllowed(paystackKey);
    const callbackUrl = `${paymentsOrigin(origin)}/api/public/paystack/verify?return=${encodeURIComponent(returnOrigin)}`;

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        amount: Math.round(amount * 100),
        currency: "NGN",
        callback_url: callbackUrl,
        metadata: { enrolment_id: enrol.id, course_id: course.id, full_name: data.full_name },
      }),
    });
    const json = (await res.json()) as { data?: { authorization_url?: string; reference?: string } };
    if (json.data?.reference) {
      await supabaseAdmin
        .from("academy_payments")
        .update({ paystack_reference: json.data.reference })
        .eq("enrolment_id", enrol.id);
    }
    return {
      ok: true,
      stubbed: false,
      authorization_url: json.data?.authorization_url ?? null,
      enrolment_id: enrol.id,
    };
}
