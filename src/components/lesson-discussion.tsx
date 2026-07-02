import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  listLessonDiscussions,
  postLessonDiscussion,
  deleteLessonDiscussion,
} from "@/lib/discussions.functions";

export function LessonDiscussion({ lessonId, courseId, currentUserId }: { lessonId: string; courseId: string; currentUserId?: string | null }) {
  const list = useServerFn(listLessonDiscussions);
  const post = useServerFn(postLessonDiscussion);
  const del = useServerFn(deleteLessonDiscussion);
  const qc = useQueryClient();
  const key = ["lesson-discussion", lessonId] as const;

  const { data, isLoading } = useQuery({
    queryKey: key,
    queryFn: () => list({ data: { lesson_id: lessonId } }),
  });

  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: () => post({ data: { lesson_id: lessonId, course_id: courseId, parent_id: replyTo, body } }),
    onSuccess: () => {
      setBody("");
      setReplyTo(null);
      qc.invalidateQueries({ queryKey: key });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  });

  const posts = data?.posts ?? [];
  const authors = data?.authors ?? {};
  const roots = posts.filter((p) => !p.parent_id);
  const repliesOf = (id: string) => posts.filter((p) => p.parent_id === id);

  return (
    <section className="mt-6 rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2 text-vetiver">
        <MessageSquare className="size-5" />
        <h3 className="font-serif text-xl">Discussion</h3>
        <span className="text-xs text-foreground/50">· {posts.length} {posts.length === 1 ? "post" : "posts"}</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-foreground/50">Loading…</p>
      ) : roots.length === 0 ? (
        <p className="text-sm text-foreground/60">No discussion yet. Ask the first question — instructors and peers will reply.</p>
      ) : (
        <ul className="space-y-4">
          {roots.map((p) => (
            <li key={p.id} className="rounded-lg border border-border/50 bg-background p-4">
              <PostBody post={p} author={authors[p.user_id]} currentUserId={currentUserId} onDelete={(id) => remove.mutate(id)} onReply={() => setReplyTo(p.id)} />
              {repliesOf(p.id).length > 0 && (
                <ul className="mt-3 space-y-3 border-l-2 border-vetiver/20 pl-4">
                  {repliesOf(p.id).map((r) => (
                    <li key={r.id}>
                      <PostBody post={r} author={authors[r.user_id]} currentUserId={currentUserId} onDelete={(id) => remove.mutate(id)} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {currentUserId && (
        <form
          onSubmit={(e) => { e.preventDefault(); if (body.trim()) submit.mutate(); }}
          className="mt-6 rounded-lg border border-vetiver/20 bg-background p-3"
        >
          {replyTo && (
            <div className="mb-2 flex items-center justify-between text-xs text-foreground/60">
              <span>Replying to post</span>
              <button type="button" className="text-vetiver hover:underline" onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={replyTo ? "Write a reply…" : "Ask a question or share what worked for you…"}
            rows={3}
            maxLength={4000}
            className="w-full resize-y rounded-md border border-border bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-vetiver/30"
            required
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-foreground/50">{body.length}/4000</span>
            <button
              type="submit"
              disabled={submit.isPending || !body.trim()}
              className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-4 py-2 text-xs font-semibold text-bone disabled:opacity-50"
            >
              <Send className="size-3.5" /> {submit.isPending ? "Posting…" : "Post"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function PostBody({ post, author, currentUserId, onDelete, onReply }: {
  post: { id: string; user_id: string; body: string; created_at: string; is_pinned: boolean };
  author?: { full_name: string | null; avatar_url: string | null; public_slug: string | null; is_public: boolean };
  currentUserId?: string | null;
  onDelete: (id: string) => void;
  onReply?: () => void;
}) {
  const name = author?.full_name ?? "Learner";
  const canDelete = currentUserId === post.user_id;
  return (
    <div>
      <div className="flex items-center gap-2 text-xs">
        {author?.avatar_url ? (
          <img src={author.avatar_url} alt="" className="size-6 rounded-full object-cover" />
        ) : (
          <div className="grid size-6 place-items-center rounded-full bg-vetiver/15 text-[10px] font-semibold text-vetiver">{name.slice(0, 1).toUpperCase()}</div>
        )}
        {author?.is_public && author?.public_slug ? (
          <Link to="/learners/$slug" params={{ slug: author.public_slug }} className="font-semibold text-vetiver hover:underline">{name}</Link>
        ) : (
          <span className="font-semibold text-vetiver">{name}</span>
        )}
        {post.is_pinned && <span className="rounded-full bg-ochre/15 px-2 py-0.5 text-[10px] font-semibold text-ochre">Pinned</span>}
        <span className="text-foreground/40">· {new Date(post.created_at).toLocaleString()}</span>
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/85">{post.body}</p>
      <div className="mt-2 flex items-center gap-3 text-xs">
        {onReply && <button type="button" onClick={onReply} className="text-vetiver hover:underline">Reply</button>}
        {canDelete && (
          <button type="button" onClick={() => onDelete(post.id)} className="inline-flex items-center gap-1 text-red-600 hover:underline">
            <Trash2 className="size-3" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}
