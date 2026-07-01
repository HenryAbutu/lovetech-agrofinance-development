import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Gift, Share2, Users, Check } from "lucide-react";
import { getMyReferralInfo } from "@/lib/referrals.functions";

export const Route = createFileRoute("/_authenticated/academy/referrals")({
  head: () => ({ meta: [{ title: "Refer & Earn — LoveTech Agro Academy" }] }),
  component: Page,
});

function Page() {
  const fn = useServerFn(getMyReferralInfo);
  const { data, isLoading } = useQuery({ queryKey: ["referrals-info"], queryFn: () => fn() });
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  if (isLoading || !data) {
    return <main className="grid min-h-[60vh] place-items-center text-sm text-foreground/60">Loading…</main>;
  }

  const code = data.referral_code ?? "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const shareLink = `${origin}/academy/courses/professionals-ai-edge?ref=${code}`;

  async function copy(kind: "link" | "code", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1600);
    } catch {}
  }

  return (
    <main className="px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Refer & Earn</p>
        <h1 className="font-serif text-4xl text-vetiver md:text-5xl">Bring a friend, earn 20% off</h1>
        <p className="mt-2 max-w-2xl text-foreground/70">Share your personal link. When a friend pays for a course, you automatically receive a 20% discount coupon on your next enrolment. Valid for 90 days.</p>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2 text-vetiver"><Share2 className="size-5 text-ochre" /><h2 className="font-serif text-xl">Your referral link</h2></div>
            <div className="rounded-md border border-border bg-background p-3 font-mono text-sm break-all">{shareLink}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => copy("link", shareLink)} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone">
                {copied === "link" ? <><Check className="size-4" /> Copied</> : <><Copy className="size-4" /> Copy link</>}
              </button>
              <button onClick={() => copy("code", code)} className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-4 py-2 text-sm font-semibold text-vetiver">
                {copied === "code" ? <><Check className="size-4" /> Copied</> : <><Copy className="size-4" /> Code: {code}</>}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-2 text-vetiver"><Users className="size-5 text-ochre" /><h2 className="font-serif text-xl">Your progress</h2></div>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs uppercase tracking-wider text-foreground/50">Total referrals</dt>
                <dd className="mt-1 font-serif text-3xl text-vetiver">{data.referral_count}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-foreground/50">Converted</dt>
                <dd className="mt-1 font-serif text-3xl text-vetiver">{data.converted_count}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2 text-vetiver"><Gift className="size-5 text-ochre" /><h2 className="font-serif text-2xl">My reward coupons</h2></div>
          {data.coupons.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-foreground/60">
              No coupons yet. Share your link — you'll receive a coupon here when a friend enrols.
            </div>
          ) : (
            <div className="grid gap-3">
              {data.coupons.map((c) => {
                const usedUp = c.max_uses !== null && (c.used_count ?? 0) >= c.max_uses;
                const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
                const dead = !c.active || usedUp || expired;
                return (
                  <div key={c.id} className={`flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 ${dead ? "opacity-60" : ""}`}>
                    <div>
                      <p className="font-mono text-lg font-semibold text-vetiver">{c.code}</p>
                      <p className="text-xs text-foreground/60">{c.kind === "percent" ? `${c.value}% off` : `₦${Number(c.value).toLocaleString()} off`}{c.expires_at && ` · expires ${new Date(c.expires_at).toLocaleDateString()}`}</p>
                      {c.notes && <p className="mt-1 text-xs text-foreground/50">{c.notes}</p>}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${dead ? "bg-muted text-foreground/50" : "bg-vetiver/10 text-vetiver"}`}>
                      {expired ? "Expired" : usedUp ? "Used" : "Available"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-10">
          <Link to="/academy/dashboard" className="text-sm text-vetiver underline">← Back to dashboard</Link>
        </div>
      </div>
    </main>
  );
}
