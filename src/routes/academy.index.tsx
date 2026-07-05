import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, GraduationCap, Sparkles, CheckCircle2, X, Clock, BarChart3, Award, PlayCircle, Users } from "lucide-react";
import { submitWaitlist } from "@/lib/forms.functions";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "LoveTech Agro Academy — Practical AI, finance and business courses" },
      { name: "description", content: "Practical courses for business growth, finance readiness, AI, agribusiness, climate-smart enterprise, and digital transformation." },
      { property: "og:title", content: "LoveTech Agro Academy" },
      { property: "og:description", content: "AI, entrepreneurship, finance readiness and digital skills for Nigerian MSMEs, entrepreneurs and professionals." },
    ],
  }),
  component: AcademyPage,
});

type Module = { title: string; duration?: string; items?: string[] };
type Course = {
  slug: string;
  title: string;
  displayTitle?: string;
  status: "Enrolment Open" | "Waiting List" | "Coming Soon";
  category: string;
  price?: string;
  priceNote?: string;
  level?: string;
  format?: string;
  duration?: string;
  summary: string;
  whoFor?: string[];
  outcomes?: string[];
  modules?: Module[];
  resources?: string[];
  ctaLabel: string;
  onOpenCTA?: "enrol" | "waitlist";
  externalCTA?: string; // route for open courses
};

const basicCourse: Course = {
  slug: "ai-for-business-basic",
  title: "AI for Business — Basic",
  displayTitle: "AI for Business Foundations",
  status: "Enrolment Open",
  category: "AI & Digital Business",
  price: "₦8,900",
  level: "Beginner",
  format: "Self-paced",
  duration: "Maximum 60 minutes",
  summary:
    "A practical beginner course that helps Nigerian business owners, entrepreneurs, professionals and small teams understand how to use AI tools to save time, create better content, improve customer communication, prepare documents and make smarter business decisions.",
  whoFor: [
    "Small business owners and entrepreneurs",
    "Professionals and consultants",
    "Cooperative leaders and admins",
    "Anyone new to using AI in business",
  ],
  outcomes: [
    "Understand what AI is (in plain language)",
    "Use ChatGPT, Canva AI and WhatsApp assistants for real business tasks",
    "Write effective business prompts",
    "Design a 30-day AI action plan for your business",
  ],
  modules: [
    { title: "Welcome and Pre-Assessment", duration: "5 min", items: ["Orientation", "Baseline quiz"] },
    { title: "Module 1 — What AI Actually Is", duration: "10 min", items: ["Plain-English AI overview", "How AI supports everyday tasks"] },
    { title: "Module 2 — 5 Business Functions AI Helps With", duration: "10 min", items: ["Marketing", "Customer service", "Finance", "Content creation", "Administration"] },
    { title: "Module 3 — Live Demo: Your First 3 AI Tools", duration: "15 min", items: ["ChatGPT demo", "Canva AI demo", "WhatsApp Business + AI assistant"] },
    { title: "Module 4 — How to Prompt AI for Business Results", duration: "10 min", items: ["Practical prompt formula", "Templates", "Nigerian SME examples"] },
    { title: "Module 5 — Your 30-Day AI Action Plan and Assignment", duration: "7 min", items: ["AI action plan worksheet", "Assignment brief"] },
    { title: "Post-Assessment and Certificate", duration: "3 min", items: ["Post-course quiz", "Certificate of completion"] },
  ],
  resources: [
    "Video lessons",
    "Participant handout",
    "Prompt templates",
    "Practical worksheets",
    "Assignment",
    "Pre & post assessment quiz",
    "Certificate after completion",
  ],
  ctaLabel: "Enrol Now — ₦8,900",
  onOpenCTA: "enrol",
  externalCTA: "/academy/courses/ai-tools-small-businesses",
};

const advancedCourse: Course = {
  slug: "ai-for-business-advanced",
  title: "AI for Business — Advanced Modules",
  status: "Enrolment Open",
  category: "AI & Digital Business",
  price: "₦25,000 bundle",
  priceNote: "or ₦15,000 for any single module",
  level: "Advanced",
  format: "Self-paced + practical",
  duration: "5 modules",
  summary:
    "A practical advanced AI programme for entrepreneurs, consultants, professionals, business owners and teams that want to apply AI across core business functions. Take the full 5-module bundle or purchase any single module.",
  whoFor: [
    "Growing SME founders and teams",
    "Consultants and agency operators",
    "Professionals who want to work smarter with AI",
  ],
  outcomes: [
    "Apply AI across marketing, service, finance, admin and research",
    "Build repeatable AI workflows for your team",
    "Choose the right AI tool for each business function",
  ],
  modules: [
    { title: "Module 1 — AI for Marketing, Content and Social Media", items: ["Introduction", "Core concept", "Live demo", "Practical assignment", "Mini quiz"] },
    { title: "Module 2 — AI for Customer Service and WhatsApp Automation", items: ["Introduction", "Core concept", "Live demo", "Practical assignment", "Mini quiz"] },
    { title: "Module 3 — AI for Finance, Bookkeeping and Cashflow", items: ["Introduction", "Core concept", "Live demo", "Practical assignment", "Mini quiz"] },
    { title: "Module 4 — AI for Administration, Documents and Productivity", items: ["Introduction", "Core concept", "Live demo", "Practical assignment", "Mini quiz"] },
    { title: "Module 5 — AI for Research, Data and Business Decisions", items: ["Introduction", "Core concept", "Live demo", "Practical assignment", "Mini quiz"] },
  ],
  resources: [
    "Advanced video lessons",
    "Workflow templates",
    "Prompt libraries",
    "Practical assignments",
    "Module quizzes",
    "Certificate of completion",
  ],
  ctaLabel: "Enrol in All 5 Modules — ₦25,000",
  onOpenCTA: "enrol",
  externalCTA: "/academy/courses/professionals-ai-edge",
};

const upcoming: Course[] = [
  {
    slug: "finance-readiness-msmes",
    title: "Finance Readiness for MSMEs",
    status: "Waiting List",
    category: "Finance Readiness",
    summary:
      "A practical course that helps entrepreneurs prepare business documents, records, cashflow information and funding applications for loans, grants, investment and partnership opportunities.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "grant-readiness-proposal-writing",
    title: "Grant Readiness and Proposal Writing for Small Businesses",
    status: "Waiting List",
    category: "Funding & Proposals",
    summary:
      "A hands-on programme that teaches business owners how to identify grant opportunities, understand eligibility, prepare strong applications and package supporting documents.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "business-records-bookkeeping-msmes",
    title: "Business Records, Bookkeeping and Cashflow for MSMEs",
    status: "Waiting List",
    category: "Finance",
    summary:
      "A practical course for small business owners who need to improve their sales records, expense tracking, cashflow planning and basic financial decision-making.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "agribusiness-value-chain",
    title: "Agribusiness and Value Chain Development",
    status: "Waiting List",
    category: "Agriculture",
    summary:
      "A course for farmers, processors, aggregators, cooperatives and agribusinesses who want to understand value chains, market access, quality standards, pricing and business growth opportunities.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "climate-smart-green-enterprise",
    title: "Climate-Smart Business and Green Enterprise Development",
    status: "Waiting List",
    category: "Climate & Sustainability",
    summary:
      "A practical course on climate-smart enterprise practices, green business opportunities, circular economy ideas, climate finance readiness and sustainable business models.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "cooperative-management-governance",
    title: "Cooperative Business Management and Governance",
    status: "Waiting List",
    category: "Cooperatives",
    summary:
      "A course for cooperatives, farmer groups, associations and community-based business groups on governance, records, leadership, member accountability, finance readiness and growth planning.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "digital-tools-small-business",
    title: "Digital Tools for Small Business Operations",
    status: "Waiting List",
    category: "Digital Business",
    summary:
      "A practical course on using simple digital tools such as Google Forms, spreadsheets, Airtable, WhatsApp Business, Canva, payment tools and dashboards to run a more structured business.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
  {
    slug: "export-readiness-agribusiness",
    title: "Export Readiness for Nigerian Agribusinesses",
    status: "Waiting List",
    category: "Trade & Agribusiness",
    summary:
      "A practical introductory course for agribusinesses interested in export opportunities, product standards, documentation, packaging, market research and buyer readiness.",
    ctaLabel: "Join Waiting List",
    onOpenCTA: "waitlist",
  },
];

const advancedModules = [
  { t: "AI for Marketing, Content & Social Media", b: "Campaign planning, content calendars, captions, video scripts, repurposing and marketing productivity." },
  { t: "AI for Customer Service & WhatsApp", b: "Better customer replies, FAQs, WhatsApp automation and enquiry management workflows." },
  { t: "AI for Finance, Bookkeeping & Cashflow", b: "Organise sales, track expenses, understand cashflow and support better business decisions." },
  { t: "AI for Administration, Documents & Productivity", b: "Draft letters, proposals, reports, SOPs, meeting notes and daily documents faster." },
  { t: "AI for Research, Data & Business Decisions", b: "Market research, competitor review, customer insights, planning and decision support." },
];

const faqs = [
  { q: "How do I access a course after paying?", a: "After successful Paystack payment, a learner account is created (or updated) and you'll be redirected to your dashboard where the course opens instantly." },
  { q: "Can I take just one advanced module?", a: "Yes. You can purchase any single Advanced AI module for ₦15,000, or take the full bundle of all 5 modules for ₦25,000." },
  { q: "Will I get a certificate?", a: "Yes — every course issues a certificate of completion once you complete the required lessons, assessments and assignment." },
  { q: "How does the waiting list work?", a: "Join the waiting list for any upcoming course. We'll email you the moment enrolment opens and offer priority access." },
];

function AcademyPage() {
  const [active, setActive] = useState<Course | null>(null);
  return (
    <main className="bg-white">
      {/* Compact heading */}
      <section className="border-b border-border bg-gradient-to-br from-[#FFF8E7] via-white to-white px-6 pt-16 pb-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ochre">
            <Sparkles className="size-3.5" /> LoveTech Agro Academy
          </p>
          <h1 className="font-serif text-4xl text-vetiver md:text-5xl">Practical courses for business growth.</h1>
          <p className="mt-4 max-w-3xl text-lg text-foreground/70">
            Practical courses for business growth, finance readiness, AI, agribusiness, climate-smart enterprise and digital transformation.
          </p>
        </div>
      </section>

      {/* Available Courses */}
      <Section id="available" eyebrow="Available now" title="Currently open for enrolment">
        <div className="grid gap-6 md:grid-cols-2">
          <FeaturedCourseCard course={basicCourse} onOpen={() => setActive(basicCourse)} />
          <FeaturedCourseCard course={advancedCourse} onOpen={() => setActive(advancedCourse)} />
        </div>
      </Section>

      {/* Advanced AI Modules */}
      <Section id="advanced-modules" eyebrow="Advanced AI Programme" title="Choose the AI module that fits your business" bg="ivory">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {advancedModules.map((m, i) => (
            <article key={m.t} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal">Module {i + 1}</span>
                <span className="text-xs font-semibold text-ochre">₦15,000</span>
              </div>
              <h3 className="mb-2 font-serif text-lg text-vetiver">{m.t}</h3>
              <p className="text-sm text-foreground/65">{m.b}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-vetiver/25 bg-white p-6 md:flex md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-ochre">Best Value</p>
            <p className="mt-1 font-serif text-2xl text-vetiver">Bundle all 5 modules for ₦25,000</p>
          </div>
          <button onClick={() => setActive(advancedCourse)} className="mt-4 inline-flex rounded-lg bg-vetiver px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 md:mt-0">
            View bundle details
          </button>
        </div>
      </Section>

      {/* Upcoming */}
      <Section id="upcoming" eyebrow="Coming soon" title="Upcoming Courses & Programmes">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((c) => (
            <UpcomingCard key={c.slug} course={c} onOpen={() => setActive(c)} />
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section id="why" eyebrow="Why LoveTech" title="Why learn with LoveTech" bg="ivory">
        <div className="grid gap-6 md:grid-cols-3">
          <Pillar icon={<GraduationCap className="size-5" />} title="Practitioners, not theorists" body="Every course is built and delivered by people doing the work in Nigerian businesses." />
          <Pillar icon={<Sparkles className="size-5" />} title="Built for application" body="Workbooks, templates and exercises so you can apply what you learn the next day." />
          <Pillar icon={<Award className="size-5" />} title="Certification & pathway" body="Earn a certificate and graduate into our consulting and finance-readiness support." />
        </div>
      </Section>

      {/* FAQs */}
      <Section id="faqs" eyebrow="FAQs" title="Common questions">
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-serif text-lg text-vetiver">{f.q}</h3>
              <p className="text-sm text-foreground/65">{f.a}</p>
            </div>
          ))}
        </div>
      </Section>

      {active && <CourseDetailModal course={active} onClose={() => setActive(null)} />}
    </main>
  );
}

function Section({ id, eyebrow, title, children, bg }: { id: string; eyebrow: string; title: string; children: React.ReactNode; bg?: "ivory" }) {
  return (
    <section id={id} className={`px-6 py-16 lg:px-8 ${bg === "ivory" ? "border-y border-border bg-[#FFF8E7]" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">{eyebrow}</p>
          <h2 className="font-serif text-3xl text-vetiver md:text-4xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-3 grid size-10 place-items-center rounded-lg bg-vetiver/10 text-vetiver">{icon}</div>
      <h3 className="mb-2 font-serif text-xl text-vetiver">{title}</h3>
      <p className="text-sm text-foreground/65">{body}</p>
    </div>
  );
}

function FeaturedCourseCard({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group flex flex-col rounded-2xl border-2 border-vetiver/20 bg-white p-7 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-vetiver/50 hover:shadow-lg">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ochre px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{course.status}</span>
        <span className="rounded-full bg-teal/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-teal">{course.category}</span>
        {course.level && <span className="text-[11px] text-foreground/55">{course.level}</span>}
      </div>
      <h3 className="mb-2 font-serif text-2xl text-vetiver">{course.displayTitle ?? course.title}</h3>
      <p className="mb-5 flex-1 text-sm text-foreground/70">{course.summary}</p>
      <div className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-foreground/60">
        {course.duration && <span className="inline-flex items-center gap-1"><Clock className="size-3.5" />{course.duration}</span>}
        {course.format && <span className="inline-flex items-center gap-1"><PlayCircle className="size-3.5" />{course.format}</span>}
        {course.modules && <span className="inline-flex items-center gap-1"><BarChart3 className="size-3.5" />{course.modules.length} modules</span>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="font-serif text-3xl text-vetiver">{course.price}</p>
          {course.priceNote && <p className="text-xs text-foreground/55">{course.priceNote}</p>}
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-vetiver px-4 py-2.5 text-sm font-semibold text-white group-hover:opacity-95">
          View details <ArrowRight className="size-4" />
        </span>
      </div>
    </button>
  );
}

function UpcomingCard({ course, onOpen }: { course: Course; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group flex flex-col rounded-2xl border border-border bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lg">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-ochre/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8B6A00]">Waiting List</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-teal">{course.category}</span>
      </div>
      <h3 className="mb-2 font-serif text-lg text-vetiver">{course.title}</h3>
      <p className="mb-5 flex-1 text-sm text-foreground/65">{course.summary}</p>
      <span className="inline-flex items-center gap-1.5 self-start rounded-lg border border-vetiver/25 px-4 py-2 text-sm font-semibold text-vetiver group-hover:bg-vetiver/5">
        Join Waiting List <ArrowRight className="size-4" />
      </span>
    </button>
  );
}

/* ---------- Course detail modal + inline enrol/waitlist ---------- */

function CourseDetailModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-black/60 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/95 px-6 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${course.status === "Enrolment Open" ? "bg-ochre text-ink" : "bg-ochre/20 text-[#8B6A00]"}`}>{course.status}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal">{course.category}</span>
            </div>
            <h3 className="truncate font-serif text-xl text-vetiver">{course.displayTitle ?? course.title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid size-9 shrink-0 place-items-center rounded-lg border border-border text-foreground/60 hover:bg-muted">
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-8 px-6 py-6">
          <p className="text-[15px] leading-relaxed text-foreground/75">{course.summary}</p>

          {(course.price || course.duration || course.level || course.format) && (
            <div className="grid gap-3 rounded-xl bg-[#FFF8E7] p-4 sm:grid-cols-4">
              {course.price && <Meta k="Price" v={course.price} sub={course.priceNote} />}
              {course.duration && <Meta k="Duration" v={course.duration} />}
              {course.level && <Meta k="Level" v={course.level} />}
              {course.format && <Meta k="Format" v={course.format} />}
            </div>
          )}

          {course.whoFor && <Block title="Who this is for" items={course.whoFor} />}
          {course.outcomes && <Block title="What you will learn" items={course.outcomes} />}

          {course.modules && (
            <div>
              <h4 className="mb-3 font-serif text-lg text-vetiver">Modules & topics</h4>
              <ol className="space-y-3">
                {course.modules.map((m, i) => (
                  <li key={m.title} className="rounded-xl border border-border bg-white p-4">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="font-semibold text-vetiver">{i + 1}. {m.title}</p>
                      {m.duration && <span className="text-xs text-foreground/55">{m.duration}</span>}
                    </div>
                    {m.items && (
                      <ul className="ml-4 mt-1 list-disc space-y-1 text-sm text-foreground/70">
                        {m.items.map((it) => <li key={it}>{it}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {course.resources && <Block title="Included resources" items={course.resources} />}

          <div className="rounded-xl border border-vetiver/20 bg-vetiver/5 p-4 text-sm text-vetiver">
            <p className="font-semibold">Certificate on completion</p>
            <p className="mt-1 text-foreground/70">Complete required lessons, assessments and the assignment to earn your LoveTech Agro Academy certificate.</p>
          </div>

          {/* CTA */}
          <div className="sticky bottom-0 -mx-6 border-t border-border bg-white px-6 py-4">
            {course.onOpenCTA === "enrol" ? (
              <Link
                to={course.externalCTA ?? "/academy"}
                hash="enrol"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-vetiver px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-95"
              >
                {course.ctaLabel} <ArrowRight className="size-4" />
              </Link>
            ) : showWaitlist ? (
              <WaitlistInline course={course} />
            ) : (
              <button
                onClick={() => setShowWaitlist(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-vetiver px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-95"
              >
                {course.ctaLabel} <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ k, v, sub }: { k: string; v: string; sub?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground/55">{k}</p>
      <p className="mt-0.5 font-serif text-lg text-vetiver">{v}</p>
      {sub && <p className="text-[11px] text-foreground/55">{sub}</p>}
    </div>
  );
}

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 font-serif text-lg text-vetiver">{title}</h4>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-foreground/75">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WaitlistInline({ course }: { course: Course }) {
  const submit = useServerFn(submitWaitlist);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading"); setErr("");
    const fd = new FormData(e.currentTarget);
    const data = {
      course_slug: course.slug,
      interest_area: course.title,
      ...Object.fromEntries(fd.entries()),
    } as Record<string, string>;
    try { await submit({ data: data as never }); setState("done"); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Failed"); setState("error"); }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-vetiver/25 bg-vetiver/5 p-5 text-center">
        <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-vetiver/10 text-vetiver">
          <CheckCircle2 className="size-5" />
        </div>
        <p className="font-serif text-lg text-vetiver">Thank you.</p>
        <p className="text-sm text-foreground/70">Your interest has been received. LoveTech will contact you when this programme opens.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="full_name" required placeholder="Full name *" className="input" />
        <input name="email" type="email" required placeholder="Email *" className="input" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="phone" placeholder="Phone / WhatsApp" className="input" />
        <input name="business_name" placeholder="Business / organisation" className="input" />
      </div>
      <textarea name="main_challenge" rows={2} placeholder="Short note (optional)" className="input" />
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button disabled={state === "loading"} className="rounded-lg bg-vetiver px-6 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-60">
        {state === "loading" ? "Submitting…" : "Join Waiting List"}
      </button>
    </form>
  );
}

// used icon to prevent unused warning
void Users;
