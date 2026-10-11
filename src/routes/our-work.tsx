import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import hero from "@/assets/group/academy-workshop.jpg";
import { Button } from "@/components/ui/button";
import { PhotoHero, Eyebrow, ConsultationCTA } from "@/components/website/presentation";
import { websiteHead, experienceNote } from "@/components/website/content";
export const Route = createFileRoute("/our-work")({
  head: () =>
    websiteHead(
      "Our Work & Professional Experience",
      "A transparent distinction between founder/team prior professional experience and contracts awarded to Lovetech Agrofinance & Development Ltd.",
    ),
  component: Work,
});
function Work() {
  return (
    <main className="website">
      <PhotoHero
        label="Our work & experience"
        title="Experience, with clear attribution."
        text="We distinguish the experience our people bring from the work formally awarded to Lovetech Agrofinance & Development Ltd."
        image={hero}
        alt="An African business training workshop"
      >
        <Button asChild variant="websiteLight" className="web-button">
          <Link to="/contact">
            Discuss a collaboration <ArrowUpRight />
          </Link>
        </Button>
      </PhotoHero>
      <section className="web-section">
        <div className="web-container">
          <Eyebrow>A clear reporting boundary</Eyebrow>
          <h2 className="web-heading">Prior experience is not a company contract.</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">{experienceNote}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <article className="rounded-lg border border-border p-7">
              <Eyebrow>Founder / team prior professional experience</Eyebrow>
              <h3 className="web-card-title">Capability brought into Lovetech</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Enterprise development, training, finance readiness, agribusiness and institutional
                support are areas of professional expertise. Programme names, dates, roles and
                supporting evidence are awaiting approval before detailed publication.
              </p>
              <p className="mt-5 text-sm font-medium text-primary">
                Historical scope & reporting periods: awaiting verification
              </p>
            </article>
            <article className="rounded-lg border border-border bg-secondary p-7">
              <Eyebrow>Lovetech Ltd company-awarded contracts</Eyebrow>
              <h3 className="web-card-title">Company work, separately documented</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Approved contract details and company case studies are awaiting publication. We do
                not present bids as awards, or prior GIZ/ICSS professional work as Lovetech Ltd
                contracts.
              </p>
              <p className="mt-5 text-sm font-medium text-primary">
                Verified company case studies: awaiting approval
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="web-section bg-muted">
        <div className="web-container">
          <Eyebrow>Evidence before claims</Eyebrow>
          <h2 className="web-heading">What an approved case study will include.</h2>
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Client approval & attribution",
              "Dates, context & agreed scope",
              "Lovetech’s documented role",
              "Verified outputs & results",
            ].map((t) => (
              <div key={t} className="border-t border-border pt-5 text-base font-semibold">
                {t}
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-muted-foreground">
            We publish client feedback only with permission. No testimonial or client logo is shown
            here without approval.
          </p>
        </div>
      </section>
      <ConsultationCTA />
    </main>
  );
}
