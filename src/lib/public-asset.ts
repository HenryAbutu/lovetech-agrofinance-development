/** Public host that serves uploaded Lovable assets for both the Lovable and Netlify websites. */
export const PUBLIC_ASSET_ORIGIN = "https://lovetechgroup.lovable.app";

export function publicAssetUrl(url: string) {
  return url.startsWith("/__l5e/") ? `${PUBLIC_ASSET_ORIGIN}${url}` : url;
}