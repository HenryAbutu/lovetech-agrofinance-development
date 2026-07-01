import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { checkIsAdmin } from "@/lib/learner.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — LoveTech Agro Academy" }] }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/courses", label: "Courses" },
  { to: "/admin/assessments", label: "Assessments" },
  { to: "/admin/enrolments", label: "Enrolments" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/coupons", label: "Coupons" },
  { to: "/admin/waitlist", label: "Waitlist" },
  { to: "/admin/certificates", label: "Certificates" },
  { to: "/admin/video-studio", label: "Video Studio" },
];

function AdminLayout() {
  const fetchAdmin = useServerFn(checkIsAdmin);
  const admin = useQuery({ queryKey: ["isAdmin"], queryFn: () => fetchAdmin() });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (admin.isLoading) return <main className="grid min-h-[60vh] place-items-center text-sm text-foreground/60">Checking access…</main>;
  if (!admin.data?.isAdmin) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="mb-3 font-serif text-3xl text-vetiver">Admins only</h1>
        <p className="mb-6 text-foreground/70">You need an admin role to view this area.</p>
        <Link to="/academy/dashboard" className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Back to dashboard</Link>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-ochre">LoveTech Admin</p>
          <h1 className="mt-1 font-serif text-3xl text-vetiver">Academy control room</h1>
        </div>
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 lg:px-8">
          <nav className="flex gap-1 border-b border-transparent -mb-px">
            {tabs.map((t) => {
              const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    active ? "border-vetiver text-vetiver" : "border-transparent text-foreground/60 hover:text-foreground"
                  }`}
                >
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
