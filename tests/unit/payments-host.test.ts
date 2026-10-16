import { describe, it, expect } from "vitest";
import { safeReturnOrigin } from "@/lib/enrolment.server";
describe("post-payment return address", () => {
  it("returns learners to the custom domain", () => expect(safeReturnOrigin("https://lovetechgroup.com.ng/x", "https://f")).toBe("https://lovetechgroup.com.ng"));
  it("refuses outside sites", () => expect(safeReturnOrigin("https://evil.com", "https://f")).toBe("https://f"));
});
