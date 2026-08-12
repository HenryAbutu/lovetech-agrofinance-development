import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listRubyChaiOrders, updateRubyChaiOrderStatus } from "@/lib/rubychai.functions";

export const Route = createFileRoute("/_authenticated/admin/ruby-chai")({
  component: RubyChaiOrdersAdmin,
});

const statuses = ["new", "confirmed", "delivered", "cancelled"] as const;

function RubyChaiOrdersAdmin() {
  const list = useServerFn(listRubyChaiOrders);
  const update = useServerFn(updateRubyChaiOrderStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-rubychai"], queryFn: () => list() });

  const mutate = useMutation({
    mutationFn: (vars: { id: string; status: (typeof statuses)[number] }) => update({ data: vars }),
    onSuccess: () => {
      toast.success("Order updated");
      qc.invalidateQueries({ queryKey: ["admin-rubychai"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
          <tr>
            <th className="p-3">Customer</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Items</th>
            <th className="p-3">Total</th>
            <th className="p-3">Delivery</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.orders.map((o) => (
            <tr key={o.id} className="border-t border-border align-top">
              <td className="p-3 font-medium">
                {o.full_name}
                <div className="text-xs text-foreground/60">{new Date(o.created_at).toLocaleString()}</div>
              </td>
              <td className="p-3 text-xs">
                <div>{o.email}</div>
                <div className="text-foreground/60">{o.phone}</div>
              </td>
              <td className="p-3 text-xs">
                {(o.items ?? []).map((i: any, idx: number) => (
                  <div key={idx}>{i.quantity} × {i.name}</div>
                ))}
              </td>
              <td className="p-3 text-xs font-semibold">₦{Number(o.estimated_total ?? 0).toLocaleString()}</td>
              <td className="p-3 max-w-[220px] text-xs text-foreground/70">
                {o.city ?? "—"}
                <div>{o.delivery_address ?? ""}</div>
                {o.notes && <div className="mt-1 italic">{o.notes}</div>}
              </td>
              <td className="p-3">
                <select
                  value={o.status}
                  onChange={(e) => mutate.mutate({ id: o.id, status: e.target.value as (typeof statuses)[number] })}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {data?.orders.length === 0 && (
            <tr><td colSpan={6} className="p-6 text-center text-foreground/60">No orders yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
