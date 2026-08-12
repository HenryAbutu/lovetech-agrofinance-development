import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, BedDouble, Wifi, ShieldCheck, Sparkles, MapPin, Car, Users, Utensils, Gamepad2, Flame, Wine } from "lucide-react";
import { submitHouse8Booking } from "@/lib/house8.functions";
import exteriorAsset from "@/assets/group/house8-exterior.png.asset.json";
import poolAsset from "@/assets/group/house8-pool.png.asset.json";
import roomAsset from "@/assets/group/house8-room.png.asset.json";

const exteriorImg = exteriorAsset.url;
const poolImg = poolAsset.url;
const bedroomImg = roomAsset.url;

const URL = "https://lovetechgroup.lovable.app/house-8";

export const Route = createFileRoute("/house-8")({
  head: () => ({
    meta: [
      { title: "House 8 — 5-Bedroom Luxury Shortlet Apartment in Dawaki, Abuja" },
      { name: "description", content: "House 8 is a 5-bedroom luxury shortlet apartment in Dawaki, Abuja. Five named rooms, two lounges, bush bar, grills, games and premium hospitality for families, teams and events." },
      { property: "og:title", content: "House 8 — Luxury Shortlet Apartment in Abuja" },
      { property: "og:description", content: "Five named rooms, two lounges, bush bar, grills and games in a gated Dawaki home." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: House8Page,
});

const rooms = [
  { name: "Diamond", accent: "Spacious master-style suite" },
  { name: "Ruby", accent: "Warm, executive comfort" },
  { name: "Jasmine", accent: "Calm, airy retreat" },
  { name: "Emerald", accent: "Fresh, modern finish" },
  { name: "Pearl", accent: "Elegant and serene" },
];

const amenities = [
  { icon: BedDouble, t: "5 named rooms", b: "Diamond, Ruby, Jasmine, Emerald and Pearl — each uniquely styled." },
  { icon: Users, t: "Two lounges", b: "Separate upstairs and downstairs lounges for relaxation and meetings." },
  { icon: Utensils, t: "Dining & kitchen", b: "Fully equipped kitchen and dining area for home-style meals." },
  { icon: Wine, t: "Bush bar services", b: "On-demand bar service for drinks and evening ambience." },
  { icon: Flame, t: "Grills & games", b: "Outdoor grilling and in-house games for gatherings and events." },
  { icon: Wifi, t: "Fast Wi-Fi", b: "Work-ready connectivity throughout the house." },
  { icon: ShieldCheck, t: "24/7 security", b: "Gated estate with round-the-clock security." },
  { icon: Sparkles, t: "Housekeeping", b: "Professional cleaning between and during stays." },
  { icon: Car, t: "Secure parking", b: "On-site parking for guests and visitors." },
  { icon: MapPin, t: "Prime location", b: "8 Abdulrahim Babaita St, News Engineering Layout, Dawaki, Abuja." },
];

function House8Page() {
  return (
    <main className="bg-white">
      <section className="relative bg-burgundy text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold">House 8 Shortlet Apartments</p>
            <h1 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
              5-bedroom luxury shortlet apartment in the heart of Dawaki, Abuja
            </h1>
            <p className="mt-5 max-w-xl text-white/80">
              A fully serviced home with five named rooms — Diamond, Ruby, Jasmine, Emerald and Pearl — two lounges, dining, kitchen, bush bar services, grills and games. Ideal for families, teams, events and weekend stays.
            </p>
            <div className="mt-6 flex items-start gap-2 text-sm text-white/80">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>8 Abdulrahim Babaita Street, News Engineering Layout, Dawaki, Abuja</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#book" className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy hover:opacity-95">Check availability <ArrowRight className="size-4" /></a>
              <a href="https://wa.me/2348026065189" target="_blank" rel="noreferrer" className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Chat on WhatsApp</a>
            </div>
          </div>
          <img src={exteriorImg} alt="House 8 shortlet apartments exterior in Abuja" width={1600} height={1200} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl" />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">The rooms</h2>
          <p className="mt-4 max-w-2xl text-foreground/70">
            Every room at House 8 is named, freshly styled and furnished for comfort. Book a single room or reserve the entire house for your group.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {rooms.map((r) => (
              <div key={r.name} className="rounded-2xl border border-border bg-white p-5 text-center shadow-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/20 text-lg font-bold text-navy">{r.name[0]}</div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{r.name}</h3>
                <p className="mt-1 text-sm text-foreground/70">{r.accent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cloud px-6 py-20 lg:px-8">
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

      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2">
            <img src={poolImg} alt="House 8 swimming pool and thatched lounge area" loading="lazy" width={1600} height={1200} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
            <img src={exteriorImg} alt="House 8 landscaped courtyard entrance" loading="lazy" width={1600} height={1200} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
          </div>
          <p className="mt-4 text-sm text-foreground/60">On-site pool, outdoor lounge, grills and landscaped grounds for guests.</p>
        </div>
      </section>

      <section className="bg-navy px-6 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <img src={bedroomImg} alt="House 8 apartment bedroom with premium bedding" loading="lazy" width={1600} height={1200} className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Stay options</p>
            <h2 className="mt-3 font-serif text-3xl font-bold md:text-4xl">Nightly, weekly and monthly stays</h2>
            <p className="mt-4 text-white/80">
              Tell us your dates, preferred rooms, number of guests and purpose of stay. We will confirm availability, rates and payment details — usually within a few hours.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { t: "Nightly", b: "Short business trips and city visits" },
                { t: "Weekly", b: "Extended work or family stays" },
                { t: "Monthly", b: "Relocation and long assignments" },
              ].map((x) => (
                <div key={x.t} className="rounded-xl border border-white/20 bg-white/5 p-4">
                  <p className="font-serif font-semibold text-white">{x.t}</p>
                  <p className="mt-1 text-xs text-white/70">{x.b}</p>
                </div>
              ))}
            </div>
            <a href="#book" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy hover:opacity-95">Request your dates <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </section>

      <section id="book" className="scroll-mt-24 px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-burgundy">Booking enquiry</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Request your dates</h2>
            <p className="mt-4 text-foreground/70">
              Send us your stay details and our host team will confirm availability, rates and payment instructions — usually within a few hours.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: BedDouble, t: "Studio & 1-bedroom", b: "Ideal for solo travellers and couples" },
                { icon: Users, t: "2-bedroom apartment", b: "Families, small teams and longer stays" },
                { icon: ShieldCheck, t: "Verified & secure", b: "Gated estate, 24/7 security, direct host support" },
              ].map((x) => (
                <div key={x.t} className="flex gap-4 rounded-xl border border-border bg-white p-4">
                  <x.icon className="mt-0.5 size-5 shrink-0 text-burgundy" />
                  <div>
                    <p className="font-semibold text-navy">{x.t}</p>
                    <p className="text-sm text-foreground/70">{x.b}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-foreground/70">
              Prefer to chat?{" "}
              <a href="https://wa.me/2348026065189" target="_blank" rel="noreferrer" className="font-semibold text-burgundy underline">
                Message us on WhatsApp
              </a>
              .
            </p>
          </div>
          <BookingForm />
        </div>
      </section>
    </main>
  );
}

function BookingForm() {
  const submit = useServerFn(submitHouse8Booking);
  const [done, setDone] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => submit({ data: payload as never }),
    onSuccess: () => {
      setDone(true);
      toast.success("Booking enquiry sent — we'll be in touch shortly.");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not send your enquiry. Please try again."),
  });

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-cloud p-8">
        <h3 className="font-serif text-2xl font-bold text-navy">Enquiry received</h3>
        <p className="mt-3 text-foreground/70">
          Thank you — our host team has your request and will confirm availability and rates shortly.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-burgundy">
          Back to LoveTech Group <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const field = "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-burgundy";
  const label = "text-xs font-semibold uppercase tracking-wide text-foreground/60";

  return (
    <form
      className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
        mutation.mutate({
          full_name: raw.full_name,
          email: raw.email,
          phone: raw.phone,
          apartment_type: raw.apartment_type || null,
          check_in: raw.check_in || null,
          check_out: raw.check_out || null,
          guests: raw.guests ? Number(raw.guests) : null,
          purpose: raw.purpose || null,
          notes: raw.notes || null,
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="h8-name">Full name</label>
          <input id="h8-name" name="full_name" required maxLength={200} className={field} />
        </div>
        <div>
          <label className={label} htmlFor="h8-email">Email</label>
          <input id="h8-email" name="email" type="email" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="h8-phone">Phone / WhatsApp</label>
          <input id="h8-phone" name="phone" required className={field} />
        </div>
        <div>
          <label className={label} htmlFor="h8-in">Check-in</label>
          <input id="h8-in" name="check_in" type="date" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="h8-out">Check-out</label>
          <input id="h8-out" name="check_out" type="date" className={field} />
        </div>
        <div>
          <label className={label} htmlFor="h8-apt">Apartment type</label>
          <select id="h8-apt" name="apartment_type" className={field} defaultValue="1-bedroom apartment">
            <option>Studio apartment</option>
            <option>1-bedroom apartment</option>
            <option>2-bedroom apartment</option>
            <option>Not sure yet</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="h8-guests">Guests</label>
          <input id="h8-guests" name="guests" type="number" min={1} max={20} defaultValue={2} className={field} />
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="h8-purpose">Purpose of stay</label>
          <select id="h8-purpose" name="purpose" className={field} defaultValue="Business trip">
            <option>Business trip</option>
            <option>Family visit</option>
            <option>Staycation</option>
            <option>Relocation / long stay</option>
            <option>Other</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="h8-notes">Anything else we should know?</label>
          <textarea id="h8-notes" name="notes" rows={4} maxLength={2000} className={field} />
        </div>
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-burgundy px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
      >
        {mutation.isPending ? "Sending…" : "Send booking enquiry"} <ArrowRight className="size-4" />
      </button>
      <p className="mt-3 text-center text-xs text-foreground/60">No payment is taken online — we confirm availability first.</p>
    </form>
  );
}
