import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export type DiscoveryCourse = {
  id: string; title: string; summary: string; category: string; image: string;
  status?: string; price?: string; priceNote?: string; level?: string; duration?: string; delivery?: string;
  routeSlug?: string; onOpen?: () => void; actionLabel?: string;
};
export function AcademyCourseCard({ course, compact = false }: { course: DiscoveryCourse; compact?: boolean }) {
  return <article className="academy-discovery-card flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
    <img src={course.image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
    <div className="flex flex-1 flex-col p-4">
      <p className="text-xs font-semibold text-primary">{course.category}</p>
      <h3 className="mt-2 text-base font-semibold leading-snug">{course.title}</h3>
      {!compact && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{course.summary}</p>}
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{[course.level, course.duration, course.delivery].filter(Boolean).join(" · ")}</p>
      {course.status && <p className="mt-3 text-xs font-semibold text-primary">{course.status}</p>}
      {course.price && <p className="mt-2 text-sm font-semibold">{course.price}{course.priceNote && <span className="block text-xs font-normal text-muted-foreground">{course.priceNote}</span>}</p>}
      <div className="mt-auto pt-4">
        {course.routeSlug ? <Button asChild variant="link" className="h-auto justify-start px-0"><Link to="/academy/courses/$slug" params={{ slug: course.routeSlug }}>View Course <ArrowRight /></Link></Button> : <Button variant="link" className="h-auto justify-start whitespace-normal px-0 text-left" onClick={course.onOpen}>{course.actionLabel ?? "View details"} <ArrowRight /></Button>}
      </div>
    </div>
  </article>;
}
export function AcademyCourseShelf({ title, courses }: { title: string; courses: DiscoveryCourse[] }) {
  const shelf = useRef<HTMLDivElement>(null);
  return <section className="academy-shelf-section border-b border-border py-9">
    <div className="web-container">
      <div className="mb-5 flex items-center justify-between gap-4"><h2 className="web-heading">{title}</h2><div className="flex shrink-0 gap-2">
        <Button variant="outline" size="icon" aria-label={`Scroll ${title} left`} title="Previous courses" onClick={() => shelf.current?.scrollBy({ left: -320, behavior: "smooth" })}><ChevronLeft /></Button>
        <Button variant="outline" size="icon" aria-label={`Scroll ${title} right`} title="More courses" onClick={() => shelf.current?.scrollBy({ left: 320, behavior: "smooth" })}><ChevronRight /></Button>
      </div></div>
      <div ref={shelf} className="academy-course-shelf" tabIndex={0} role="region" aria-label={title}>{courses.map(course => <AcademyCourseCard key={course.id} course={course} />)}</div>
    </div>
  </section>;
}
