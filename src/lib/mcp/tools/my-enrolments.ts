import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_enrolments",
  title: "My enrolments",
  description: "List the signed-in learner's course enrolments with payment and access status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("academy_enrolments")
      .select("id, created_at, payment_status, access_status, course:academy_courses(slug, title)")
      .eq("user_id", ctx.getUserId()!)
      .order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const enrolments = (data ?? []).map((e) => {
      const c = Array.isArray(e.course) ? e.course[0] : e.course;
      return {
        id: e.id, enrolled_at: e.created_at, payment_status: e.payment_status, access_status: e.access_status,
        course_slug: c?.slug ?? null, course_title: c?.title ?? null,
      };
    });
    return { content: [{ type: "text", text: JSON.stringify(enrolments) }], structuredContent: { enrolments } };
  },
});
