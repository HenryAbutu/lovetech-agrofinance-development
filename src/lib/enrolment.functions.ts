import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const EnrolSchema = z.object({
  course_slug: z.string().min(1).max(120),
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().nullable(),
  business_name: z.string().max(200).optional().nullable(),
  business_sector: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  main_challenge: z.string().max(2000).optional().nullable(),
  referral_source: z.string().max(200).optional().nullable(),
  coupon_code: z.string().max(60).optional().nullable(),
  referral_code: z.string().max(60).optional().nullable(),
});

function getPublicClient() {
  const url = process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variable(s): SUPABASE_URL and/or SUPABASE_PUBLISHABLE_KEY (anon key).",
    );
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const enrolInCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => EnrolSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId, supabase: userClient } = context;
    // Public read for course (anon-readable via RLS)
    const publicClient = getPublicClient();
    const { data: course, error: cErr } = await publicClient
      .from("academy_courses")
      .select("id, title, discount_price, regular_price")
      .eq("slug", data.course_slug)
      .maybeSingle();
    if (cErr) throw new Error(cErr.message);
    if (!course) throw new Error("Course not found");

    const { course_slug, coupon_code, referral_code, ...rest } = data;
    void course_slug;

    const basePrice = Number(course.discount_price ?? course.regular_price ?? 0);

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
      const now = new Date();
      const usable =
        coupon &&
        coupon.active &&
        (!coupon.expires_at || new Date(coupon.expires_at) >= now) &&
        (coupon.max_uses === null || (coupon.used_count ?? 0) < coupon.max_uses) &&
        (!coupon.course_id || coupon.course_id === course.id) &&
        (coupon.min_amount === null || basePrice >= Number(coupon.min_amount)) &&
        (!coupon.issued_to_user_id || coupon.issued_to_user_id === userId);
      if (usable && coupon) {
        discountAmount =
          coupon.kind === "percent"
            ? Math.min(basePrice, Math.round((basePrice * Number(coupon.value)) / 100))
            : Math.min(basePrice, Number(coupon.value));
        appliedCoupon = code;
      }
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
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    // Payment rows are written server-side only (service role)
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("academy_payments").insert({
      enrolment_id: enrol.id,
      course_id: course.id,
      user_email: data.email,
      amount,
      currency: "NGN",
      status: "initiated",
      payment_provider: "paystack",
    });

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

    // Live Paystack init
    const req = getRequest();
    const origin = new URL(req.url).origin;
    const callbackUrl = `${origin}/api/public/paystack/verify`;

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
  });
