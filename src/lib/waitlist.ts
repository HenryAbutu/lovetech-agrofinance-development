import { getActiveSupabaseSession, supabase } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/waitlist.functions";

export type WaitlistEntry = {
  full_name?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  business_sector?: string;
  location?: string;
  interest_area?: string;
  main_challenge?: string;
  preferred_training_mode?: string;
};

export type WaitlistResult = { status: "ok" } | { status: "duplicate" };

/** Saves a waitlist entry straight from the browser (works on any host, no server env needed). */
export async function joinWaitlist(entry: WaitlistEntry, courseInterest: string): Promise<WaitlistResult> {
  const session = await getActiveSupabaseSession();
  const user = session?.user ?? null;
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
  const email = (entry.email || user?.email || "").trim();
  const full_name = (entry.full_name || String(meta.full_name ?? meta.name ?? "") || email.split("@")[0] || "").trim();
  console.info("[waitlist] submit", { signedIn: !!user, courseInterest });

  if (!full_name || !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Please provide your full name and a valid email address.");
  }

  if (user) {
    const { data: existing, error: dupErr } = await supabase
      .from("academy_waitlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_interest", courseInterest)
      .limit(1);
    if (dupErr) console.warn("[waitlist] duplicate check failed", dupErr.message);
    if (existing && existing.length > 0) return { status: "duplicate" };
  }

  const id = crypto.randomUUID();
  const { error } = await supabase.from("academy_waitlist").insert({
    ...entry,
    id,
    full_name: full_name.slice(0, 200),
    email: email.slice(0, 320),
    interest_area: (entry.interest_area || courseInterest).slice(0, 200),
    course_interest: courseInterest.slice(0, 300),
    source_page: typeof window !== "undefined" ? window.location.href.slice(0, 500) : null,
    user_id: user?.id ?? null,
    status: "new",
  });
  if (error) {
    console.error("[waitlist] insert failed", error.message);
    if (error.code === "23505") return { status: "duplicate" };
    throw new Error(error.message);
  }
  console.info("[waitlist] insert success");
  sendWaitlistConfirmation({ data: { id } }).catch((e) => console.warn("[waitlist] email failed", e));
  return { status: "ok" };
}
