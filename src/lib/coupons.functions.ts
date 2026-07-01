import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Validate a coupon against a course slug; returns the discount and final price.
// Public + authenticated learners can call. Uses admin client (bypass RLS) so we
// don't need to expose coupon table rows.
export const validateCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      code: z.string().trim().min(2).max(60),
      course_slug: z.string().min(1).max(120),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const code = data.code.trim().toUpperCase();

    const { data: course } = await supabaseAdmin
      .from("academy_courses")
      .select("id, discount_price, regular_price")
      .eq("slug", data.course_slug)
      .maybeSingle();
    if (!course) return { valid: false as const, reason: "Course not found" };

    const basePrice = Number(course.discount_price ?? course.regular_price ?? 0);

    const { data: coupon } = await supabaseAdmin
      .from("academy_coupons")
      .select("id, code, kind, value, max_uses, used_count, expires_at, min_amount, course_id, active")
      .eq("code", code)
      .maybeSingle();

    if (!coupon || !coupon.active) return { valid: false as const, reason: "Coupon not found" };
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
      return { valid: false as const, reason: "Coupon expired" };
    if (coupon.max_uses !== null && coupon.used_count !== null && coupon.used_count >= coupon.max_uses)
      return { valid: false as const, reason: "Coupon fully used" };
    if (coupon.course_id && coupon.course_id !== course.id)
      return { valid: false as const, reason: "Coupon not valid for this course" };
    if (coupon.min_amount !== null && basePrice < Number(coupon.min_amount))
      return { valid: false as const, reason: "Order too small for this coupon" };

    const discount =
      coupon.kind === "percent"
        ? Math.min(basePrice, Math.round((basePrice * Number(coupon.value)) / 100))
        : Math.min(basePrice, Number(coupon.value));
    const final = Math.max(0, basePrice - discount);

    return {
      valid: true as const,
      code,
      base_price: basePrice,
      discount_amount: discount,
      final_amount: final,
    };
  });
