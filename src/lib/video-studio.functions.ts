import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const InputSchema = z.object({
  course_slug: z.string().max(120),
  module_title: z.string().min(1).max(300),
  audience: z.string().min(1).max(300),
  duration_minutes: z.number().int().min(1).max(60),
  key_points: z.string().min(1).max(4000),
  nigerian_example: z.string().max(2000).optional().nullable(),
  practical_activity: z.string().max(2000).optional().nullable(),
  call_to_action: z.string().max(500).optional().nullable(),
});

const SYSTEM = `You are a senior course producer for LoveTech Agro Academy in Nigeria.
Generate a structured short video script (around the requested duration) that a presenter can record directly.
The output MUST follow this 12-part structure with these exact headings:
1. Hook
2. Title & Module
3. Objective
4. Why It Matters (Nigerian MSME context)
5. Key Concepts
6. Concrete Example (Nigerian context)
7. Step-by-Step Walkthrough
8. Common Mistakes
9. Practical Activity / Mini Exercise
10. Tools / Resources to Mention
11. Recap (3 bullets)
12. Call To Action
Tone: warm, practical, plain English, no fluff. Format in clean Markdown with these headings as level-2 (##).`;

export const generateVideoScript = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const { data: isAdmin, error: roleErr } = await supabaseAdmin.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleErr) throw new Error(roleErr.message);
    if (!isAdmin) throw new Error("Forbidden: admin role required");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const userPrompt = `Course: ${data.course_slug}
Module/Lesson: ${data.module_title}
Audience: ${data.audience}
Target length: ~${data.duration_minutes} minutes
Key points to cover:
${data.key_points}

${data.nigerian_example ? `Specific Nigerian example to weave in: ${data.nigerian_example}` : ""}
${data.practical_activity ? `Suggested practical activity: ${data.practical_activity}` : ""}
${data.call_to_action ? `Desired call to action: ${data.call_to_action}` : ""}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`AI Gateway error ${res.status}: ${txt.slice(0, 300)}`);
    }
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const script = json.choices?.[0]?.message?.content ?? "";

    let course_id: string | null = null;
    const { data: c } = await supabaseAdmin
      .from("academy_courses")
      .select("id")
      .eq("slug", data.course_slug)
      .maybeSingle();
    course_id = c?.id ?? null;

    const { data: saved, error: insErr } = await supabaseAdmin
      .from("video_script_prompts")
      .insert({
        title: data.module_title,
        prompt_text: userPrompt,
        generated_script: script,
        course_id,
        created_by: userId,
        status: "ready",
      })
      .select()
      .single();
    if (insErr) throw new Error(insErr.message);

    return { ok: true, script, id: saved.id };
  });
