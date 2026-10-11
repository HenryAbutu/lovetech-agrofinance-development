import { catalogue, type CatalogueCourse } from "@/lib/academy-catalogue";

export type LessonType = "video" | "reading" | "download" | "assignment" | "assessment" | "live" | "coaching";

export type Lesson = {
  key: string;
  title: string;
  type: LessonType;
  body: string;
  videoUrl?: string;
  resourceKey?: string;
  assignmentKey?: string;
  assessmentKey?: string;
  /** PLACEHOLDER CONTENT: generated wording, to be replaced with real lesson content. */
  placeholder?: boolean;
};

export type LearningModule = { key: string; title: string; lessons: Lesson[] };

export type Assessment = { key: string; title: string; purpose: string; url: string };

export type Resource = { key: string; title: string; category: string; courseSlug?: string; outline: string[] };

/** Default assessment list. Live links are edited in Admin → LMS Settings (lms_assessment_links). */
export const ASSESSMENTS: Assessment[] = [
  { key: "pre-test", title: "Pre-training assessment", purpose: "Measures your starting knowledge before the course.", url: "" },
  { key: "post-test", title: "Post-training assessment", purpose: "Measures what you have learned after the course.", url: "" },
  { key: "feedback", title: "Feedback form", purpose: "Tell us how the course went so we can improve it.", url: "" },
  { key: "skills-needs", title: "Skills needs assessment", purpose: "Helps us understand the skills you want to build.", url: "" },
  { key: "finance-diagnostic", title: "Finance readiness diagnostic", purpose: "Checks how ready your business is for funding.", url: "" },
];

export const RESOURCES: Resource[] = [
  { key: "ai-use-case-map", title: "AI Business Use-Case Map", category: "Templates", courseSlug: "ai-for-businesses", outline: ["Business area", "Current task", "How AI can help", "Tool to use", "Expected time saved"] },
  { key: "content-calendar", title: "7-Day Content Calendar", category: "Templates", courseSlug: "ai-for-businesses", outline: ["Day", "Platform", "Post idea", "Caption", "Call to action"] },
  { key: "whatsapp-replies", title: "WhatsApp Quick Reply Bank", category: "Templates", courseSlug: "ai-for-businesses", outline: ["Greeting", "Price enquiry", "Delivery enquiry", "Payment confirmation", "Follow-up"] },
  { key: "sales-expense-tracker", title: "Sales and Expense Tracker", category: "Business Record Templates", courseSlug: "ai-for-businesses", outline: ["Date", "Item", "Sales (₦)", "Expenses (₦)", "Balance (₦)"] },
  { key: "finance-checklist", title: "Finance Readiness Checklist", category: "Finance Readiness Tools", courseSlug: "finance-readiness-msmes", outline: ["Business registration", "Bank statements (6 months)", "Sales records", "Business plan", "Tax ID"] },
  { key: "business-profile", title: "Business Profile Template", category: "Templates", outline: ["Business name", "What you sell", "Customers", "Location", "Achievements", "Contact"] },
  { key: "agri-self-assessment", title: "Agribusiness Skills Self-Assessment", category: "Assessment Tools", courseSlug: "agribusiness-skills", outline: ["Skill area", "My level (1–5)", "Evidence", "What I want to improve"] },
  { key: "value-addition", title: "Value Addition Checklist", category: "Worksheets", courseSlug: "agribusiness-skills", outline: ["Raw product", "Possible processed products", "Equipment needed", "Packaging", "Target market"] },
  { key: "food-safety", title: "Food Safety Checklist", category: "Certification Readiness Tools", courseSlug: "agribusiness-skills", outline: ["Clean water", "Hygiene practices", "Storage", "Pest control", "Record keeping"] },
  { key: "certification-readiness", title: "Certification Readiness Checklist", category: "Certification Readiness Tools", courseSlug: "agribusiness-skills", outline: ["Product registration", "NAFDAC requirements", "Labelling", "Premises", "Documents"] },
  { key: "market-linkage-plan", title: "Market Linkage Action Plan", category: "Action Plan Templates", courseSlug: "agribusiness-skills", outline: ["Target buyer", "Product and volume", "Price", "Steps to reach buyer", "Timeline"] },
  { key: "automation-workflow-map", title: "Automation Workflow Map", category: "Worksheets", courseSlug: "business-automation-smes", outline: ["Repeated task", "Who does it now", "Time per week", "Tool to automate", "Owner"] },
  { key: "business-improvement-plan", title: "Business Improvement Action Plan", category: "Action Plan Templates", outline: ["Goal", "Key actions", "Resources", "Timeline", "Expected result"] },
];

export const RESOURCE_CATEGORIES = [
  "Course Guides", "Participant Handbooks", "Worksheets", "Templates", "Assessment Tools",
  "Action Plan Templates", "Certification Readiness Tools", "Business Record Templates", "Finance Readiness Tools",
];

export const ACTION_PLAN_TYPES = [
  { value: "business_improvement", label: "Business improvement" },
  { value: "value_addition", label: "Value addition" },
  { value: "market_linkage", label: "Market linkage" },
  { value: "certification_readiness", label: "Certification readiness" },
  { value: "labour_market_participation", label: "Labour market participation" },
] as const;

/** Courses learners can start now from the catalogue. */
export const LEARNABLE = new Set(["ai-for-businesses", "finance-readiness-msmes", "agribusiness-skills", "business-automation-smes"]);

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

export function buildModules(c: CatalogueCourse): LearningModule[] {
  const resForCourse = RESOURCES.filter((r) => r.courseSlug === c.slug);
  const mods: LearningModule[] = [
    {
      key: "start",
      title: "Getting started",
      lessons: [
        { key: "welcome", title: "Welcome and how this course works", type: "reading", body: `Welcome to ${c.title}. Work through each module in order, mark lessons complete as you go, submit the assignments and finish with your action plan. Lessons are short and low-data so you can learn on your phone.` },
        { key: "pre-test", title: "Take the pre-training assessment", type: "assessment", body: "Before you begin, complete the short pre-training assessment so we can measure your progress.", assessmentKey: "pre-test" },
      ],
    },
  ];
  c.modules.forEach((m, i) => {
    const k = `m${i + 1}`;
    const res = resForCourse[i % Math.max(resForCourse.length, 1)];
    const lessons: Lesson[] = [
      { key: `${k}-video`, title: `Watch: ${m.title.replace(/^(Day|Module) \d+: /, "")}`, type: "video", body: "Watch the short lesson video. If your data is limited, read the notes below instead." },
      { key: `${k}-notes`, title: "Lesson notes", type: "reading", body: `Key ideas for "${m.title}". Read through, then apply one idea to your own business today.` },
    ];
    if (c.hybrid && i % 3 === 2) lessons.push({ key: `${k}-live`, title: "Practical session (face-to-face)", type: "live", body: "Attend the practical session with your cohort. Your facilitator will share the date and venue on WhatsApp." });
    if (c.hybrid && (i === 3 || i === 7)) lessons.push({ key: `${k}-coach`, title: "Coaching touchpoint", type: "coaching", body: "Book or attend your coaching session. Bring your questions and progress on your action plan." });
    if (res) lessons.push({ key: `${k}-dl`, title: `Download: ${res.title}`, type: "download", body: "Download the worksheet and fill it in for your business.", resourceKey: res.key });
    lessons.push({ key: `${k}-task`, title: "Assignment", type: "assignment", body: `Apply what you learned in "${m.title}" to your business and submit your work.`, assignmentKey: `${k}-${slugify(m.title)}` });
    mods.push({ key: k, title: m.title, lessons });
  });
  mods.push({
    key: "finish",
    title: "Finish the course",
    lessons: [
      { key: "post-test", title: "Take the post-training assessment", type: "assessment", body: "Complete the post-training assessment to show what you have learned.", assessmentKey: "post-test" },
      { key: "action-plan", title: "Submit your action plan", type: "assignment", body: "Submit your final action plan from the Action Plan page." },
    ],
  });
  // PLACEHOLDER CONTENT: every generated lesson is flagged until real content arrives.
  return mods.map((m) => ({ ...m, lessons: m.lessons.map((l) => ({ ...l, placeholder: true })) }));
}

export function learnableCourses() {
  return catalogue.filter((c) => LEARNABLE.has(c.slug));
}

/** Generates a simple low-data template file the learner can fill in. */
export function downloadResource(r: Resource) {
  const lines = [`LoveTech Academy — ${r.title}`, `Category: ${r.category}`, "", ...r.outline.map((o) => `${o}:\n\n`), "", "info@lovetechgroup.com.ng"];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${r.key}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCourseGuide(c: CatalogueCourse) {
  downloadResource({
    key: `${c.slug}-guide`,
    title: `${c.title} — Course Guide`,
    category: "Course Guides",
    outline: [`Duration: ${c.duration}`, `Delivery: ${c.delivery}`, "Modules:\n" + c.modules.map((m) => `- ${m.title}`).join("\n"), "Outputs:\n" + c.outputs.map((o) => `- ${o}`).join("\n")],
  });
}
