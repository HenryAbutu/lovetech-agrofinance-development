import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Send, Megaphone } from "lucide-react";
import { adminSendPush } from "@/lib/push.functions";
import { listCoursesAdmin } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/announcements")({
  head: () => ({ meta: [{ title: "Announcements · Admin" }] }),
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  const send = useServerFn(adminSendPush);
  const listCourses = useServerFn(listCoursesAdmin);
  const { data: courses } = useQuery({ queryKey: ["admin-courses"], queryFn: () => listCourses() });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/academy/dashboard");
  const [courseId, setCourseId] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  const mutate = useMutation({
    mutationFn: () => send({ data: { title, body, url, course_id: courseId || undefined } }),
    onSuccess: (r) => setResult(`Sent to ${r.sent} device(s). ${r.failed} failed.`),
    onError: (e: Error) => setResult(`Error: ${e.message}`),
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <Megaphone className="size-6 text-ochre" />
        <div>
          <h1 className="font-serif text-3xl text-vetiver">Push announcements</h1>
          <p className="mt-1 text-sm text-foreground/60">Send a push notification to learners who enabled notifications.</p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); mutate.mutate(); }} className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/60">Title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/60">Message</span>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={300} required rows={3} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/60">Deep link URL</span>
            <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/60">Target course (optional)</span>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">All subscribers</option>
              {courses?.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button type="submit" disabled={mutate.isPending} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone disabled:opacity-50">
            <Send className="size-4" /> {mutate.isPending ? "Sending…" : "Send notification"}
          </button>
          {result && <span className="text-sm text-foreground/70">{result}</span>}
        </div>
      </form>
    </main>
  );
}
