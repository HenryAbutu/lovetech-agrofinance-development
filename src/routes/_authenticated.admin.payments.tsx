import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listPaymentsAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/payments")({
  component: PaymentsAdmin,
});

function PaymentsAdmin() {
  const list = useServerFn(listPaymentsAdmin);
  const { data, isLoading } = useQuery({ queryKey: ["admin-payments"], queryFn: () => list() });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
          <tr>
            <th className="p-3">Email</th>
            <th className="p-3">Course</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Reference</th>
            <th className="p-3">Paid</th>
          </tr>
        </thead>
        <tbody>
          {data?.payments.map((p: any) => {
            const course = Array.isArray(p.course) ? p.course[0] : p.course;
            return (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">{p.user_email}</td>
                <td className="p-3">{course?.title ?? "—"}</td>
                <td className="p-3 font-mono">{p.currency} {Number(p.amount).toLocaleString()}</td>
                <td className="p-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${p.status === "success" ? "bg-vetiver/10 text-vetiver" : "bg-muted text-foreground/60"}`}>{p.status}</span>
                </td>
                <td className="p-3 font-mono text-xs">{p.paystack_reference ?? "—"}</td>
                <td className="p-3 text-xs text-foreground/60">{p.paid_at ? new Date(p.paid_at).toLocaleDateString() : "—"}</td>
              </tr>
            );
          })}
          {data?.payments.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-foreground/60">No payments recorded.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
