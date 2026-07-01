import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listEnrolmentsAdmin, updateEnrolmentAccess } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/enrolments")({
  component: EnrolmentsAdmin,
});

function EnrolmentsAdmin() {
  const list = useServerFn(listEnrolmentsAdmin);
  const update = useServerFn(updateEnrolmentAccess);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-enrolments"], queryFn: () => list() });
  const mutate = useMutation({
    mutationFn: (p: { id: string; access_status?: "active" | "inactive" | "revoked"; payment_status?: "paid" | "pending_payment" }) =>
      update({ data: p }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-enrolments"] }),
  });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
          <tr>
            <th className="p-3">Learner</th>
            <th className="p-3">Course</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Access</th>
            <th className="p-3">Date</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.enrolments.map((e: any) => {
            const course = Array.isArray(e.course) ? e.course[0] : e.course;
            return (
              <tr key={e.id} className="border-t border-border">
                <td className="p-3">
                  <div className="font-medium text-vetiver">{e.full_name}</div>
                  <div className="text-xs text-foreground/60">{e.email}</div>
                  {e.phone && <div className="text-xs text-foreground/60">{e.phone}</div>}
                </td>
                <td className="p-3">{course?.title ?? "—"}</td>
                <td className="p-3"><Badge label={e.payment_status} ok={e.payment_status === "paid"} /></td>
                <td className="p-3"><Badge label={e.access_status} ok={e.access_status === "active"} /></td>
                <td className="p-3 text-xs text-foreground/60">{new Date(e.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-2">
                    {e.access_status !== "active" ? (
                      <button
                        onClick={() => mutate.mutate({ id: e.id, access_status: "active", payment_status: "paid" })}
                        className="rounded-sm bg-vetiver px-3 py-1 text-xs font-semibold text-bone"
                      >Activate</button>
                    ) : (
                      <button
                        onClick={() => mutate.mutate({ id: e.id, access_status: "revoked" })}
                        className="rounded-sm border border-border px-3 py-1 text-xs font-semibold"
                      >Revoke</button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          {data?.enrolments.length === 0 && (
            <tr><td colSpan={6} className="p-6 text-center text-foreground/60">No enrolments yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ label, ok }: { label: string; ok: boolean }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${ok ? "bg-vetiver/10 text-vetiver" : "bg-muted text-foreground/60"}`}>{label?.replaceAll("_", " ")}</span>;
}
