import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paystack/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
        const { safeReturnOrigin } = await import("@/lib/enrolment.server");
        const origin = safeReturnOrigin(url.searchParams.get("return"), url.origin);
        if (!reference) {
          throw redirect({ href: `${origin}/academy/dashboard?payment=missing_reference` });
        }
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key) {
          throw redirect({ href: `${origin}/academy/dashboard?payment=unconfigured` });
        }
        // Re-checks the charge with Paystack and that amount/currency match our record.
        const { applyPaystackResult } = await import("@/lib/paystack-verify.server");
        const r = await applyPaystackResult(reference, key);
        throw redirect({
          href: `${origin}/academy/receipt?payment=${r.ok ? "success" : "failed"}&ref=${encodeURIComponent(reference)}`,
        });
      },
    },
  },
});
