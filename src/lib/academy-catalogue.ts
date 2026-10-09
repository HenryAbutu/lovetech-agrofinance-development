export type CatalogueModule = { title: string; items?: string[] };

export type CatalogueCourse = {
  slug: string;
  title: string;
  short: string;
  description: string;
  level: string;
  duration: string;
  delivery: string;
  pathway: "Digital & AI" | "Finance & Funding" | "Agribusiness";
  hybrid?: boolean;
  modules: CatalogueModule[];
  outputs: string[];
  outputsTitle: string;
  whoFor: string[];
};

export const catalogue: CatalogueCourse[] = [
  {
    slug: "ai-for-businesses",
    title: "AI for Businesses: Practical AI Skills for Nigerian SMEs",
    short: "Five practical days on using AI for marketing, sales, WhatsApp, records and access to finance.",
    description:
      "A hands-on 5-day course for Nigerian business owners and teams. Each day is a 2-hour session focused on real tasks, so you leave with ready-to-use prompts, templates and a 30-day action plan for your business.",
    level: "Beginner to Intermediate",
    duration: "5 days · 2 hours per day",
    delivery: "Live online + self-paced resources",
    pathway: "Digital & AI",
    modules: [
      { title: "Day 1: Understanding AI and What It Can Do for Your Business" },
      { title: "Day 2: Prompt Writing for Business Owners" },
      { title: "Day 3: AI for Marketing, Sales, and WhatsApp Business" },
      { title: "Day 4: AI for Operations, Records, Finance, and Access to Finance" },
      { title: "Day 5: AI Workflow, Responsible AI, and Final Business Action Plan" },
    ],
    outputsTitle: "What you will produce",
    outputs: [
      "AI Business Use-Case Map",
      "10 Business Prompts",
      "7-Day Content Calendar",
      "WhatsApp Quick Reply Bank",
      "Sales and Expense Tracker",
      "Business Profile Draft",
      "Finance Readiness Checklist",
      "30-Day AI Business Action Plan",
    ],
    whoFor: ["SME owners and founders", "Small business teams", "Cooperative leaders", "Professionals new to AI"],
  },
  {
    slug: "finance-readiness-msmes",
    title: "Finance Readiness for MSMEs",
    short: "Prepare records, cashflow and documents for loans, grants, investment and partnerships.",
    description:
      "A practical course that helps entrepreneurs prepare business documents, records, cashflow information and funding applications.",
    level: "Beginner",
    duration: "4 weeks",
    delivery: "Online + coaching",
    pathway: "Finance & Funding",
    modules: [],
    outputsTitle: "What you will produce",
    outputs: [],
    whoFor: [],
  },
  {
    slug: "agribusiness-skills",
    title: "Agribusiness Skills for Value Addition, Market Access and Certification Readiness",
    short: "A hybrid programme combining online learning, practical sessions, coaching and action planning.",
    description:
      "A practical hybrid programme for farmers, processors, aggregators, cooperatives and agribusinesses. It combines online lessons with face-to-face practical sessions, coaching touchpoints, assignments and a personal action plan, so participants leave ready to add value, reach better markets and prepare for certification.",
    level: "All levels",
    duration: "9 modules · cohort-based",
    delivery: "Hybrid: online + face-to-face + coaching",
    pathway: "Agribusiness",
    hybrid: true,
    modules: [
      { title: "Module 1: Labour Market Participation and Agribusiness Opportunities" },
      { title: "Module 2: Agribusiness Entrepreneurship and Business Management" },
      { title: "Module 3: Production, Post-Harvest Handling and Quality Control" },
      { title: "Module 4: Value Addition and Product Development" },
      { title: "Module 5: Branding, Packaging, Marketing and Market Linkages" },
      { title: "Module 6: Food Safety and Certification Readiness" },
      { title: "Module 7: Digital Skills, Records and Financial Management" },
      { title: "Module 8: Inclusion, Safeguarding and Nutrition-Sensitive Agriculture" },
      { title: "Module 9: Practical Action Planning" },
    ],
    outputsTitle: "Course outputs",
    outputs: [
      "Skills self-assessment",
      "Business improvement action plan",
      "Market linkage action plan",
      "Value addition checklist",
      "Certification readiness checklist",
      "Pre/post assessment",
      "Attendance and participation record",
      "Coaching notes",
      "Completion status",
    ],
    whoFor: ["Farmers and processors", "Aggregators and cooperatives", "Women and youth in agribusiness", "Programme partners running cohorts"],
  },
  {
    slug: "business-automation-smes",
    title: "Business Automation for SMEs",
    short: "Automate enquiries, orders, records and follow-ups with simple, affordable digital tools.",
    description:
      "Learn to connect forms, spreadsheets, WhatsApp Business and payment tools into simple workflows that save time and reduce errors in your daily operations.",
    level: "Intermediate",
    duration: "3 weeks",
    delivery: "Online, self-paced + live clinics",
    pathway: "Digital & AI",
    modules: [
      { title: "Mapping your business processes" },
      { title: "Forms, spreadsheets and simple databases" },
      { title: "WhatsApp Business and customer follow-ups" },
      { title: "Orders, payments and records" },
      { title: "Building your first automation workflow" },
    ],
    outputsTitle: "What you will produce",
    outputs: ["Process map", "Order and records tracker", "Customer follow-up workflow", "Automation action plan"],
    whoFor: ["SME owners", "Operations and admin staff", "Growing service businesses"],
  },
  {
    slug: "proposal-grant-writing",
    title: "Proposal and Grant Writing for Development Consultants",
    short: "Write stronger proposals, budgets and logframes for donor and development funding.",
    description:
      "A practical course for consultants, NGOs and social enterprises on finding opportunities, understanding donor requirements and writing competitive proposals.",
    level: "Intermediate to Advanced",
    duration: "4 weeks",
    delivery: "Online + feedback sessions",
    pathway: "Finance & Funding",
    modules: [
      { title: "Finding and qualifying funding opportunities" },
      { title: "Understanding donor requirements" },
      { title: "Problem statements, theory of change and logframes" },
      { title: "Budgets and value for money" },
      { title: "Writing, reviewing and submitting" },
    ],
    outputsTitle: "What you will produce",
    outputs: ["Opportunity tracker", "Concept note", "Logframe draft", "Budget template", "Full proposal draft"],
    whoFor: ["Development consultants", "NGOs and CSOs", "Social enterprises"],
  },
];

export const findCourse = (slug: string) => catalogue.find((c) => c.slug === slug);
