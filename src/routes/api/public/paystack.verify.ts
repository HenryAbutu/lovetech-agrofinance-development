import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paystack/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
        const origin = url.origin;
        if (!reference) {
          throw redirect({ href: `${origin}/academy/dashboard?payment=missing_reference` });
        }
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key) {
          throw redirect({ href: `${origin}/academy/dashboard?payment=unconfigured` });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
          headers: { Authorization: `Bearer ${key}` },
        });
        const json = (await res.json()) as {
          status?: boolean;
          data?: { status?: string; amount?: number; currency?: string; metadata?: { enrolment_id?: string } };
        };

        const ok = json.status && json.data?.status === "success";
        const enrolmentId = json.data?.metadata?.enrolment_id ?? null;

        await supabaseAdmin
          .from("academy_payments")
          .update({
            status: ok ? "success" : (json.data?.status ?? "failed"),
            paid_at: ok ? new Date().toISOString() : null,
          })
          .eq("paystack_reference", reference);

        if (ok && enrolmentId) {
          await supabaseAdmin
            .from("academy_enrolments")
            .update({ payment_status: "paid", access_status: "active" })
            .eq("id", enrolmentId);
          const { fulfilPayment } = await import("@/lib/payment-fulfilment.server");
          await fulfilPayment(reference);
        }

        throw redirect({
          href: `${origin}/academy/receipt?payment=${ok ? "success" : "failed"}&ref=${encodeURIComponent(reference)}`,
        });
      },
    },
  },
});
