import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitWaitlist } from "@/lib/forms.functions";

export function WaitlistForm({ courseSlug, courseLabel }: { courseSlug: string; courseLabel: string }) {
  const submit = useServerFn(submitWaitlist);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = { course_slug: courseSlug, ...Object.fromEntries(fd.entries()) } as Record<string, string>;
    try { await submit({ data: data as never }); setState("done"); e.currentTarget.reset(); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Failed"); setState("error"); }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-vetiver/30 bg-vetiver/5 p-8 text-center">
        <h3 className="mb-2 font-serif text-3xl text-vetiver">You're on the {courseLabel} waitlist.</h3>
        <p className="text-foreground/75">We'll email you the moment enrolment opens.</p>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-5 rounded-2xl border border-border bg-card p-8">
      <h2 className="font-serif text-3xl text-vetiver">Join the {courseLabel} waitlist</h2>
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="full_name" label="Full name" required />
        <Input name="email" type="email" label="Email" required />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="phone" label="Phone (WhatsApp)" />
        <Input name="business_name" label="Business name" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Input name="business_sector" label="Business sector" />
        <Input name="location" label="Location" />
      </div>
      <Input name="interest_area" label="What interests you most about this programme?" />
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">Main business challenge</label>
        <textarea name="main_challenge" rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground/80">Preferred training mode</label>
        <select name="preferred_training_mode" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
          <option value="">Select…</option>
          {["Self-paced online","Live Zoom cohort","Hybrid","In-person"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <button disabled={state === "loading"} className="rounded-sm bg-vetiver px-6 py-3 font-semibold text-bone disabled:opacity-60">{state === "loading" ? "Submitting…" : "Join Waitlist"}</button>
    </form>
  );
}
function Input({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <input name={name} type={type} required={required} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
