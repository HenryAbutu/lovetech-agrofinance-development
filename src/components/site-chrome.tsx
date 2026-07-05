import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/LoveTech_Logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { checkIsAdmin } from "@/lib/learner.functions";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/finance-readiness", label: "Finance Readiness" },
  { to: "/academy", label: "Academy" },
  { to: "/insights", label: "Insights" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const fetchAdmin = useServerFn(checkIsAdmin);

  useEffect(() => {
    let active = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (!data.session?.user) { setIsAdmin(false); return; }
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <img src={logoAsset.url} alt="LoveTech Agrofinance & Development Ltd" className="h-10 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/75 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-vetiver"
              activeProps={{ className: "text-vetiver font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="hidden items-center gap-1.5 rounded-lg border border-ochre/40 bg-ochre/10 px-3 py-2 text-sm font-semibold text-ochre hover:bg-ochre/15 lg:inline-flex"
            >
              <ShieldCheck className="size-4" /> Admin
            </Link>
          )}
          <Link
            to="/contact"
            className="hidden rounded-lg bg-vetiver px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 lg:inline-flex"
          >
            Book a Consultation
          </Link>
          <button
            aria-label="Toggle menu"
            className="grid size-10 place-items-center rounded-lg border border-border text-vetiver lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-white lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm font-medium">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-foreground/75 hover:bg-muted hover:text-vetiver"
                activeProps={{ className: "text-vetiver font-semibold bg-vetiver/5" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-ochre/40 bg-ochre/10 px-4 py-2.5 text-center text-sm font-semibold text-ochre"
                onClick={() => setOpen(false)}
              >
                <ShieldCheck className="size-4" /> Admin
              </Link>
            )}
            <Link
              to="/contact"
              className="mt-2 rounded-lg bg-vetiver px-4 py-2.5 text-center text-sm font-semibold text-white"
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
    <section className="border-t border-border bg-[#FFF8E7] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ochre">Next Step</p>
        <h2 className="mb-4 font-serif text-4xl text-vetiver md:text-5xl">Ready to move from hustle to structure?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-foreground/70">
          Whether you need training, finance readiness, business planning, digital tools, or implementation support, LoveTech Agrofinance & Development can help you take the next practical step.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/contact" className="rounded-lg bg-vetiver px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95">Book a Consultation</Link>
          <Link to="/finance-readiness" className="rounded-lg bg-ochre px-6 py-3 text-sm font-semibold text-ink shadow-sm hover:opacity-95">Start Diagnostic</Link>
          <Link to="/academy" className="rounded-lg border border-vetiver/25 bg-white px-6 py-3 text-sm font-semibold text-vetiver hover:bg-vetiver/5">Explore Academy</Link>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1F2933] text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <img src={logoAsset.url} alt="LoveTech" className="h-8 w-auto rounded-sm bg-white px-2 py-1" />
          </div>
          <p className="max-w-md text-sm leading-relaxed">
            Helping Nigerian MSMEs, agribusinesses, and professionals build structured, fundable, and growth-ready enterprises.
          </p>
          <div className="mt-6 space-y-1 text-sm">
            <p>27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja, Nigeria</p>
            <p>+234 802 606 5189</p>
            <p>info@lovetechgroup.com.ng</p>
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Explore</h4>
          <ul className="space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-ochre">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" className="transition-colors hover:text-ochre">Book a Consultation</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" className="hover:text-ochre">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-ochre">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/50 lg:px-8">
        © {new Date().getFullYear()} LoveTech Agrofinance & Development Ltd. All rights reserved.
      </div>
    </footer>
  );
}
