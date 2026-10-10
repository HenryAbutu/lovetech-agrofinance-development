import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { learnableCourses } from "@/lib/learning-content";

export function EnrolForm({ onDone, initialEmail = "", waitlistId }: { onDone: () => void; initialEmail?: string; waitlistId?: string }) {
  const [email, setEmail] = useState(initialEmail);
  const [course, setCourse] = useState(learnableCourses()[0].slug);
  const [cohort, setCohort] = useState("");
  const [busy, setBusy] = useState(false);
  async function enrol(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.rpc("admin_enrol_learner", { _email: email, _course_slug: course, _cohort: cohort || undefined, _waitlist_id: waitlistId });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`${email} is now enrolled`);
    onDone();
  }
  return (
    <form onSubmit={enrol} className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
      <label className="text-xs font-medium">Learner email
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-64 rounded-md border border-input bg-background p-2 text-sm" />
      </label>
      <label className="text-xs font-medium">Course
        <select value={course} onChange={(e) => setCourse(e.target.value)} className="mt-1 block rounded-md border border-input bg-background p-2 text-sm">
          {learnableCourses().map((c) => <option key={c.slug} value={c.slug}>{c.title.split(":")[0]}</option>)}
        </select>
      </label>
      <label className="text-xs font-medium">Cohort (optional)
        <input value={cohort} onChange={(e) => setCohort(e.target.value)} placeholder="e.g. Abuja Cohort 1" className="mt-1 block w-48 rounded-md border border-input bg-background p-2 text-sm" />
      </label>
      <button disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Enrolling…" : "Enrol learner"}</button>
    </form>
  );
}

