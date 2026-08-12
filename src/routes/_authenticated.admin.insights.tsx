import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Trash2, ExternalLink } from "lucide-react";
import { listAllPosts, savePost, deletePost } from "@/lib/blog.functions";
import { BLOG_CATEGORIES } from "@/lib/blog.types";
import type { BlogPost } from "@/lib/blog.types";

export const Route = createFileRoute("/_authenticated/admin/insights")({
  head: () => ({ meta: [{ title: "Insights — Admin" }] }),
  component: AdminInsights,
});

type Draft = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  featured_image: string;
  status: "draft" | "published" | "archived";
};

const empty: Draft = { title: "", slug: "", category: "", excerpt: "", body: "", featured_image: "", status: "draft" };

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 90);

function AdminInsights() {
  const fetchAll = useServerFn(listAllPosts);
  const save = useServerFn(savePost);
  const remove = useServerFn(deletePost);
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);

  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: () => fetchAll() });

  const saveMutation = useMutation({
    mutationFn: (d: Draft) =>
      save({
        data: {
          id: d.id ?? null,
          title: d.title,
          slug: d.slug || slugify(d.title),
          category: d.category || null,
          excerpt: d.excerpt || null,
          body: d.body || null,
          featured_image: d.featured_image || null,
          status: d.status,
        } as never,
      }),
    onSuccess: () => {
      toast.success("Article saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["insights"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } as never }),
    onSuccess: () => {
      toast.success("Article deleted");
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["insights"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not delete"),
  });

  const field = "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-teal";
  const label = "text-xs font-semibold uppercase tracking-wide text-foreground/60";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy">Insights articles</h2>
          <p className="mt-1 text-sm text-foreground/65">Write, publish and manage articles shown on the public Insights page.</p>
        </div>
        <button
          type="button"
          onClick={() => setDraft({ ...empty })}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
        >
          <Plus className="size-4" /> New article
        </button>
      </div>

      {draft && (
        <form
          className="grid gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(draft);
          }}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className={label} htmlFor="p-title">Title</label>
              <input
                id="p-title"
                required
                className={field}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: draft.id ? draft.slug : slugify(e.target.value) })}
              />
            </div>
            <div>
              <label className={label} htmlFor="p-slug">URL slug</label>
              <input id="p-slug" required className={field} value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })} />
            </div>
            <div>
              <label className={label} htmlFor="p-cat">Category</label>
              <select id="p-cat" className={field} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                <option value="">Select…</option>
                {BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="p-status">Status</label>
              <select
                id="p-status"
                className={field}
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as Draft["status"] })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={label} htmlFor="p-img">Featured image URL (optional)</label>
              <input id="p-img" className={field} value={draft.featured_image} onChange={(e) => setDraft({ ...draft, featured_image: e.target.value })} placeholder="https://…" />
            </div>
            <div className="md:col-span-2">
              <label className={label} htmlFor="p-exc">Excerpt</label>
              <textarea id="p-exc" rows={2} maxLength={600} className={field} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className={label} htmlFor="p-body">Body (blank line between paragraphs)</label>
              <textarea id="p-body" rows={14} className={field} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
            >
              <Save className="size-4" /> {saveMutation.isPending ? "Saving…" : "Save article"}
            </button>
            <button type="button" onClick={() => setDraft(null)} className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:bg-cloud">
              Cancel
            </button>
          </div>
        </form>
      )}

      {posts.isLoading ? (
        <p className="text-sm text-foreground/60">Loading articles…</p>
      ) : posts.error ? (
        <p className="text-sm text-destructive">{posts.error instanceof Error ? posts.error.message : "Could not load articles"}</p>
      ) : (posts.data?.posts.length ?? 0) === 0 ? (
        <p className="text-sm text-foreground/60">No articles yet. Create your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-cloud text-xs uppercase tracking-wide text-foreground/60">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.data!.posts.map((p: BlogPost) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-navy">{p.title}</td>
                  <td className="px-4 py-3 text-foreground/70">{p.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase ${p.status === "published" ? "bg-teal/10 text-teal" : "bg-gold/20 text-navy"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString("en-NG") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {p.status === "published" && (
                        <a href={`/insights/${p.slug}`} target="_blank" rel="noreferrer" className="rounded-md border border-border p-2 hover:bg-cloud" aria-label={`View ${p.title}`}>
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setDraft({
                            id: p.id,
                            title: p.title,
                            slug: p.slug,
                            category: p.category ?? "",
                            excerpt: p.excerpt ?? "",
                            body: p.body ?? "",
                            featured_image: p.featured_image ?? "",
                            status: p.status,
                          })
                        }
                        className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-navy hover:bg-cloud"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete "${p.title}"? This cannot be undone.`)) deleteMutation.mutate(p.id);
                        }}
                        className="rounded-md border border-destructive/30 p-2 text-destructive hover:bg-destructive/5"
                        aria-label={`Delete ${p.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
