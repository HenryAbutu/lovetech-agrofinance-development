import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, GraduationCap, Leaf, ShieldCheck, LineChart, Users } from "lucide-react";
import heroImg from "@/assets/group/hero-advisory-session.jpg";
import house8Asset from "@/assets/group/house8-pool.png.asset.json";

const house8Img = house8Asset.url;
import rubyImg from "@/assets/group/rubychai-tea.jpg";
import academyImg from "@/assets/group/academy-workshop.jpg";
import avessAsset from "@/assets/avess-abutu.png.asset.json";

const URL = "https://lovetechgroup.lovable.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LoveTech Group — Advisory, Academy, Hospitality & Wellness" },
      { name: "description", content: "LoveTech Group builds structured, fundable and growth-ready enterprises and premium lifestyle experiences through LoveTech Advisory & Academy, House 8 Shortlet Apartments and Ruby Chai Wellness." },
      { property: "og:title", content: "LoveTech Group — Advisory, Academy, Hospitality & Wellness" },
      { property: "og:description", content: "One Nigerian group, three businesses: advisory & academy, premium shortlets in Abuja, and wellness." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: Home,
});

const gateways = [
  {
    to: "/advisory" as const,
    img: academyImg,
    icon: GraduationCap,
    name: "LoveTech Advisory & Academy",
    body: "Business advisory, finance readiness and practical online courses for MSMEs, agribusinesses and professionals.",
    cta: "Explore advisory & courses",
    tint: "text-teal",
  },
  {
    to: "/house-8" as const,
    img: house8Img,
    icon: Building2,
    name: "House 8 Shortlet Apartments",
    body: "Premium, secure and fully serviced short-stay apartments in Abuja for business travel, family visits and staycations.",
    cta: "View apartments",
    tint: "text-burgundy",
  },
  {
    to: "/ruby-chai" as const,
    img: rubyImg,
    icon: Leaf,
    name: "Ruby Chai Wellness",
    body: "Herbal tea blends and simple wellness rituals for calm, energy and everyday balance.",
    cta: "Discover the blends",
    tint: "text-rose",
  },
];

const proof = [
  { icon: Users, k: "1,000+", l: "Entrepreneurs trained and supported" },
  { icon: LineChart, k: "₦ multi-million", l: "Funding-readiness packages prepared" },
  { icon: ShieldCheck, k: "3 businesses", l: "Advisory, hospitality and wellness" },
];

function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">LoveTech Group</p>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] md:text-5xl lg:text-6xl">
              Building structured, fundable businesses — and experiences worth returning to
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75">
              One Nigerian group, three focused businesses: advisory and education for enterprises, premium hospitality in Abuja, and everyday wellness.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#businesses" className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy hover:opacity-95">
                Explore our businesses <ArrowRight className="size-4" />
              </a>
              <Link to="/contact" className="rounded-lg border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                Book a consultation
              </Link>
            </div>
            <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              {proof.map((p) => (
                <div key={p.k}>
                  <p className="font-serif text-2xl font-bold text-gold">{p.k}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/60">{p.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="LoveTech Group advisory session with Nigerian business owners" width={1600} height={1200} className="rounded-2xl object-cover shadow-2xl" />
            <div className="absolute -bottom-6 -left-6 hidden max-w-[15rem] rounded-xl border border-white/10 bg-white p-4 shadow-xl lg:block">
              <p className="font-serif text-sm font-semibold text-navy">Group-wide standard</p>
              <p className="mt-1 text-xs text-foreground/70">Practical delivery, clear pricing, and follow-through in every business we run.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business gateways */}
      <section id="businesses" className="scroll-mt-20 px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">Our Businesses</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Three businesses, one standard of delivery</h2>
            <p className="mt-4 text-foreground/70">Choose the door that fits what you need today.</p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {gateways.map((g) => (
              <Link
                key={g.to}
                to={g.to}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <img src={g.img} alt={g.name} loading="lazy" width={1600} height={1200} className="h-52 w-full object-cover" />
                <div className="flex flex-1 flex-col p-6">
                  <g.icon className={`size-6 ${g.tint}`} />
                  <h3 className="mt-4 font-serif text-xl font-semibold text-navy">{g.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70">{g.body}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                    {g.cta} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured offerings */}
      <section className="bg-cloud px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">Featured right now</p>
          <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Popular starting points</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { t: "Free Finance Readiness Diagnostic", b: "Find out in minutes how fundable your business looks to lenders and grant providers.", to: "/finance-readiness" as const, cta: "Start diagnostic" },
              { t: "AI for Work & Business", b: "A focused, practical course on using AI and digital tools to sell more and work faster.", to: "/academy" as const, cta: "View course" },
              { t: "Book a stay at House 8", b: "Check availability for nightly, weekly or monthly stays in Abuja.", to: "/house-8" as const, cta: "Check availability" },
            ].map((c) => (
              <div key={c.t} className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-semibold text-navy">{c.t}</h3>
                <p className="mt-3 flex-1 text-sm text-foreground/70">{c.b}</p>
                <Link to={c.to} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline">
                  {c.cta} <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <img src={avessAsset.url} alt="Avess Abutu, Founder & Chief Executive of LoveTech Group" loading="lazy" className="w-full rounded-2xl object-cover shadow-lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">Leadership</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Led by practitioners, not theorists</h2>
            <p className="mt-5 text-foreground/75">
              LoveTech Group is led by <strong className="text-navy">Avess Abutu</strong>, whose work spans agrofinance, enterprise development and business advisory across Nigeria. The group was built on one belief: African businesses do not lack ambition — they lack structure, tools and access.
            </p>
            <p className="mt-4 text-foreground/70">
              That conviction shapes everything we run: advisory that produces documents funders accept, courses people actually finish, apartments guests return to, and wellness products we would give our own families.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">
              About LoveTech Group <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
