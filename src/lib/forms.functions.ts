import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function getPublicServerClient() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured on the server. Please contact the site administrator.",
    );
  }
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

function tryGetPublicServerClient() {
  try {
    return getPublicServerClient();
  } catch (error) {
    console.warn("Database client unavailable; skipping contact-form persistence", error);
    return null;
  }
}

async function sendEnquiryEmail(data: z.infer<typeof EnquirySchema>) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    throw new Error(
      "Email delivery is not configured on the server. Please contact the site administrator.",
    );
  }

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const row = (label: string, value?: string | null) =>
    value ? `<tr><td style="padding:6px 12px;color:#666;font-weight:600">${label}</td><td style="padding:6px 12px">${escape(value)}</td></tr>` : "";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <h2 style="color:#2d4a3e">New Contact Enquiry — LoveTech Agrofinance</h2>
      <table style="width:100%;border-collapse:collapse;background:#fafafa;border:1px solid #eee;border-radius:8px">
        ${row("Full name", data.full_name)}
        ${row("Email", data.email)}
        ${row("Phone", data.phone)}
        ${row("Business", data.business_name)}
        ${row("Service interest", data.service_interest)}
      </table>
      <h3 style="margin-top:24px;color:#2d4a3e">Message</h3>
      <p style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;padding:16px;border-radius:8px">${escape(data.message)}</p>
      <p style="color:#999;font-size:12px;margin-top:24px">Submitted via lovetechgroup.com.ng contact form</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: "LoveTech Website <notifications@lovetechgroup.com.ng>",
      to: ["info@lovetechgroup.com.ng"],
      reply_to: data.email,
      subject: `New enquiry from ${data.full_name}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend send failed:", res.status, await res.text());
    throw new Error("Message could not be sent right now. Please try again later.");
  }
}

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
    await sendEnquiryEmail(data);

    const supabase = tryGetPublicServerClient();
    if (supabase) {
      const { error } = await supabase.from("enquiries").insert(data);
      if (error) console.error("Contact enquiry persistence failed:", error.message);
    }

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
    const supabase = getPublicServerClient();
    const { error } = await supabase.from("diagnostic_requests").insert(data);
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
    const supabase = getPublicServerClient();
    let course_id: string | null = null;
    if (data.course_slug) {
      const { data: c } = await supabase
        .from("academy_courses")
        .select("id")
        .eq("slug", data.course_slug)
        .maybeSingle();
      course_id = c?.id ?? null;
    }
    const { course_slug, ...rest } = data;
    void course_slug;
    const { error } = await supabase
      .from("academy_waitlist")
      .insert({ ...rest, course_id });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
