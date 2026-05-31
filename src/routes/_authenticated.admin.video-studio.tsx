import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { checkIsAdmin } from "@/lib/learner.functions";
import { generateVideoScript } from "@/lib/video-studio.functions";

export const Route = createFileRoute("/_authenticated/admin/video-studio")({
  head: () => ({ meta: [{ title: "Course Video Studio — Admin" }] }),
  component: Studio,
});

const aiEdgeTemplates = [
  "Foundations: what AI can and can't do for your business",
  "Productivity stack: writing, research, summarisation",
  "Marketing & content with AI",
  "Sales, leads and customer support automation",
  "Operations: SOPs, workflows and document handling",
  "Data: analysing your business numbers with AI",
  "Building simple AI assistants (no-code)",
  "Ethics, safety and compliance",
  "Putting it together: your AI operating system",
  "Capstone: ship one AI workflow",
];
const icssTemplates = [
  "From idea to structured business",
  "Customer discovery for Nigerian MSMEs",
  "Pricing, margins and unit economics",
  "Operations and basic record-keeping",
  "Marketing, sales and growth",
  "Finance readiness and access to capital",
];

function Studio() {
  const fetchAdmin = useServerFn(checkIsAdmin);
  const generate = useServerFn(generateVideoScript);
  const admin = useQuery({ queryKey: ["isAdmin"], queryFn: () => fetchAdmin() });

  const [course, setCourse] = useState("professionals-ai-edge");
  const [moduleTitle, setModuleTitle] = useState(aiEdgeTemplates[0]);
  const [audience, setAudience] = useState("Nigerian professionals, founders and operators");
  const [duration, setDuration] = useState(5);
  const [keyPoints, setKeyPoints] = useState("");
  const [example, setExample] = useState("");
  const [activity, setActivity] = useState("");
  const [cta, setCta] = useState("Visit the Academy and enroll in Professionals AI Edge.");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const templates = course === "icss-2-0-entrepreneurship" ? icssTemplates : aiEdgeTemplates;

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setErr(""); setScript("");
    try {
      const r = await generate({ data: {
        course_slug: course,
        module_title: moduleTitle,
        audience,
        duration_minutes: duration,
        key_points: keyPoints,
        nigerian_example: example || null,
        practical_activity: activity || null,
        call_to_action: cta || null,
      }});
      setScript(r.script);
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : "Failed"); }
    finally { setLoading(false); }
  }

  if (admin.isLoading) return <main className="grid min-h-[40vh] place-items-center text-sm text-foreground/60">Loading…</main>;
  if (!admin.data?.isAdmin) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="mb-2 font-serif text-3xl text-vetiver">Admin only</h1>
        <p className="mb-6 text-foreground/65">You need the admin role to use the Video Studio.</p>
        <Link to="/academy/dashboard" className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Admin · AI</p>
        <h1 className="mb-2 font-serif text-4xl text-vetiver md:text-5xl">Course Video Studio</h1>
        <p className="mb-10 text-foreground/65">Generate a 12-part script for a short course video. Powered by Lovable AI.</p>

        <div className="grid gap-10 lg:grid-cols-2">
          <form onSubmit={onGenerate} className="grid gap-4 rounded-2xl border border-border bg-card p-6">
            <Select label="Course" value={course} onChange={setCourse} options={[
              { v: "professionals-ai-edge", l: "Professionals AI Edge" },
              { v: "icss-2-0-entrepreneurship", l: "ICSS 2.0 Entrepreneurship" },
              { v: "finance-readiness-msmes", l: "Finance Readiness for MSMEs" },
            ]} />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground/80">Module / Lesson</label>
              <input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} list="templates" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              <datalist id="templates">{templates.map((t) => <option key={t} value={t} />)}</datalist>
            </div>
            <Text label="Audience" value={audience} onChange={setAudience} />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground/80">Target duration (minutes)</label>
              <input type="number" min={1} max={60} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-32 rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </div>
            <Area label="Key points to cover" value={keyPoints} onChange={setKeyPoints} rows={5} required />
            <Area label="Nigerian example to weave in (optional)" value={example} onChange={setExample} />
            <Area label="Practical activity (optional)" value={activity} onChange={setActivity} />
            <Text label="Call to action" value={cta} onChange={setCta} />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button disabled={loading || !keyPoints} className="rounded-sm bg-vetiver px-6 py-3 font-semibold text-bone disabled:opacity-60">{loading ? "Generating…" : "Generate Script"}</button>
          </form>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-vetiver">Generated script</h2>
              {script && <button onClick={() => navigator.clipboard.writeText(script)} className="rounded-sm border border-border px-3 py-1 text-xs hover:bg-muted">Copy</button>}
            </div>
            {script ? (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground/85">{script}</pre>
            ) : (
              <p className="text-sm text-foreground/55">Fill out the form and click Generate Script to preview output here.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
function Area({ label, value, onChange, rows = 3, required }: { label: string; value: string; onChange: (v: string) => void; rows?: number; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}{required && " *"}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-foreground/80">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}
