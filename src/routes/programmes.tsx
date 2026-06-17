import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/programmes")({
  head: () => ({
    meta: [
      { title: "Programmes — LoveTech Agrofinance & Development Ltd" },
      { name: "description", content: "Current and upcoming programmes for MSMEs, professionals and agribusinesses." },
    ],
  }),
  component: ProgrammesPage,
});

const current = [
  { t: "Professionals AI Edge", status: "Enrolment Open", b: "Practical AI tools for more efficient, productive and profitable businesses. ₦10,000 → ₦1,000 launch price.", to: "/academy/courses/professionals-ai-edge" },
];
const upcoming = [
  { t: "ICSS 2.0 Entrepreneurship Programme", b: "Practical entrepreneurship training for MSME growth, finance readiness and market access.", to: "/academy/courses/icss-2-0-entrepreneurship" },
  { t: "Finance Readiness for MSMEs", b: "Prepare your business for loans, grants, investments and partnership funding.", to: "/academy/courses/finance-readiness-msmes" },
  { t: "Agrofinance Cohort", b: "A focused cohort for agribusinesses and value chain actors building investment readiness.", to: "/contact" },
];

function ProgrammesPage() {
  return (
    <main>
      <section className="border-b border-border bg-card px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-ochre">Programmes</p>
          <h1 className="font-serif text-5xl text-vetiver md:text-6xl">Cohorts and courses for Nigerian entrepreneurs.</h1>
        </div>
      </section>
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 font-serif text-3xl text-vetiver">Currently running</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {current.map((p) => (
              <article key={p.t} className="rounded-2xl border border-vetiver/20 bg-card p-8">
                <span className="mb-3 inline-flex rounded-full bg-vetiver/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-vetiver">{p.status}</span>
                <h3 className="mb-2 font-serif text-2xl text-vetiver">{p.t}</h3>
                <p className="mb-6 text-foreground/70">{p.b}</p>
                <Link to={p.to} className="inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">View Programme</Link>
              </article>
            ))}
          </div>
          <h2 className="mt-16 mb-8 font-serif text-3xl text-vetiver">Coming soon</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {upcoming.map((p) => (
              <article key={p.t} className="rounded-2xl border border-border bg-card p-6">
                <span className="mb-3 inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">Coming Soon</span>
                <h3 className="mb-2 font-serif text-xl text-vetiver">{p.t}</h3>
                <p className="mb-6 text-sm text-foreground/65">{p.b}</p>
                <Link to={p.to} className="inline-flex rounded-sm border border-vetiver/20 px-4 py-2 text-sm font-semibold text-vetiver hover:bg-vetiver/5">Join Waitlist</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
