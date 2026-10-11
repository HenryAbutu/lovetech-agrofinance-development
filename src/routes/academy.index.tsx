import academyImage from "@/assets/academy-hero-v3.jpg";
import { AcademyCourseCard, AcademyCourseShelf, type DiscoveryCourse } from "@/components/website/academy-course-card";
import { Eyebrow } from "@/components/website/presentation";
import aiImage from "@/assets/course-ai-tools.jpg";
import advancedImage from "@/assets/course-ai-edge.jpg";
import financeImage from "@/assets/course-finance.jpg";
import agricultureImage from "@/assets/hero-lovetech.jpg";
import { useSessionIdentity } from "@/hooks/use-session-identity";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Search, CheckCircle2, X, Award, Users } from "lucide-react";
import { submitWaitlist } from "@/lib/forms.functions";
import { LegalNotice } from "@/components/legal-notice";
import { catalogue } from "@/lib/academy-catalogue";
import { joinWaitlist } from "@/lib/waitlist";
import { Button } from "@/components/ui/button";
import { BookOpen, UserPlus, MonitorPlay, Download, FileCheck2, Target } from "lucide-react";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Lovetech Academy — Practical AI, finance and business courses" },
      { name: "description", content: "Practical courses for business growth, finance readiness, AI, agribusiness, climate-smart enterprise, and digital transformation." },
      { property: "og:title", content: "Lovetech Academy" },
      { property: "og:description", content: "AI, entrepreneurship, finance readiness and digital skills for Nigerian MSMEs, entrepreneurs and professionals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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

const faqs = [
  { q: "How do I access a course after paying?", a: "After successful Paystack payment, a learner account is created (or updated) and you'll be redirected to your dashboard where the course opens instantly." },
  { q: "Can I take just one advanced module?", a: "Yes. You can purchase any single Advanced AI module for ₦15,000, or take the full bundle of all 5 modules for ₦25,000." },
  { q: "Will I get a certificate?", a: "Yes — every course issues a certificate of completion once you complete the required lessons, assessments and assignment." },
  { q: "How does the waiting list work?", a: "Join the waiting list for any upcoming course. We'll email you the moment enrolment opens and offer priority access." },
];

const steps = [
  { icon: BookOpen, title: "Choose course" }, { icon: UserPlus, title: "Sign in" },
  { icon: MonitorPlay, title: "Learn online" }, { icon: Download, title: "Download tools" },
  { icon: FileCheck2, title: "Submit tasks" }, { icon: Target, title: "Build action plan" },
  { icon: Award, title: "Track completion" },
];

const topics = ["All Courses", "Business Development", "Digital & AI", "Finance Readiness", "Agribusiness & Enterprise"] as const;
function discoveryTopic(category: string): string {
  if (/AI|Digital/i.test(category)) return "Digital & AI";
  if (/Finance|Funding|Proposal/i.test(category)) return "Finance Readiness";
  if (/Agri|Agriculture|Climate|Cooperative/i.test(category)) return "Agribusiness & Enterprise";
  return "Business Development";
}
function discoveryImage(category: string) {
  const topic = discoveryTopic(category);
  return topic === "Digital & AI" ? aiImage : topic === "Finance Readiness" ? financeImage : topic === "Agribusiness & Enterprise" ? agricultureImage : academyImage;
}
function AcademyPage() {
  const [active, setActive] = useState<Course | null>(null);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("All Courses");
  const legacy = [basicCourse, advancedCourse, ...upcoming];
  const courses: DiscoveryCourse[] = [
    ...catalogue.map(c => ({ id:c.slug, title:c.title, summary:c.short, category:c.pathway, image:discoveryImage(c.pathway), level:c.level, duration:c.duration, delivery:c.delivery, routeSlug:c.slug })),
    ...legacy.map(c => ({ id:`programme-${c.slug}`, title:c.displayTitle ?? c.title, summary:c.summary, category:c.category, image:c === advancedCourse ? advancedImage : discoveryImage(c.category), status:c.status, price:c.price, priceNote:c.priceNote, level:c.level, duration:c.duration, delivery:c.format, onOpen:() => setActive(c), actionLabel:c.onOpenCTA === "waitlist" ? "Join Waiting List" : "View details" })),
  ];
  const filtered = courses.filter(c => {
    const matchesTopic = topic === "All Courses" || discoveryTopic(c.category) === topic || (topic === "Business Development" && /Business|SME|MSME|Proposal|Grant|Cooperative/i.test(c.title));
    return matchesTopic && [c.title,c.summary,c.category,c.level,c.duration,c.delivery,c.status].filter(Boolean).join(" ").toLowerCase().includes(query.trim().toLowerCase());
  });
  const trending = filtered.filter(c => c.status === "Enrolment Open");
  const business = filtered.filter(c => /Business|SME|MSME|Proposal|Grant|Cooperative/i.test(c.title));
  return <main className="website academy-marketplace">
    <section className="web-photo-hero academy-catalogue-hero">
      <img src={academyImage} alt="African entrepreneurs learning and working together" fetchPriority="high" className="web-hero-image" /><div className="web-hero-shade" />
      <div className="web-container relative py-12 lg:py-16"><div className="max-w-3xl"><Eyebrow>Skills you can put to work</Eyebrow><h1 className="web-title">Lovetech Academy</h1><p className="mt-4 max-w-xl text-base leading-relaxed text-primary-foreground">Practical learning for business growth, finance readiness, agribusiness and digital transformation.</p>
        <div className="academy-search mt-6 flex items-center gap-3 rounded border border-border bg-background px-4 text-foreground"><Search className="size-5 shrink-0 text-primary" aria-hidden="true" /><label htmlFor="academy-search" className="sr-only">What do you want to learn?</label><input id="academy-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you want to learn?" className="min-w-0 flex-1 py-4 text-base" aria-controls="course-results" /></div>
        <div className="mt-5 flex flex-wrap gap-3"><Button asChild variant="websiteLight" className="web-button"><a href="#course-results">Explore courses <ArrowRight /></a></Button><Button asChild variant="homepageOutline" className="web-button"><Link to="/academy/dashboard">My Academy <ArrowRight /></Link></Button></div>
      </div></div>
    </section>
    <section className="border-b border-border bg-secondary py-5"><div className="web-container"><nav aria-label="Course topics" className="flex flex-wrap gap-2">{topics.map(t => <Button key={t} variant={topic === t ? "default" : "outline"} aria-pressed={topic === t} onClick={() => setTopic(t)} className="h-auto min-h-10 whitespace-normal">{t}</Button>)}</nav></div></section>
    {!query.trim() && <>
      {trending.length > 0 && <AcademyCourseShelf title="Trending courses" courses={trending} />}
      {business.length > 0 && (topic === "All Courses" || topic === "Business Development") && <AcademyCourseShelf title="Top courses in Business Development" courses={business} />}
      {topics.slice(2).map(t => {const items = filtered.filter(c => discoveryTopic(c.category) === t);return items.length > 0 ? <AcademyCourseShelf key={t} title={`Top courses in ${t}`} courses={items} /> : null;})}
    </>}
    <section id="course-results" className="scroll-mt-24 bg-secondary py-10"><div className="web-container"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><h2 className="web-heading">{query.trim() ? "Search results" : "Full course catalogue"}</h2><p className="text-sm text-muted-foreground" role="status">{filtered.length} {filtered.length === 1 ? "course" : "courses"}{topic !== "All Courses" ? ` · ${topic}` : ""}</p></div>
      {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map(c => <AcademyCourseCard key={c.id} course={c} />)}</div> : <div className="border-y border-border py-12 text-center"><h3 className="text-lg font-semibold">No courses found</h3><p className="mt-2 text-sm text-muted-foreground">No courses match your search and topic.</p><Button variant="outline" className="mt-5" onClick={() => {setQuery("");setTopic("All Courses");}}>Clear filters</Button></div>}
    </div></section>
    <section className="py-10"><div className="web-container"><Eyebrow>Your learning journey</Eyebrow><h2 className="web-heading">How Lovetech Academy Works</h2><ol className="mt-7 grid grid-cols-2 gap-x-5 gap-y-6 sm:grid-cols-4 lg:grid-cols-7">{steps.map((step,i) => <li key={step.title} className="border-t border-border pt-4"><span className="text-xs text-muted-foreground">0{i+1}</span><step.icon className="my-3 size-5 text-primary" /><h3 className="text-sm font-semibold">{step.title}</h3></li>)}</ol></div></section>
    <section className="border-t border-border py-10"><div className="web-container"><h2 className="web-heading">Common questions</h2><div className="mt-5 grid gap-x-8 md:grid-cols-2">{faqs.map(f => <details key={f.q} className="border-b border-border py-4"><summary className="cursor-pointer text-sm font-semibold">{f.q}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p></details>)}</div></div></section>
    <section className="bg-primary py-10 text-primary-foreground"><div className="web-container flex flex-wrap items-center justify-between gap-5"><h2 className="web-heading">Your next step starts here.</h2><div className="flex flex-wrap gap-3"><Button asChild variant="websiteLight" className="web-button"><a href="#course-results">Explore courses <ArrowRight /></a></Button><Button asChild variant="homepageOutline" className="web-button"><Link to="/academy/dashboard">My Academy <ArrowRight /></Link></Button></div></div></section>
    {active && <CourseDetailModal course={active} onClose={() => setActive(null)} />}
  </main>;
}

/* ---------- Course detail modal + inline enrol/waitlist ---------- */

function CourseDetailModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center overflow-y-auto bg-navy-deep/60 p-0 sm:items-center sm:p-6" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-background shadow-2xl sm:rounded-lg"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${course.status === "Enrolment Open" ? "bg-ochre text-ink" : "bg-ochre/20 text-ochre"}`}>{course.status}</span>
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
            <div className="grid gap-3 rounded-xl bg-secondary p-4 sm:grid-cols-4">
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
                  <li key={m.title} className="rounded-xl border border-border bg-background p-4">
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
          <div className="sticky bottom-0 -mx-6 border-t border-border bg-background px-6 py-4">
            {course.onOpenCTA === "enrol" ? (
              <Link
                to={course.externalCTA ?? "/academy"}
                hash="enrol"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-vetiver px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95"
              >
                {course.ctaLabel} <ArrowRight className="size-4" />
              </Link>
            ) : showWaitlist ? (
              <WaitlistInline course={course} />
            ) : (
              <button
                onClick={() => setShowWaitlist(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-vetiver px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95"
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
  const me = useSessionIdentity();
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    const form = e.currentTarget;
    const entries = Object.fromEntries(
      [...new FormData(form).entries()].map(([k, v]) => [k, String(v).trim()]).filter(([, v]) => v !== ""),
    ) as Record<string, string>;
    const data: Record<string, string> = { ...(me ?? {}), course_slug: course.slug, interest_area: course.title.slice(0, 200), ...entries };
    if (!data.full_name || !data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
      setErr("Please enter your full name and a valid email address."); setState("error"); return;
    }
    setState("loading"); setErr("");
    try { const { course_slug: _cs, ...entry } = data; void _cs; await joinWaitlist(entry, course.title); form.reset(); setState("done"); }
    catch (e2) { setErr(e2 instanceof Error ? e2.message : "Something went wrong. Please try again."); setState("error"); }
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-xl border border-vetiver/25 bg-vetiver/5 p-5 text-center">
        <div className="mx-auto mb-2 grid size-10 place-items-center rounded-full bg-vetiver/10 text-vetiver">
          <CheckCircle2 className="size-5" />
        </div>
        <p className="font-serif text-lg text-vetiver">Thank you. You have joined the waitlist.</p>
        <p className="text-sm text-foreground/70">We will contact you with the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      {me ? (
        <p className="text-sm text-foreground/70">Joining as <span className="font-semibold text-navy">{me.full_name}</span> ({me.email})</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="full_name" required placeholder="Full name *" className="input" />
          <input name="email" type="email" required placeholder="Email *" className="input" />
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="phone" placeholder="Phone / WhatsApp" className="input" />
        <input name="business_name" placeholder="Business / organisation" className="input" />
      </div>
      <textarea name="main_challenge" rows={2} placeholder="Short note (optional)" className="input" />
      {err && <p className="text-xs text-destructive">{err}</p>}
      <button disabled={state === "loading"} className="rounded-lg bg-vetiver px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-60">
        {state === "loading" ? "Submitting…" : "Join Waiting List"}
      </button>
      <LegalNotice action="joining the waiting list" />
    </form>
  );
}

// used icon to prevent unused warning
void Users;
