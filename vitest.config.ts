import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Unit tests only: deterministic, no network, no database. Live checks live in tests/smoke.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: { include: ["tests/unit/**/*.test.ts"], environment: "node" },
});
