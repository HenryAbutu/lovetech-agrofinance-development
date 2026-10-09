import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { lovable } from "@/lib/lovable-auth";
import { LegalNotice } from "@/components/legal-notice";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — LoveTech" }, { name: "description", content: "Create your LoveTech account." }, { property: "og:title", content: "Create account — LoveTech" }, { property: "og:description", content: "Register for LoveTech Academy courses and learning resources." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [fullName, setFullName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false); const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    // If email confirmation is required, session is null — show "check email".
    // If auto-confirm is on, session exists — send to dashboard.
    if (data.session) window.location.assign("/academy/dashboard");
    else setDone(true);
  }

  async function googleSignIn() {
    window.sessionStorage.setItem("lovetech_post_auth_redirect", "/academy/dashboard");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth/callback` });
    if (result.error) setErr(result.error.message);
    else if (!result.redirected) window.location.assign("/academy/dashboard");
  }

  return (
    <main className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="mb-2 font-serif text-4xl text-vetiver">Create your account</h1>
        <p className="mb-6 text-sm text-foreground/65">Join the LoveTech Agro Academy.</p>
        {done ? (
          <div className="rounded-md border border-vetiver/30 bg-vetiver/5 p-4 text-sm">Check your email to confirm your address, then sign in.</div>
        ) : (
          <>
            <button onClick={googleSignIn} className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Google</button>
            <LegalNotice className="mb-5" />
            <div className="my-4 flex items-center gap-3 text-xs text-foreground/40"><div className="h-px flex-1 bg-border" /><span>OR</span><div className="h-px flex-1 bg-border" /></div>
            <form onSubmit={onSubmit} className="grid gap-4">
              <input required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
              <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
              <input required type="password" minLength={8} placeholder="Password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button disabled={loading} className="rounded-sm bg-vetiver py-2.5 text-sm font-semibold text-bone disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
            </form>
          </>
        )}
        <div className="mt-6 text-xs text-foreground/60">Already have an account? <Link to="/login" className="text-vetiver">Sign in</Link></div>
      </div>
    </main>
  );
}
