import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listWaitlistAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/waitlist")({
  component: WaitlistAdmin,
});

function WaitlistAdmin() {
  const list = useServerFn(listWaitlistAdmin);
  const { data, isLoading } = useQuery({ queryKey: ["admin-waitlist"], queryFn: () => list() });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Business</th>
            <th className="p-3">Interest</th>
            <th className="p-3">Course</th>
            <th className="p-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {data?.waitlist.map((w: any) => {
            const course = Array.isArray(w.course) ? w.course[0] : w.course;
            return (
              <tr key={w.id} className="border-t border-border">
                <td className="p-3 font-medium text-vetiver">{w.full_name}</td>
                <td className="p-3">
                  <div className="text-xs">{w.email}</div>
                  {w.phone && <div className="text-xs text-foreground/60">{w.phone}</div>}
                </td>
                <td className="p-3 text-xs">{w.business_name ?? "—"}<br /><span className="text-foreground/60">{w.location ?? ""}</span></td>
                <td className="p-3 text-xs">{w.interest_area ?? "—"}</td>
                <td className="p-3 text-xs">{course?.title ?? "General"}</td>
                <td className="p-3 text-xs text-foreground/60">{new Date(w.created_at).toLocaleDateString()}</td>
              </tr>
            );
          })}
          {data?.waitlist.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-foreground/60">No waitlist entries.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
