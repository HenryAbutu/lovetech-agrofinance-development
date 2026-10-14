// Server-only: confirms a Paystack charge matches what we expected to collect.
type PaystackData = { status?: string; amount?: number; currency?: string; reference?: string; metadata?: { enrolment_id?: string } };

export async function checkPaystackCharge(reference: string, key: string) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  const json = (await res.json().catch(() => ({}))) as { status?: boolean; data?: PaystackData };
  const d = json.data;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: payment } = await supabaseAdmin
    .from("academy_payments")
    .select("id, enrolment_id, amount, currency, status")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (!payment) return { ok: false as const, status: "not_found", enrolmentId: null };
  if (!json.status || d?.status !== "success") {
    return { ok: false as const, status: d?.status ?? "failed", enrolmentId: payment.enrolment_id };
  }
  const expectedKobo = Math.round(Number(payment.amount) * 100);
  const amountOk = typeof d.amount === "number" && d.amount >= expectedKobo;
  const currencyOk = (d.currency ?? "").toUpperCase() === (payment.currency ?? "NGN").toUpperCase();
  const metaOk = !d.metadata?.enrolment_id || d.metadata.enrolment_id === payment.enrolment_id;
  if (!amountOk || !currencyOk || !metaOk) {
    console.warn("[paystack] charge mismatch", { reference, expectedKobo, got: d.amount, currency: d.currency });
    return { ok: false as const, status: "amount_mismatch", enrolmentId: payment.enrolment_id };
  }
  return { ok: true as const, status: "success", enrolmentId: payment.enrolment_id };
}

export async function applyPaystackResult(reference: string, key: string) {
  const r = await checkPaystackCharge(reference, key);
  if (r.status === "not_found") return r;
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  if (r.ok) {
    // Only the first successful transition runs fulfilment, so duplicate webhooks/redirects are idempotent.
    const { data: changed } = await supabaseAdmin.from("academy_payments")
      .update({ status: "success", paid_at: new Date().toISOString() })
      .eq("paystack_reference", reference).neq("status", "success")
      .select("id");
    await supabaseAdmin.from("academy_enrolments")
      .update({ payment_status: "paid", access_status: "active" }).eq("id", r.enrolmentId);
    if (changed && changed.length > 0) {
      const { fulfilPayment } = await import("@/lib/payment-fulfilment.server");
      await fulfilPayment(reference);
    }
  } else {
    await supabaseAdmin.from("academy_payments")
      .update({ status: r.status }).eq("paystack_reference", reference).neq("status", "success");
  }
  return r;
}
