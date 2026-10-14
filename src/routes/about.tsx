import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import hero from "@/assets/academy-hero-v3.jpg";
import founder from "@/assets/avess-abutu.png";
import { Button } from "@/components/ui/button";
import { PhotoHero, Eyebrow, ConsultationCTA } from "@/components/website/presentation";
import { websiteHead, experienceNote } from "@/components/website/content";
export const Route = createFileRoute("/about")({
  head: () =>
    websiteHead(
      "About Lovetech",
      "Advisory rooted in real business challenges. Meet Lovetech Agrofinance & Development Ltd and founder Avess Swile Abutu.", "/about"
    ),
  component: About,
});
function About() {
  return (
    <main className="website">
      <PhotoHero
        label="About Lovetech"
        title="Advisory rooted in real business challenges."
        text="We work alongside businesses and institutions to turn practical challenges into clearer plans, stronger skills and better systems."
        image={hero}
        alt="An African business advisory and training setting"
      >
        <Button asChild variant="websiteLight" className="web-button">
          <Link to="/contact">
            Work with Lovetech <ArrowUpRight />
          </Link>
        </Button>
      </PhotoHero>
      <section className="web-section">
        <div className="web-container grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="web-heading">
              Practical preparation.
              <br />
              Lasting capability.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Lovetech Agrofinance & Development Ltd supports entrepreneurs, agribusinesses,
              financial institutions and development partners with advisory, capacity building and
              implementation support.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Our work connects enterprise development, finance readiness, agribusiness,
              organisational development, institutional capacity, research and digital solutions.
            </p>
            <p className="mt-6 text-xs text-muted-foreground">Incorporated May 2026 · RC 9535107</p>
          </div>
        </div>
      </section>
      <section className="web-section bg-secondary">
        <div className="web-container grid items-start gap-10 lg:grid-cols-[300px_1fr]">
          <img
            src={founder}
            alt="Avess Abutu, Founder and CEO"
            className="aspect-[4/5] w-full max-w-xs rounded-lg object-cover object-top"
            loading="lazy"
          />
          <div>
            <Eyebrow>Founder / CEO</Eyebrow>
            <h2 className="web-heading">Avess Swile Abutu</h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
              Founded by Avess Swile Abutu, Lovetech brings a practical view of enterprise development, finance readiness and institutional capability.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Lovetech’s founder brings a practical focus on business structure, finance readiness,
              capacity and the tools enterprises need to move forward.
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Our perspective is straightforward: training should lead to action, finance should
              meet readiness, and technology should solve real problems.
            </p>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{experienceNote}</p>
            <Button asChild variant="link" className="mt-5 px-0">
              <Link to="/our-work">
                Professional experience & company work <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="web-section">
        <div className="web-container">
          <Eyebrow>Multidisciplinary expertise</Eyebrow>
          <h2 className="web-heading">Connected challenges need connected thinking.</h2>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Agriculture & agribusiness",
              "Finance & financial inclusion",
              "Enterprise development",
              "Organisational development",
              "Institutional capacity",
              "Research, monitoring, evaluation & learning",
              "Digital & AI solutions",
            ].map((t) => (
              <div key={t} className="flex gap-3 border-t border-border py-5">
                <Check className="size-5 shrink-0 text-primary" />
                <h3 className="text-base font-semibold">{t}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="web-section bg-muted">
        <div className="web-container">
          <Eyebrow>How we work</Eyebrow>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              [
                "Practical by design",
                "Clear priorities and useful outputs shaped around real business conditions.",
              ],
              [
                "People & context first",
                "Support that recognises different capabilities, institutions and enterprise realities.",
              ],
              [
                "Evidence with integrity",
                "Transparent attribution, realistic commitments and reporting grounded in verified information.",
              ],
            ].map(([t, b]) => (
              <div key={t}>
                <h2 className="web-card-title">{t}</h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </main>
  );
}
