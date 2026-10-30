import { describe, expect, it } from "vitest";
import { publicAssetUrl } from "@/lib/public-asset";

describe("public asset URLs", () => {
  it("serves uploaded assets from the Lovable host on the custom domain", () => {
    expect(publicAssetUrl("/__l5e/assets-v1/id/logo.png")).toBe("https://lovetechgroup.lovable.app/__l5e/assets-v1/id/logo.png");
  });
  it("leaves bundled images unchanged", () => {
    expect(publicAssetUrl("/assets/hero.jpg")).toBe("/assets/hero.jpg");
  });
});