import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const BookingSchema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(50),
  apartment_type: z.string().max(120).optional().nullable(),
  check_in: z.string().max(20).optional().nullable(),
  check_out: z.string().max(20).optional().nullable(),
  guests: z.coerce.number().int().min(1).max(20).optional().nullable(),
  purpose: z.string().max(120).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export type House8BookingInput = z.infer<typeof BookingSchema>;

export const submitHouse8Booking = createServerFn({ method: "POST" })
  .inputValidator((input) => BookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("house8_bookings" as never).insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      apartment_type: data.apartment_type ?? null,
      check_in: data.check_in || null,
      check_out: data.check_out || null,
      guests: data.guests ?? null,
      purpose: data.purpose ?? null,
      notes: data.notes ?? null,
    } as never);
    if (error) throw new Error(error.message);

    const key = process.env.RESEND_API_KEY;
    if (key) {
      const esc = (s?: string | null) =>
        (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const row = (l: string, v?: string | number | null) =>
        v ? `<tr><td style="padding:6px 12px;color:#667;font-weight:600">${l}</td><td style="padding:6px 12px">${esc(String(v))}</td></tr>` : "";
      const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#102A43">New House 8 booking enquiry</h2>
        <table style="width:100%;border-collapse:collapse;background:#f7f9fb;border:1px solid #e6ebf0;border-radius:8px">
          ${row("Guest", data.full_name)}
          ${row("Email", data.email)}
          ${row("Phone", data.phone)}
          ${row("Apartment", data.apartment_type)}
          ${row("Check-in", data.check_in)}
          ${row("Check-out", data.check_out)}
          ${row("Guests", data.guests)}
          ${row("Purpose", data.purpose)}
        </table>
        ${data.notes ? `<h3 style="color:#102A43;margin-top:20px">Notes</h3><p style="white-space:pre-wrap">${esc(data.notes)}</p>` : ""}
      </div>`;
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.RESEND_FROM ?? "House 8 Website <notifications@lovetechgroup.com.ng>",
            to: [process.env.ADMIN_NOTIFICATIONS_EMAIL ?? "info@lovetechgroup.com.ng"],
            reply_to: data.email,
            subject: `House 8 booking enquiry — ${data.full_name}`,
            html,
          }),
        });
        if (!res.ok) console.warn("[house8] Resend failed", res.status, await res.text());
      } catch (e) {
        console.warn("[house8] Resend exception", e);
      }
    }

    return { ok: true };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const listHouse8Bookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("house8_bookings" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { bookings: (data ?? []) as any[] };
  });

export const updateHouse8BookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "contacted", "confirmed", "closed"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("house8_bookings" as never)
      .update({ status: data.status } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
