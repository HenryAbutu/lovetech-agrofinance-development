import { createFileRoute, redirect } from "@tanstack/react-router";

// Consolidated: this course is the same as Professionals AI Edge (AI for Work & Business).
export const Route = createFileRoute("/academy/courses/ai-tools-small-businesses")({
  validateSearch: (s: Record<string, unknown>) => ({ ref: typeof s.ref === "string" ? s.ref : undefined }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/academy/courses/professionals-ai-edge", search: { ref: search.ref }, statusCode: 301 });
  },
  head: () => ({ meta: [{ title: "Continue to AI for Work & Business — Lovetech Academy" }, { name: "description", content: "This course page has moved to AI for Work & Business." }] }),
});
