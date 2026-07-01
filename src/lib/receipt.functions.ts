import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getReceipt = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ reference: z.string().min(1).max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: payment, error } = await supabase
      .from("academy_payments")
      .select("id, amount, currency, status, paid_at, paystack_reference, enrolment_id, course_id, user_email, invoice_number, invoice_pdf_url")
      .eq("paystack_reference", data.reference)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!payment) return { found: false as const };

    const [{ data: enrolment }, { data: course }] = await Promise.all([
      supabase
        .from("academy_enrolments")
        .select("id, full_name, email, payment_status, access_status, created_at, coupon_code, discount_amount")
        .eq("id", payment.enrolment_id)
        .maybeSingle(),
      supabase
        .from("academy_courses")
        .select("id, slug, title")
        .eq("id", payment.course_id)
        .maybeSingle(),
    ]);

    return { found: true as const, payment, enrolment, course };
  });
