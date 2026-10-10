import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/components/admin-coming-soon";

export const Route = createFileRoute("/_authenticated/admin/coaching-logs")({
  head: () => ({ meta: [{ title: "Coaching Logs — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminComingSoon title="Coaching Logs" description="Record coaching sessions and touchpoints with each participant." />,
});
