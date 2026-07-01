import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const listCouponsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("academy_coupons")
      .select("id, code, kind, value, max_uses, used_count, expires_at, course_id, issued_to_user_id, source, notes, active, created_at, course:academy_courses(title)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { coupons: data ?? [] };
  });

const CouponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().trim().min(2).max(60).transform((s) => s.toUpperCase()),
  kind: z.enum(["percent", "fixed"]),
  value: z.coerce.number().nonnegative(),
  max_uses: z.coerce.number().int().positive().optional().nullable(),
  expires_at: z.string().optional().nullable(),
  course_id: z.string().uuid().optional().nullable(),
  min_amount: z.coerce.number().nonnegative().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  active: z.coerce.boolean().default(true),
});

export const upsertCouponAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => CouponSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("academy_coupons").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCouponAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("academy_coupons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listReferralsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("academy_referrals")
      .select("id, referral_code, status, created_at, referrer_user_id, referred_user_id, referred_enrolment_id, reward_coupon_id")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { referrals: data ?? [] };
  });
