import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { findCourse } from "@/lib/academy-catalogue";
import { EnrolForm } from "@/components/admin-enrol-form";
import { ASSESSMENTS, buildModules, learnableCourses } from "@/lib/learning-content";

export const Route = createFileRoute("/_authenticated/admin/lms-settings")({
  component: LmsSettings,
});

async function load() {
  const [links, settings, starts, profiles] = await Promise.all([
    supabase.from("lms_assessment_links").select("*"),
    supabase.from("lms_course_settings").select("*"),
    supabase.from("lms_course_starts").select("*").order("started_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email"),
  ]);
  for (const r of [links, settings, starts]) if (r.error) throw new Error(r.error.message);
  return { links: links.data ?? [], settings: settings.data ?? [], starts: starts.data ?? [], profiles: profiles.data ?? [] };
}

function LmsSettings() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-lms-settings"], queryFn: load });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-lms-settings"] });
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;

  return (
    <div className="space-y-10">
      <EnrolForm onDone={refresh} />

      <section>
        <h2 className="mb-3 text-lg font-bold">Enrolled learners ({data.starts.length})</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-foreground/60"><tr><th className="p-3">Learner</th><th className="p-3">Course</th><th className="p-3">Cohort</th><th className="p-3">Enrolled</th><th className="p-3" /></tr></thead>
            <tbody>
              {data.starts.map((s) => {
                const p = data.profiles.find((x) => x.id === s.user_id);
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-3">{p?.full_name ?? "—"}<div className="text-xs text-foreground/60">{p?.email}</div></td>
                    <td className="p-3 text-xs">{findCourse(s.course_slug)?.title ?? s.course_slug}</td>
                    <td className="p-3 text-xs">{s.cohort_name ?? "—"}</td>
                    <td className="p-3 text-xs">{new Date(s.started_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <button type="button" className="text-xs font-semibold text-destructive" onClick={async () => {
                        if (!confirm("Remove this learner's access to the course?")) return;
                        const { error } = await supabase.from("lms_course_starts").delete().eq("id", s.id);
                        if (error) return toast.error(error.message);
                        toast.success("Access removed"); refresh();
                      }}>Remove access</button>
                    </td>
                  </tr>
                );
              })}
              {data.starts.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-foreground/60">No enrolled learners yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-bold">Assessment links</h2>
        <p className="mb-3 text-sm text-foreground/60">Paste a Google Form link. Leave empty to show "Link coming soon".</p>
        <div className="space-y-3">
          {ASSESSMENTS.map((a) => <LinkRow key={a.key} akey={a.key} title={a.title} url={data.links.find((l) => l.assessment_key === a.key)?.url ?? ""} />)}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-bold">Free preview</h2>
        <p className="mb-3 text-sm text-foreground/60">Choose which lessons people who are not enrolled can open.</p>
        <div className="space-y-4">
          {learnableCourses().map((c) => <PreviewRow key={c.slug} slug={c.slug} setting={data.settings.find((s) => s.course_slug === c.slug)} onDone={refresh} />)}
        </div>
      </section>
    </div>
  );
}

function LinkRow({ akey, title, url }: { akey: string; title: string; url: string }) {
  const [v, setV] = useState(url);
  async function save() {
    const { error } = await supabase.from("lms_assessment_links").upsert({ assessment_key: akey, url: v.trim(), updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message.includes("check") ? "Link must start with https://" : error.message);
    toast.success(`${title} saved`);
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
      <span className="w-56 text-sm font-medium">{title}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="https://forms.gle/…" className="min-w-0 flex-1 rounded-md border border-input bg-background p-2 text-sm" />
      <button type="button" onClick={save} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold">Save</button>
    </div>
  );
}

function PreviewRow({ slug, setting, onDone }: { slug: string; setting?: { preview_enabled: boolean; preview_lesson_keys: string[] }; onDone: () => void }) {
  const c = findCourse(slug)!;
  const [enabled, setEnabled] = useState(setting?.preview_enabled ?? false);
  const [keys, setKeys] = useState<Set<string>>(new Set(setting?.preview_lesson_keys ?? []));
  const lessons = buildModules(c).flatMap((m) => m.lessons.map((l) => ({ ...l, mod: m.title })));
  async function save() {
    const { error } = await supabase.from("lms_course_settings").upsert({ course_slug: slug, preview_enabled: enabled, preview_lesson_keys: [...keys], updated_at: new Date().toISOString() });
    if (error) return toast.error(error.message);
    toast.success("Preview settings saved"); onDone();
  }
  return (
    <details className="rounded-xl border border-border bg-card p-4">
      <summary className="cursor-pointer text-sm font-semibold">{c.title} — {enabled ? `preview on (${keys.size} lessons)` : "preview off"}</summary>
      <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} /> Enable free preview</label>
      <div className="mt-3 grid max-h-72 gap-1 overflow-y-auto sm:grid-cols-2">
        {lessons.map((l) => (
          <label key={l.key} className="flex items-start gap-2 text-xs">
            <input type="checkbox" checked={keys.has(l.key)} onChange={(e) => { const n = new Set(keys); e.target.checked ? n.add(l.key) : n.delete(l.key); setKeys(n); }} />
            <span><b>{l.title}</b> <span className="text-foreground/50">· {l.mod}</span></span>
          </label>
        ))}
      </div>
      <button type="button" onClick={save} className="mt-3 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Save preview</button>
    </details>
  );
}
