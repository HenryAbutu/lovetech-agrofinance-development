import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listHouse8Bookings, updateHouse8BookingStatus } from "@/lib/house8.functions";

export const Route = createFileRoute("/_authenticated/admin/house-8")({
  component: House8BookingsAdmin,
});

const statuses = ["new", "contacted", "confirmed", "closed"] as const;

function House8BookingsAdmin() {
  const list = useServerFn(listHouse8Bookings);
  const update = useServerFn(updateHouse8BookingStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-house8"], queryFn: () => list() });

  const mutate = useMutation({
    mutationFn: (vars: { id: string; status: (typeof statuses)[number] }) => update({ data: vars }),
    onSuccess: () => {
      toast.success("Booking updated");
      qc.invalidateQueries({ queryKey: ["admin-house8"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Update failed"),
  });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
          <tr>
            <th className="p-3">Guest</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Stay</th>
            <th className="p-3">Room</th>
            <th className="p-3">Notes</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.bookings.map((b) => (
            <tr key={b.id} className="border-t border-border align-top">
              <td className="p-3 font-medium">
                {b.full_name}
                <div className="text-xs text-foreground/60">{new Date(b.created_at).toLocaleString()}</div>
              </td>
              <td className="p-3 text-xs">
                <div>{b.email}</div>
                <div className="text-foreground/60">{b.phone}</div>
              </td>
              <td className="p-3 text-xs">
                {b.check_in ?? "—"} → {b.check_out ?? "—"}
                <div className="text-foreground/60">{b.guests ? `${b.guests} guest(s)` : ""} {b.purpose ?? ""}</div>
              </td>
              <td className="p-3 text-xs">{b.room ?? b.apartment_type ?? "—"}</td>
              <td className="p-3 max-w-[240px] text-xs text-foreground/70">{b.notes ?? "—"}</td>
              <td className="p-3">
                <select
                  value={b.status}
                  onChange={(e) => mutate.mutate({ id: b.id, status: e.target.value as (typeof statuses)[number] })}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {data?.bookings.length === 0 && (
            <tr><td colSpan={6} className="p-6 text-center text-foreground/60">No booking enquiries yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
