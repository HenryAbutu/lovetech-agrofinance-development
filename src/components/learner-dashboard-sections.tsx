import { Link } from "@tanstack/react-router";
import { BookOpen, Download, ClipboardList, ClipboardCheck, Target, Award, ArrowRight } from "lucide-react";
import { useSessionIdentity } from "@/hooks/use-session-identity";
import { catalogue } from "@/lib/academy-catalogue";
import { ASSESSMENTS, LEARNABLE, RESOURCES, RESOURCE_CATEGORIES, downloadResource } from "@/lib/learning-content";
import { courseSummary, previewKeys, useLearnerData } from "@/lib/use-learner-data";

const statusLabel = (s: string) => (s === "completed" ? "Completed" : s === "started" ? "Started" : "Not started");

export function LearnerWelcome() {
  const id = useSessionIdentity();
  if (!id) return null;
  return <p className="mb-6 text-lg text-foreground/80">Welcome back, <span className="font-semibold text-vetiver">{id.full_name}</span> <span className="text-sm text-foreground/50">({id.email})</span></p>;
}

export function LearnerDashboardSections() {
  const { data, isLoading, error } = useLearnerData();
  if (isLoading) return <p className="text-sm text-foreground/60">Loading your learning…</p>;
  if (error || !data) return <p className="text-sm text-destructive">Could not load your learning: {(error as Error)?.message}</p>;

  const mine = data.starts.map((s) => ({ s, sum: courseSummary(data, s.course_slug) })).filter((x) => x.sum.course);
  const available = catalogue.filter((c) => !data.starts.some((s) => s.course_slug === c.slug));
  const pending = mine.flatMap(({ sum }) => sum.pending.map((l) => ({ l, sum })));

  return (
    <div className="space-y-12">
      <Section icon={<BookOpen className="size-5" />} title="Continue learning">
        {mine.length === 0 ? <Empty>You are not enrolled in any course yet. Join a waitlist or contact Lovetech to begin.</Empty> : (
          <div className="grid gap-4">
            {mine.map(({ s, sum }) => (
              <article key={s.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-vetiver">{sum.course.title}</h3>
                    <p className="mt-1 text-xs text-foreground/60">Enrolled · {s.cohort_name ? `Cohort: ${s.cohort_name}` : "Cohort not assigned yet"}</p>
                    <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-muted"><div className="h-full bg-teal" style={{ width: `${sum.percent}%` }} /></div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/70 sm:grid-cols-3">
                      <div>Progress: <b>{sum.percent}%</b></div>
                      <div>Pre-test: <b>{statusLabel(sum.preTest)}</b></div>
                      <div>Post-test: <b>{statusLabel(sum.postTest)}</b></div>
                      <div>Pending assignments: <b>{sum.pending.length}</b></div>
                      <div>Completion: <b>{sum.completed ? "Complete" : "In progress"}</b></div>
                      <div className="col-span-2 sm:col-span-1">Next: <b>{sum.nextLesson?.title ?? "All done"}</b></div>
                    </dl>
                  </div>
                  <Link to="/academy/learn/$slug" params={{ slug: s.course_slug }} className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-primary-foreground">
                    Continue Learning <ArrowRight className="size-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      {data.waitlist.length > 0 && (
        <Section icon={<ClipboardList className="size-5" />} title="My waitlist status">
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {data.waitlist.map((w) => (
              <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <span>{w.course_interest ?? w.interest_area ?? "General"} <span className="text-xs text-foreground/50">· joined {new Date(w.created_at).toLocaleDateString()}</span></span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold capitalize">{w.status === "new" ? "Received" : w.status}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section icon={<BookOpen className="size-5" />} title="Available courses">
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map((c) => (
            <div key={c.slug} className="rounded-xl border border-border bg-card p-4">
              <p className="font-semibold text-vetiver">{c.title}</p>
              <p className="mt-1 text-xs text-foreground/60">{c.duration} · {c.delivery}</p>
              <div className="mt-3 flex gap-2">
                <Link to="/academy/courses/$slug" params={{ slug: c.slug }} className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold">View Course</Link>
                <Link to="/academy/courses/$slug" params={{ slug: c.slug }} hash="register" className="rounded-lg bg-ochre px-3 py-1.5 text-xs font-bold text-ink">Join Waitlist</Link>
                {LEARNABLE.has(c.slug) && previewKeys(data, c.slug).size > 0 && (
                  <Link to="/academy/learn/$slug" params={{ slug: c.slug }} className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold">Free preview</Link>
                )}
              </div>
            </div>
          ))}
          {available.length === 0 && <Empty>You have started every available course.</Empty>}
        </div>
      </Section>

      <Section icon={<ClipboardList className="size-5" />} title="Pending assignments">
        {pending.length === 0 ? <Empty>No assignments due.</Empty> : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {pending.slice(0, 8).map(({ l, sum }) => (
              <li key={sum.course.slug + l.key} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                <span><b>{l.moduleTitle}</b> <span className="text-foreground/60">· {sum.course.title}</span></span>
                <Link to="/academy/learn/$slug" params={{ slug: sum.course.slug }} className="text-xs font-semibold text-teal">Submit Assignment →</Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={<ClipboardCheck className="size-5" />} title="Assessments">
        {mine.length === 0 ? <Empty>No assessments available yet.</Empty> : (
          <div className="grid gap-3 sm:grid-cols-2">
            {mine.flatMap(({ sum }) => ASSESSMENTS.map((a) => {
              const st = data.assess.find((x) => x.course_slug === sum.course.slug && x.assessment_key === a.key)?.status ?? "not_started";
              return (
                <div key={sum.course.slug + a.key} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold text-vetiver">{a.title}</p>
                  <p className="text-xs text-foreground/60">{a.purpose}</p>
                  <p className="mt-1 text-xs">Status: <b>{statusLabel(st)}</b> · {sum.course.title.split(":")[0]}</p>
                  {(data.links[a.key] || a.url) ? <a href={data.links[a.key] || a.url} target="_blank" rel="noreferrer noopener" className="mt-2 inline-block text-xs font-semibold text-teal">Start Assessment →</a>
                    : <p className="mt-2 text-xs text-foreground/50">Link coming soon</p>}
                </div>
              );
            }))}
          </div>
        )}
      </Section>

      <Section icon={<Download className="size-5" />} title="Downloads">
        <div className="space-y-4">
          {RESOURCE_CATEGORIES.map((cat) => {
            const items = RESOURCES.filter((r) => r.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-foreground/50">{cat}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((r) => (
                    <button key={r.key} type="button" onClick={() => downloadResource(r)} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted">
                      <Download className="size-3.5" /> {r.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section icon={<Target className="size-5" />} title="Action plan">
        {data.plans.length === 0 ? <Empty>You haven't submitted an action plan yet.</Empty> : (
          <ul className="space-y-2">
            {data.plans.map((p) => (
              <li key={p.id} className="rounded-xl border border-border bg-card p-3 text-sm">
                <b>{p.main_goal.slice(0, 80)}</b>
                <p className="text-xs text-foreground/60">{p.plan_type.replaceAll("_", " ")} · {new Date(p.created_at).toLocaleDateString()} · Submitted</p>
              </li>
            ))}
          </ul>
        )}
        {mine.length > 0 && <Link to="/academy/action-plan" className="mt-3 inline-flex rounded-lg bg-ochre px-4 py-2 text-sm font-bold text-ink">Submit Action Plan</Link>}
      </Section>

      <Section icon={<Award className="size-5" />} title="Certificate status">
        {mine.length === 0 ? <Empty>Your certificate will appear here after course completion.</Empty> : (
          <ul className="space-y-2">
            {mine.map(({ s, sum }) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
                <span>{sum.course.title}</span>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">{sum.cert}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-vetiver">{icon}{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-foreground/60">{children}</p>;
}
