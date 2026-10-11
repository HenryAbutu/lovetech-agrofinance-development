import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, CreditCard, Clock, Award, TrendingUp } from "lucide-react";
import { getAdminOverview } from "@/lib/admin.functions";
import { loadLmsAdmin, LMS_ADMIN_KEY } from "@/lib/lms-admin";
import { learnableCourses } from "@/lib/learning-content";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const fn = useServerFn(getAdminOverview);
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: () => fn() });
  const lms = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });

  if (isLoading || lms.isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (!data) return null;
  const l = lms.data;
  const learners = new Set(l?.starts.map((s) => s.user_id)).size;
  const completed = l?.starts.filter((s) => s.access_status === "completed").length ?? 0;
  const lmsCards = [
    { label: "Total learners", value: learners, icon: Users, sub: `${l?.starts.length ?? 0} course enrolments` },
    { label: "Waitlist entries", value: data.waitlistCount, icon: Clock },
    { label: "Active courses", value: learnableCourses().length, icon: BookOpen, sub: "open for learning" },
    { label: "Active cohorts", value: l?.cohorts.filter((c) => c.status === "active").length ?? 0, icon: Users, sub: `${l?.cohorts.length ?? 0} cohorts in total` },
    { label: "Pending assignments", value: l?.subs.filter((s) => s.status === "submitted" || s.status === "pending").length ?? 0, icon: CreditCard, sub: "awaiting review" },
    { label: "Action plans submitted", value: l?.plans.length ?? 0, icon: TrendingUp, sub: `${l?.plans.filter((p) => p.status === "submitted").length ?? 0} awaiting review` },
    { label: "Completion rate", value: l?.starts.length ? `${Math.round((completed / l.starts.length) * 100)}%` : "—", icon: Award, sub: "based on enrolments marked completed" },
    { label: "Assessments", value: l?.assess.filter((a) => a.status === "completed").length ?? 0, icon: Award, sub: "completed (pre/post/feedback) — links pending" },
  ];

  const cards = [
    { label: "Courses", value: data.courseCount, icon: BookOpen },
    { label: "Enrolments (total)", value: data.enrolmentCount, icon: Users, sub: `${data.paidEnrolments} paid · ${data.pendingEnrolments} pending` },
    { label: "Revenue (NGN)", value: `₦${data.revenueNGN.toLocaleString()}`, icon: TrendingUp },
    { label: "Payments", value: data.paidEnrolments, icon: CreditCard, sub: "successful" },
    { label: "Waitlist", value: data.waitlistCount, icon: Clock },
    { label: "Certificates issued", value: data.issuedCerts, icon: Award, sub: `${data.pendingCerts} in-progress` },
  ];

  return (
    <div className="space-y-8">
    <section><h2 className="mb-3 text-lg font-bold">Academy & programme overview</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {lmsCards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">{c.label}</p><c.icon className="size-4 text-vetiver" /></div>
          <p className="font-serif text-3xl text-vetiver">{c.value}</p>
          {c.sub && <p className="mt-1 text-xs text-foreground/60">{c.sub}</p>}
        </div>
      ))}
    </div></section>
    <section><h2 className="mb-3 text-lg font-bold">Payments & certificates</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">{c.label}</p>
            <c.icon className="size-5 text-vetiver" />
          </div>
          <p className="font-serif text-3xl text-vetiver">{c.value}</p>
          {c.sub && <p className="mt-1 text-xs text-foreground/60">{c.sub}</p>}
        </div>
      ))}
    </div></section>
    </div>
  );
}
