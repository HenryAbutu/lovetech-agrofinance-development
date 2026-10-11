import { Link, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck, ChevronDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceContent } from "@/components/website/content";
import logoAssetSrc from "@/assets/LoveTech_Logo.png";
const logoAsset = { url: logoAssetSrc };
import { getActiveSupabaseSession, supabase, signOutAndRedirect } from "@/lib/supabase";
import { checkIsAdmin } from "@/lib/learner.functions";

const navLinks = [
 { to: "/about", label: "About" },
 { to: "/academy", label: "Academy" },
 { to: "/who-we-serve", label: "Who We Serve" },
 { to: "/our-work", label: "Our Work" },
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
    tagline: "5-bedroom luxury apartment in Dawaki, Abuja",
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [who, setWho] = useState("");
  const fetchAdmin = useServerFn(checkIsAdmin);

  useEffect(() => {
    let active = true;
    async function apply(user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null | undefined) {
      if (!active) return;
      setAuthed(!!user);
      const meta = user?.user_metadata ?? {};
      setWho(String(meta.full_name ?? meta.name ?? user?.email ?? ""));
      if (!user) { setIsAdmin(false); return; }
      try {
        const r = await fetchAdmin();
        if (active) setIsAdmin(!!r.isAdmin);
      } catch { if (active) setIsAdmin(false); }
    }
    async function check() {
      let user = (await getActiveSupabaseSession())?.user ?? null;
      if (!user) user = (await supabase.auth.getSession()).data.session?.user ?? null;
      await apply(user);
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) void apply(session.user);
      else if (event === "SIGNED_OUT") void apply(null);
    });
    return () => { active = false; sub.subscription.unsubscribe(); };
  }, [fetchAdmin]);

  function signOut() {
    setOpen(false);
    void signOutAndRedirect("/login");
  }

  return (
    <header className="website sticky top-0 z-50 border-b border-border bg-background">
      <div className="hidden border-b border-border bg-secondary lg:block"><div className="web-container flex items-center justify-between py-2 text-[10px] text-muted-foreground"><span>Enterprise development · Finance readiness · Institutional capability</span><a href="mailto:info@lovetechgroup.com.ng" className="hover:text-primary">info@lovetechgroup.com.ng</a></div></div>
      <div className="mx-auto flex min-h-20 max-w-[1440px] items-center justify-between gap-5 px-5 lg:px-8">
        <Link to="/" aria-label="Lovetech home" className="flex shrink-0 items-center gap-3" onClick={()=>setOpen(false)}><img src={logoAsset.url} alt="Lovetech" className="h-11 w-auto max-w-28 object-contain"/><span className="hidden border-l border-border pl-3 text-[10px] font-semibold leading-relaxed text-primary sm:block">AGROFINANCE &<br/>DEVELOPMENT LTD</span></Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-5 whitespace-nowrap text-xs font-medium xl:flex">
          <Link to="/about" activeProps={{className:"text-primary underline underline-offset-4"}} className="hover:text-primary">About</Link>
          <details className="relative"><summary className="flex cursor-pointer list-none items-center gap-1 py-5 hover:text-primary">Advisory Services <ChevronDown className="size-3"/></summary><div className="web-dropdown"><Link to="/advisory" className="block border-b border-border px-3 py-3 font-semibold hover:bg-muted">All Advisory Services</Link>{serviceContent.map(s=><Link key={s.id} to={s.to} className="block whitespace-normal px-3 py-3 leading-relaxed hover:bg-muted">{s.title}</Link>)}</div></details>
          {navLinks.slice(1).map(l=><Link key={l.to} to={l.to} activeProps={{className:"text-primary underline underline-offset-4"}} className="hover:text-primary">{l.label}</Link>)}
        </nav>
        <div className="flex items-center gap-2">
          {isAdmin&&<Button asChild variant="ghost" className="hidden px-2 lg:inline-flex"><Link to="/admin"><ShieldCheck/>Admin</Link></Button>}
          {authed&&<><Button asChild variant="ghost" className="hidden px-2 lg:inline-flex"><Link to="/academy/dashboard">My Academy</Link></Button><Button variant="ghost" onClick={signOut} className="hidden px-2 lg:inline-flex" title={who ? `Signed in as ${who}` : undefined}>Sign Out</Button></>}
          {authed===false&&<Button asChild variant="ghost" className="hidden px-2 lg:inline-flex"><Link to="/login">Login</Link></Button>}
          <Button asChild className="hidden h-11 rounded px-4 text-xs lg:inline-flex"><Link to="/contact">Book Consultation <ArrowUpRight/></Link></Button>
          <Button variant="outline" size="icon" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(v=>!v)} className="xl:hidden">{open?<X/>:<Menu/>}</Button>
        </div>
      </div>
      {open&&<nav aria-label="Mobile navigation" className="max-h-[calc(100dvh-80px)] overflow-y-auto border-t border-border px-6 py-5 xl:hidden"><Link to="/" onClick={()=>setOpen(false)} className="block py-3 text-sm">Home</Link><Link to="/about" onClick={()=>setOpen(false)} className="block py-3 text-sm">About Lovetech</Link><details className="border-y border-border"><summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm">Advisory Services <ChevronDown className="size-4"/></summary><div className="pb-3 pl-4"><Link to="/advisory" onClick={()=>setOpen(false)} className="block py-3 text-sm">All Advisory Services</Link>{serviceContent.map(s=><Link key={s.id} to={s.to} onClick={()=>setOpen(false)} className="block py-3 text-sm">{s.title}</Link>)}</div></details>{navLinks.slice(1).map(l=><Link key={l.to} to={l.to} onClick={()=>setOpen(false)} className="block py-3 text-sm">{l.label}</Link>)}<div className="mt-4 grid gap-3 border-t border-border pt-5">{isAdmin&&<Button asChild variant="outline"><Link to="/admin" onClick={()=>setOpen(false)}><ShieldCheck/>Admin</Link></Button>}{authed?<><Button asChild variant="outline"><Link to="/academy/dashboard" onClick={()=>setOpen(false)}>My Academy</Link></Button><Button variant="ghost" onClick={signOut}>Sign Out</Button>{who&&<p className="break-words text-center text-xs text-muted-foreground">Signed in as {who}</p>}</>:authed===false?<><Button asChild variant="outline"><Link to="/login" onClick={()=>setOpen(false)}>Login</Link></Button><Button asChild variant="ghost"><Link to="/signup" onClick={()=>setOpen(false)}>Join Academy</Link></Button></>:null}<Button asChild className="web-button"><Link to="/contact" onClick={()=>setOpen(false)}>Book a Consultation <ArrowUpRight/></Link></Button></div></nav>}
    </header>
  );
}

export function NextStepBand() {
  const { pathname } = useLocation();
  if (["/", "/about", "/advisory", "/finance-advisory", "/agribusiness-development", "/digital-ai-solutions", "/programme-support", "/who-we-serve", "/our-work"].includes(pathname)) return null;
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
 const columns = [
   {title:"Advisory",links:[...serviceContent.map(s=>({to:s.to,label:s.title})),{to:"/finance-readiness",label:"Finance Diagnostic"}]},
  {title:"Academy",links:[{to:"/academy",label:"Explore courses"},{to:"/academy/dashboard",label:"My Academy"},{to:"/signup",label:"Join Academy"},{to:"/login",label:"Login"}]},
  {title:"Company",links:[{to:"/about",label:"About Lovetech"},{to:"/who-we-serve",label:"Who We Serve"},{to:"/our-work",label:"Our Work"},{to:"/programmes",label:"Programmes"},{to:"/insights",label:"Insights"},{to:"/contact",label:"Contact"}]},
  {title:"Group Ventures",links:[{to:"/house-8",label:"House 8 Apartments"},{to:"/ruby-chai",label:"Ruby Chai Wellness"}]},
 ] as const;
 return <footer className="website"><div className="bg-navy-deep text-primary-foreground"><div className="web-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_.7fr_.7fr_.8fr]"><div><img src={logoAsset.url} alt="Lovetech" className="mb-5 h-12 w-auto rounded bg-background px-2 py-1"/><h2 className="text-sm font-semibold leading-relaxed">Lovetech Agrofinance<br/>& Development Ltd</h2><p className="mt-4 text-xs leading-relaxed text-primary-foreground/70">27, 3rd Avenue, Aldenco Estate,<br/>Galadimawa, Abuja, Nigeria</p><a href="tel:+2348026065189" className="mt-4 block text-xs hover:text-accent">+234 802 606 5189</a><a href="mailto:info@lovetechgroup.com.ng" className="mt-2 block break-all text-xs hover:text-accent">info@lovetechgroup.com.ng</a></div>{columns.map(c=><div key={c.title}><h3 className="mb-5 text-xs font-semibold">{c.title}</h3><ul className="space-y-3">{c.links.map(l=><li key={l.to}><Link to={l.to} className="text-xs leading-relaxed text-primary-foreground/70 hover:text-accent">{l.label}</Link></li>)}</ul></div>)}</div><div className="border-t border-primary-foreground/15"><div className="web-container flex flex-wrap justify-between gap-4 py-6 text-[11px] text-primary-foreground/60"><p>© {new Date().getFullYear()} Lovetech Agrofinance & Development Ltd. All rights reserved.</p><div className="flex flex-wrap gap-5"><Link to="/privacy-policy" className="hover:text-accent">Privacy Policy</Link><Link to="/terms-of-service" className="hover:text-accent">Terms of Service</Link></div></div></div></div></footer>;
}
