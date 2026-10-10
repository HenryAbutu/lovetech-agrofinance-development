import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/components/admin-coming-soon";

export const Route = createFileRoute("/_authenticated/admin/participants")({
  head: () => ({ meta: [{ title: "Participants — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminComingSoon title="Participants" description="See every learner in each cohort, with attendance and progress." />,
});
