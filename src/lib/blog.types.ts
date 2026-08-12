export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  body: string | null;
  featured_image: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export const BLOG_CATEGORIES = [
  "MSME News",
  "Funding & Opportunities",
  "Finance Readiness",
  "Agribusiness & Value Chains",
  "Climate & Green Enterprise",
  "AI & Digital Business",
  "Women and Youth Enterprise",
  "Policy & Ecosystem Updates",
  "Hospitality & House 8",
  "Wellness & Ruby Chai",
] as const;
