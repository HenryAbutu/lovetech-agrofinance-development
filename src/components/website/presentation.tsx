import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceContent, experienceNote } from "./content";
import type { ReactNode } from "react";
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="web-eyebrow">{children}</p>;
}
export function PhotoHero({
  label,
  title,
  text,
  image,
  alt,
  children,
}: {
  label: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  children?: ReactNode;
}) {
  return (
    <section className="web-photo-hero">
      <img src={image} alt={alt} fetchPriority="high" className="web-hero-image" />
      <div className="web-hero-shade" />
      <div className="web-container relative py-16 lg:py-24">
        <div className="max-w-3xl">
          <Eyebrow>{label}</Eyebrow>
          <h1 className="web-title">{title}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/90 md:text-lg">
            {text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
export function ConsultationCTA() {
  return (
    <section className="web-section bg-primary text-primary-foreground">
      <div className="web-container flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div>
          <Eyebrow>Let’s move forward</Eyebrow>
          <h2 className="web-heading">What would you like to strengthen?</h2>
          <p className="mt-4 text-primary-foreground/80">
            A business, a team, a system or a programme. Let’s start there.
          </p>
        </div>
        <Button asChild variant="websiteLight" className="web-button shrink-0">
          <Link to="/contact">
            Book a Consultation <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
export function ServiceCards() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {serviceContent.slice(0, 3).map((s) => (
        <article
          key={s.id}
          className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
        >
          <Link to={s.to} aria-label={s.title} className="overflow-hidden">
            <img
              src={s.image}
              alt={s.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          <div className="flex flex-1 flex-col p-6">
            <p className="web-eyebrow">{s.number} / Advisory</p>
            <h3 className="web-card-title">{s.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
            <Button asChild variant="link" className="mt-6 justify-start self-start px-0">
              <Link to={s.to}>
                Explore service <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
export function ServicePage({ id }: { id: string }) {
  const s = serviceContent.find((x) => x.id === id);
  if (!s) return null;
  return (
    <main className="website">
      <PhotoHero
        label="Lovetech / Advisory services"
        title={s.title}
        text={s.short}
        image={s.image}
        alt={s.alt}
      >
        <Button asChild variant="websiteLight" className="web-button">
          <Link to={s.ctaTo}>
            {s.cta}
            <ArrowRight />
          </Link>
        </Button>
      </PhotoHero>
      <section className="web-section">
        <div className="web-container grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Eyebrow>A practical starting point</Eyebrow>
            <h2 className="web-heading">{s.intro.split(". ")[0]}.</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              {s.intro.substring(s.intro.indexOf(". ") + 2)}
            </p>
          </div>
          <div className="border-l border-border pl-7">
            <Eyebrow>Problems we help solve</Eyebrow>
            {s.problems.map((p) => (
              <p key={p} className="flex gap-3 border-b border-border py-5">
                <Check className="size-5 shrink-0 text-primary" />
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section className="web-section bg-secondary">
        <div className="web-container">
          <Eyebrow>Useful outputs, not just advice</Eyebrow>
          <h2 className="web-heading">What we can help you build</h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.deliverables.map((d, i) => (
              <article key={d} className="rounded-lg border border-border bg-card p-6">
                <span className="text-sm text-primary">0{i + 1}</span>
                <h3 className="mt-6 text-lg font-semibold leading-snug">{d}</h3>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Scope, deliverables and timelines are agreed with you before work begins.
          </p>
        </div>
      </section>
      <section className="web-section">
        <div className="web-container">
          <Eyebrow>Our approach</Eyebrow>
          <h2 className="web-heading">Understand. Prepare. Put it to work.</h2>
          <ol className="mt-9 grid gap-8 md:grid-cols-3">
            {[
              ["Listen & diagnose", "Understand the challenge, current systems and priorities."],
              [
                "Agree a practical plan",
                "Define the work, tools and support that fit your context.",
              ],
              ["Support & review", "Build capability, support implementation and review progress."],
            ].map(([t, b], i) => (
              <li key={t} className="border-t border-border pt-6">
                <p className="text-sm text-primary">0{i + 1}</p>
                <h3 className="mt-4 web-card-title">{t}</h3>
                <p className="mt-3 text-muted-foreground">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="web-section bg-muted">
        <div className="web-container grid gap-10 md:grid-cols-2">
          <div>
            <Eyebrow>Who this is for</Eyebrow>
            <h2 className="web-heading">Support shaped around your context.</h2>
            <p className="mt-5 text-muted-foreground">{s.audience}</p>
            <Button asChild variant="link" className="mt-5 px-0">
              <Link to="/who-we-serve">
                Who we serve <ArrowRight />
              </Link>
            </Button>
          </div>
          <div>
            <Eyebrow>Experience & accountability</Eyebrow>
            <p className="leading-relaxed text-muted-foreground">{experienceNote}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Engagement-specific references and case studies will be shared only after verification
              and approval.
            </p>
            <Button asChild variant="link" className="mt-5 px-0">
              <Link to="/our-work">
                Our work & experience <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </main>
  );
}
