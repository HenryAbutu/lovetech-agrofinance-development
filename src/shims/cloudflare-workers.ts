// Shim for "cloudflare:workers" so non-Cloudflare builds (Netlify) can resolve it.
// Code that imports it falls back to process.env at runtime.
export const env: Record<string, unknown> = {};
export default { env };
