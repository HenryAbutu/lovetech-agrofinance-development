import { createFileRoute, redirect } from "@tanstack/react-router";
import { websiteHead } from "@/components/website/content";
export const Route = createFileRoute("/programmes")({
  beforeLoad: () => { throw redirect({ to: "/academy", statusCode: 301 }); },
  head: () => websiteHead("Continue to Lovetech Academy", "This legacy address redirects to the current Lovetech course discovery page."),
});
