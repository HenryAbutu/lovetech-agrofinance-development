import { createFileRoute } from "@tanstack/react-router";
import { AdminComingSoon } from "@/components/admin-coming-soon";

export const Route = createFileRoute("/_authenticated/admin/evidence-export")({
  head: () => ({ meta: [{ title: "Evidence Export — LoveTech Admin" }, { name: "robots", content: "noindex" }] }),
  component: () => <AdminComingSoon title="Evidence Export" description="Export attendance, assessment and action-plan evidence for donor reporting." />,
});
