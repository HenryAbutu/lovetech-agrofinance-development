import { describe, it, expect, vi, beforeEach } from "vitest";
import { createHmac } from "node:crypto";
import { createFakeDb } from "./fake-db";

const state = vi.hoisted(() => ({ db: null as unknown as ReturnType<typeof import("./fake-db").createFakeDb>, fulfil: vi.fn() }));
vi.mock("@/integrations/supabase/client.server", () => ({ get supabaseAdmin() { return state.db.client; } }));
vi.mock("@/lib/payment-fulfilment.server", () => ({ fulfilPayment: (ref: string) => state.fulfil(ref) }));

import { checkPaystackCharge, applyPaystackResult } from "@/lib/paystack-verify.server";
import { isValidPaystackSignature } from "@/lib/paystack-signature.server";

const KEY = "sk_test_unit_only";
const ENROL = "enrol-1";
function seed(status = "initiated") {
  state.db = createFakeDb({
    academy_payments: [{ id: "p1", enrolment_id: ENROL, amount: 25000, currency: "NGN", status, paystack_reference: "REF1" }],
    academy_enrolments: [{ id: ENROL, payment_status: "pending_payment", access_status: "inactive" }],
  });
}
function paystackReturns(data: Record<string, unknown> | null, status = true) {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ status, data }))));
}
const enrolment = () => state.db.tables.academy_enrolments![0]!;

beforeEach(() => { seed(); state.fulfil.mockReset(); vi.unstubAllGlobals(); });

describe("payment verification (mocked Paystack + database)", () => {
  it("unknown reference is not_found and grants nothing", async () => {
    paystackReturns({ status: "success", amount: 2500000, currency: "NGN" });
    const r = await applyPaystackResult("NOPE", KEY);
    expect(r.status).toBe("not_found");
    expect(enrolment().access_status).toBe("inactive");
  });

  it.each([
    ["failed", { status: "failed", amount: 2500000, currency: "NGN" }],
    ["abandoned/pending", { status: "abandoned", amount: 2500000, currency: "NGN" }],
    ["underpaid", { status: "success", amount: 100, currency: "NGN" }],
    ["wrong currency", { status: "success", amount: 2500000, currency: "USD" }],
    ["mismatched enrolment metadata", { status: "success", amount: 2500000, currency: "NGN", metadata: { enrolment_id: "someone-else" } }],
  ])("%s transaction does not grant access", async (_n, data) => {
    paystackReturns(data);
    const r = await applyPaystackResult("REF1", KEY);
    expect(r.ok).toBe(false);
    expect(enrolment().access_status).toBe("inactive");
    expect(state.fulfil).not.toHaveBeenCalled();
  });

  it("Paystack API error (status false) does not grant access", async () => {
    paystackReturns(null, false);
    expect((await applyPaystackResult("REF1", KEY)).ok).toBe(false);
    expect(enrolment().access_status).toBe("inactive");
  });

  it("verified full payment grants access and runs fulfilment", async () => {
    paystackReturns({ status: "success", amount: 2500000, currency: "NGN", metadata: { enrolment_id: ENROL } });
    const r = await applyPaystackResult("REF1", KEY);
    expect(r.ok).toBe(true);
    expect(enrolment()).toMatchObject({ payment_status: "paid", access_status: "active" });
    expect(state.fulfil).toHaveBeenCalledTimes(1);
  });

  it("duplicate delivery keeps one success state and the original paid time", async () => {
    paystackReturns({ status: "success", amount: 2500000, currency: "NGN" });
    await applyPaystackResult("REF1", KEY);
    const firstPaidAt = state.db.tables.academy_payments![0]!.paid_at;
    await new Promise((r) => setTimeout(r, 5));
    await applyPaystackResult("REF1", KEY);
    await applyPaystackResult("REF1", KEY);
    expect(state.db.tables.academy_payments![0]!.paid_at).toBe(firstPaidAt);
    expect(state.db.tables.academy_enrolments).toHaveLength(1);
    expect(enrolment().access_status).toBe("active");
  });

  it("Paystack being unreachable throws (so the webhook is retried) and grants nothing", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down"); }));
    await expect(applyPaystackResult("REF1", KEY)).rejects.toThrow();
    expect(enrolment().access_status).toBe("inactive");
  });

  it("a crash during fulfilment is recovered on the next delivery", async () => {
    paystackReturns({ status: "success", amount: 2500000, currency: "NGN" });
    state.fulfil.mockRejectedValueOnce(new Error("temporary database failure"));
    await expect(applyPaystackResult("REF1", KEY)).rejects.toThrow();
    await applyPaystackResult("REF1", KEY);
    expect(state.fulfil).toHaveBeenCalledTimes(2);
    expect(enrolment().access_status).toBe("active");
  });

  it("overpayment is accepted (amount is at least expected)", async () => {
    paystackReturns({ status: "success", amount: 2600000, currency: "NGN" });
    expect((await checkPaystackCharge("REF1", KEY)).ok).toBe(true);
  });

  it("a later failed check never downgrades an already-successful payment", async () => {
    seed("success");
    paystackReturns({ status: "failed" });
    await applyPaystackResult("REF1", KEY);
    expect(state.db.tables.academy_payments![0]!.status).toBe("success");
  });

  it("verifies against the stored amount, not anything the client sent", async () => {
    paystackReturns({ status: "success", amount: 1500000, currency: "NGN" }); // ₦15,000 paid against a ₦25,000 record
    expect((await checkPaystackCharge("REF1", KEY)).status).toBe("amount_mismatch");
  });
});

describe("webhook signature", () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: "REF1" } });
  const good = createHmac("sha512", KEY).update(body).digest("hex");
  it("accepts the correct HMAC", () => expect(isValidPaystackSignature(body, good, KEY)).toBe(true));
  it("rejects missing signature", () => expect(isValidPaystackSignature(body, null, KEY)).toBe(false));
  it("rejects malformed signature", () => expect(isValidPaystackSignature(body, "abc", KEY)).toBe(false));
  it("rejects signature for a tampered body", () => expect(isValidPaystackSignature(body + " ", good, KEY)).toBe(false));
  it("rejects signature made with another key", () =>
    expect(isValidPaystackSignature(body, createHmac("sha512", "other").update(body).digest("hex"), KEY)).toBe(false));
});
