import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { ACTION_PLAN_TYPES, learnableCourses } from "@/lib/learning-content";
import { useLearnerData, useRefreshLearner } from "@/lib/use-learner-data";

export const Route = createFileRoute("/_authenticated/academy/action-plan")({
  validateSearch: (s) => z.object({ course: z.string().optional() }).parse(s),
  head: () => ({ meta: [{ title: "Submit Action Plan — LoveTech Academy" }, { name: "robots", content: "noindex" }] }),
  component: ActionPlanPage,
});

const FIELDS: { k: string; label: string; required?: boolean; long?: boolean }[] = [
  { k: "business_name", label: "Business name" },
  { k: "main_goal", label: "Main goal", required: true, long: true },
  { k: "key_actions", label: "Key actions", required: true, long: true },
  { k: "resources_needed", label: "Resources needed", long: true },
  { k: "support_needed", label: "Support needed", long: true },
  { k: "timeline", label: "Timeline" },
  { k: "expected_result", label: "Expected result", long: true },
  { k: "risks", label: "Risks", long: true },
  { k: "next_steps", label: "Next steps", long: true },
];

function ActionPlanPage() {
  const { course } = Route.useSearch();
  const courses = learnableCourses();
  const { data } = useLearnerData();
  const refresh = useRefreshLearner();
  const [form, setForm] = useState<Record<string, string>>({ course_slug: course ?? courses[0].slug, plan_type: "business_improvement" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    if (!form.main_goal?.trim() || !form.key_actions?.trim()) return toast.error("Please fill in your main goal and key actions.");
    setSending(true);
    const row: Record<string, string | null> = {};
    for (const f of FIELDS) row[f.k] = form[f.k]?.trim().slice(0, 5000) || null;
    const { error } = await supabase.from("lms_action_plans").insert({
      ...row, user_id: data.userId, course_slug: form.course_slug, plan_type: form.plan_type as any,
      main_goal: row.main_goal!, key_actions: row.key_actions!,
    });
    setSending(false);
    if (error) return toast.error(`Submission failed: ${error.message}`);
    toast.success("Your action plan has been submitted successfully.");
    setDone(true);
    refresh();
  }

  return (
    <main className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link to="/academy/dashboard" className="text-xs font-semibold uppercase tracking-widest text-ochre">← My Academy</Link>
        <h1 className="mt-2 text-3xl font-bold text-vetiver">Submit your action plan</h1>
        <p className="mt-2 text-sm text-foreground/70">Set out the practical steps you will take in your business after this programme.</p>

        {done ? (
          <div className="mt-8 rounded-2xl border border-teal/40 bg-teal/5 p-6">
            <p className="font-semibold text-teal">Your action plan has been submitted successfully.</p>
            <div className="mt-4 flex gap-3">
              <Link to="/academy/dashboard" className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-primary-foreground">Back to dashboard</Link>
              <button type="button" onClick={() => { setDone(false); setForm({ course_slug: form.course_slug, plan_type: form.plan_type }); }} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">Submit another</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6">
            <label className="block text-sm font-medium">Course / programme
              <select value={form.course_slug} onChange={(e) => setForm({ ...form, course_slug: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm">
                {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Action plan type
              <select value={form.plan_type} onChange={(e) => setForm({ ...form, plan_type: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm">
                {ACTION_PLAN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </label>
            {FIELDS.map((f) => (
              <label key={f.k} className="block text-sm font-medium">{f.label}{f.required && " *"}
                {f.long ? (
                  <textarea rows={3} required={f.required} value={form[f.k] ?? ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
                ) : (
                  <input required={f.required} value={form[f.k] ?? ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm" />
                )}
              </label>
            ))}
            <button type="submit" disabled={sending || !data} className="rounded-lg bg-ochre px-6 py-3 text-sm font-bold text-ink disabled:opacity-60">{sending ? "Submitting…" : "Submit Action Plan"}</button>
          </form>
        )}
      </div>
    </main>
  );
}
