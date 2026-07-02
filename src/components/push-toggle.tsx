import { useEffect, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from "@/pwa/vapid";
import { savePushSubscription, removePushSubscription } from "@/lib/push.functions";

type State = "unsupported" | "denied" | "off" | "on" | "loading";

export function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const save = useServerFn(savePushSubscription);
  const remove = useServerFn(removePushSubscription);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") { setState("denied"); return; }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setState(sub ? "on" : "off"))
      .catch(() => setState("off"));
  }, []);

  async function enable() {
    setState("loading");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setState(perm === "denied" ? "denied" : "off"); return; }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      const json = sub.toJSON();
      await save({
        data: {
          endpoint: sub.endpoint,
          p256dh: json.keys?.p256dh ?? "",
          auth: json.keys?.auth ?? "",
          user_agent: navigator.userAgent.slice(0, 500),
        },
      });
      setState("on");
    } catch (e) {
      console.error(e);
      setState("off");
    }
  }

  async function disable() {
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await remove({ data: { endpoint: sub.endpoint } });
        await sub.unsubscribe();
      }
      setState("off");
    } catch {
      setState("on");
    }
  }

  if (state === "unsupported") {
    return <p className="text-xs text-foreground/50">Push notifications aren't supported on this device.</p>;
  }
  if (state === "denied") {
    return <p className="text-xs text-foreground/60">Notifications blocked. Enable them for this site in your browser settings.</p>;
  }
  const on = state === "on";
  return (
    <button
      type="button"
      onClick={on ? disable : enable}
      disabled={state === "loading"}
      className={`inline-flex items-center gap-2 rounded-sm px-3 py-2 text-xs font-semibold ${on ? "border border-vetiver/30 text-vetiver hover:bg-vetiver/5" : "bg-vetiver text-bone"} disabled:opacity-50`}
    >
      {on ? <><BellOff className="size-3.5" /> Turn off notifications</> : <><Bell className="size-3.5" /> Enable notifications</>}
    </button>
  );
}
