import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/components/admin-coming-soon";

export const Route = createFileRoute("/_authenticated/admin/assignments")({
  head: () => ({ meta: [{ title: "Assignments — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminComingSoon title="Assignments" description="Review and grade learner assignment submissions across courses." />,
});
