import { describe, expect, it } from "vitest";
import { summariseHealth } from "@/lib/system-health";

const find = (env: Record<string, string>, s: string) => summariseHealth(env).find((x) => x.service.startsWith(s))!;

describe("system health", () => {
  it("reports test-mode Paystack as a warning", () => expect(find({ PAYSTACK_SECRET_KEY: "sk_test_abc" }, "Payments").state).toBe("warn"));
  it("reports live Paystack as ok", () => expect(find({ PAYSTACK_SECRET_KEY: "sk_live_abc" }, "Payments").detail).toBe("Live mode"));
  it("reports missing email key", () => expect(find({}, "Email").state).toBe("missing"));
  it("never includes secret values", () => {
    const out = JSON.stringify(summariseHealth({ PAYSTACK_SECRET_KEY: "sk_live_SECRET123", RESEND_API_KEY: "re_SECRET456" }));
    expect(out).not.toContain("SECRET");
  });
});
