import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Newspaper } from "lucide-react";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Practical updates, opportunities and analysis for Nigerian MSMEs, agribusinesses, entrepreneurs, cooperatives and development actors." },
      { property: "og:title", content: "LoveTech Insights" },
      { property: "og:description", content: "Ecosystem news, funding opportunities, finance readiness, AI, agribusiness and climate insights for Nigerian entrepreneurs." },
    ],
  }),
  component: InsightsPage,
});

const categories = [
  "All",
  "MSME News",
  "Funding & Opportunities",
  "Finance Readiness",
  "Agribusiness & Value Chains",
  "Climate & Green Enterprise",
  "AI & Digital Business",
  "Women and Youth Enterprise",
  "Policy & Ecosystem Updates",
] as const;

type Post = { title: string; category: (typeof categories)[number]; excerpt: string; date: string; featured?: boolean };

const posts: Post[] = [
  { title: "How Nigerian MSMEs Can Become Finance-Ready in 90 Days", category: "Finance Readiness", excerpt: "A practical 90-day roadmap covering documentation, cashflow records, compliance and lender-ready packaging.", date: "Coming soon", featured: true },
  { title: "Why Agribusinesses Need Better Records Before Seeking Loans", category: "Agribusiness & Value Chains", excerpt: "Lenders don't reject weak businesses — they reject unclear numbers. Here's how to fix your records first." , date: "Coming soon" },
  { title: "AI Tools Every Small Business Owner Should Learn in 2026", category: "AI & Digital Business", excerpt: "The AI stack that pays for itself in a Nigerian SME within 30 days — practical, not futuristic.", date: "Coming soon" },
  { title: "What Lenders Look for Before Financing a Business", category: "Finance Readiness", excerpt: "Inside the 8 signals lenders check before opening your financial statements.", date: "Coming soon" },
  { title: "Climate-Smart Enterprise Opportunities for Nigerian SMEs", category: "Climate & Green Enterprise", excerpt: "Where the money is moving in climate finance and how a small business can position for it.", date: "Coming soon" },
  { title: "How Cooperatives Can Prepare for Grants and Development Programmes", category: "MSME News", excerpt: "Governance, records, member accountability — the readiness gaps donors look for.", date: "Coming soon" },
  { title: "Funding Opportunities Nigerian Entrepreneurs Should Watch", category: "Funding & Opportunities", excerpt: "A rolling summary of grant calls, loan windows and investment programmes we're tracking.", date: "Coming soon" },
  { title: "Practical Ways to Move from Hustle to Structure", category: "Women and Youth Enterprise", excerpt: "The five structural moves that separate a hustle from a fundable, growth-ready business.", date: "Coming soon" },
];

function InsightsPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => p !== featured && (filter === "All" || p.category === filter));

  return (
    <main className="bg-white">
      <section className="border-b border-border bg-gradient-to-br from-[#FFF8E7] via-white to-white px-6 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ochre">
            <Newspaper className="size-3.5" /> Insights
          </p>
          <h1 className="font-serif text-4xl text-vetiver md:text-5xl">Insights</h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/70">
            Practical updates, opportunities and analysis for Nigerian MSMEs, agribusinesses, entrepreneurs, cooperatives and development actors.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="px-6 py-14 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <article className="grid overflow-hidden rounded-2xl border border-border bg-white shadow-sm md:grid-cols-[1.2fr_1fr]">
              <div className="bg-gradient-to-br from-vetiver via-vetiver to-teal p-10 text-white">
                <span className="mb-4 inline-flex rounded-full bg-ochre px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Featured</span>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{featured.category}</p>
                <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{featured.title}</h2>
                <p className="mt-4 text-white/85">{featured.excerpt}</p>
                <p className="mt-6 text-xs text-white/60">{featured.date}</p>
              </div>
              <div className="flex items-center justify-center bg-[#FFF8E7] p-10">
                <div className="text-center">
                  <p className="font-serif text-5xl text-vetiver">90</p>
                  <p className="text-sm font-semibold uppercase tracking-widest text-foreground/60">Day Roadmap</p>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Category chips + grid */}
      <section className="px-6 pb-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${filter === c ? "border-vetiver bg-vetiver text-white" : "border-border bg-white text-foreground/70 hover:border-vetiver/30 hover:text-vetiver"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {rest.map((p) => (
              <article key={p.title} className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-vetiver/30 hover:shadow-lg">
                <span className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-teal">{p.category}</span>
                <h3 className="mb-3 flex-1 font-serif text-xl leading-snug text-vetiver">{p.title}</h3>
                <p className="text-sm text-foreground/65">{p.excerpt}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-foreground/45">{p.date}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-vetiver">Read More <ArrowRight className="size-3.5" /></span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border bg-[#FFF8E7] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-white p-8 shadow-sm md:flex md:items-center md:gap-8">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-ochre">Stay updated</p>
            <h3 className="mt-2 font-serif text-2xl text-vetiver">Get funding opportunities and MSME insights in your inbox</h3>
            <p className="mt-2 text-sm text-foreground/65">Short, practical updates for Nigerian entrepreneurs. No spam.</p>
          </div>
          <form
            className="mt-6 flex gap-2 md:mt-0"
            onSubmit={(e) => { e.preventDefault(); alert("Thanks — you'll be added to our list."); }}
          >
            <input type="email" required placeholder="you@company.com" className="input min-w-[220px]" />
            <button className="rounded-lg bg-vetiver px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95">Subscribe</button>
          </form>
        </div>
      </section>
    </main>
  );
}
