import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const EnquirySchema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().nullable(),
  business_name: z.string().max(200).optional().nullable(),
  service_interest: z.string().max(200).optional().nullable(),
  message: z.string().min(5).max(4000),
});

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input) => EnquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("enquiries").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const DiagnosticSchema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().nullable(),
  business_name: z.string().min(1).max(200),
  business_sector: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  years_in_operation: z.string().max(100).optional().nullable(),
  registration_status: z.string().max(100).optional().nullable(),
  monthly_sales_estimate: z.string().max(100).optional().nullable(),
  funding_type_needed: z.string().max(200).optional().nullable(),
  funding_amount_needed: z.string().max(100).optional().nullable(),
  main_funding_challenge: z.string().max(2000).optional().nullable(),
});

export const submitDiagnostic = createServerFn({ method: "POST" })
  .inputValidator((input) => DiagnosticSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("diagnostic_requests").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const WaitlistSchema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional().nullable(),
  business_name: z.string().max(200).optional().nullable(),
  business_sector: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  interest_area: z.string().max(200).optional().nullable(),
  main_challenge: z.string().max(2000).optional().nullable(),
  preferred_training_mode: z.string().max(100).optional().nullable(),
  course_slug: z.string().max(120).optional().nullable(),
});

export const submitWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input) => WaitlistSchema.parse(input))
  .handler(async ({ data }) => {
    let course_id: string | null = null;
    if (data.course_slug) {
      const { data: c } = await supabaseAdmin
        .from("academy_courses")
        .select("id")
        .eq("slug", data.course_slug)
        .maybeSingle();
      course_id = c?.id ?? null;
    }
    const { course_slug, ...rest } = data;
    void course_slug;
    const { error } = await supabaseAdmin.from("academy_waitlist").insert({ ...rest, course_id });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
