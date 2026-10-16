import { createFileRoute } from "@tanstack/react-router";
import { canonicalLink } from "@/lib/seo";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/academy/courses/finance-readiness-msmes")({
  head: () => ({
    links: [canonicalLink("/academy/courses/finance-readiness-msmes")],
    meta: [
      { title: "Finance Readiness for MSMEs — LoveTech Academy" },
      { name: "description", content: "Upcoming programme preparing MSMEs for loans, grants, investment and partnerships. Join the waitlist." },
      { property: "og:title", content: "Finance Readiness for MSMEs — Lovetech Academy" },
      { property: "og:description", content: "Upcoming programme preparing MSMEs for finance and partnerships. Join the existing waitlist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <main className="website web-course">
      <section className="bg-ink px-6 py-24 text-bone lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Coming Soon</p>
          <h1 className="font-serif text-5xl text-bone md:text-6xl">Finance Readiness for MSMEs</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone/70">Learn how to prepare your business for loans, grants, investments and partnership funding — the LoveTech way.</p>
        </div>
      </section>
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <WaitlistForm courseSlug="finance-readiness-msmes" courseLabel="Finance Readiness" />
        </div>
      </section>
    </main>
  ),
});
