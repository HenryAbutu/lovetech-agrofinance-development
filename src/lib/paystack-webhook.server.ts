import { isValidPaystackSignature } from "@/lib/paystack-signature.server";

/** Pure request handling for the Paystack webhook so it can be unit-tested. */
export async function handlePaystackWebhook(body: string, signature: string | null, key: string | undefined) {
  if (!key) return new Response("unconfigured", { status: 503 });
  if (!isValidPaystackSignature(body, signature, key)) return new Response("invalid signature", { status: 401 });

  let event: { event?: unknown; data?: { reference?: unknown } } | null;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response("invalid body", { status: 400 });
  }
  const reference = event && typeof event === "object" ? event.data?.reference : undefined;
  if (event?.event === "charge.success" && typeof reference === "string" && reference.length > 0 && reference.length <= 200) {
    // Never trust the webhook body alone: re-verify amount/currency with Paystack.
    const { applyPaystackResult } = await import("@/lib/paystack-verify.server");
    await applyPaystackResult(reference, key);
  }
  return new Response("ok");
}
