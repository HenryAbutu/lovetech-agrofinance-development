import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_courses",
  title: "List academy courses",
  description: "List published LoveTech Academy courses with prices and delivery mode.",
  inputSchema: { limit: z.number().int().min(1).max(50).optional().describe("Max courses to return (default 20).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await supabaseForUser(ctx)
      .from("academy_courses")
      .select("slug, title, subtitle, delivery_mode, regular_price, discount_price, status")
      .eq("status", "published")
      .order("title")
      .limit(limit ?? 20);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const courses = (data ?? []).map((c) => ({
      slug: c.slug, title: c.title, subtitle: c.subtitle, delivery_mode: c.delivery_mode,
      regular_price: c.regular_price, discount_price: c.discount_price,
    }));
    return { content: [{ type: "text", text: JSON.stringify(courses) }], structuredContent: { courses } };
  },
});
