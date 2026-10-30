import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { canonicalLink } from "@/lib/seo";
import { CheckCircle2, Clock, GraduationCap, MonitorSmartphone, Users, ClipboardCheck, MessageSquare, Target } from "lucide-react";
import { findFlagship } from "@/components/website/academy-flagships";
import { FlagshipDetail } from "@/components/website/flagship-detail";
import { findCourse } from "@/lib/academy-catalogue";
import { WaitlistForm } from "@/components/waitlist-form";
import { LEARNABLE, downloadCourseGuide } from "@/lib/learning-content";
import { whatsappUrl } from "@/lib/lms-config";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/academy/courses/$slug")({
  loader: ({ params }) => {
    const flagship = findFlagship(params.slug);
    const course = findCourse(params.slug);
    if (flagship) return { flagship, course: null };
    if (!course) throw notFound();
    return { course, flagship: null };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Course not found — LoveTech Academy" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.flagship ?? loaderData.course;
    if (!c) return {};
    const title = `${c.title} — LoveTech Academy`;
    return {
      meta: [
        { title },
        { name: "description", content: c.short },
        { property: "og:title", content: title },
        { property: "og:description", content: c.short },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [canonicalLink(`/academy/courses/${params.slug}`)],
    };
  },
  notFoundComponent: CourseNotFound,
  component: CoursePage,
});

function CourseNotFound() {
  return (
    <main className="website px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-vetiver">Course not found</h1>
      <Link to="/academy" className="mt-6 inline-block font-semibold text-teal underline">Back to Academy</Link>
    </main>
  );
}

function CoursePage() {
  const { course: c, flagship } = Route.useLoaderData();
  if (flagship) return <FlagshipDetail course={flagship}/>;
  if (!c) return null;
  return <main className="website web-section"><div className="web-container"><h1 className="web-heading">{c.title}</h1><p className="my-6">This legacy programme is closed to new enrolments. Existing learners retain access.</p><div className="flex flex-wrap gap-4"><Button asChild><Link to="/academy/learn/$slug" params={{slug:c.slug}}>Existing learner access</Link></Button><Button asChild variant="outline"><Link to="/academy">Explore flagship courses</Link></Button></div></div></main>;
}
