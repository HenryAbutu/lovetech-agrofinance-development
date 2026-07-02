// Guarded service worker registration.
// Never registers in Lovable preview / dev / iframe contexts.
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;

  const host = window.location.hostname;
  const inIframe = window.self !== window.top;
  const isPreview =
    host.startsWith("id-preview--") ||
    host.startsWith("preview--") ||
    host === "lovableproject.com" ||
    host.endsWith(".lovableproject.com") ||
    host === "lovableproject-dev.com" ||
    host.endsWith(".lovableproject-dev.com") ||
    host === "beta.lovable.dev" ||
    host.endsWith(".beta.lovable.dev");
  const killSwitch = new URL(window.location.href).searchParams.get("sw") === "off";

  if (!import.meta.env.PROD || inIframe || isPreview || killSwitch) {
    // Clean up any previously registered SW in refused contexts.
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        regs.filter((r) => r.active?.scriptURL?.endsWith("/sw.js")).map((r) => r.unregister()),
      );
    } catch { /* ignore */ }
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return reg;
  } catch (err) {
    console.warn("SW registration failed", err);
    return null;
  }
}
