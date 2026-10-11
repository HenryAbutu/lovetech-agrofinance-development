import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewTable } from "@/components/lms-review-table";
import { LMS_ADMIN_KEY, loadLmsAdmin } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/assignments")({
  head: () => ({ meta: [{ title: "Assignments — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  const items = data.subs.map((s) => ({
    id: s.id, user_id: s.user_id, course_slug: s.course_slug, status: s.status, feedback: s.feedback,
    title: `${s.assignment_title}${s.module_title ? ` · ${s.module_title}` : ""}`, date: s.submitted_at, link: s.link_url,
    body: [{ k: "Written answer", v: s.submission_text }, { k: "Notes", v: s.notes }],
  }));
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Assignment submissions</h2>
      <ReviewTable data={data} items={items} table="lms_assignment_submissions" onDone={() => qc.invalidateQueries({ queryKey: LMS_ADMIN_KEY })} />
    </div>
  );
}
