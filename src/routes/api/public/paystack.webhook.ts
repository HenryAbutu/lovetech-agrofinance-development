import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paystack/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key) return new Response("unconfigured", { status: 503 });

        const body = await request.text();
        const { isValidPaystackSignature } = await import("@/lib/paystack-signature.server");
        if (!isValidPaystackSignature(body, request.headers.get("x-paystack-signature"), key)) {
          return new Response("invalid signature", { status: 401 });
        }

        let event: { event?: string; data?: { reference?: string } };
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("invalid body", { status: 400 });
        }

        if (event.event === "charge.success" && event.data?.reference) {
          // Never trust the webhook body alone: re-verify amount/currency with Paystack.
          const { applyPaystackResult } = await import("@/lib/paystack-verify.server");
          await applyPaystackResult(event.data.reference, key);
        }

        return new Response("ok");
      },
    },
  },
});
