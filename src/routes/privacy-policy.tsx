import { createFileRoute } from "@tanstack/react-router";
import { LegalDocument } from "@/components/legal-document";
import content from "@/content/privacy-policy.md?raw";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — LoveTech Group" },
      { name: "description", content: "How Lovetech Agrofinance & Development Ltd collects, uses and protects your personal data, including Google sign-in, Academy courses and payments." },
      { property: "og:title", content: "Privacy Policy — LoveTech Group" },
      { property: "og:description", content: "Read LoveTech's privacy policy and learn about your data protection rights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://lovetechgroup.com.ng/privacy-policy" }],
  }),
  component: () => <LegalDocument title="Privacy Policy" content={content} />,
});