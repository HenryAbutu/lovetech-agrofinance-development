import { createFileRoute } from "@tanstack/react-router";
import { WaitlistForm } from "@/components/waitlist-form";

export const Route = createFileRoute("/academy/courses/icss-2-0-entrepreneurship")({
  head: () => ({
    meta: [
      { title: "ICSS 2.0 Entrepreneurship Programme — LoveTech Agro Academy" },
      { name: "description", content: "Upcoming entrepreneurship programme for MSME growth, finance readiness and market access. Join the waitlist." },
    ],
  }),
  component: () => (
    <main>
      <section className="bg-ink px-6 py-24 text-bone lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Coming Soon</p>
          <h1 className="font-serif text-5xl text-bone md:text-6xl">ICSS 2.0 Entrepreneurship Programme</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone/70">A practical entrepreneurship programme designed for Nigerian MSMEs ready to grow, structure and access finance. Join the waitlist for first access when enrolment opens.</p>
        </div>
      </section>
      <section className="px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <WaitlistForm courseSlug="icss-2-0-entrepreneurship" courseLabel="ICSS 2.0" />
        </div>
      </section>
    </main>
  ),
});
