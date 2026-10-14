import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/paystack/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.PAYSTACK_SECRET_KEY;
        if (!key) return new Response("unconfigured", { status: 503 });

        const signature = request.headers.get("x-paystack-signature") ?? "";
        const body = await request.text();
        const expected = createHmac("sha512", key).update(body).digest("hex");
        const sig = Buffer.from(signature);
        const exp = Buffer.from(expected);
        if (sig.length !== exp.length || !timingSafeEqual(sig, exp)) {
          return new Response("invalid signature", { status: 401 });
        }

        const event = JSON.parse(body) as {
          event?: string;
          data?: { reference?: string; status?: string; metadata?: { enrolment_id?: string } };
        };

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
