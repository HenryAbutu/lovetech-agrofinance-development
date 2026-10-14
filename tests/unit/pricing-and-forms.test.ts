import { describe, it, expect } from "vitest";
import { resolveBasePrice, couponDiscount, SINGLE_MODULE_OPTIONS, type CouponRecord } from "@/lib/pricing";
import { EnrolSchema } from "@/lib/enrolment.functions";
import { EnquirySchema } from "@/lib/forms.functions";
import { canonicalUrl } from "@/lib/seo";

// The course record stands in for the database row; tests assert behaviour relative to it,
// not a hardcoded price, so the database stays the single source of truth.
const course = { id: "c1", regular_price: 25000, discount_price: null };
const coupon = (o: Partial<CouponRecord> = {}): CouponRecord => ({
  kind: "percent", value: 20, max_uses: null, used_count: 0, expires_at: null, min_amount: null,
  course_id: null, active: true, issued_to_user_id: null, ...o,
});

describe("pricing", () => {
  it("bundle price comes from the course record", () => {
    expect(resolveBasePrice("professionals-ai-edge", course).basePrice).toBe(course.regular_price);
    expect(resolveBasePrice("x", { ...course, discount_price: 9000 }).basePrice).toBe(9000);
  });
  it("single module uses the configured module price and requires a valid module", () => {
    const cfg = SINGLE_MODULE_OPTIONS["professionals-ai-edge"]!;
    expect(resolveBasePrice("professionals-ai-edge", course, "single_module", cfg.modules[0]).basePrice).toBe(cfg.price);
    expect(() => resolveBasePrice("professionals-ai-edge", course, "single_module", null)).toThrow();
    expect(() => resolveBasePrice("professionals-ai-edge", course, "single_module", "Made-up module")).toThrow();
    expect(() => resolveBasePrice("agribusiness-skills", course, "single_module", cfg.modules[0])).toThrow();
  });
  it("client-submitted prices are ignored: the schema strips any amount field", () => {
    const parsed = EnrolSchema.parse({ course_slug: "x", full_name: "A", email: "a@example.com", amount: 1, price: 1 }) as Record<string, unknown>;
    expect(parsed.amount).toBeUndefined();
    expect(parsed.price).toBeUndefined();
  });
  it("coupon rules", () => {
    expect(couponDiscount(coupon(), 25000, "c1", "u1")).toBe(5000);
    expect(couponDiscount(coupon({ kind: "fixed", value: 99999 }), 25000, "c1", "u1")).toBe(25000);
    expect(couponDiscount(coupon({ active: false }), 25000, "c1", "u1")).toBe(0);
    expect(couponDiscount(coupon({ expires_at: "2000-01-01" }), 25000, "c1", "u1")).toBe(0);
    expect(couponDiscount(coupon({ max_uses: 1, used_count: 1 }), 25000, "c1", "u1")).toBe(0);
    expect(couponDiscount(coupon({ course_id: "other" }), 25000, "c1", "u1")).toBe(0);
    expect(couponDiscount(coupon({ issued_to_user_id: "u2" }), 25000, "c1", "u1")).toBe(0);
    expect(couponDiscount(coupon({ min_amount: 30000 }), 25000, "c1", "u1")).toBe(0);
    expect(couponDiscount(null, 25000, "c1", "u1")).toBe(0);
  });
});

describe("enquiry form validation", () => {
  const ok = { full_name: "Ada", email: "ada@example.com", message: "Hello there" };
  it("accepts a valid submission", () => expect(EnquirySchema.safeParse(ok).success).toBe(true));
  it.each([
    ["missing name", { ...ok, full_name: "" }],
    ["invalid email", { ...ok, email: "not-an-email" }],
    ["short message", { ...ok, message: "hi" }],
    ["oversized message", { ...ok, message: "x".repeat(4001) }],
  ])("rejects %s", (_n, v) => expect(EnquirySchema.safeParse(v).success).toBe(false));
});

describe("canonical URLs", () => {
  it("uses the production origin and drops query/hash/trailing slash", () => {
    expect(canonicalUrl("/academy?ref=x#top")).toBe("https://lovetechgroup.com.ng/academy");
    expect(canonicalUrl("about/")).toBe("https://lovetechgroup.com.ng/about");
    expect(canonicalUrl("/")).toBe("https://lovetechgroup.com.ng/");
  });
});
