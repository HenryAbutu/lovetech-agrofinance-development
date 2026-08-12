import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BedDouble, Wifi, ShieldCheck, Sparkles, MapPin, Car } from "lucide-react";
import livingImg from "@/assets/group/house8-living.jpg";
import bedroomImg from "@/assets/group/house8-bedroom.jpg";

const URL = "https://lovetechgroup.lovable.app/house-8";

export const Route = createFileRoute("/house-8")({
  head: () => ({
    meta: [
      { title: "House 8 Shortlet Apartments — Premium Short Stays in Abuja" },
      { name: "description", content: "House 8 Shortlet Apartments offers premium, secure and fully serviced short-stay apartments in Abuja for business travellers, families and staycations." },
      { property: "og:title", content: "House 8 Shortlet Apartments — Abuja" },
      { property: "og:description", content: "Premium, secure, fully serviced short-stay apartments in Abuja. Book directly with House 8." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: House8Page,
});

const amenities = [
  { icon: Wifi, t: "Fast Wi-Fi", b: "Work-ready connectivity in every apartment." },
  { icon: ShieldCheck, t: "24/7 security", b: "Gated estate with round-the-clock security." },
  { icon: BedDouble, t: "Hotel-grade bedding", b: "Fresh linens, quality mattresses, blackout curtains." },
  { icon: Sparkles, t: "Housekeeping", b: "Professional cleaning between and during stays." },
  { icon: Car, t: "Secure parking", b: "On-site parking for guests." },
  { icon: MapPin, t: "Great location", b: "Quiet residential comfort with easy city access." },
];

function House8Page() {
  return (
    <main className="bg-white">
      <section className="relative bg-burgundy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">House 8 Shortlet Apartments</p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">Premium short stays in Abuja that feel like home</h1>
            <p className="mt-5 max-w-xl text-white/80">
              Fully serviced, secure and beautifully finished apartments for business travellers, families and weekend staycations — booked directly, priced fairly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy hover:opacity-95">Enquire & book <ArrowRight className="size-4" /></Link>
              <a href="https://wa.me/2348026065189" target="_blank" rel="noreferrer" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Chat on WhatsApp</a>
            </div>
          </div>
          <img src={livingImg} alt="House 8 shortlet apartment living room in Abuja" width={1600} height={1200} className="rounded-2xl object-cover shadow-2xl" />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">Everything included</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a) => (
              <div key={a.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <a.icon className="size-6 text-burgundy" />
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{a.t}</h3>
                <p className="mt-2 text-sm text-foreground/70">{a.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <img src={bedroomImg} alt="House 8 apartment bedroom with premium bedding" loading="lazy" width={1600} height={1200} className="rounded-2xl object-cover shadow-lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-burgundy">Stay options</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Nightly, weekly and monthly stays</h2>
            <p className="mt-4 text-foreground/70">
              Tell us your dates, number of guests and purpose of stay. We'll confirm availability and send you current rates and payment details — usually within a few hours.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { t: "Nightly", b: "Short business trips and city visits" },
                { t: "Weekly", b: "Extended work or family stays" },
                { t: "Monthly", b: "Relocation and long assignments" },
              ].map((x) => (
                <div key={x.t} className="rounded-xl border border-border bg-white p-4">
                  <p className="font-serif font-semibold text-navy">{x.t}</p>
                  <p className="mt-1 text-xs text-foreground/70">{x.b}</p>
                </div>
              ))}
            </div>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">Check availability <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
