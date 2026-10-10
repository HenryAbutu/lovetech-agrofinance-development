import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/components/admin-coming-soon";

export const Route = createFileRoute("/_authenticated/admin/action-plans")({
  head: () => ({ meta: [{ title: "Action Plans — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminComingSoon title="Action Plans" description="Review learners' business action plans and follow-up progress." />,
});
