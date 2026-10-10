import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "my_waitlist_entries",
  title: "My waitlist entries",
  description: "List the programmes the signed-in user has joined the waitlist for.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("academy_waitlist")
      .select("id, course_interest, status, created_at")
      .eq("user_id", ctx.getUserId()!)
      .order("created_at", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const entries = (data ?? []).map((w) => ({ id: w.id, programme: w.course_interest, status: w.status, joined_at: w.created_at }));
    return { content: [{ type: "text", text: JSON.stringify(entries) }], structuredContent: { entries } };
  },
});
