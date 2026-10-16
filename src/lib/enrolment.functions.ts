import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const EnrolSchema = z.object({
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
  purchase_option: z.enum(["bundle", "single_module"]).optional().nullable(),
  module_choice: z.string().max(200).optional().nullable(),
});

export const enrolInCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => EnrolSchema.parse(input))
  .handler(async ({ data, context }) => {
    const req = getRequest();
    const origin = new URL(req.url).origin;
    const { runEnrolment, paymentsOrigin } = await import("@/lib/enrolment.server");
    const target = paymentsOrigin(origin);
    if (target !== origin) {
      // This host can't record payments itself; the payments host does it for the same signed-in learner.
      const res = await fetch(`${target}/api/public/enrol`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: req.headers.get("authorization") ?? "", "X-Return-Origin": origin },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok || !json) throw new Error(json?.error ?? "We couldn't start your payment. Please try again.");
      return json as Awaited<ReturnType<typeof runEnrolment>>;
    }
    return runEnrolment(data, context.userId, context.supabase, origin, origin);
  });
