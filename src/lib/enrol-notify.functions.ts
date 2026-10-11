import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { findCourse } from "@/lib/academy-catalogue";

export const sendEnrolmentNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ email: z.string().email().max(200), course_slug: z.string().min(1).max(120), cohort: z.string().max(200).optional().nullable(), origin: z.string().url().max(200) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: p } = await context.supabase.from("profiles").select("full_name").ilike("email", data.email).maybeSingle();
    const course = findCourse(data.course_slug);
    const { sendLearnerEnrolledEmail } = await import("@/lib/emails.server");
    const r = await sendLearnerEnrolledEmail({
      email: data.email, name: p?.full_name ?? "", courseTitle: course?.title ?? data.course_slug,
      cohort: data.cohort, learnUrl: `${data.origin}/academy/learn/${data.course_slug}`,
    });
    return { ok: r.ok, error: r.error ?? null };
  });
