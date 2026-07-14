import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password — LoveTech" }] }),
  component: ResetPage,
});

function ResetPage() {
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash.includes("type=recovery")) {
      setMode("update");
    }
  }, []);

  async function request(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + "/reset-password" });
    if (error) setErr(error.message); else setMsg("Check your email for a reset link.");
  }
  async function update(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setMsg("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setErr(error.message); else setMsg("Password updated. You can now sign in.");
  }

  return (
    <main className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8">
        <h1 className="mb-6 font-serif text-3xl text-vetiver">{mode === "request" ? "Reset your password" : "Set a new password"}</h1>
        {mode === "request" ? (
          <form onSubmit={request} className="grid gap-4">
            <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button className="rounded-sm bg-vetiver py-2.5 text-sm font-semibold text-bone">Send reset link</button>
          </form>
        ) : (
          <form onSubmit={update} className="grid gap-4">
            <input required type="password" minLength={8} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
            <button className="rounded-sm bg-vetiver py-2.5 text-sm font-semibold text-bone">Update password</button>
          </form>
        )}
        {msg && <p className="mt-4 text-sm text-vetiver">{msg}</p>}
        {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
      </div>
    </main>
  );
}
