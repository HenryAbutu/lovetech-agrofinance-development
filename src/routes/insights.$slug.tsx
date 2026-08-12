import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPublishedPost } from "@/lib/blog.functions";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["insights", "post", slug],
    queryFn: () => getPublishedPost({ data: { slug } }),
  });

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ context, params }) => {
    const res = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!res.post) throw notFound();
    return res;
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    const title = p ? `${p.title} — LoveTech Group Insights` : "Insights — LoveTech Group";
    const description = p?.excerpt ?? "Practical insights for Nigerian businesses from LoveTech Group.";
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description.slice(0, 158) },
      { property: "og:title", content: p?.title ?? "LoveTech Group Insights" },
      { property: "og:description", content: description.slice(0, 158) },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (p?.featured_image?.startsWith("https://")) {
      meta.push({ property: "og:image", content: p.featured_image });
      meta.push({ name: "twitter:image", content: p.featured_image });
    }
    return { meta };
  },
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy">This article couldn't be loaded</h1>
      <Link to="/insights" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal">Back to Insights</Link>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy">Article not found</h1>
      <p className="mt-3 text-foreground/70">It may have been unpublished or moved.</p>
      <Link to="/insights" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal">Back to Insights <ArrowRight className="size-4" /></Link>
    </main>
  ),
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQuery(slug));
  const post = data.post!;
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <main className="bg-white">
      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <Link to="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
          <ArrowLeft className="size-4" /> All insights
        </Link>
        {post.category && (
          <p className="mt-6 inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">
            {post.category}
          </p>
        )}
        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight text-navy md:text-4xl">{post.title}</h1>
        {date && <p className="mt-3 text-sm text-muted-foreground">{date}</p>}
        {post.excerpt && <p className="mt-6 text-lg text-foreground/75">{post.excerpt}</p>}
        {post.featured_image && (
          <img src={post.featured_image} alt={post.title} className="mt-8 w-full rounded-2xl object-cover shadow-md" loading="lazy" />
        )}
        <div className="mt-8 space-y-5 text-foreground/80">
          {(post.body ?? "").split(/\n{2,}/).filter(Boolean).map((para, i) => (
            <p key={i} className="whitespace-pre-wrap leading-relaxed">{para}</p>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-border bg-cloud p-8">
          <h2 className="font-serif text-xl font-bold text-navy">Need practical support for your business?</h2>
          <p className="mt-2 text-sm text-foreground/70">Our advisory team helps Nigerian businesses get structured, finance-ready and digitally efficient.</p>
          <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">
            Book a consultation <ArrowRight className="size-4" />
          </Link>
        </div>
      </article>
    </main>
  );
}
