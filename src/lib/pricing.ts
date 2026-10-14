// Pure, browser-safe pricing rules shared by checkout (server) and course pages (display).
// The server always recomputes the amount; the browser value is display-only.

// Courses that can be bought one module at a time, with the server-trusted module price.
export const SINGLE_MODULE_OPTIONS: Record<string, { price: number; modules: string[] }> = {
  "professionals-ai-edge": {
    price: 15000,
    modules: [
      "Day 1: Understanding AI and What It Can Do for Your Business",
      "Day 2: Prompt Writing for Business Owners",
      "Day 3: AI for Marketing, Sales, and WhatsApp Business",
      "Day 4: AI for Operations, Records, Finance, and Access to Finance",
      "Day 5: AI Workflow, Responsible AI, and Final Business Action Plan",
    ],
  },
};

export type CourseRecord = { id: string; regular_price: number | string | null; discount_price: number | string | null };
export type CouponRecord = {
  kind: string; value: number | string; max_uses: number | null; used_count: number | null;
  expires_at: string | null; min_amount: number | string | null; course_id: string | null;
  active: boolean; issued_to_user_id: string | null;
};

/** Base price from the saved course record, or the configured single-module price. Throws on invalid choice. */
export function resolveBasePrice(slug: string, course: CourseRecord, option?: string | null, moduleChoice?: string | null) {
  if (option === "single_module") {
    const cfg = SINGLE_MODULE_OPTIONS[slug];
    if (!cfg) throw new Error("Single-module purchase isn't available for this course");
    if (!moduleChoice || !cfg.modules.includes(moduleChoice)) throw new Error("Please choose a module");
    return { basePrice: cfg.price, option: "single_module" as const, module: moduleChoice };
  }
  return { basePrice: Number(course.discount_price ?? course.regular_price ?? 0), option: "bundle" as const, module: null };
}

/** Discount a coupon gives, or 0 when it isn't usable for this user/course/price. */
export function couponDiscount(coupon: CouponRecord | null | undefined, basePrice: number, courseId: string, userId: string, now = new Date()) {
  const usable =
    !!coupon && coupon.active &&
    (!coupon.expires_at || new Date(coupon.expires_at) >= now) &&
    (coupon.max_uses === null || (coupon.used_count ?? 0) < coupon.max_uses) &&
    (!coupon.course_id || coupon.course_id === courseId) &&
    (coupon.min_amount === null || basePrice >= Number(coupon.min_amount)) &&
    (!coupon.issued_to_user_id || coupon.issued_to_user_id === userId);
  if (!usable || !coupon) return 0;
  return coupon.kind === "percent"
    ? Math.min(basePrice, Math.round((basePrice * Number(coupon.value)) / 100))
    : Math.min(basePrice, Number(coupon.value));
}
