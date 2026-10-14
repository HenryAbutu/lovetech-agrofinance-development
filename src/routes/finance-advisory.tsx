import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/website/presentation";
import { websiteHead, serviceContent } from "@/components/website/content";
export const Route = createFileRoute("/finance-advisory")({
  head: () =>
    websiteHead(
      "Finance Readiness & Access to Finance",
      serviceContent.find((s) => s.id === "finance")?.intro ??
        "Finance Readiness & Access to Finance", "/finance-advisory"
    ),
  component: () => <ServicePage id="finance" />,
});
