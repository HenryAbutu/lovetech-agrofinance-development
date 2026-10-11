import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReviewTable } from "@/components/lms-review-table";
import { LMS_ADMIN_KEY, label, loadLmsAdmin } from "@/lib/lms-admin";

export const Route = createFileRoute("/_authenticated/admin/action-plans")({
  head: () => ({ meta: [{ title: "Action Plans — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: LMS_ADMIN_KEY, queryFn: loadLmsAdmin });
  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;
  if (error || !data) return <p className="text-sm text-destructive">{(error as Error)?.message}</p>;
  const items = data.plans.map((p) => ({
    id: p.id, user_id: p.user_id, course_slug: p.course_slug, status: p.status, feedback: p.feedback,
    title: `${label(p.plan_type)}${p.business_name ? ` · ${p.business_name}` : ""}`, date: p.created_at,
    body: [
      { k: "Main goal", v: p.main_goal }, { k: "Key actions", v: p.key_actions }, { k: "Resources needed", v: p.resources_needed },
      { k: "Support needed", v: p.support_needed }, { k: "Timeline", v: p.timeline }, { k: "Expected result", v: p.expected_result },
      { k: "Risks", v: p.risks }, { k: "Next steps", v: p.next_steps },
    ],
  }));
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">Learner action plans</h2>
      <ReviewTable data={data} items={items} table="lms_action_plans" onDone={() => qc.invalidateQueries({ queryKey: LMS_ADMIN_KEY })} />
    </div>
  );
}
