import { Link } from "@tanstack/react-router";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/programmes", label: "Programmes" },
  { to: "/finance-readiness", label: "Finance Readiness" },
  { to: "/academy", label: "Academy" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-sm bg-vetiver">
            <span className="size-3 rotate-45 bg-ochre" />
          </span>
          <span className="font-serif text-xl tracking-tight text-vetiver">LoveTech</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/70 lg:flex">
          {navLinks.slice(1, -1).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-vetiver"
              activeProps={{ className: "text-vetiver" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/contact"
          className="rounded-sm bg-ochre px-4 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
        >
          Book a Consultation
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-bone/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <span className="size-6 rounded-sm bg-ochre" />
            <span className="font-serif text-xl text-bone">LoveTech Agrofinance & Development Ltd</span>
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
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-bone">Explore</h4>
          <ul className="space-y-3 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition-colors hover:text-ochre">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-bone">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/privacy" className="hover:text-ochre">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-ochre">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-6 text-center text-xs text-bone/50 lg:px-8">
        © {new Date().getFullYear()} LoveTech Agrofinance & Development Ltd. All rights reserved.
      </div>
    </footer>
  );
}
