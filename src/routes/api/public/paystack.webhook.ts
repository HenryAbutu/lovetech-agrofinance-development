import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/paystack/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handlePaystackWebhook } = await import("@/lib/paystack-webhook.server");
        return handlePaystackWebhook(await request.text(), request.headers.get("x-paystack-signature"), process.env.PAYSTACK_SECRET_KEY);
      },
    },
  },
});
