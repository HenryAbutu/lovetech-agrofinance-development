import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { listUsersAdmin, setUserDisabled, setUserRole, ROLES, type AppRole } from "@/lib/user-roles.functions";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Users — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: UsersAdmin,
});

const LABEL: Record<AppRole, string> = { learner: "Learner", facilitator: "Facilitator", admin: "Admin", super_admin: "Super admin" };
const fmt = (d: string | null) => (d ? new Date(d).toLocaleString() : "—");

function UsersAdmin() {
  const list = useServerFn(listUsersAdmin);
  const changeRole = useServerFn(setUserRole);
  const changeDisabled = useServerFn(setUserDisabled);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["admin-users"], queryFn: () => list() });

  const roleMut = useMutation({
    mutationFn: (v: { userId: string; role: AppRole }) => changeRole({ data: v }),
    onSuccess: (_d, v) => { toast.success(`Role changed to ${LABEL[v.role]}.`); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const disableMut = useMutation({
    mutationFn: (v: { userId: string; disabled: boolean }) => changeDisabled({ data: v }),
    onSuccess: (_d, v) => { toast.success(v.disabled ? "Access disabled." : "Access restored."); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  const busy = roleMut.isPending || disableMut.isPending;

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[1100px] text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
          <tr>
            <th className="p-3">Full name</th><th className="p-3">Email</th><th className="p-3">Login method</th>
            <th className="p-3">Role</th><th className="p-3">Joined</th><th className="p-3">Last login</th>
            <th className="p-3">Status</th><th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map((u) => (
            <tr key={u.id} className="border-t border-border align-top">
              <td className="p-3 font-medium text-vetiver">{u.full_name ?? "—"}</td>
              <td className="p-3 text-xs">{u.email}</td>
              <td className="p-3 text-xs capitalize">{u.login_methods.join(", ")}</td>
              <td className="p-3">
                <select
                  aria-label={`Role for ${u.email}`}
                  disabled={busy}
                  value={u.role}
                  onChange={(e) => roleMut.mutate({ userId: u.id, role: e.target.value as AppRole })}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{LABEL[r]}</option>)}
                </select>
              </td>
              <td className="p-3 text-xs text-foreground/60">{new Date(u.created_at).toLocaleDateString()}</td>
              <td className="p-3 text-xs text-foreground/60">{fmt(u.last_sign_in_at)}</td>
              <td className="p-3 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${u.status === "disabled" ? "bg-destructive/10 text-destructive" : u.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-foreground/70"}`}>{u.status}</span>
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {ROLES.filter((r) => r !== u.role).map((r) => (
                    <button key={r} disabled={busy} onClick={() => roleMut.mutate({ userId: u.id, role: r })}
                      className="rounded border border-border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50">Make {LABEL[r].toLowerCase()}</button>
                  ))}
                  <button disabled={busy}
                    onClick={() => { if (u.status === "disabled" || confirm(`Disable access for ${u.email}?`)) disableMut.mutate({ userId: u.id, disabled: u.status !== "disabled" }); }}
                    className="rounded border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50">
                    {u.status === "disabled" ? "Restore access" : "Disable access"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
