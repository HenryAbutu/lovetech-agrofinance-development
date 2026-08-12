import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const OrderSchema = z.object({
  full_name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().min(6).max(50),
  city: z.string().max(120).optional().nullable(),
  delivery_address: z.string().max(500).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  items: z
    .array(
      z.object({
        sku: z.string().min(1).max(80),
        name: z.string().min(1).max(160),
        unit_price: z.coerce.number().min(0).max(10_000_000),
        quantity: z.coerce.number().int().min(1).max(500),
      }),
    )
    .min(1, "Select at least one product"),
});

export const submitRubyChaiOrder = createServerFn({ method: "POST" })
  .inputValidator((input) => OrderSchema.parse(input))
  .handler(async ({ data }) => {
    const total = data.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("rubychai_orders" as never).insert({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      city: data.city ?? null,
      delivery_address: data.delivery_address ?? null,
      notes: data.notes ?? null,
      items: data.items,
      estimated_total: total,
    } as never);
    if (error) throw new Error(error.message);

    const key = process.env.RESEND_API_KEY;
    if (key) {
      const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const rows = data.items
        .map(
          (i) =>
            `<tr><td style="padding:6px 12px">${esc(i.name)}</td><td style="padding:6px 12px">${i.quantity}</td><td style="padding:6px 12px">₦${(i.unit_price * i.quantity).toLocaleString()}</td></tr>`,
        )
        .join("");
      const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#102A43">New Ruby Chai order enquiry</h2>
        <p><strong>${esc(data.full_name)}</strong><br/>${esc(data.email)}<br/>${esc(data.phone)}</p>
        <p>${esc(data.city ?? "")}<br/>${esc(data.delivery_address ?? "")}</p>
        <table style="width:100%;border-collapse:collapse;background:#fbf3f4;border:1px solid #eee;border-radius:8px">
          <tr><th style="text-align:left;padding:6px 12px">Product</th><th style="text-align:left;padding:6px 12px">Qty</th><th style="text-align:left;padding:6px 12px">Amount</th></tr>
          ${rows}
        </table>
        <p style="font-size:16px"><strong>Estimated total: ₦${total.toLocaleString()}</strong></p>
        ${data.notes ? `<p style="white-space:pre-wrap">${esc(data.notes)}</p>` : ""}
      </div>`;
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: process.env.RESEND_FROM ?? "Ruby Chai Website <notifications@lovetechgroup.com.ng>",
            to: [process.env.ADMIN_NOTIFICATIONS_EMAIL ?? "info@lovetechgroup.com.ng"],
            reply_to: data.email,
            subject: `Ruby Chai order — ${data.full_name} (₦${total.toLocaleString()})`,
            html,
          }),
        });
        if (!res.ok) console.warn("[rubychai] Resend failed", res.status, await res.text());
      } catch (e) {
        console.warn("[rubychai] Resend exception", e);
      }
    }

    return { ok: true, total };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const listRubyChaiOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("rubychai_orders" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return { orders: (data ?? []) as any[] };
  });

export const updateRubyChaiOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ id: z.string().uuid(), status: z.enum(["new", "confirmed", "delivered", "cancelled"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("rubychai_orders" as never)
      .update({ status: data.status } as never)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
