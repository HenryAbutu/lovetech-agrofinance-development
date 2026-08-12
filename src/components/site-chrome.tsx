import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck, ChevronDown, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/LoveTech_Logo.png.asset.json";
import { getActiveSupabaseSession, supabase } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/learner.functions";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/advisory", label: "Advisory & Academy" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export const businesses = [
  {
    to: "/advisory",
    name: "LoveTech Advisory & Academy",
    tagline: "Business advisory, finance readiness and practical training",
    accent: "text-teal",
    dot: "bg-teal",
  },
  {
    to: "/house-8",
    name: "House 8 Shortlet Apartments",
    tagline: "Premium short-stay apartments in Abuja",
    accent: "text-burgundy",
    dot: "bg-burgundy",
  },
  {
    to: "/ruby-chai",
    name: "Ruby Chai Wellness",
    tagline: "Herbal teas and everyday wellness rituals",
    accent: "text-rose",
    dot: "bg-rose",
  },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const fetchAdmin = useServerFn(checkIsAdmin);

  useEffect(() => {
    let active = true;
    async function check() {
      const session = await getActiveSupabaseSession();
      if (!active) return;
      const signedIn = !!session?.user;
      setAuthed(signedIn);
      if (!signedIn) { setIsAdmin(false); return; }
      try {
        const r = await fetchAdmin();
        if (active) setIsAdmin(!!r.isAdmin);
      } catch { if (active) setIsAdmin(false); }
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [fetchAdmin]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="hidden bg-navy px-6 py-2 text-center text-xs font-medium tracking-wide text-white/85 lg:block lg:px-8">
        One group, three businesses — advisory & academy, premium shortlets, and wellness. <Link to="/contact" className="ml-1 font-semibold text-gold hover:underline">Talk to us</Link>
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logoAsset.url} alt="LoveTech Group" className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/75 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <button
              className="flex items-center gap-1 transition-colors hover:text-navy"
              onClick={() => setMega((v) => !v)}
              aria-expanded={mega}
            >
              Our Businesses <ChevronDown className="size-4" />
            </button>
            {mega && (
              <div className="absolute left-1/2 top-full w-[36rem] -translate-x-1/2 pt-3">
                <div className="grid gap-2 rounded-2xl border border-border bg-white p-3 shadow-xl">
                  {businesses.map((b) => (
                    <Link
                      key={b.to}
                      to={b.to}
                      onClick={() => setMega(false)}
                      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-cloud"
                    >
                      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${b.dot}`} />
                      <span className="min-w-0">
                        <span className="block font-serif text-sm font-semibold text-navy">{b.name}</span>
                        <span className="block text-xs text-muted-foreground">{b.tagline}</span>
                      </span>
                      <ArrowRight className="ml-auto mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-navy"
              activeProps={{ className: "text-navy font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm font-semibold text-navy hover:bg-gold/20 lg:inline-flex"
            >
              <ShieldCheck className="size-4" /> Admin
            </Link>
          )}
          {authed ? (
            <Link
              to="/academy/dashboard"
              className="hidden rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-cloud lg:inline-flex"
            >
              My Academy
            </Link>
          ) : authed === false ? (
            <Link
              to="/login"
              className="hidden rounded-lg border border-navy/20 bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-cloud lg:inline-flex"
            >
              Sign in
            </Link>
          ) : null}
          <Link
            to="/contact"
            className="hidden rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 lg:inline-flex"
          >
            Book a Consultation
          </Link>
          <button
            aria-label="Toggle menu"
            className="grid size-10 place-items-center rounded-lg border border-border text-navy lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm font-medium">
            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Our Businesses</p>
            {businesses.map((b) => (
              <Link
                key={b.to}
                to={b.to}
                className="rounded-md px-3 py-2 text-foreground/80 hover:bg-cloud"
                onClick={() => setOpen(false)}
              >
                {b.name}
              </Link>
            ))}
            <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Group</p>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-cloud hover:text-navy"
                activeProps={{ className: "text-navy font-semibold bg-cloud" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-center text-sm font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck className="size-4" /> Admin
              </Link>
            )}
            {authed ? (
              <Link
                to="/academy/dashboard"
                className="mt-2 rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-center text-sm font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                My Academy
              </Link>
            ) : authed === false ? (
              <Link
                to="/login"
                className="mt-2 rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-center text-sm font-semibold text-navy"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
            ) : null}
            <Link
              to="/contact"
              className="mt-2 rounded-lg bg-navy px-4 py-2.5 text-center text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Book a Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function NextStepBand() {
  return (
    <section className="border-t border-border bg-cloud px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-teal">Next Step</p>
        <h2 className="mb-4 font-serif text-4xl font-bold text-navy md:text-5xl">Let's find the right entry point for you</h2>
        <p className="mx-auto mb-8 max-w-2xl text-foreground/70">
          Whether you need advisory and finance readiness, a practical course, a premium place to stay in Abuja, or a wellness ritual you can trust — LoveTech Group has a door for you.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95">Book a Consultation</Link>
          <Link to="/finance-readiness" className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy shadow-sm hover:opacity-95">Start Diagnostic</Link>
          <Link to="/academy" className="rounded-lg border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-white/70">Explore Academy</Link>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-white/75">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <img src={logoAsset.url} alt="LoveTech Group" className="h-8 w-auto rounded-sm bg-white px-2 py-1" />
          </div>
          <p className="max-w-md text-sm leading-relaxed">
            LoveTech Group is a Nigerian holding group building structured, fundable and growth-ready enterprises — and premium lifestyle experiences — across advisory, education, hospitality and wellness.
          </p>
          <div className="mt-6 space-y-1 text-sm">
            <p>27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja, Nigeria</p>
            <p>+234 802 606 5189</p>
            <p>info@lovetechgroup.com.ng</p>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Our Businesses</h4>
          <ul className="space-y-3 text-sm">
            {businesses.map((b) => (
              <li key={b.to}>
                <Link to={b.to} className="transition-colors hover:text-gold">{b.name}</Link>
              </li>
            ))}
            <li><Link to="/academy" className="transition-colors hover:text-gold">Academy Courses</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Group</h4>
          <ul className="space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-gold">{l.label}</Link>
              </li>
            ))}
            <li><Link to="/finance-readiness" className="transition-colors hover:text-gold">Finance Readiness</Link></li>
            <li><Link to="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-gold">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50 lg:px-8">
        © {new Date().getFullYear()} LoveTech Group. All rights reserved.
      </div>
    </footer>
  );
}
