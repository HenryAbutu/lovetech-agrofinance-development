import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createHmac } from "node:crypto";

const apply = vi.hoisted(() => vi.fn());
vi.mock("@/lib/paystack-verify.server", () => ({ applyPaystackResult: apply }));

import { handlePaystackWebhook } from "@/lib/paystack-webhook.server";
import { siteOrigin, assertPaystackKeyAllowed } from "@/lib/environment.server";

const KEY = "sk_test_unit_only";
const sign = (b: string) => createHmac("sha512", KEY).update(b).digest("hex");

beforeEach(() => apply.mockReset());
afterEach(() => vi.unstubAllEnvs());

describe("webhook handler", () => {
  it.each(["not json {", "", "null", "[]", '{"event":"charge.success"}', '{"event":"charge.success","data":{"reference":123}}'])(
    "validly signed but unreadable payload %j is handled cleanly and grants nothing",
    async (body) => {
      const r = await handlePaystackWebhook(body, sign(body), KEY);
      expect([200, 400]).toContain(r.status);
      expect(apply).not.toHaveBeenCalled();
    },
  );
  it("bad signature → 401 without processing", async () => {
    const body = '{"event":"charge.success","data":{"reference":"R"}}';
    expect((await handlePaystackWebhook(body, "x", KEY)).status).toBe(401);
    expect(apply).not.toHaveBeenCalled();
  });
  it("missing key → 503", async () => expect((await handlePaystackWebhook("{}", "x", undefined)).status).toBe(503));
  it("valid charge.success is re-verified with Paystack", async () => {
    const body = '{"event":"charge.success","data":{"reference":"R1"}}';
    expect((await handlePaystackWebhook(body, sign(body), KEY)).status).toBe(200);
    expect(apply).toHaveBeenCalledWith("R1", KEY);
  });
  it("other events are acknowledged without processing", async () => {
    const body = '{"event":"transfer.success","data":{"reference":"R1"}}';
    expect((await handlePaystackWebhook(body, sign(body), KEY)).status).toBe(200);
    expect(apply).not.toHaveBeenCalled();
  });
});

describe("environment guards", () => {
  it("production emails default to the live domain", () => {
    vi.stubEnv("SITE_ORIGIN", "");
    expect(siteOrigin()).toBe("https://lovetechgroup.com.ng");
  });
  it("staging links use the staging origin", () => {
    vi.stubEnv("SITE_ORIGIN", "https://staging.example.com/");
    expect(siteOrigin()).toBe("https://staging.example.com");
  });
  it("an unsafe origin falls back to the live domain", () => {
    vi.stubEnv("SITE_ORIGIN", "http://evil.example.com");
    expect(siteOrigin()).toBe("https://lovetechgroup.com.ng");
  });
  it("staging refuses a non-test Paystack key", () => {
    vi.stubEnv("APP_ENV", "staging");
    expect(() => assertPaystackKeyAllowed("sk_live_abc")).toThrow();
    expect(() => assertPaystackKeyAllowed("sk_test_abc")).not.toThrow();
  });
  it("production does not apply the staging restriction", () => {
    vi.stubEnv("APP_ENV", "");
    expect(() => assertPaystackKeyAllowed("sk_live_abc")).not.toThrow();
  });
});
