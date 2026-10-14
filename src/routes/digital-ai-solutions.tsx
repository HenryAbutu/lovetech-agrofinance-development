import { createFileRoute } from "@tanstack/react-router";
import { ServicePage } from "@/components/website/presentation";
import { websiteHead, serviceContent } from "@/components/website/content";
export const Route = createFileRoute("/digital-ai-solutions")({
  head: () =>
    websiteHead(
      "Digital & AI Solutions",
      serviceContent.find((s) => s.id === "digital")?.intro ?? "Digital & AI Solutions", "/digital-ai-solutions"
    ),
  component: () => <ServicePage id="digital" />,
});
