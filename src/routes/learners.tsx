import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { listPublicLearners } from "@/lib/profiles-public.functions";

const learnersQuery = queryOptions({
  queryKey: ["public-learners"],
  queryFn: () => listPublicLearners(),
});

export const Route = createFileRoute("/learners")({
  head: () => ({
    meta: [
      { title: "Learner directory · LoveTech Agro Academy" },
      { name: "description", content: "Meet learners and entrepreneurs building better businesses through LoveTech Agro Academy." },
      { property: "og:title", content: "Learner directory · LoveTech Agro Academy" },
      { property: "og:description", content: "Meet learners and entrepreneurs building better businesses through LoveTech Agro Academy." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(learnersQuery),
  component: LearnersPage,
  errorComponent: ({ error }) => <div role="alert" className="p-8 text-center text-red-600">{error.message}</div>,
  notFoundComponent: () => <div className="p-8 text-center">No learners found.</div>,
});

function LearnersPage() {
  const { data: learners } = useSuspenseQuery(learnersQuery);
  return (
    <main>
      <section className="bg-ink px-6 py-20 text-bone lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Community</p>
          <h1 className="font-serif text-5xl">Meet our learners</h1>
          <p className="mt-4 max-w-2xl text-bone/70">Entrepreneurs, professionals and value-chain actors building smarter Nigerian businesses.</p>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {learners.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Users className="mx-auto mb-3 size-8 text-vetiver" />
              <p className="text-sm text-foreground/60">No public profiles yet. Learners appear here after they opt in from their profile settings.</p>
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {learners.map((l) => (
                <li key={l.public_slug} className="group rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-lg">
                  <Link to="/learners/$slug" params={{ slug: l.public_slug! }} className="flex items-start gap-4">
                    {l.avatar_url ? (
                      <img src={l.avatar_url} alt="" className="size-14 rounded-full object-cover" />
                    ) : (
                      <div className="grid size-14 place-items-center rounded-full bg-vetiver/10 font-serif text-xl text-vetiver">{(l.full_name ?? "?").slice(0, 1)}</div>
                    )}
                    <div>
                      <h2 className="font-serif text-lg text-vetiver group-hover:underline">{l.full_name}</h2>
                      {l.headline && <p className="mt-1 text-sm text-foreground/70">{l.headline}</p>}
                      {l.location && <p className="mt-1 text-xs text-foreground/50">{l.location}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
