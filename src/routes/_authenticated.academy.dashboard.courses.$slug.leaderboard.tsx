import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Award, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { getCourseLeaderboard, getMyBadgesAndPrefs, updateLeaderboardPrefs } from "@/lib/leaderboard.functions";

export const Route = createFileRoute("/_authenticated/academy/dashboard/courses/$slug/leaderboard")({
  head: () => ({ meta: [{ title: "Leaderboard · LoveTech Agro Academy" }] }),
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { slug } = Route.useParams();
  const qc = useQueryClient();
  const fetchBoard = useServerFn(getCourseLeaderboard);
  const fetchPrefs = useServerFn(getMyBadgesAndPrefs);
  const updatePrefs = useServerFn(updateLeaderboardPrefs);

  const board = useQuery({ queryKey: ["leaderboard", slug], queryFn: () => fetchBoard({ data: { slug, limit: 25 } }) });
  const prefs = useQuery({ queryKey: ["my-badges-prefs"], queryFn: () => fetchPrefs() });
  const [name, setName] = useState("");

  const savePrefs = useMutation({
    mutationFn: (payload: { leaderboard_opt_in?: boolean; display_name?: string }) => updatePrefs({ data: payload }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leaderboard", slug] });
      qc.invalidateQueries({ queryKey: ["my-badges-prefs"] });
    },
  });

  const profile = prefs.data?.profile;
  const optIn = profile?.leaderboard_opt_in !== false;

  return (
    <main className="bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-6 py-6 lg:px-8">
          <Link to="/academy/dashboard/courses/$slug/assessments" params={{ slug }} className="mb-2 inline-flex items-center gap-1 text-xs text-vetiver hover:underline"><ArrowLeft className="size-3" /> Assessments</Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ochre">Leaderboard</p>
              <h1 className="font-serif text-2xl text-vetiver md:text-3xl">{board.data?.course.title ?? "Course leaderboard"}</h1>
            </div>
            <Link to="/academy/dashboard/courses/$slug" params={{ slug }} className="text-sm text-vetiver hover:underline">← Back to course</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl gap-6 px-6 py-8 lg:grid-cols-[1fr_280px] lg:px-8">
        <section>
          {board.isLoading ? (
            <p className="text-sm text-foreground/60">Loading rankings…</p>
          ) : board.data?.entries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-foreground/60">No scores yet — be the first!</div>
          ) : (
            <ol className="overflow-hidden rounded-2xl border border-border bg-card">
              {board.data?.entries.map((e) => (
                <li key={e.rank} className={`flex items-center gap-4 border-b border-border px-5 py-4 last:border-b-0 ${e.is_me ? "bg-ochre/10" : ""}`}>
                  <div className={`grid size-10 shrink-0 place-items-center rounded-full font-serif text-lg ${e.rank <= 3 ? "bg-ochre text-ink" : "bg-muted text-foreground/70"}`}>
                    {e.rank <= 3 ? <Trophy className="size-5" /> : e.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-semibold text-vetiver">{e.display_name}</div>
                    <div className="text-xs text-foreground/60">{e.quiz_points} quiz · {e.assign_points} assignment · {e.badge_count} badges</div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl text-vetiver">{e.total_points}</div>
                    <div className="text-xs text-foreground/60">points</div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-vetiver"><Award className="size-4" /> Leaderboard settings</h3>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => savePrefs.mutate({ leaderboard_opt_in: e.target.checked })}
            />
            Show my name on leaderboards
          </label>
          <div className="mt-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-vetiver">Display name</label>
            <input
              type="text"
              defaultValue={profile?.display_name ?? profile?.full_name ?? ""}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
              className="w-full rounded-md border border-border bg-background p-2 text-sm"
              placeholder="How your name appears"
            />
            <button
              onClick={() => name.trim() && savePrefs.mutate({ display_name: name.trim() })}
              disabled={savePrefs.isPending}
              className="mt-2 w-full rounded-sm bg-vetiver px-3 py-2 text-xs font-semibold text-bone disabled:opacity-50"
            >
              Save name
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
