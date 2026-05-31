import { createFileRoute } from "@tanstack/react-router";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/academy/courses/finance-readiness-msmes")({
  head: () => ({
    meta: [
      { title: "Finance Readiness for MSMEs — LoveTech Agro Academy" },
      { name: "description", content: "Upcoming programme preparing MSMEs for loans, grants, investment and partnerships. Join the waitlist." },
    ],
  }),
  component: () => (
    <main>
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
