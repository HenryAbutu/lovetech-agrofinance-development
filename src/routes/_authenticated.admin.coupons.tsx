import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Copy, Check } from "lucide-react";
import { listCouponsAdmin, upsertCouponAdmin, deleteCouponAdmin, listReferralsAdmin } from "@/lib/admin-coupons.functions";
import { listCoursesAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/coupons")({
  head: () => ({ meta: [{ title: "Coupons — Admin" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const listCoupons = useServerFn(listCouponsAdmin);
  const listCourses = useServerFn(listCoursesAdmin);
  const listRefs = useServerFn(listReferralsAdmin);
  const upsert = useServerFn(upsertCouponAdmin);
  const del = useServerFn(deleteCouponAdmin);

  const coupons = useQuery({ queryKey: ["admin-coupons"], queryFn: () => listCoupons() });
  const courses = useQuery({ queryKey: ["admin-courses-min"], queryFn: () => listCourses() });
  const referrals = useQuery({ queryKey: ["admin-referrals"], queryFn: () => listRefs() });

  const [copied, setCopied] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setErr("");
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const payload: Record<string, unknown> = {
      code: raw.code,
      kind: raw.kind,
      value: raw.value,
      active: true,
    };
    if (raw.max_uses) payload.max_uses = raw.max_uses;
    if (raw.expires_at) payload.expires_at = new Date(raw.expires_at).toISOString();
    if (raw.course_id) payload.course_id = raw.course_id;
    if (raw.min_amount) payload.min_amount = raw.min_amount;
    if (raw.notes) payload.notes = raw.notes;
    try {
      await upsert({ data: payload as never });
      (e.currentTarget as HTMLFormElement).reset();
      qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Failed to save");
    } finally { setSaving(false); }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this coupon?")) return;
    await del({ data: { id } });
    qc.invalidateQueries({ queryKey: ["admin-coupons"] });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl text-vetiver">Create coupon</h2>
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="text-xs font-medium text-foreground/70">Code
            <input name="code" required maxLength={60} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm uppercase" placeholder="LAUNCH50" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-foreground/70">Type
              <select name="kind" required className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                <option value="percent">Percent %</option>
                <option value="fixed">Fixed ₦</option>
              </select>
            </label>
            <label className="text-xs font-medium text-foreground/70">Value
              <input name="value" type="number" min={0} step="0.01" required className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-foreground/70">Max uses
              <input name="max_uses" type="number" min={1} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="unlimited" />
            </label>
            <label className="text-xs font-medium text-foreground/70">Expires at
              <input name="expires_at" type="datetime-local" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
            </label>
          </div>
          <label className="text-xs font-medium text-foreground/70">Restrict to course (optional)
            <select name="course_id" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">Any course</option>
              {courses.data?.courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
          <label className="text-xs font-medium text-foreground/70">Minimum order (₦)
            <input name="min_amount" type="number" min={0} step="0.01" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="text-xs font-medium text-foreground/70">Notes
            <input name="notes" maxLength={500} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </label>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button disabled={saving} className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-60">
            <Plus className="size-4" /> {saving ? "Saving…" : "Add coupon"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 font-serif text-xl text-vetiver">Active coupons</h2>
        <div className="grid gap-3">
          {coupons.data?.coupons.map((c) => {
            const course = Array.isArray(c.course) ? c.course[0] : c.course;
            return (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-base font-semibold text-vetiver">{c.code}</p>
                    <button onClick={() => { navigator.clipboard?.writeText(c.code); setCopied(c.id); setTimeout(() => setCopied(null), 1200); }} className="text-foreground/40 hover:text-foreground">
                      {copied === c.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </button>
                    {c.source === "referral" && <span className="rounded-full bg-ochre/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ochre">referral reward</span>}
                  </div>
                  <p className="text-xs text-foreground/60">
                    {c.kind === "percent" ? `${c.value}% off` : `₦${Number(c.value).toLocaleString()} off`}
                    {course?.title && ` · ${course.title}`}
                    {` · ${c.used_count ?? 0}${c.max_uses ? "/" + c.max_uses : ""} used`}
                    {c.expires_at && ` · until ${new Date(c.expires_at).toLocaleDateString()}`}
                  </p>
                </div>
                <button onClick={() => onDelete(c.id)} className="text-destructive/70 hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
            );
          })}
          {coupons.data?.coupons.length === 0 && (
            <p className="rounded-md border border-dashed border-border p-6 text-center text-sm text-foreground/50">No coupons yet.</p>
          )}
        </div>

        <h2 className="mb-4 mt-10 font-serif text-xl text-vetiver">Recent referrals</h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background/50 text-xs uppercase tracking-wider text-foreground/50">
              <tr><th className="px-4 py-2 text-left">Date</th><th className="px-4 py-2 text-left">Code</th><th className="px-4 py-2 text-left">Status</th><th className="px-4 py-2 text-left">Reward</th></tr>
            </thead>
            <tbody>
              {referrals.data?.referrals.map((r) => (
                <tr key={r.id} className="border-b border-border/50">
                  <td className="px-4 py-2 text-foreground/70">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-mono text-vetiver">{r.referral_code}</td>
                  <td className="px-4 py-2"><span className="rounded-full bg-muted px-2 py-0.5 text-xs uppercase tracking-wider">{r.status}</span></td>
                  <td className="px-4 py-2 text-foreground/60">{r.reward_coupon_id ? "issued" : "—"}</td>
                </tr>
              ))}
              {referrals.data?.referrals.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-foreground/50">No referrals yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
