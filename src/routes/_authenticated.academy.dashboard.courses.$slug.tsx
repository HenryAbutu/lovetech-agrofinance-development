import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, PlayCircle, Download, FileText, Award, ExternalLink, MessageCircle, ClipboardCheck, Trophy } from "lucide-react";
import { getMyCourseContent, markLessonComplete } from "@/lib/lms.functions";
import { getMyCertificateSignedUrl } from "@/lib/certificate.functions";
import { LMS_CONFIG, whatsappUrl } from "@/lib/lms-config";

export const Route = createFileRoute("/_authenticated/academy/dashboard/courses/$slug")({
  head: () => ({ meta: [{ title: "Course · LoveTech Agro Academy" }] }),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const fetchContent = useServerFn(getMyCourseContent);
  const complete = useServerFn(markLessonComplete);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["course-content", slug],
    queryFn: () => fetchContent({ data: { slug } }),
  });

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const mutate = useMutation({
    mutationFn: (payload: { lesson_id: string; course_id: string; completed: boolean }) =>
      complete({ data: payload }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["course-content", slug] }),
  });

  const cfg = LMS_CONFIG.courses[slug] ?? {};

  const { activeLesson, completionSet, totalLessons, completedCount } = useMemo(() => {
    if (!data) return { activeLesson: null, completionSet: new Set<string>(), totalLessons: 0, completedCount: 0 };
    const set = new Set(data.progress.filter((p) => p.completed).map((p) => p.lesson_id));
    const firstIncomplete = data.lessons.find((l) => !set.has(l.id)) ?? data.lessons[0];
    const active = data.lessons.find((l) => l.id === activeLessonId) ?? firstIncomplete ?? null;
    return { activeLesson: active, completionSet: set, totalLessons: data.lessons.length, completedCount: set.size };
  }, [data, activeLessonId]);

  if (isLoading) return <main className="grid min-h-[50vh] place-items-center text-sm text-foreground/60">Loading your course…</main>;
  if (error) throw notFound();
  if (!data) return null;

  if (!data.hasAccess) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-3 font-serif text-3xl text-vetiver">Access not active yet</h1>
        <p className="mb-6 text-foreground/70">
          {data.enrolment?.payment_status === "pending_payment"
            ? "Your enrolment is awaiting payment. Complete payment to unlock the course."
            : "You are not enrolled in this course yet."}
        </p>
        <Link to="/academy/courses/ai-tools-small-businesses" className="inline-flex rounded-sm bg-academy px-5 py-2.5 text-sm font-semibold text-white">
          Complete enrolment
        </Link>
      </main>
    );
  }

  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <main className="bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ochre">Lovetech AI Business Academy</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-serif text-2xl text-vetiver md:text-3xl">{data.course.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link to="/academy/dashboard/courses/$slug/assessments" params={{ slug }} className="inline-flex items-center gap-1 rounded-sm border border-vetiver/30 px-3 py-1.5 font-semibold text-vetiver hover:bg-vetiver/5"><ClipboardCheck className="size-4" /> Assessments</Link>
              <Link to="/academy/dashboard/courses/$slug/leaderboard" params={{ slug }} className="inline-flex items-center gap-1 rounded-sm border border-ochre/40 px-3 py-1.5 font-semibold text-ochre hover:bg-ochre/5"><Trophy className="size-4" /> Leaderboard</Link>
              <Link to="/academy/dashboard" className="text-vetiver hover:underline">← My Academy</Link>
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-foreground/70">
              <span>Course progress</span>
              <span className="font-semibold">{completedCount} / {totalLessons} lessons · {progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-academy transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* Player + main */}
        <div>
          {activeLesson ? (
            <article className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="aspect-video w-full bg-ink text-bone">
                {activeLesson.video_url ? (
                  isEmbeddable(activeLesson.video_url) ? (
                    <iframe
                      src={toEmbedUrl(activeLesson.video_url)}
                      title={activeLesson.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={activeLesson.video_url} controls className="h-full w-full" />
                  )
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-bone/70">
                    <PlayCircle className="size-10 opacity-60" />
                    <p className="text-sm">Video for this lesson will be published soon.</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="font-serif text-2xl text-vetiver">{activeLesson.title}</h2>
                {activeLesson.description && <p className="mt-2 text-sm text-foreground/70">{activeLesson.description}</p>}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => mutate.mutate({ lesson_id: activeLesson.id, course_id: data.course.id, completed: !completionSet.has(activeLesson.id) })}
                    className={`inline-flex items-center gap-2 rounded-sm px-5 py-2.5 text-sm font-semibold ${completionSet.has(activeLesson.id) ? "border border-vetiver/30 text-vetiver hover:bg-vetiver/5" : "bg-vetiver text-bone"}`}
                  >
                    {completionSet.has(activeLesson.id) ? <><CheckCircle2 className="size-4" /> Completed — mark incomplete</> : <><CheckCircle2 className="size-4" /> Mark as complete</>}
                  </button>
                  {activeLesson.resource_url && (
                    <a href={activeLesson.resource_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted">
                      <Download className="size-4" /> Resource
                    </a>
                  )}
                  <NextLessonButton lessons={data.lessons} activeId={activeLesson.id} onPick={setActiveLessonId} />
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-foreground/60">No lessons yet.</div>
          )}

          {/* Assignments / Assessment / Resources */}
          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <ActionCard
              icon={<FileText className="size-5" />}
              title="Participant Handbook"
              body="Download the course handbook and worksheets."
              href={cfg.handbookUrl || "#"}
              cta="Download PDF"
            />
            <ActionCard
              icon={<ExternalLink className="size-5" />}
              title="Submit Assignment"
              body="Use the same name & email as your enrolment so your certificate can be processed correctly."
              href={cfg.assignmentFormUrl || "#"}
              cta="Open form"
            />
            <ActionCard
              icon={<ExternalLink className="size-5" />}
              title="Complete Assessment"
              body="Complete the assessment and feedback form after finishing all modules."
              href={cfg.assessmentFormUrl || "#"}
              cta="Open form"
            />
          </section>

          {/* Certificate status */}
          <section className="mt-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-md bg-ochre/10 text-ochre"><Award className="size-6" /></div>
              <div className="flex-1">
                <h3 className="font-serif text-xl text-vetiver">Certificate</h3>
                <p className="mt-1 text-sm text-foreground/70">
                  Status: <span className="font-semibold text-vetiver">{formatCertStatus(data.certificate?.status ?? "not_eligible")}</span>
                  {data.certificate?.certificate_id && <> · ID: <span className="font-mono text-xs">{data.certificate.certificate_id}</span></>}
                </p>
                {data.certificate?.status === "issued" && (
                  <CertificateDownloadButton courseId={data.course.id} />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar: modules + lessons */}
        <aside className="lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h3 className="font-serif text-lg text-vetiver">Course content</h3>
              <p className="text-xs text-foreground/60">{data.modules.length} modules · {totalLessons} lessons</p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {data.modules.map((m) => {
                const modLessons = data.lessons.filter((l) => l.module_id === m.id);
                return (
                  <div key={m.id} className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-vetiver">Module {m.module_number}: {m.title}</div>
                    <ul>
                      {modLessons.map((l) => {
                        const done = completionSet.has(l.id);
                        const active = activeLesson?.id === l.id;
                        return (
                          <li key={l.id}>
                            <button
                              onClick={() => setActiveLessonId(l.id)}
                              className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${active ? "bg-vetiver/10 text-vetiver" : "hover:bg-muted"}`}
                            >
                              {done ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-vetiver" /> : <Circle className="mt-0.5 size-4 shrink-0 text-foreground/30" />}
                              <span className={done ? "text-foreground/60" : "text-foreground/85"}>{l.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <a href={whatsappUrl("Hi, I need help with my course.")} target="_blank" rel="noreferrer noopener" className="mt-4 flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white">
            <MessageCircle className="size-4" /> Support on WhatsApp
          </a>
        </aside>
      </div>
    </main>
  );
}

function NextLessonButton({ lessons, activeId, onPick }: { lessons: Array<{ id: string }>; activeId: string; onPick: (id: string) => void }) {
  const idx = lessons.findIndex((l) => l.id === activeId);
  const next = lessons[idx + 1];
  if (!next) return null;
  return (
    <button onClick={() => onPick(next.id)} className="inline-flex items-center gap-2 rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted">
      Next lesson →
    </button>
  );
}

function ActionCard({ icon, title, body, href, cta }: { icon: React.ReactNode; title: string; body: string; href: string; cta: string }) {
  const disabled = !href || href === "#";
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-2 flex items-center gap-2 text-vetiver">{icon}<h4 className="font-serif text-base">{title}</h4></div>
      <p className="mb-3 text-xs text-foreground/70">{body}</p>
      {disabled ? (
        <span className="inline-flex rounded-sm border border-border px-3 py-1.5 text-xs text-foreground/50">Coming soon</span>
      ) : (
        <a href={href} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-sm border border-vetiver/30 px-3 py-1.5 text-xs font-semibold text-vetiver hover:bg-vetiver/5">
          {cta} <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  );
}

function CertificateDownloadButton({ courseId }: { courseId: string }) {
  const getSigned = useServerFn(getMyCertificateSignedUrl);
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={async () => {
        setLoading(true);
        try {
          const { url } = await getSigned({ data: { course_id: courseId } });
          window.open(url, "_blank", "noopener,noreferrer");
        } catch (e) {
          alert((e as Error).message);
        } finally {
          setLoading(false);
        }
      }}
      className="mt-3 inline-flex items-center gap-2 rounded-sm bg-ochre px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
      disabled={loading}
    >
      <Download className="size-4" /> {loading ? "Preparing…" : "Download certificate"}
    </button>
  );
}

function formatCertStatus(s: string) {
  const map: Record<string, string> = {
    not_eligible: "Not eligible yet",
    assignment_submitted: "Assignment submitted",
    assessment_submitted: "Assessment submitted",
    under_review: "Under review",
    approved: "Approved",
    issued: "Certificate issued",
  };
  return map[s] ?? s.replaceAll("_", " ");
}

function isEmbeddable(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}
function toEmbedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}
