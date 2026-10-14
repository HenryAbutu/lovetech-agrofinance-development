// Server-only environment guards. APP_ENV=staging marks an isolated test deployment.
const PRODUCTION_ORIGIN = "https://lovetechgroup.com.ng";

export const isStaging = () => (process.env.APP_ENV ?? "").toLowerCase() === "staging";

/** Origin used in emails and invoices. Staging must set SITE_ORIGIN; production defaults to the live domain. */
export function siteOrigin(): string {
  const raw = (process.env.SITE_ORIGIN ?? "").trim();
  try {
    if (raw) {
      const u = new URL(raw);
      if (u.protocol === "https:" || u.hostname === "localhost") return u.origin;
    }
  } catch { /* fall through */ }
  return PRODUCTION_ORIGIN;
}

/** Throws if a staging deployment is holding anything other than a Paystack test key. */
export function assertPaystackKeyAllowed(key: string) {
  if (isStaging() && !key.startsWith("sk_test_")) {
    throw new Error("Staging is configured with a non-test Paystack key; payments are disabled here.");
  }
}
