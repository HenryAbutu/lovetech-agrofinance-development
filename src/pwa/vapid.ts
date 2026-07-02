// Public VAPID key — safe to expose to the browser.
export const VAPID_PUBLIC_KEY =
  "BLPDyXc-nAHJ-g-RA2OTWbJ4RXjtNHsPy6D6Q0k4-xIXCniP7yQf7_qDYMI2TF2ky1AsTDMlI-r6Bq648AkATh0";

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}
