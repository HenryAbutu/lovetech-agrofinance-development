import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, CreditCard, Clock, Award, TrendingUp } from "lucide-react";
import { getAdminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const fn = useServerFn(getAdminOverview);
  const { data, isLoading } = useQuery({ queryKey: ["admin-overview"], queryFn: () => fn() });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (!data) return null;

  const cards = [
    { label: "Courses", value: data.courseCount, icon: BookOpen },
    { label: "Enrolments (total)", value: data.enrolmentCount, icon: Users, sub: `${data.paidEnrolments} paid · ${data.pendingEnrolments} pending` },
    { label: "Revenue (NGN)", value: `₦${data.revenueNGN.toLocaleString()}`, icon: TrendingUp },
    { label: "Payments", value: data.paidEnrolments, icon: CreditCard, sub: "successful" },
    { label: "Waitlist", value: data.waitlistCount, icon: Clock },
    { label: "Certificates issued", value: data.issuedCerts, icon: Award, sub: `${data.pendingCerts} in-progress` },
  ];

  return (
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
    </div>
  );
}
