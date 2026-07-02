import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { Award, ExternalLink, MapPin } from "lucide-react";
import { getPublicProfile } from "@/lib/profiles-public.functions";

const profileQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public-profile", slug],
    queryFn: () => getPublicProfile({ data: { slug } }),
  });

export const Route = createFileRoute("/learners/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData?.profile;
    const title = p ? `${p.full_name} · LoveTech Agro Academy` : "Learner · LoveTech Agro Academy";
    const desc = p?.headline ?? p?.bio?.slice(0, 160) ?? "LoveTech Agro Academy learner profile.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(p?.avatar_url ? [{ property: "og:image", content: p.avatar_url }, { name: "twitter:image", content: p.avatar_url }] : []),
      ],
    };
  },
  loader: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(profileQuery(params.slug));
    if (!data.profile) throw notFound();
    return data;
  },
  component: PublicProfilePage,
  errorComponent: ({ error }) => <div role="alert" className="p-8 text-center text-red-600">{error.message}</div>,
  notFoundComponent: () => (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-vetiver">Profile not found</h1>
      <p className="mt-3 text-sm text-foreground/60">This learner profile is private or doesn't exist.</p>
      <Link to="/learners" className="mt-6 inline-flex rounded-sm bg-vetiver px-5 py-2 text-sm font-semibold text-bone">Browse learners</Link>
    </main>
  ),
});

function PublicProfilePage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(profileQuery(slug));
  const p = data.profile!;
  return (
    <main>
      <section className="bg-ink px-6 py-16 text-bone lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 sm:flex-row sm:items-center">
          {p.avatar_url ? (
            <img src={p.avatar_url} alt="" className="size-24 rounded-full object-cover ring-2 ring-ochre/40" />
          ) : (
            <div className="grid size-24 place-items-center rounded-full bg-bone/10 font-serif text-4xl text-ochre">{p.full_name?.slice(0, 1)}</div>
          )}
          <div>
            <h1 className="font-serif text-4xl">{p.full_name}</h1>
            {p.headline && <p className="mt-1 text-bone/80">{p.headline}</p>}
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-bone/60">
              {p.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {p.location}</span>}
              {p.website_url && (
                <a href={p.website_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 hover:text-ochre">
                  <ExternalLink className="size-3.5" /> Website
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-3 font-serif text-2xl text-vetiver">About</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{p.bio ?? "No bio yet."}</p>
          </div>
          <aside className="space-y-6">
            {data.certificates.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-vetiver"><Award className="size-4" /> Certificates</h3>
                <ul className="space-y-2 text-sm">
                  {data.certificates.map((c) => (
                    <li key={c.id} className="rounded-md border border-border bg-card p-3">
                      <p className="font-semibold text-vetiver">{c.course?.title ?? "Course"}</p>
                      <p className="text-xs text-foreground/50">Issued {c.issued_at ? new Date(c.issued_at).toLocaleDateString() : ""}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.badges.length > 0 && (
              <div>
                <h3 className="mb-3 font-serif text-lg text-vetiver">Badges</h3>
                <ul className="flex flex-wrap gap-2">
                  {data.badges.map((b, i) => b.badge && (
                    <li key={i} className="rounded-full bg-ochre/15 px-3 py-1 text-xs font-semibold text-ochre">{b.badge.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
