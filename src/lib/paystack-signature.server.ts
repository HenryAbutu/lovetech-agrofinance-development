import { createHmac, timingSafeEqual } from "crypto";

/** True only when the x-paystack-signature header is the HMAC-SHA512 of the raw body. */
export function isValidPaystackSignature(body: string, signature: string | null | undefined, key: string) {
  if (!signature || !key) return false;
  const expected = createHmac("sha512", key).update(body).digest("hex");
  const sig = Buffer.from(signature);
  const exp = Buffer.from(expected);
  return sig.length === exp.length && timingSafeEqual(sig, exp);
}
