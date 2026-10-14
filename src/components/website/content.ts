import { canonicalLink } from "@/lib/seo";
import finance from "@/assets/group/finance-review.jpg";
import agriculture from "@/assets/hero-lovetech.jpg";
import digital from "@/assets/group/digital-business.jpg";
import training from "@/assets/group/academy-workshop.jpg";
export const serviceContent = [
  {
    id: "finance",
    to: "/finance-advisory",
    number: "01",
    title: "Finance Readiness & Access to Finance",
    short: "A clearer business story. Stronger funding conversations.",
    image: finance,
    alt: "Business financial records being reviewed",
    intro:
      "Finance starts with preparation. Funding conversations become easier when a business can show where it is going, how it earns, what it needs and how it will manage the money. We help enterprises organise that story with the evidence behind it.",
    problems: [
      "Incomplete business records",
      "Unclear funding needs",
      "Applications without supporting evidence",
    ],
    deliverables: [
      "Readiness diagnostic and gap review",
      "Business records and cashflow review",
      "Business plan and pitch documents",
      "Funding application support",
    ],
    audience: "MSMEs, entrepreneurs, agribusinesses, cooperatives and financial institutions.",
    cta: "Start Finance Readiness Diagnostic",
    ctaTo: "/finance-readiness",
  },
  {
    id: "agribusiness",
    to: "/agribusiness-development",
    number: "02",
    title: "Agribusiness & Enterprise Development",
    short: "Connect production, enterprise and market opportunity.",
    image: agriculture,
    alt: "African enterprise owner using digital tools outdoors",
    intro:
      "Help agricultural businesses become stronger businesses. Farmers, processors, cooperatives and value-chain enterprises face connected challenges — finance, markets, operations, capacity and coordination. We bring these pieces together so solutions make sense on the ground.",
    problems: [
      "Weak links between production and markets",
      "Business management and coordination gaps",
      "Unclear quality and certification requirements",
    ],
    deliverables: [
      "Value addition and enterprise planning",
      "Market access and business management support",
      "Cooperative and farmer group strengthening",
      "Certification readiness guidance",
    ],
    audience: "Farmers, processors, cooperatives, aggregators and value-chain enterprises.",
    cta: "Explore Agribusiness Support",
    ctaTo: "/contact",
  },
  {
    id: "digital",
    to: "/digital-ai-solutions",
    number: "03",
    title: "Digital & AI Solutions",
    short: "Less friction. Better information. More useful technology.",
    image: digital,
    alt: "African business owner and adviser reviewing digital reports",
    intro:
      "Use technology where it genuinely helps. Digital transformation does not have to begin with a complicated system. Sometimes it starts by improving how enquiries are answered, how records are kept or how managers see what is happening.",
    problems: [
      "Repetitive administration",
      "Scattered customer and business records",
      "Limited visibility for managers",
    ],
    deliverables: [
      "AI business tools and practical workflows",
      "Customer service and enquiry systems",
      "Dashboards, records and reports",
      "LMS and training portals",
    ],
    audience: "SMEs, business teams, financial institutions and programme delivery teams.",
    cta: "Request Digital Support",
    ctaTo: "/contact",
  },
  {
    id: "programme",
    to: "/programme-support",
    number: "04",
    title: "Programme & Institutional Support",
    short: "From programme objectives to coordinated delivery.",
    image: training,
    alt: "Participants attending a business skills workshop",
    intro:
      "Strong programmes need more than good designs. We support development partners, public institutions and implementation teams to move from programme objectives to coordinated delivery, useful evidence and lasting capability.",
    problems: [
      "Delivery teams working in silos",
      "Training without practical follow-through",
      "Fragmented monitoring and evidence",
    ],
    deliverables: [
      "Programme design and implementation support",
      "Curriculum, training and institutional capacity",
      "Research, monitoring, evaluation and learning tools",
      "Stakeholder coordination and evidence reporting",
    ],
    audience:
      "Development partners, NGOs, government, public institutions and implementation teams.",
    cta: "Discuss Programme Support",
    ctaTo: "/contact",
  },
] as const;
export const audienceContent = [
  [
    "MSMEs & Entrepreneurs",
    "Structure, practical skills and preparation for the next stage of growth.",
  ],
  [
    "Agribusinesses & Cooperatives",
    "Connected support for enterprise, value addition and market access.",
  ],
  ["Development Partners & NGOs", "Programme delivery, capacity building and useful evidence."],
  [
    "Government & Public Institutions",
    "Stronger systems, coordinated implementation and institutional capability.",
  ],
  [
    "Financial Institutions",
    "Enterprise readiness, financial inclusion and better-prepared businesses.",
  ],
] as const;
export const experienceNote =
  "Lovetech Agrofinance & Development Ltd was incorporated in May 2026. Historical reach figures refer to founder/team prior professional experience, not contracts awarded to the company. Reporting periods, programme scope and supporting records are awaiting publication approval.";
export function websiteHead(title: string, description: string, path?: string) {
  const full = `${title} — Lovetech Agrofinance & Development Ltd`;
  return {
    links: path ? [canonicalLink(path)] : [],
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
