import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Articles and resources on MSME growth, agrofinance, AI for business, and finance readiness." },
    ],
  }),
  component: InsightsPage,
});

const posts = [
  { t: "How Nigerian MSMEs can become finance-ready in 90 days", c: "Finance Readiness", e: "A practical guide to documentation, cashflow records and lender-ready packaging." },
  { t: "Why most agribusinesses lose investor interest in the first meeting", c: "Agrofinance", e: "The 5 structural gaps investors check before they even open your numbers." },
  { t: "Using AI as a productivity edge — without overspending", c: "AI & Digital", e: "How small Nigerian teams can use AI to do the work of three people without burning out." },
];

function InsightsPage() {
  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Insights</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">Notes from the field.</h1>
          <p className="mt-6 max-w-2xl text-lg text-foreground/70">Practical writing on agrofinance, MSME structuring, and AI for Nigerian businesses.</p>
        </div>
      </section>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <article key={p.t} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <span className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ochre">{p.c}</span>
              <h3 className="mb-3 flex-1 font-serif text-2xl leading-tight text-vetiver">{p.t}</h3>
              <p className="text-sm text-foreground/65">{p.e}</p>
              <span className="mt-6 text-xs text-foreground/45">Coming soon</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
