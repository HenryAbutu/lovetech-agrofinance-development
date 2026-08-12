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

      <Shop />

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
            <a href="#shop" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white hover:opacity-95">Place an order <ArrowRight className="size-4" /></a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Shop() {
  const submit = useServerFn(submitRubyChaiOrder);
  const [qty, setQty] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const items = useMemo(
    () =>
      blends
        .filter((b) => (qty[b.sku] ?? 0) > 0)
        .map((b) => ({ sku: b.sku, name: b.t, unit_price: b.price, quantity: qty[b.sku]! })),
    [qty],
  );
  const total = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => submit({ data: payload as never }),
    onSuccess: () => {
      setDone(true);
      toast.success("Order received — we'll confirm payment and delivery shortly.");
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not send your order. Please try again."),
  });

  const bump = (sku: string, delta: number) =>
    setQty((prev) => ({ ...prev, [sku]: Math.max(0, Math.min(500, (prev[sku] ?? 0) + delta)) }));

  const field = "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-rose";
  const label = "text-xs font-semibold uppercase tracking-wide text-foreground/60";

  return (
    <section id="shop" className="scroll-mt-24 px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">Shop our blends</h2>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Choose your blends, tell us where to deliver, and we'll confirm your order with payment and delivery details.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {blends.map((b) => {
            const count = qty[b.sku] ?? 0;
            return (
              <div key={b.sku} className="flex flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <b.icon className="size-6 text-rose" />
                  <span className="rounded-full bg-rose/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose">{b.note}</span>
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-navy">{b.t}</h3>
                <p className="mt-2 flex-1 text-sm text-foreground/70">{b.b}</p>
                <p className="mt-3 text-xs text-muted-foreground">{b.size}</p>
                <p className="mt-1 font-semibold text-navy">{ngn(b.price)}</p>
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border p-1.5">
                  <button type="button" aria-label={`Reduce ${b.t}`} onClick={() => bump(b.sku, -1)} className="grid size-8 place-items-center rounded-md hover:bg-cloud">
                    <Minus className="size-4" />
                  </button>
                  <span className="text-sm font-semibold text-navy">{count}</span>
                  <button type="button" aria-label={`Add ${b.t}`} onClick={() => bump(b.sku, 1)} className="grid size-8 place-items-center rounded-md hover:bg-cloud">
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Ruby Chai products are food supplements and are not intended to diagnose, treat or cure any condition.</p>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-2xl border border-border bg-[#FBF3F4] p-6 sm:p-8">
            <h3 className="font-serif text-xl font-semibold text-navy">Your order</h3>
            {items.length === 0 ? (
              <p className="mt-4 text-sm text-foreground/70">No items selected yet — use the + buttons above to build your order.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {items.map((i) => (
                  <li key={i.sku} className="flex justify-between gap-4">
                    <span>{i.quantity} × {i.name}</span>
                    <span className="font-semibold text-navy">{ngn(i.unit_price * i.quantity)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 flex justify-between border-t border-navy/10 pt-4 text-sm font-semibold text-navy">
              <span>Estimated total</span>
              <span>{ngn(total)}</span>
            </div>
            <p className="mt-3 text-xs text-foreground/60">Delivery is quoted separately based on your location.</p>
          </div>

          {done ? (
            <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-navy">Order received</h3>
              <p className="mt-3 text-foreground/70">
                Thank you — we've got your order and will reach out shortly with payment and delivery details.
              </p>
              <Link to="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-rose">
                Back to LoveTech Group <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <form
              className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
              onSubmit={(e) => {
                e.preventDefault();
                if (items.length === 0) {
                  toast.error("Please select at least one blend first.");
                  return;
                }
                const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
                mutation.mutate({
                  full_name: raw.full_name,
                  email: raw.email,
                  phone: raw.phone,
                  city: raw.city || null,
                  delivery_address: raw.delivery_address || null,
                  notes: raw.notes || null,
                  items,
                });
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="rc-name">Full name</label>
                  <input id="rc-name" name="full_name" required maxLength={200} className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="rc-email">Email</label>
                  <input id="rc-email" name="email" type="email" required className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="rc-phone">Phone / WhatsApp</label>
                  <input id="rc-phone" name="phone" required className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="rc-city">City / State</label>
                  <input id="rc-city" name="city" className={field} />
                </div>
                <div>
                  <label className={label} htmlFor="rc-address">Delivery address</label>
                  <input id="rc-address" name="delivery_address" className={field} />
                </div>
                <div className="sm:col-span-2">
                  <label className={label} htmlFor="rc-notes">Notes (gift message, preferred delivery day…)</label>
                  <textarea id="rc-notes" name="notes" rows={3} maxLength={2000} className={field} />
                </div>
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose px-6 py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
              >
                {mutation.isPending ? "Sending…" : `Place order${total > 0 ? ` — ${ngn(total)}` : ""}`} <ShoppingBag className="size-4" />
              </button>
              <p className="mt-3 text-center text-xs text-foreground/60">No payment online — we confirm your order and share payment details.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
