import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyReferralInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code, full_name")
      .eq("id", userId)
      .maybeSingle();

    const { data: referrals } = await supabase
      .from("academy_referrals")
      .select("id, status, created_at, referred_enrolment_id, reward_coupon_id")
      .eq("referrer_user_id", userId)
      .order("created_at", { ascending: false });

    const { data: coupons } = await supabase
      .from("academy_coupons")
      .select("id, code, kind, value, expires_at, used_count, max_uses, active, source, notes")
      .eq("issued_to_user_id", userId)
      .order("created_at", { ascending: false });

    return {
      referral_code: profile?.referral_code ?? null,
      full_name: profile?.full_name ?? null,
      referral_count: referrals?.length ?? 0,
      converted_count: (referrals ?? []).filter((r) => r.status !== "pending").length,
      referrals: referrals ?? [],
      coupons: coupons ?? [],
    };
  });
