import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Building2,
  Sprout,
  Users,
  Briefcase,
  Landmark,
} from "lucide-react";
import hero from "@/assets/academy-hero-v3.jpg";
import academy from "@/assets/group/academy-workshop.jpg";
import imgAi from "@/assets/course-ai-tools.jpg";
import imgFinance from "@/assets/group/finance-review.jpg";
import imgAgri from "@/assets/course-agribusiness.jpg";
import imgAuto from "@/assets/group/digital-business.jpg";
const courseImages: Record<string, string> = { "ai-for-businesses": imgAi, "finance-readiness-msmes": imgFinance, "agribusiness-skills": imgAgri, "business-automation-smes": imgAuto };
import house from "@/assets/group/house8-exterior.png";
import ruby from "@/assets/group/rubychai-packaging.png";
import { AcademyCourseCard } from "@/components/website/academy-course-card";
import { catalogue } from "@/lib/academy-catalogue";
import { Button } from "@/components/ui/button";
import { ServiceCards, Eyebrow, ConsultationCTA } from "@/components/website/presentation";
import {
  websiteHead,
  experienceNote,
  audienceContent,
} from "@/components/website/content";
export const Route = createFileRoute("/")({
  head: () =>
    websiteHead(
      "Business advisory, enterprise & institutional development",
      "Lovetech works with entrepreneurs, agribusinesses, financial institutions and development partners to prepare for finance and build stronger systems, skills and programmes.", "/"
    ),
  component: Home,
});
const audienceIcons = [Briefcase, Sprout, Users, Building2, Landmark];
function Home() {
  return (
    <main className="website home-concise">
      <section className="web-photo-hero home-hero">
        <img
          src={hero}
          alt="An African business training and advisory setting"
          fetchPriority="high"
          className="web-hero-image"
        />
        <div className="web-hero-shade" />
        <div className="web-container relative py-14 lg:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Lovetech Agrofinance & Development Ltd</Eyebrow>
            <h1 className="web-title">
              Better-prepared businesses.
              <br />
              Stronger institutions.
              <br />
              <span className="text-accent">More opportunities to grow.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-primary-foreground/90">
              We work with entrepreneurs, agribusinesses, financial institutions and development
              partners to solve practical challenges — from getting ready for finance to building
              better systems, skills and programmes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="websiteLight" className="web-button">
                <Link to="/contact">
                  Book a Consultation <ArrowUpRight />
                </Link>
              </Button>
              <Button asChild variant="homepageOutline" className="web-button">
                <Link to="/advisory">
                  Explore Our Services <ArrowRight />
                </Link>
              </Button>
            </div>
            <Link
              to="/academy"
              className="mt-7 inline-flex items-center gap-2 border-b border-primary-foreground/40 pb-1 text-sm"
            >
              Skills you can put to work · Explore Academy <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="web-container relative border-t border-primary-foreground/25 py-4">
          <p className="text-xs text-primary-foreground/80">
            Enterprise development &nbsp; / &nbsp; Finance readiness &nbsp; / &nbsp; Institutional
            capability
          </p>
        </div>
      </section>
      <section className="border-b border-border bg-secondary py-5">
        <div className="web-container">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
            {[
              ["1,000+", "MSMEs & entrepreneurs reached"],
              ["250+", "Businesses directly supported"],
              ["6", "Master Trainers"],
              ["Multidisciplinary", "Expertise"],
            ].map(([n, t]) => (
              <div key={t} className="border-l border-primary/20 pl-5">
                <p
                  className={`${n === "Multidisciplinary" ? "text-sm sm:text-lg" : "text-3xl"} font-semibold text-primary`}
                >
                  {n}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-5xl text-[11px] leading-relaxed text-muted-foreground">
            {experienceNote}
          </p>
        </div>
      </section>
      <section className="web-section">
        <div className="web-container"><Eyebrow>Our core advisory areas</Eyebrow><h2 className="web-heading">What Lovetech Does</h2><ServiceCards /></div>
      </section>
      <section className="web-section bg-primary text-primary-foreground">
        <div className="web-container"><div className="mb-6 flex flex-wrap items-end justify-between gap-5"><div><Eyebrow>Lovetech Academy</Eyebrow><h2 className="web-heading">Skills you can put to work.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/90">Practical courses, downloadable tools and action plans for your next business step.</p></div><div className="flex flex-wrap gap-3"><Button asChild variant="websiteLight" className="web-button"><Link to="/academy">Explore Academy <ArrowUpRight /></Link></Button><Button asChild variant="homepageOutline" className="web-button"><Link to="/academy/dashboard">My Academy <GraduationCap /></Link></Button></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{catalogue.slice(0,4).map(c => <AcademyCourseCard key={c.slug} compact course={{id:c.slug,title:c.title,summary:c.short,category:c.pathway,image:courseImages[c.slug] ?? academy,level:c.level,duration:c.duration,delivery:c.delivery,routeSlug:c.slug}} />)}</div></div>
      </section>
      <section className="web-section">
        <div className="web-container grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div><Eyebrow>Programme & institutional support</Eyebrow><h2 className="web-heading">Strong programmes need more than good designs.</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">We support development partners, public institutions and implementation teams with coordinated delivery, useful evidence and lasting capability.</p><Button asChild variant="link" className="mt-4 px-0"><Link to="/programme-support">Explore Programme Support <ArrowUpRight /></Link></Button></div>
          <div><h3 className="text-lg font-semibold">Who We Serve</h3><ul className="mt-3 grid gap-x-5 sm:grid-cols-2">{audienceContent.map(([title],i) => {const Icon = audienceIcons[i] ?? Users;return <li key={title} className="flex items-center gap-3 border-b border-border py-4 text-sm"><Icon className="size-5 shrink-0 text-primary" />{title}</li>;})}</ul><Button asChild variant="link" className="mt-3 px-0"><Link to="/who-we-serve">Who We Serve <ArrowUpRight /></Link></Button></div>
        </div>
      </section>
      <section className="web-section">
        <div className="web-container grid gap-10 lg:grid-cols-2">
          <div>
            <Eyebrow>Our work & professional experience</Eyebrow>
            <h2 className="web-heading">
              Experience matters.
              <br />
              So does clear attribution.
            </h2>
            <Button asChild variant="link" className="mt-6 px-0">
              <Link to="/our-work">
                Our work & experience <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div className="border-l border-border pl-7">
            <p className="leading-relaxed text-muted-foreground">{experienceNote}</p>
            <p className="mt-5 text-sm text-muted-foreground">
              Company case studies and client references will appear after evidence and publication
              permissions are approved.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-border bg-secondary py-5">
        <div className="web-container">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Eyebrow>Our wider ecosystem</Eyebrow>
              <h2 className="text-xl font-semibold">Lovetech Group Ventures</h2>
            </div>
            <div className="flex flex-wrap gap-6">
              {[
                { to: "/house-8", name: "House 8 Shortlet Apartments", img: house },
                { to: "/ruby-chai", name: "Ruby Chai Wellness", img: ruby },
              ].map((v) => (
                <Link
                  key={v.to}
                  to={v.to}
                  className="flex items-center gap-3 text-sm font-medium hover:text-primary"
                >
                  <img
                    src={v.img}
                    alt={v.name}
                    loading="lazy"
                    className="size-14 rounded object-cover"
                  />
                  {v.name}
                  <ArrowUpRight className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <ConsultationCTA />
    </main>
  );
}
