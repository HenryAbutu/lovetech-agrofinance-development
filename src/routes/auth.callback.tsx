import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({ meta: [{ title: "Signing you in — LoveTech" }, { name: "robots", content: "noindex" }] }),
  component: AuthCallback,
});

function safePath(p: string | null) {
  return p && p.startsWith("/") && !p.startsWith("//") ? p : "/academy/dashboard";
}

function AuthCallback() {
  const [err, setErr] = useState("");
  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      const dest = safePath(window.sessionStorage.getItem("lovetech_post_auth_redirect"));
      window.sessionStorage.removeItem("lovetech_post_auth_redirect");
      window.location.assign(dest);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) go();
    });
    (async () => {
      const url = new URL(window.location.href);
      const oauthErr = url.searchParams.get("error_description") || url.searchParams.get("error");
      if (oauthErr) { setErr(oauthErr); return; }
      let { data } = await supabase.auth.getSession();
      const code = url.searchParams.get("code");
      if (!data.session && code) {
        const res = await supabase.auth.exchangeCodeForSession(code);
        if (res.error) {
          // The client may have already exchanged the code; re-check before failing.
          const again = await supabase.auth.getSession();
          if (!again.data.session) { setErr(res.error.message); return; }
          data = again.data;
        } else {
          data = { session: res.data.session };
        }
      }
      if (!data.session) { setErr("Sign-in could not be completed. Please try again."); return; }
      go();
    })();
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <main className="px-6 py-24 text-center">
      {err ? (
        <div className="mx-auto max-w-md">
          <p className="mb-4 text-sm text-destructive">{err}</p>
          <a href="/login" className="text-sm underline">Back to sign in</a>
        </div>
      ) : (
        <p className="text-sm text-foreground/70">Signing you in…</p>
      )}
    </main>
  );
}
