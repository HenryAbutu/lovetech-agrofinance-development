import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { getMyAccess, type AppRole } from "@/lib/user-roles.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — LoveTech Agro Academy" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type Tab = { to: string; label: string; exact?: boolean; roles: AppRole[] };
const STAFF: AppRole[] = ["admin", "super_admin"];
const ALL_STAFF: AppRole[] = ["facilitator", "admin", "super_admin"];

const tabs: Tab[] = [
  { to: "/admin", label: "Overview", exact: true, roles: STAFF },
  { to: "/admin/users", label: "Users", roles: ["super_admin"] },
  { to: "/admin/waitlist", label: "Waitlist", roles: STAFF },
  { to: "/admin/courses", label: "Courses", roles: STAFF },
  { to: "/admin/cohorts", label: "Cohorts", roles: ALL_STAFF },
  { to: "/admin/participants", label: "Participants", roles: ALL_STAFF },
  { to: "/admin/assignments", label: "Assignments", roles: ALL_STAFF },
  { to: "/admin/assessments", label: "Assessments", roles: STAFF },
  { to: "/admin/coaching-logs", label: "Coaching Logs", roles: ALL_STAFF },
  { to: "/admin/action-plans", label: "Action Plans", roles: ALL_STAFF },
  { to: "/admin/evidence-export", label: "Evidence Export", roles: STAFF },
  { to: "/admin/enrolments", label: "Enrolments", roles: STAFF },
  { to: "/admin/payments", label: "Payments", roles: STAFF },
  { to: "/admin/coupons", label: "Coupons", roles: STAFF },
  { to: "/admin/certificates", label: "Certificates", roles: STAFF },
  { to: "/admin/announcements", label: "Announcements", roles: STAFF },
  { to: "/admin/video-studio", label: "Video Studio", roles: STAFF },
  { to: "/admin/house-8", label: "House 8 Bookings", roles: STAFF },
  { to: "/admin/ruby-chai", label: "Ruby Chai Orders", roles: STAFF },
  { to: "/admin/insights", label: "Insights", roles: STAFF },
];

const ROLE_LABEL: Record<AppRole, string> = { learner: "Learner", facilitator: "Facilitator", admin: "Admin", super_admin: "Super admin" };

function tabFor(pathname: string) {
  const matches = tabs.filter((t) => (t.exact ? pathname === t.to || pathname === `${t.to}/` : pathname.startsWith(t.to)));
  return matches.sort((a, b) => b.to.length - a.to.length)[0];
}

function AdminLayout() {
  const fetchAccess = useServerFn(getMyAccess);
  const access = useQuery({ queryKey: ["my-access"], queryFn: () => fetchAccess(), retry: false });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const role = access.data?.role;
  const visible = role ? tabs.filter((t) => t.roles.includes(role)) : [];
  const current = tabFor(pathname);
  const allowed = !!role && !!current && current.roles.includes(role);

  useEffect(() => {
    if (access.isLoading) return;
    if (!role || role === "learner" || access.isError) {
      toast.error("You do not have permission to access the admin area.");
      void navigate({ to: "/academy/dashboard", replace: true });
      return;
    }
    if (!allowed) {
      const home = visible[0];
      toast.error("You do not have permission to access that admin page.");
      if (home) void navigate({ to: home.to as never, replace: true });
    }
  }, [access.isLoading, access.isError, role, allowed, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (access.isLoading || !allowed) {
    return <main className="grid min-h-[60vh] place-items-center text-sm text-foreground/60">Checking access…</main>;
  }

  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-6 py-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ochre">LoveTech Admin</p>
            <h1 className="mt-1 font-serif text-3xl text-vetiver">Academy control room</h1>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-2 text-xs">
            <div><span className="text-foreground/60">Logged in as:</span> <span className="font-medium">{access.data?.email}</span></div>
            <div className="mt-0.5"><span className="text-foreground/60">Role:</span> <span className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 font-semibold text-primary">{ROLE_LABEL[role!]}</span></div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-8">
          <nav className="-mb-px flex gap-1">
            {visible.map((t) => {
              const active = current?.to === t.to;
              return (
                <Link key={t.to} to={t.to as never}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${active ? "border-vetiver text-vetiver" : "border-transparent text-foreground/60 hover:text-foreground"}`}>
                  {t.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Outlet />
      </div>
    </main>
  );
}
