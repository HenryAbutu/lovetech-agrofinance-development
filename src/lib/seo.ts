// Canonical URL helpers. One production origin for every public page so search
// engines never index the preview/lovable.app host as the primary address.
const PRODUCTION_ORIGIN = "https://lovetechgroup.com.ng";

function resolveOrigin(): string {
  const raw = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim();
  if (!raw) return PRODUCTION_ORIGIN;
  try {
    const u = new URL(raw);
    // Only accept a bare https origin; anything else falls back safely.
    if (u.protocol !== "https:" || u.pathname !== "/" || u.search || u.hash) return PRODUCTION_ORIGIN;
    return u.origin;
  } catch {
    return PRODUCTION_ORIGIN;
  }
}

export const SITE_ORIGIN = resolveOrigin();

/** Absolute canonical URL for a route path. Query strings and fragments are dropped. */
export function canonicalUrl(path: string): string {
  const clean = ("/" + path.split(/[?#]/)[0]!.replace(/^\/+/, "")).replace(/\/{2,}/g, "/");
  const normalised = clean.length > 1 ? clean.replace(/\/+$/, "") : "/";
  return `${SITE_ORIGIN}${normalised}`;
}

/** `<link rel="canonical">` entry for a route's head().links array. */
export function canonicalLink(path: string) {
  return { rel: "canonical", href: canonicalUrl(path) };
}
