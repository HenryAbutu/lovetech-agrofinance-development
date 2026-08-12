import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Leaf, HeartPulse, Moon, Sparkles, Minus, Plus, ShoppingBag } from "lucide-react";
import { submitRubyChaiOrder } from "@/lib/rubychai.functions";
import teaImg from "@/assets/group/rubychai-tea.jpg";
import lifestyleImg from "@/assets/group/rubychai-lifestyle.jpg";

const URL = "https://lovetechgroup.lovable.app/ruby-chai";

export const Route = createFileRoute("/ruby-chai")({
  head: () => ({
    meta: [
      { title: "Ruby Chai Wellness — Herbal Teas & Everyday Wellness Rituals" },
      { name: "description", content: "Ruby Chai Wellness blends herbal teas and simple wellness rituals for calm, energy and everyday balance. Made for Nigerian homes and workdays." },
      { property: "og:title", content: "Ruby Chai Wellness" },
      { property: "og:description", content: "Herbal teas and simple wellness rituals for calm, energy and everyday balance." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: RubyChaiPage,
});

const blends = [
  { sku: "hibiscus-bloom", icon: Leaf, t: "Hibiscus Bloom", b: "Zobo-inspired hibiscus and rose — antioxidant-rich and caffeine free.", note: "Everyday", size: "20 tea bags", price: 6500 },
  { sku: "ginger-reset", icon: HeartPulse, t: "Ginger Reset", b: "Warming ginger, lemongrass and turmeric for digestion and immunity.", note: "Morning", size: "20 tea bags", price: 7000 },
  { sku: "calm-nights", icon: Moon, t: "Calm Nights", b: "Chamomile, mint and lavender to wind the day down gently.", note: "Evening", size: "20 tea bags", price: 7500 },
  { sku: "ritual-trio", icon: Sparkles, t: "Ritual Trio Gift Box", b: "All three blends in a gift-ready box — perfect for gifting or trying everything.", note: "Bestseller", size: "3 × 20 bags", price: 19500 },
];

const ngn = (n: number) => `₦${n.toLocaleString()}`;

function RubyChaiPage() {
  return (
    <main className="bg-white">
      <section className="bg-[#FBF3F4]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-rose/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-rose">Ruby Chai Wellness</p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-navy md:text-5xl">Small rituals. Real wellness.</h1>
            <p className="mt-5 max-w-xl text-foreground/70">
              Ruby Chai blends herbal teas that fit into real Nigerian days — a calm morning, a busy workday, a slow evening. Clean ingredients, honest flavour, no complicated routines.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#shop" className="inline-flex items-center gap-2 rounded-lg bg-rose px-6 py-3 text-sm font-semibold text-white hover:opacity-95">Shop the blends <ShoppingBag className="size-4" /></a>
              <a href="https://wa.me/2348026065189" target="_blank" rel="noreferrer" className="rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-cloud">Order on WhatsApp</a>
              <Link to="/contact" className="rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-cloud">Wholesale enquiry</Link>
            </div>
          </div>
          <img src={teaImg} alt="Ruby Chai herbal tea blend with hibiscus and botanicals" width={1600} height={1200} className="rounded-2xl object-cover shadow-xl" />
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">Our blends</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {blends.map((b) => (
              <div key={b.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <b.icon className="size-6 text-rose" />
                  <span className="rounded-full bg-rose/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose">{b.note}</span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{b.t}</h3>
                <p className="mt-2 text-sm text-foreground/70">{b.b}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">Ruby Chai products are food supplements and are not intended to diagnose, treat or cure any condition.</p>
        </div>
      </section>

      <section className="bg-cloud px-6 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <img src={lifestyleImg} alt="Woman enjoying a cup of Ruby Chai herbal tea" loading="lazy" width={1600} height={1200} className="rounded-2xl object-cover shadow-lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose">Why Ruby Chai</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Wellness that fits your day, not the other way round</h2>
            <ul className="mt-6 space-y-3 text-sm text-foreground/75">
              {["Naturally caffeine-free herbal blends", "Locally sourced botanicals where possible", "Hand-blended in small, fresh batches", "Gifting and corporate packs available"].map((x) => (
                <li key={x} className="flex gap-2"><Sparkles className="mt-0.5 size-4 shrink-0 text-rose" />{x}</li>
              ))}
            </ul>
            <a href="https://wa.me/2348026065189" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">Place an order <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}
