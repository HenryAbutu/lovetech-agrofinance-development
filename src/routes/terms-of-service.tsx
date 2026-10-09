import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal-document";
import content from "@/content/terms-of-service.md?raw";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — LoveTech Group" },
      { name: "description", content: "Terms for using Lovetech Agrofinance & Development Ltd's website, Academy courses, advisory services, resources and payments." },
      { property: "og:title", content: "Terms of Service — LoveTech Group" },
      { property: "og:description", content: "Read LoveTech's terms covering accounts, courses, payments, refunds and service responsibilities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://lovetechgroup.com.ng/terms-of-service" }],
  }),
  component: () => <LegalDocument title="Terms of Service" content={content} />,
});