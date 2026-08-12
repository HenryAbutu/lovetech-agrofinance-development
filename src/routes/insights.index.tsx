import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Newspaper } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";

const postsQuery = queryOptions({
  queryKey: ["insights", "published"],
  queryFn: () => listPublishedPosts(),
});

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights — LoveTech Group" },
      { name: "description", content: "Practical updates, opportunities and analysis for Nigerian MSMEs, agribusinesses, entrepreneurs, cooperatives and development actors." },
      { property: "og:title", content: "LoveTech Group Insights" },
      { property: "og:description", content: "Funding opportunities, finance readiness, AI, agribusiness, hospitality and wellness insights from LoveTech Group." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy">Insights are unavailable right now</h1>
      <p className="mt-3 text-foreground/70">Please refresh in a moment.</p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy">Not found</h1>
    </main>
  ),
  component: InsightsPage,
});

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "";

function InsightsPage() {
  const { data } = useSuspenseQuery(postsQuery);
  const posts = data.posts;
  const [filter, setFilter] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => !!c)))],
    [posts],
  );
  const featured = posts[0];
  const rest = posts.slice(1).filter((p) => filter === "All" || p.category === filter);

  return (
    <main className="bg-white">
      <section className="border-b border-border bg-gradient-to-br from-cloud via-white to-white px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal">
            <Newspaper className="size-3.5" /> Insights
          </p>
          <h1 className="font-serif text-4xl font-bold text-navy md:text-5xl">Insights from LoveTech Group</h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/70">
            Practical updates, opportunities and analysis for Nigerian MSMEs, agribusinesses, entrepreneurs, cooperatives and development actors.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-cloud p-10 text-center">
            <h2 className="font-serif text-2xl font-bold text-navy">New articles are on the way</h2>
            <p className="mt-3 text-foreground/70">
              We're preparing our first published pieces on finance readiness, funding opportunities and practical AI for Nigerian businesses.
            </p>
            <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">
              Talk to our team <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {featured && (
              <Link
                to="/insights/$slug"
                params={{ slug: featured.slug }}
                className="group grid gap-6 overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-lg md:grid-cols-2"
              >
                {featured.featured_image ? (
                  <img src={featured.featured_image} alt={featured.title} loading="lazy" className="h-full min-h-56 w-full object-cover" />
                ) : (
                  <div className="min-h-56 bg-navy/90" />
                )}
                <div className="p-7">
                  <span className="rounded-full bg-gold/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
                    {featured.category ?? "Featured"}
                  </span>
                  <h2 className="mt-4 font-serif text-2xl font-bold text-navy group-hover:text-teal md:text-3xl">{featured.title}</h2>
                  <p className="mt-3 text-foreground/70">{featured.excerpt}</p>
                  <p className="mt-5 text-xs text-muted-foreground">{fmt(featured.published_at)}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal">Read article <ArrowRight className="size-4" /></span>
                </div>
              </Link>
            )}

            {categories.length > 1 && (
              <div className="mt-12 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      filter === c ? "border-teal bg-teal text-white" : "border-border bg-white text-foreground/70 hover:border-teal/40"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <Link
                  key={p.id}
                  to="/insights/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="self-start rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-teal">
                    {p.category ?? "Insight"}
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-navy group-hover:text-teal">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-foreground/70">{p.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground">{fmt(p.published_at)}</p>
                </Link>
              ))}
            </div>
            {rest.length === 0 && featured && (
              <p className="mt-8 text-sm text-foreground/60">No other articles in this category yet.</p>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
