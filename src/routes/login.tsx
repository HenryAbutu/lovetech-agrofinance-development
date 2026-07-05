import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — LoveTech" }, { name: "description", content: "Sign in to your LoveTech account." }] }),
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: LoginPage,
});

function safeRedirectPath(value?: string) {
  if (!value) return "/academy/dashboard";
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return "/academy/dashboard";
    return `${url.pathname}${url.search}${url.hash}` || "/academy/dashboard";
  } catch {
    return "/academy/dashboard";
  }
}

function LoginPage() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);
  const redirectTo = safeRedirectPath(redirect);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setErr(error.message);
    else nav({ to: redirectTo as never });
  }

  async function googleSignIn() {
    setErr("");
    window.sessionStorage.setItem("lovetech_post_auth_redirect", redirectTo);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setErr(result.error.message);
    else if (!result.redirected) nav({ to: redirectTo as never });
  }

  return (
    <main className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="mb-2 font-serif text-4xl text-vetiver">Sign in</h1>
        <p className="mb-6 text-sm text-foreground/65">Welcome back to LoveTech.</p>
        <button onClick={googleSignIn} className="mb-5 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-2.5 text-sm font-medium hover:bg-muted">Continue with Google</button>
        <div className="my-4 flex items-center gap-3 text-xs text-foreground/40"><div className="h-px flex-1 bg-border" /><span>OR</span><div className="h-px flex-1 bg-border" /></div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={loading} className="rounded-sm bg-vetiver py-2.5 text-sm font-semibold text-bone disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
        </form>
        <div className="mt-6 flex justify-between text-xs text-foreground/60">
          <Link to="/reset-password" className="hover:text-vetiver">Forgot password?</Link>
          <Link to="/signup" className="hover:text-vetiver">Create account →</Link>
        </div>
      </div>
    </main>
  );
}
