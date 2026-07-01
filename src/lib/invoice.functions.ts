import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyInvoiceUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ payment_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Ensure the payment belongs to this user (via enrolment)
    const { data: payment } = await supabase
      .from("academy_payments")
      .select("id, invoice_pdf_url, invoice_number, enrolment_id")
      .eq("id", data.payment_id)
      .maybeSingle();
    if (!payment?.invoice_pdf_url) return { url: null, invoice_number: null };

    const { data: enrol } = await supabase
      .from("academy_enrolments")
      .select("user_id")
      .eq("id", payment.enrolment_id)
      .maybeSingle();
    if (!enrol || enrol.user_id !== userId) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("invoices")
      .createSignedUrl(payment.invoice_pdf_url, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl, invoice_number: payment.invoice_number };
  });
