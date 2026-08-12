import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, GraduationCap, Leaf, Target, Eye, ShieldCheck, Users, Sparkles } from "lucide-react";
import ceoImg from "@/assets/avess-abutu.png";
import advisoryImg from "@/assets/group/hero-advisory-session.jpg";

const URL = "https://lovetechgroup.lovable.app/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LoveTech Group — Advisory, Hospitality & Wellness" },
      {
        name: "description",
        content:
          "LoveTech Group builds practical Nigerian businesses across advisory and academy, shortlet hospitality and herbal wellness. Meet our story, mission and leadership.",
      },
      { property: "og:title", content: "About LoveTech Group" },
      {
        property: "og:description",
        content: "One group, three businesses: LoveTech Advisory & Academy, House 8 Shortlet Apartments and Ruby Chai Wellness.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AboutPage,
});

const pillars = [
  {
    icon: GraduationCap,
    name: "LoveTech Advisory & Academy",
    body: "Business advisory, agrofinance readiness and practical training that helps MSMEs, agribusinesses and professionals get structured and funded.",
    to: "/advisory" as const,
  },
  {
    icon: Building2,
    name: "House 8 Shortlet Apartments",
    body: "Comfortable, well-run shortlet apartments for business travellers, families and remote professionals who want a calm, dependable stay.",
    to: "/house-8" as const,
  },
  {
    icon: Leaf,
    name: "Ruby Chai Wellness",
    body: "Hand-blended herbal teas and simple wellness rituals designed for real Nigerian days — clean ingredients, honest flavour.",
    to: "/ruby-chai" as const,
  },
];

const values = [
  { icon: ShieldCheck, t: "Practical over theoretical", b: "Every service ends in something usable: a plan, a system, a stay, a product on the shelf." },
  { icon: Users, t: "Inclusion by design", b: "Women-led, youth-led and rural enterprises sit at the centre of how we build programmes." },
  { icon: Sparkles, t: "Technology as leverage", b: "We use digital and AI tools to sharpen delivery, not to replace judgement or people." },
  { icon: Target, t: "Standards that travel", b: "Locally rooted instincts, reporting and quality that meet financier and partner expectations." },
];

const focus = [
  "Agrofinance & enterprise development",
  "MSME training & academy programmes",
  "Finance & investment readiness",
  "Cooperative & farmer-group strengthening",
  "Climate-smart enterprise advisory",
  "M&E, research & ecosystem mapping",
  "Hospitality & shortlet operations",
  "Consumer wellness products",
];

function AboutPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-border bg-cloud">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">
              About the group
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-navy md:text-5xl">
              One group. Three businesses. A practical view of development.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/70">
              LoveTech Group is a Nigerian company building businesses that solve everyday problems — helping enterprises get
              structured and finance-ready, giving travellers a dependable place to stay, and putting honest wellness products
              into people&apos;s hands.
            </p>
            <p className="mt-4 text-sm text-foreground/55">RC: 9535107 · TIN: 2623772591480</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95"
              >
                Book a consultation <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/advisory"
                className="rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-cloud"
              >
                Explore Advisory & Academy
              </Link>
            </div>
          </div>
          <img
            src={advisoryImg}
            alt="LoveTech Group advisory session with Nigerian business owners"
            width={1600}
            height={1200}
            className="rounded-2xl object-cover shadow-xl"
          />
        </div>
      </section>

      {/* MISSION / VISION */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <Target className="size-6 text-teal" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-navy md:text-3xl">Our mission</h2>
            <p className="mt-3 text-foreground/75">
              To build and run businesses that make growth practical — equipping enterprises with structure, capacity and
              finance pathways, and serving people with hospitality and products they can trust.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
            <Eye className="size-6 text-gold" />
            <h2 className="mt-4 font-serif text-2xl font-bold text-navy md:text-3xl">Our vision</h2>
            <p className="mt-3 text-foreground/75">
              A Nigeria where entrepreneurs move from hustle to structure with the tools, training and finance they need — and
              where a Nigerian group can set the standard across advisory, hospitality and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* BUSINESSES */}
      <section className="bg-cloud px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Our businesses</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">What sits under the group</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pillars.map((p) => (
              <Link
                key={p.name}
                to={p.to}
                className="group rounded-2xl border border-border bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <p.icon className="size-6 text-teal" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{p.name}</h3>
                <p className="mt-2 text-sm text-foreground/70">{p.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-teal">
                  Visit <ArrowRight className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CEO MESSAGE */}
      <section className="border-y border-border px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Message from the Founder / CEO</p>
          <h2 className="mb-12 font-serif text-3xl font-bold leading-tight text-navy md:text-4xl">Development must be practical.</h2>

          <div className="grid gap-10 lg:grid-cols-[minmax(260px,340px)_1fr] lg:items-start">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-md">
              <img
                src={ceoImg}
                alt="Avess Abutu, Founder and CEO of LoveTech Group"
                width={1024}
                height={1280}
                loading="lazy"
                className="aspect-[4/5] w-full rounded-xl object-cover"
              />
              <div className="mt-5 border-t border-border pt-4">
                <p className="font-serif text-xl font-semibold text-navy">Avess Abutu</p>
                <p className="text-sm font-medium text-gold">Founder / CEO</p>
                <p className="mt-1 text-xs text-foreground/60">LoveTech Group</p>
              </div>
            </div>

            <div className="space-y-5 text-[15px] leading-relaxed text-foreground/80">
              <p>
                Our vision is simple: to help businesses, entrepreneurs, cooperatives and institutions become more structured,
                finance-ready and future-ready — and to build our own businesses to that same standard.
              </p>
              <p>
                Across Nigeria and Africa, many businesses have strong ideas, hardworking founders and real market potential.
                What they often lack is structure, access to finance, digital systems, compliance and practical tools. LoveTech
                was created to close that gap.
              </p>
              <p>
                Through our consulting services, academy programmes, finance readiness tools, hospitality operations and
                wellness products, we are building a group that does more than advise. We equip, guide and walk with people from
                idea to structure, from structure to growth, and from growth to sustainable impact.
              </p>
              <p>
                I believe development must be practical. Training must lead to action. Finance must meet readiness. Technology
                must solve real problems. And everyone we serve should leave better organised and more prepared for opportunity.
              </p>
              <p className="font-serif text-xl italic text-navy">— Welcome to LoveTech Group.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-navy px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">How we work</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">Values we actually operate by</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <v.icon className="size-5 text-teal" />
                <h3 className="mt-4 font-serif text-base font-semibold text-white">{v.t}</h3>
                <p className="mt-2 text-sm text-white/70">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOCUS */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Focus areas</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Where we work</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {focus.map((f) => (
              <li key={f} className="flex gap-3 rounded-xl border border-border bg-white p-5 shadow-sm">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-teal" />
                <span className="text-foreground/80">{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex rounded-lg bg-navy px-6 py-3 font-semibold text-white hover:opacity-95">
              Work with us
            </Link>
            <Link
              to="/finance-readiness"
              className="inline-flex rounded-lg border border-navy/20 bg-white px-6 py-3 font-semibold text-navy hover:bg-cloud"
            >
              Finance readiness diagnostic
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
