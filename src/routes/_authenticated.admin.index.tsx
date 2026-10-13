import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Clock, BookOpen, Layers, FileText, ClipboardList, CheckCircle2, Award, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { findCourse } from "@/lib/academy-catalogue";
import { buildModules, learnableCourses } from "@/lib/learning-content";
import { courseTitle, downloadCsv, label, loadLmsAdmin, LMS_ADMIN_KEY } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

// All figures are read live from the database as the signed-in admin.
async function loadOverview() {
  const lms = await loadLmsAdmin();
  const [wl, prof] = await Promise.all([
    supabase.from("academy_waitlist").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  if (wl.error) throw new Error(wl.error.message);
  return { lms, waitlist: wl.data ?? [], totalUsers: prof.count ?? 0 };
}

const PALETTE = ["bg-primary", "bg-teal", "bg-ochre", "bg-vetiver", "bg-muted-foreground"];

function Overview() {
  const { data, isLoading, error } = useQuery({ queryKey: [...LMS_ADMIN_KEY, "overview"], queryFn: loadOverview });
  if (isLoading) return <p className="text-sm text-foreground/60">Loading dashboard…</p>;
  if (error || !data) return <p className="text-sm text-destructive">Could not load dashboard: {(error as Error)?.message}</p>;
  const { lms, waitlist } = data;

  // ---- per-enrolment evidence ----
  const enrolments = lms.starts.map((s) => {
    const c = findCourse(s.course_slug);
    const total = c ? buildModules(c).reduce((n, m) => n + m.lessons.length, 0) : 0;
    const done = lms.progress.filter((p) => p.user_id === s.user_id && p.course_slug === s.course_slug).length;
    const st = (k: string) => lms.assess.find((a) => a.user_id === s.user_id && a.course_slug === s.course_slug && a.assessment_key === k)?.status;
    const plan = lms.plans.some((p) => p.user_id === s.user_id && p.course_slug === s.course_slug);
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { s, pct, pre: st("pre-test") === "completed", post: st("post-test") === "completed", plan, eligible: pct === 100 && plan && st("post-test") === "completed" };
  });
  const n = enrolments.length;
  const learners = new Set(lms.starts.map((s) => s.user_id)).size;
  const eligible = enrolments.filter((e) => e.eligible).length;
  const completed = lms.starts.filter((s) => s.access_status === "completed").length;
  const pendingAssign = lms.subs.filter((s) => s.status === "submitted").length;
  const pendingPlans = lms.plans.filter((p) => p.status === "submitted").length;
  const assessDone = enrolments.filter((e) => e.pre).length + enrolments.filter((e) => e.post).length;

  const count = <T,>(xs: T[], key: (x: T) => string) => {
    const m = new Map<string, number>();
    xs.forEach((x) => m.set(key(x), (m.get(key(x)) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const waitlistByCourse = count(waitlist, (w: any) => (w.course_interest ?? w.interest_area ?? "General").split(":")[0]);
  const waitlistByStatus = count(waitlist, (w: any) => w.status);
  const perCourse = learnableCourses().map((c) => [courseTitle(c.slug), lms.starts.filter((s) => s.course_slug === c.slug).length] as [string, number]);
  const assignStatus = count(lms.subs, (s) => label(s.status));
  const planStatus: [string, number][] = [["not submitted", Math.max(n - new Set(lms.plans.map((p) => `${p.user_id}|${p.course_slug}`)).size, 0)], ...count(lms.plans, (p) => label(p.status))];
  const learnerStatus: [string, number][] = [
    ["waitlisted", waitlist.filter((w: any) => w.status !== "enrolled").length],
    ["enrolled", lms.starts.filter((s) => s.access_status === "enrolled").length],
    ["active", lms.starts.filter((s) => s.access_status === "active").length],
    ["completed", completed],
    ["certificate eligible", eligible],
  ];
  const cohortParticipation = lms.cohorts.map((c) => {
    const att = lms.attendance.filter((a) => a.cohort_id === c.id);
    const members = lms.starts.filter((s) => s.cohort_id === c.id).length;
    return { name: c.name, members, rate: att.length ? Math.round((att.filter((a) => a.present).length / att.length) * 100) : null, coaching: lms.coaching.filter((x) => x.cohort_id === c.id).length };
  });

  const cards = [
    { label: "Waitlist entries", value: waitlist.length, icon: Clock, sub: `${waitlist.filter((w: any) => w.status === "new").length} new`, to: "/admin/waitlist" },
    { label: "Enrolled learners", value: learners, icon: Users, sub: `${n} course enrolments · ${data.totalUsers} accounts`, to: "/admin/participants" },
    { label: "Active courses", value: learnableCourses().length, icon: BookOpen, sub: "open for learning" },
    { label: "Active cohorts", value: lms.cohorts.filter((c) => c.status === "active").length, icon: Layers, sub: `${lms.cohorts.length} cohorts in total`, to: "/admin/cohorts" },
    { label: "Pending assignments", value: pendingAssign, icon: FileText, sub: `${lms.subs.length} submitted in total`, to: "/admin/assignments" },
    { label: "Pending action plans", value: pendingPlans, icon: ClipboardList, sub: `${lms.plans.length} submitted in total`, to: "/admin/action-plans" },
    { label: "Assessment completion", value: n ? `${Math.round((assessDone / (n * 2)) * 100)}%` : "—", icon: CheckCircle2, sub: "pre- and post-tests" },
    { label: "Certificate eligible", value: eligible, icon: Award, sub: n ? `${Math.round((eligible / n) * 100)}% of enrolments` : "no enrolments yet" },
  ];

  const exportReport = () => downloadCsv("dashboard-report", [
    ...cards.map((c) => ({ section: "Summary", item: c.label, value: c.value })),
    ...waitlistByCourse.map(([k, v]) => ({ section: "Waitlist by course", item: k, value: v })),
    ...learnerStatus.map(([k, v]) => ({ section: "Learner status", item: k, value: v })),
    ...perCourse.map(([k, v]) => ({ section: "Learners per course", item: k, value: v })),
    ...assignStatus.map(([k, v]) => ({ section: "Assignments", item: k, value: v })),
    ...planStatus.map(([k, v]) => ({ section: "Action plans", item: k, value: v })),
  ]);
  const person = (id: string) => lms.person(id)?.full_name ?? lms.person(id)?.email ?? "—";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold">Academy & programme overview</h2>
        <div className="flex flex-wrap gap-2">
          <ExportBtn label="Waitlist" onClick={() => downloadCsv("waitlist", waitlist.map((w: any) => ({ name: w.full_name, email: w.email, phone: w.phone, business: w.business_name, sector: w.business_sector, course: w.course_interest ?? w.interest_area, mode: w.preferred_training_mode, status: w.status, joined: w.created_at })))} />
          <ExportBtn label="Learners" onClick={() => downloadCsv("learners", enrolments.map((e) => ({ learner: person(e.s.user_id), email: lms.person(e.s.user_id)?.email, course: courseTitle(e.s.course_slug), cohort: lms.cohortName(e.s.cohort_id) ?? e.s.cohort_name ?? "", status: e.s.access_status, progress: `${e.pct}%`, certificate_eligible: e.eligible ? "yes" : "no" })))} />
          <ExportBtn label="Assignments" onClick={() => downloadCsv("assignments", lms.subs.map((s) => ({ learner: person(s.user_id), course: courseTitle(s.course_slug), assignment: s.assignment_title, status: s.status, submitted: s.submitted_at })))} />
          <ExportBtn label="Action plans" onClick={() => downloadCsv("action-plans", lms.plans.map((p) => ({ learner: person(p.user_id), course: courseTitle(p.course_slug), goal: p.main_goal, status: p.status, submitted: p.created_at })))} />
          <ExportBtn label="Dashboard report" onClick={exportReport} primary />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const body = (
            <>
              <div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-foreground/60">{c.label}</p><c.icon className="size-4 text-primary" /></div>
              <p className="text-3xl font-semibold text-foreground">{c.value}</p>
              <p className="mt-1 text-xs text-foreground/60">{c.sub}</p>
            </>
          );
          return c.to
            ? <Link key={c.label} to={c.to as never} className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50">{body}</Link>
            : <div key={c.label} className="rounded-xl border border-border bg-card p-4">{body}</div>;
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Waitlist by course"><Bars rows={waitlistByCourse} empty="No waitlist entries yet." /></Panel>
        <Panel title="Learner status"><Bars rows={learnerStatus} /></Panel>
        <Panel title="Learners per course"><Bars rows={perCourse} empty="No enrolments yet." /></Panel>
        <Panel title="Completion & certificate readiness">
          <div className="flex items-center gap-6">
            <Ring pct={n ? Math.round((completed / n) * 100) : 0} label="completed" />
            <Ring pct={n ? Math.round((eligible / n) * 100) : 0} label="certificate eligible" />
            <p className="text-xs text-foreground/60">{n ? `${completed} completed · ${eligible} eligible out of ${n} enrolments` : "Appears once learners are enrolled."}</p>
          </div>
        </Panel>
        <Panel title="Assignment submission status"><Stacked rows={assignStatus} empty="No assignments submitted yet." /></Panel>
        <Panel title="Action plan status"><Stacked rows={n ? planStatus : []} empty="No enrolments yet." /></Panel>
        <Panel title="Assessment completion">
          {n ? <div className="space-y-3"><Progress label="Pre-test" pct={Math.round((enrolments.filter((e) => e.pre).length / n) * 100)} /><Progress label="Post-test" pct={Math.round((enrolments.filter((e) => e.post).length / n) * 100)} /></div> : <Empty text="No enrolments yet." />}
        </Panel>
        <Panel title="Attendance & coaching by cohort">
          {cohortParticipation.length ? <div className="space-y-3">{cohortParticipation.map((c) => (
            <div key={c.name}><Progress label={`${c.name} · ${c.members} learners · ${c.coaching} coaching`} pct={c.rate ?? 0} note={c.rate == null ? "no attendance yet" : undefined} /></div>
          ))}</div> : <Empty text="No cohorts created yet." />}
        </Panel>
        <Panel title="Waitlist status"><Stacked rows={waitlistByStatus} empty="No waitlist entries yet." /></Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Recent title="Recent waitlist entries" to="/admin/waitlist" rows={waitlist.slice(0, 5).map((w: any) => [w.full_name, (w.course_interest ?? w.interest_area ?? "General").split(":")[0], w.status, w.created_at])} />
        <Recent title="Recent enrolments" to="/admin/participants" rows={lms.starts.slice(0, 5).map((s) => [person(s.user_id), courseTitle(s.course_slug), s.access_status, s.started_at])} />
        <Recent title="Recent assignment submissions" to="/admin/assignments" rows={lms.subs.slice(0, 5).map((s) => [person(s.user_id), s.assignment_title, label(s.status), s.submitted_at])} />
        <Recent title="Recent action plans" to="/admin/action-plans" rows={lms.plans.slice(0, 5).map((p) => [person(p.user_id), courseTitle(p.course_slug), label(p.status), p.created_at])} />
      </div>
    </div>
  );
}

function ExportBtn({ label, onClick, primary }: { label: string; onClick: () => void; primary?: boolean }) {
  return <button type="button" onClick={onClick} className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold ${primary ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}><Download className="size-3" /> {label}</button>;
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-border bg-card p-5"><h3 className="mb-4 text-sm font-semibold">{title}</h3>{children}</section>;
}
function Empty({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-foreground/60">{text}</p>;
}
function Bars({ rows, empty = "No data yet." }: { rows: [string, number][]; empty?: string }) {
  const max = Math.max(...rows.map((r) => r[1]), 1);
  if (!rows.some((r) => r[1] > 0)) return <Empty text={empty} />;
  return <ul className="space-y-2">{rows.map(([k, v]) => (
    <li key={k} className="grid grid-cols-[minmax(0,10rem)_1fr_2rem] items-center gap-3 text-xs">
      <span className="truncate capitalize" title={k}>{k}</span>
      <span className="h-2.5 rounded-full bg-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${(v / max) * 100}%` }} /></span>
      <span className="text-right font-semibold">{v}</span>
    </li>))}</ul>;
}
function Stacked({ rows, empty }: { rows: [string, number][]; empty: string }) {
  const total = rows.reduce((n, r) => n + r[1], 0);
  if (!total) return <Empty text={empty} />;
  return <div>
    <div className="flex h-3 overflow-hidden rounded-full bg-muted">{rows.map(([k, v], i) => v > 0 && <span key={k} className={PALETTE[i % PALETTE.length]} style={{ width: `${(v / total) * 100}%` }} title={`${k}: ${v}`} />)}</div>
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">{rows.map(([k, v], i) => <li key={k} className="inline-flex items-center gap-1.5 capitalize"><span className={`size-2.5 rounded-full ${PALETTE[i % PALETTE.length]}`} />{k} <b>{v}</b></li>)}</ul>
  </div>;
}
function Progress({ label, pct, note }: { label: string; pct: number; note?: string }) {
  return <div className="text-xs"><div className="mb-1 flex justify-between gap-2"><span className="truncate">{label}</span><b>{note ?? `${pct}%`}</b></div><div className="h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div></div>;
}
function Ring({ pct, label }: { pct: number; label: string }) {
  return <div className="text-center">
    <div className="relative grid size-20 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--primary)) ${pct * 3.6}deg, hsl(var(--muted)) 0)` }}>
      <div className="grid size-14 place-items-center rounded-full bg-card text-sm font-semibold">{pct}%</div>
    </div>
    <p className="mt-1 text-[11px] text-foreground/60">{label}</p>
  </div>;
}
function Recent({ title, to, rows }: { title: string; to: string; rows: string[][] }) {
  return <section className="rounded-xl border border-border bg-card">
    <div className="flex items-center justify-between border-b border-border px-4 py-3"><h3 className="text-sm font-semibold">{title}</h3><Link to={to as never} className="text-xs font-semibold text-primary">View all</Link></div>
    {rows.length ? <table className="w-full text-xs"><tbody>{rows.map((r, i) => (
      <tr key={i} className="border-t border-border first:border-0"><td className="p-3 font-medium">{r[0]}</td><td className="p-3 text-foreground/70">{r[1]}</td><td className="p-3"><span className="rounded-full bg-muted px-2 py-0.5 capitalize">{r[2]}</span></td><td className="p-3 text-right text-foreground/60">{new Date(r[3]).toLocaleDateString()}</td></tr>
    ))}</tbody></table> : <p className="p-4 text-center text-xs text-foreground/60">Nothing yet.</p>}
  </section>;
}
