import { createFileRoute, redirect } from "@tanstack/react-router";
import { websiteHead } from "@/components/website/content";
export const Route = createFileRoute("/services")({
  beforeLoad: () => { throw redirect({ to: "/advisory", statusCode: 301 }); },
  head: () => websiteHead("Continue to Advisory Services", "This legacy address redirects to the current Lovetech advisory services page."),
});
