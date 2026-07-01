// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@vercel/nft": "@vercel/nft/out/index.js",
      },
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  // Build for Netlify Functions. Override with NITRO_PRESET env var if needed.
  nitro: {
    preset: process.env.NITRO_PRESET ?? "netlify",
    // Mark @vercel/nft as external so Nitro/Rollup skip bundling it (avoids
    // the CJS/ESM interop error: missing named export `nodeFileTrace`).
    ...({
      externals: { external: ["@vercel/nft"] },
      rollupConfig: { external: ["@vercel/nft"] },
    } as Record<string, unknown>),
  },
  plugins: [netlify()],
});
