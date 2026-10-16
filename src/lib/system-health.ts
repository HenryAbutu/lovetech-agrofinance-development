// Pure, value-free summary of server configuration. Never returns secret values.
export type ServiceStatus = { service: string; state: "ok" | "warn" | "missing"; detail: string };

export function summariseHealth(env: Record<string, string | undefined>): ServiceStatus[] {
  const has = (k: string) => !!(env[k] ?? "").trim();
  const paystack = (env.PAYSTACK_SECRET_KEY ?? "").trim();
  const staging = (env.APP_ENV ?? "").toLowerCase() === "staging";
  return [
    { service: "Environment", state: "ok", detail: staging ? "Staging (customer emails suppressed)" : "Production" },
    { service: "Payments (Paystack)", ...(!paystack ? { state: "missing" as const, detail: "Not configured" }
      : paystack.startsWith("sk_live_") ? { state: "ok" as const, detail: "Live mode" }
      : paystack.startsWith("sk_test_") ? { state: "warn" as const, detail: "Test mode — no real charges" }
      : { state: "warn" as const, detail: "Unrecognised key format" }) },
    { service: "Email (Resend)", state: has("RESEND_API_KEY") ? "ok" : "missing", detail: has("RESEND_API_KEY") ? "Configured" : "Not configured — forms and receipts cannot email" },
    { service: "Push notifications", state: has("VAPID_PRIVATE_KEY") && has("VAPID_PUBLIC_KEY") ? "ok" : "missing", detail: has("VAPID_PRIVATE_KEY") && has("VAPID_PUBLIC_KEY") ? "Configured" : "Not configured" },
  ];
}
