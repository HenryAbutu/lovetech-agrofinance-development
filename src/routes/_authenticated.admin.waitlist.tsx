import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listWaitlistAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/waitlist")({
  component: WaitlistAdmin,
});

function WaitlistAdmin() {
  const list = useServerFn(listWaitlistAdmin);
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-waitlist"], queryFn: () => list() });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">Could not load waitlist: {(error as Error).message}</p>;

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground/60">{data?.waitlist.length ?? 0} people on the waitlist</p>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Business</th>
              <th className="p-3">Programme</th>
              <th className="p-3">Mode / Challenge</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {data?.waitlist.map((w: any) => {
              const course = Array.isArray(w.course) ? w.course[0] : w.course;
              return (
                <tr key={w.id} className="border-t border-border align-top">
                  <td className="p-3 font-medium">{w.full_name}</td>
                  <td className="p-3">
                    <div className="text-xs">{w.email}</div>
                    {w.phone && <div className="text-xs text-foreground/60">{w.phone}</div>}
                  </td>
                  <td className="p-3 text-xs">
                    {w.business_name ?? "—"}
                    {w.business_sector && <div className="text-foreground/60">{w.business_sector}</div>}
                    {w.location && <div className="text-foreground/60">{w.location}</div>}
                  </td>
                  <td className="p-3 text-xs">{course?.title ?? w.course_interest ?? w.interest_area ?? "General"}</td>
                  <td className="p-3 text-xs">
                    {w.preferred_training_mode ?? "—"}
                    {w.main_challenge && <div className="mt-1 max-w-xs text-foreground/60">{w.main_challenge}</div>}
                  </td>
                  <td className="p-3 text-xs text-foreground/60">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="p-3 text-xs">
                    {w.emails_sent_at ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">Sent</span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-foreground/60">Not sent</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {data?.waitlist.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-foreground/60">No waitlist entries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
