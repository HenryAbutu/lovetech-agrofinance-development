import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import hero from "@/assets/academy-hero-v3.jpg";
import { Button } from "@/components/ui/button";
import { PhotoHero, Eyebrow, ConsultationCTA } from "@/components/website/presentation";
import { websiteHead, audienceContent } from "@/components/website/content";
export const Route = createFileRoute("/who-we-serve")({
  head: () =>
    websiteHead(
      "Who We Serve",
      "Practical advisory for MSMEs, agribusinesses, cooperatives, development partners, public institutions and financial institutions.", "/who-we-serve"
    ),
  component: Audience,
});
function Audience() {
  return (
    <main className="website">
      <PhotoHero
        label="Who we serve"
        title="Different contexts. Shared ambition."
        text="We shape support around the people, enterprises and institutions doing the work — and the challenges they want to solve."
        image={hero}
        alt="African entrepreneurs working together in a business setting"
      >
        <Button asChild variant="websiteLight" className="web-button">
          <Link to="/contact">
            Discuss your needs <ArrowUpRight />
          </Link>
        </Button>
      </PhotoHero>
      <section className="web-section">
        <div className="web-container">
          <Eyebrow>Support shaped around you</Eyebrow>
          <h2 className="web-heading">Find your starting point.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {audienceContent.map(([t, b], i) => (
              <article
                key={t}
                className="flex flex-col rounded-lg border border-border bg-card p-7"
              >
                <span className="text-sm text-primary">0{i + 1}</span>
                <h3 className="mt-5 web-card-title">{t}</h3>
                <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{b}</p>
                <Button asChild variant="link" className="mt-6 justify-start self-start px-0">
                  <Link to="/contact">
                    Start a conversation <ArrowUpRight />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="web-section bg-secondary">
        <div className="web-container">
          <Eyebrow>One connected offer</Eyebrow>
          <h2 className="web-heading">Advisory, learning and implementation.</h2>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Choose focused consulting support, practical learning through the Academy, or a
            coordinated programme approach.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild className="web-button">
              <Link to="/advisory">
                Explore Advisory <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild variant="outline" className="web-button">
              <Link to="/academy">
                Explore Academy <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </main>
  );
}
