import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ---------- helpers ----------
async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

// ---------- overview ----------
export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [courses, enrols, payments, waitlist, certs] = await Promise.all([
      supabaseAdmin.from("academy_courses").select("id, title, status"),
      supabaseAdmin.from("academy_enrolments").select("id, payment_status, access_status, created_at"),
      supabaseAdmin.from("academy_payments").select("amount, currency, status, paid_at"),
      supabaseAdmin.from("academy_waitlist").select("id"),
      supabaseAdmin.from("academy_certificates").select("id, status"),
    ]);

    const revenue = (payments.data ?? [])
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const paidEnrolments = (enrols.data ?? []).filter((e) => e.payment_status === "paid").length;
    const pendingEnrolments = (enrols.data ?? []).filter((e) => e.payment_status !== "paid").length;
    const issuedCerts = (certs.data ?? []).filter((c) => c.status === "issued").length;

    return {
      courseCount: courses.data?.length ?? 0,
      enrolmentCount: enrols.data?.length ?? 0,
      paidEnrolments,
      pendingEnrolments,
      waitlistCount: waitlist.data?.length ?? 0,
      revenueNGN: revenue,
      issuedCerts,
      pendingCerts: (certs.data ?? []).filter((c) => c.status !== "issued").length,
    };
  });

// ---------- courses ----------
export const listCoursesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("academy_courses")
      .select("id, slug, title, subtitle, status, delivery_mode, regular_price, discount_price")
      .order("title");
    if (error) throw new Error(error.message);
    return { courses: data ?? [] };
  });

const CourseSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120),
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional().nullable(),
  status: z.enum(["draft", "enrolment_open", "coming_soon", "closed", "archived"]).default("draft"),
  regular_price: z.coerce.number().nonnegative().optional().nullable(),
  discount_price: z.coerce.number().nonnegative().optional().nullable(),
  delivery_mode: z.string().max(120).optional().nullable(),
});

export const upsertCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => CourseSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data };
    const { error } = await supabaseAdmin.from("academy_courses").upsert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- modules ----------
export const listModulesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ course_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: mods, error } = await supabaseAdmin
      .from("academy_modules")
      .select("id, course_id, module_number, title, sort_order")
      .eq("course_id", data.course_id)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { modules: mods ?? [] };
  });

const ModuleSchema = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  module_number: z.coerce.number().int().nonnegative(),
  title: z.string().min(1).max(200),
  sort_order: z.coerce.number().int().default(0),
});

export const upsertModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => ModuleSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("academy_modules").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteModule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("academy_modules").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- lessons ----------
export const listLessonsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ course_id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: lessons, error } = await supabaseAdmin
      .from("academy_lessons")
      .select("id, course_id, module_id, title, description, video_url, resource_url, duration_minutes, sort_order, is_preview")
      .eq("course_id", data.course_id)
      .order("sort_order");
    if (error) throw new Error(error.message);
    return { lessons: lessons ?? [] };
  });

const LessonSchema = z.object({
  id: z.string().uuid().optional(),
  course_id: z.string().uuid(),
  module_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(4000).optional().nullable(),
  video_url: z.string().max(500).optional().nullable(),
  resource_url: z.string().max(500).optional().nullable(),
  duration_minutes: z.coerce.number().int().nonnegative().optional().nullable(),
  sort_order: z.coerce.number().int().default(0),
  is_preview: z.coerce.boolean().default(false),
});

export const upsertLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => LessonSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("academy_lessons").upsert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLesson = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("academy_lessons").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- enrolments ----------
export const listEnrolmentsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("academy_enrolments")
      .select("id, full_name, email, phone, business_name, payment_status, access_status, created_at, course:academy_courses(title, slug)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { enrolments: data ?? [] };
  });

export const updateEnrolmentAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({
      id: z.string().uuid(),
      payment_status: z.enum(["pending_payment", "paid", "failed", "refunded"]).optional(),
      access_status: z.enum(["inactive", "active", "revoked"]).optional(),
    }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...updates } = data;
    const { error } = await supabaseAdmin.from("academy_enrolments").update(updates).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- payments ----------
export const listPaymentsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("academy_payments")
      .select("id, user_email, amount, currency, status, payment_provider, paystack_reference, paid_at, created_at, course:academy_courses(title)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { payments: data ?? [] };
  });

// ---------- waitlist ----------
export const listWaitlistAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("academy_waitlist")
      .select("id, full_name, email, phone, business_name, location, interest_area, created_at, course:academy_courses(title)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { waitlist: data ?? [] };
  });

// ---------- certificates ----------
export const listCertificateApplicantsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Existing certificate records + eligible learners
    const [{ data: certs }, { data: enrols }, { data: lessons }, { data: progress }] = await Promise.all([
      supabaseAdmin
        .from("academy_certificates")
        .select("id, user_id, course_id, status, certificate_id, certificate_name, certificate_pdf_url, issued_at, created_at, course:academy_courses(title)")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("academy_enrolments")
        .select("user_id, full_name, email, course_id, access_status, course:academy_courses(title)")
        .eq("access_status", "active"),
      supabaseAdmin.from("academy_lessons").select("id, course_id"),
      supabaseAdmin.from("academy_lesson_progress").select("user_id, course_id, lesson_id, completed"),
    ]);

    // Compute completion pct per (user, course)
    const totalByCourse = new Map<string, number>();
    for (const l of lessons ?? []) {
      totalByCourse.set(l.course_id, (totalByCourse.get(l.course_id) ?? 0) + 1);
    }
    const completedByKey = new Map<string, number>();
    for (const p of progress ?? []) {
      if (!p.completed) continue;
      const k = `${p.user_id}::${p.course_id}`;
      completedByKey.set(k, (completedByKey.get(k) ?? 0) + 1);
    }

    const eligible = (enrols ?? []).map((e) => {
      const total = totalByCourse.get(e.course_id) ?? 0;
      const completed = completedByKey.get(`${e.user_id}::${e.course_id}`) ?? 0;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const course = Array.isArray(e.course) ? e.course[0] : e.course;
      return {
        user_id: e.user_id,
        course_id: e.course_id,
        full_name: e.full_name,
        email: e.email,
        course_title: course?.title ?? "",
        completion_pct: pct,
      };
    });

    return { certificates: certs ?? [], eligible };
  });

const ApproveSchema = z.object({
  user_id: z.string().uuid(),
  course_id: z.string().uuid(),
  certificate_name: z.string().min(1).max(200),
  admin_notes: z.string().max(2000).optional().nullable(),
});

export const approveCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => ApproveSchema.parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

    // Course info
    const { data: course, error: cErr } = await supabaseAdmin
      .from("academy_courses")
      .select("id, title, slug")
      .eq("id", data.course_id)
      .single();
    if (cErr) throw new Error(cErr.message);

    const cfgMap: Record<string, string> = {
      "ai-tools-small-businesses": "LTAI-BASIC-2026",
      "professionals-ai-edge": "LTAI-EDGE-2026",
    };
    const prefix = cfgMap[course.slug] ?? "LTAI";
    const certificateId = `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const issuedAt = new Date();

    // Generate PDF
    const pdf = await PDFDocument.create();
    const page = pdf.addPage([842, 595]); // landscape A4
    const serif = await pdf.embedFont(StandardFonts.TimesRoman);
    const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
    const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);

    const vetiver = rgb(31 / 255, 77 / 255, 60 / 255);
    const ochre = rgb(200 / 255, 148 / 255, 31 / 255);
    const ink = rgb(26 / 255, 31 / 255, 28 / 255);

    // Border
    page.drawRectangle({ x: 20, y: 20, width: 802, height: 555, borderColor: vetiver, borderWidth: 3 });
    page.drawRectangle({ x: 30, y: 30, width: 782, height: 535, borderColor: ochre, borderWidth: 1 });

    // Header
    page.drawText("LOVETECH AGRO ACADEMY", { x: 421 - bold.widthOfTextAtSize("LOVETECH AGRO ACADEMY", 18) / 2, y: 510, size: 18, font: bold, color: vetiver });
    const sub = "LoveTech Agrofinance & Development Ltd";
    page.drawText(sub, { x: 421 - serif.widthOfTextAtSize(sub, 11) / 2, y: 490, size: 11, font: italic, color: ink });

    // Title
    const cert = "Certificate of Completion";
    page.drawText(cert, { x: 421 - bold.widthOfTextAtSize(cert, 34) / 2, y: 420, size: 34, font: bold, color: ink });

    // Awarded to
    const awarded = "This certifies that";
    page.drawText(awarded, { x: 421 - serif.widthOfTextAtSize(awarded, 14) / 2, y: 370, size: 14, font: serif, color: ink });

    const name = data.certificate_name;
    page.drawText(name, { x: 421 - bold.widthOfTextAtSize(name, 30) / 2, y: 325, size: 30, font: bold, color: vetiver });
    page.drawLine({ start: { x: 200, y: 315 }, end: { x: 642, y: 315 }, thickness: 0.5, color: ochre });

    const body1 = "has successfully completed the course";
    page.drawText(body1, { x: 421 - serif.widthOfTextAtSize(body1, 13) / 2, y: 285, size: 13, font: serif, color: ink });

    const courseTitle = `"${course.title}"`;
    page.drawText(courseTitle, { x: 421 - bold.widthOfTextAtSize(courseTitle, 18) / 2, y: 255, size: 18, font: bold, color: ink });

    const body2 = "delivered by LoveTech Agro Academy.";
    page.drawText(body2, { x: 421 - serif.widthOfTextAtSize(body2, 13) / 2, y: 228, size: 13, font: serif, color: ink });

    // Footer
    const dateStr = issuedAt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    page.drawText("Date Issued", { x: 130, y: 130, size: 10, font: serif, color: ink });
    page.drawLine({ start: { x: 130, y: 120 }, end: { x: 310, y: 120 }, thickness: 0.5, color: ink });
    page.drawText(dateStr, { x: 130, y: 100, size: 12, font: bold, color: ink });

    page.drawText("Certificate ID", { x: 530, y: 130, size: 10, font: serif, color: ink });
    page.drawLine({ start: { x: 530, y: 120 }, end: { x: 710, y: 120 }, thickness: 0.5, color: ink });
    page.drawText(certificateId, { x: 530, y: 100, size: 12, font: bold, color: ink });

    // Signature (typed)
    page.drawText("Chinny Loveday-Chukwu", { x: 421 - italic.widthOfTextAtSize("Chinny Loveday-Chukwu", 14) / 2, y: 170, size: 14, font: italic, color: vetiver });
    page.drawText("Founder & Chief Learning Officer", { x: 421 - serif.widthOfTextAtSize("Founder & Chief Learning Officer", 10) / 2, y: 155, size: 10, font: serif, color: ink });

    const bytes = await pdf.save();

    const path = `${data.user_id}/${data.course_id}.pdf`;
    const uint8 = new Uint8Array(bytes);
    const uploadRes = await supabaseAdmin.storage
      .from("certificates")
      .upload(path, uint8, { contentType: "application/pdf", upsert: true });
    if (uploadRes.error) throw new Error(uploadRes.error.message);

    // Upsert certificate row
    const { data: existing } = await supabaseAdmin
      .from("academy_certificates")
      .select("id")
      .eq("user_id", data.user_id)
      .eq("course_id", data.course_id)
      .maybeSingle();

    const row = {
      user_id: data.user_id,
      course_id: data.course_id,
      certificate_name: data.certificate_name,
      admin_notes: data.admin_notes ?? null,
      certificate_id: certificateId,
      certificate_pdf_url: path,
      status: "issued",
      issued_at: issuedAt.toISOString(),
    };
    if (existing?.id) {
      const { error } = await supabaseAdmin.from("academy_certificates").update(row).eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("academy_certificates").insert(row);
      if (error) throw new Error(error.message);
    }

    return { ok: true, certificate_id: certificateId };
  });

export const revokeCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: cert } = await supabaseAdmin
      .from("academy_certificates")
      .select("certificate_pdf_url")
      .eq("id", data.id)
      .maybeSingle();
    if (cert?.certificate_pdf_url) {
      await supabaseAdmin.storage.from("certificates").remove([cert.certificate_pdf_url]);
    }
    const { error } = await supabaseAdmin
      .from("academy_certificates")
      .update({ status: "revoked", certificate_pdf_url: null })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
