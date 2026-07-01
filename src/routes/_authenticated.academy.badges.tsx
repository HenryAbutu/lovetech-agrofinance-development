import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getMyBadgesAndPrefs } from "@/lib/leaderboard.functions";

export const Route = createFileRoute("/_authenticated/academy/badges")({
  head: () => ({ meta: [{ title: "My Badges · LoveTech Agro Academy" }] }),
  component: BadgesPage,
});

function toPascal(s: string) {
  return s.split("-").map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
}

function BadgesPage() {
  const fetchFn = useServerFn(getMyBadgesAndPrefs);
  const { data, isLoading } = useQuery({ queryKey: ["my-badges-prefs"], queryFn: () => fetchFn() });

  if (isLoading) return <main className="grid min-h-[50vh] place-items-center text-sm text-foreground/60">Loading…</main>;
  const awardedSet = new Set((data?.awards ?? []).map((a) => a.badge_id));

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ochre">Achievements</p>
          <h1 className="font-serif text-3xl text-vetiver md:text-4xl">Your Badges</h1>
          <p className="mt-2 text-sm text-foreground/70">Earn badges by learning, submitting work and passing assessments.</p>
        </div>
        <Link to="/academy/dashboard" className="text-sm text-vetiver hover:underline">← My Academy</Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.badges ?? []).map((b) => {
          const earned = awardedSet.has(b.id);
          const IconCandidate = (Icons as unknown as Record<string, LucideIcon>)[toPascal(b.icon)];
          const Icon = IconCandidate ?? Icons.Award;
          return (
            <div key={b.id} className={`rounded-2xl border p-6 transition-opacity ${earned ? "border-ochre/40 bg-card" : "border-dashed border-border bg-muted/30 opacity-60"}`}>
              <div className="mb-3 grid size-14 place-items-center rounded-full" style={{ backgroundColor: earned ? b.color : "transparent", border: earned ? "none" : "2px dashed var(--border)" }}>
                <Icon className={`size-7 ${earned ? "text-white" : "text-foreground/40"}`} />
              </div>
              <h3 className="font-serif text-lg text-vetiver">{b.name}</h3>
              <p className="mt-1 text-sm text-foreground/70">{b.description}</p>
              <p className={`mt-3 text-xs font-semibold uppercase tracking-wider ${earned ? "text-ochre" : "text-foreground/50"}`}>
                {earned ? "Earned" : "Locked"}
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
