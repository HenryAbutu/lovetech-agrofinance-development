export const FLAGSHIP_SLUGS = ["ai-for-agribusinesses", "finance-ready", "business-growth-accelerator", "ai-business-transformation", "climate-smart-agribusiness", "development-project-design"] as const;
export const FLAGSHIP_PRICE = 25000;
export function isFlagship(slug: string) { return FLAGSHIP_SLUGS.some(s => s === slug); }
export function assertFlagshipCheckout(slug: string, course: {status: string; content_ready?: boolean; publication_approved?: boolean}, option?: string | null, coupon?: string | null) {
  if (!isFlagship(slug)) throw new Error("This legacy course is closed to new enrolments. Explore our flagship courses.");
  if (course.status !== "enrolment_open" || !course.content_ready || !course.publication_approved) throw new Error("This course is coming soon. Please join the waitlist.");
  if (option === "single_module") throw new Error("Flagship courses are sold as complete courses only.");
  if (coupon?.trim()) throw new Error("Promotional pricing is not available for flagship courses.");
}