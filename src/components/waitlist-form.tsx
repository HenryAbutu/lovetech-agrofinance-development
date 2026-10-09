import { useState } from "react";
import { toast } from "sonner";
import { useSessionIdentity } from "@/hooks/use-session-identity";
import { LegalNotice } from "@/components/legal-notice";
import { joinWaitlist } from "@/lib/waitlist";

const MODES = ["Online", "Physical/In-person", "Hybrid", "Self-paced", "Not sure yet"];

export function WaitlistForm({ courseSlug, courseLabel }: { courseSlug: string; courseLabel: string }) {
  void courseSlug;
  const me = useSessionIdentity();
  const [state, setState] = useState<"idle" | "loading" | "done" | "duplicate">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    const form = e.currentTarget;
    const values = Object.fromEntries(
      [...new FormData(form).entries()].map(([k, v]) => [k, String(v).trim()]).filter(([, v]) => v !== ""),
    ) as Record<string, string>;
    setErr("");
    setState("loading");
    const tId = toast.loading("Submitting...");
    try {
      const res = await joinWaitlist({ ...(me ?? {}), ...values }, courseLabel);
      if (res.status === "duplicate") {
        toast.info("You are already on the waitlist for this programme.", { id: tId });
        setState("duplicate");
        return;
      }
      form.reset();
      toast.success("You have joined the waitlist successfully.", { id: tId });
      setState("done");
    } catch (e2) {
      const msg = e2 instanceof Error ? e2.message : "Unknown error";
      toast.error(`Submission failed: ${msg}`, { id: tId });
      setErr(`Submission failed: ${msg}`);
      setState("idle");
    }
  }

  if (state === "done" || state === "duplicate") {
    return (
      <div role="status" className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-8 text-center">
        <h3 className="mb-2 font-serif text-2xl text-vetiver">
          {state === "done" ? "Thank you. You have joined the waitlist." : "You are already on the waitlist for this programme."}
        </h3>
        <p className="text-foreground/75">We will contact you with the next steps for {courseLabel}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-6 md:p-8">
      <h2 className="font-serif text-2xl text-vetiver md:text-3xl">Join the {courseLabel} waitlist</h2>
      <p className="text-xs text-foreground/60">Fields marked * are required.</p>
      {me ? (
        <p className="text-sm text-foreground/70">Joining as <span className="font-semibold">{me.full_name}</span> ({me.email})</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <Input name="full_name" label="Full name" required />
          <Input name="email" type="email" label="Email" required />
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="phone" type="tel" label="Phone / WhatsApp" required />
        <Input name="business_name" label="Business name" required />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="business_sector" label="Business sector" required />
        <Input name="location" label="Location" required />
      </div>
      <Input name="interest_area" label="What interests you most about this programme?" required />
      <div>
        <label htmlFor="wl-challenge" className="mb-1 block text-sm font-medium text-foreground/80">Main business challenge *</label>
        <textarea id="wl-challenge" name="main_challenge" required maxLength={2000} rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="wl-mode" className="mb-1 block text-sm font-medium text-foreground/80">Preferred training mode *</label>
        <select id="wl-mode" name="preferred_training_mode" required defaultValue="" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="" disabled>Select…</option>
          {MODES.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
      <button type="submit" disabled={state === "loading"} className="rounded-md bg-vetiver px-6 py-3 font-semibold text-bone disabled:opacity-60">
        {state === "loading" ? "Submitting…" : "Join Waitlist"}
      </button>
      <LegalNotice action="joining the waitlist" />
    </form>
  );
}

function Input({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  const id = `wl-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input id={id} name={name} type={type} required={required} maxLength={200} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
