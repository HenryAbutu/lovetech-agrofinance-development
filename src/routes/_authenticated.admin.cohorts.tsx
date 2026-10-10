import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/components/admin-coming-soon";

export const Route = createFileRoute("/_authenticated/admin/cohorts")({
  head: () => ({ meta: [{ title: "Cohorts — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminComingSoon title="Cohorts" description="Create cohorts by state and dates, assign facilitators, and track their status." />,
});
