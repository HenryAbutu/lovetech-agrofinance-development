import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Printer, AlertCircle, FileText } from "lucide-react";
import { z } from "zod";
import { getReceipt } from "@/lib/receipt.functions";
import { getMyInvoiceUrl } from "@/lib/invoice.functions";

const SearchSchema = z.object({
  ref: z.string().optional(),
  payment: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/academy/receipt")({
  validateSearch: (s) => SearchSchema.parse(s),
  head: () => ({ meta: [{ title: "Enrolment Receipt — LoveTech Agro Academy" }] }),
  component: Page,
});

function Page() {
  const { ref, payment: paymentStatus } = useSearch({ from: "/_authenticated/academy/receipt" });
  const fetchReceipt = useServerFn(getReceipt);
  const { data, isLoading, error } = useQuery({
    queryKey: ["receipt", ref],
    queryFn: () => fetchReceipt({ data: { reference: ref! } }),
    enabled: !!ref,
    retry: 1,
  });

  if (!ref) return <Empty title="No reference" body="We couldn't find a transaction reference in the link." />;
  if (paymentStatus === "failed") return <Failed reference={ref} />;
  if (isLoading) return <Empty title="Loading receipt…" body="Fetching your payment details." />;
  if (error || !data || !data.found) return <Empty title="Receipt not found" body="We couldn't find a payment for this reference. If you were just charged, please refresh in a moment or contact support." />;

  const { payment, enrolment, course } = data;
  const isSuccess = payment.status === "success";
  const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: payment.currency || "NGN", maximumFractionDigits: 0 }).format(n);
  const paidAmount = Number(payment.amount);
  const discount = Number(enrolment?.discount_amount ?? 0);
  const subtotal = paidAmount + discount;
  const amountStr = fmt(paidAmount);
  const paidAt = payment.paid_at ? new Date(payment.paid_at) : null;

  return (
    <main className="min-h-screen bg-card px-6 py-16 lg:px-8 print:bg-white print:py-4">
      <div className="mx-auto max-w-3xl">
        {isSuccess ? (
          <div className="mb-6 flex items-center gap-3 rounded-md border border-vetiver/30 bg-vetiver/5 p-4 print:hidden">
            <CheckCircle2 className="size-6 text-vetiver" />
            <div>
              <p className="font-serif text-lg text-vetiver">Payment successful</p>
              <p className="text-sm text-foreground/70">Your enrolment is now active.</p>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-3 rounded-md border border-ochre/40 bg-ochre/5 p-4 print:hidden">
            <AlertCircle className="size-6 text-ochre" />
            <div>
              <p className="font-serif text-lg text-vetiver">Payment {payment.status}</p>
              <p className="text-sm text-foreground/70">If this is unexpected, contact us with the reference below.</p>
            </div>
          </div>
        )}

        <article className="rounded-2xl border border-border bg-background p-8 shadow-sm print:border-0 print:shadow-none">
          <header className="mb-8 flex items-start justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ochre">Enrolment Receipt</p>
              <h1 className="mt-1 font-serif text-3xl text-vetiver">LoveTech Agro Academy</h1>
              <p className="mt-1 text-sm text-foreground/60">27, 3rd Avenue, Aldenco Estate, Galadimawa, Abuja</p>
              <p className="text-sm text-foreground/60">info@lovetechgroup.com.ng · www.lovetechgroup.com.ng</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-foreground/50">Receipt #</p>
              <p className="font-mono text-sm text-vetiver">{payment.id.slice(0, 8).toUpperCase()}</p>
              {paidAt && (
                <>
                  <p className="mt-2 text-xs uppercase tracking-wider text-foreground/50">Date paid</p>
                  <p className="text-sm text-vetiver">{paidAt.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</p>
                </>
              )}
            </div>
          </header>

          <section className="mb-8 grid gap-6 md:grid-cols-2">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-foreground/50">Billed to</p>
              <p className="font-medium text-vetiver">{enrolment?.full_name ?? "—"}</p>
              <p className="text-sm text-foreground/70">{enrolment?.email ?? payment.user_email}</p>
            </div>
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-foreground/50">Transaction reference</p>
              <p className="font-mono text-sm text-vetiver break-all">{payment.paystack_reference}</p>
              <p className="mt-2 text-xs uppercase tracking-wider text-foreground/50">Provider</p>
              <p className="text-sm text-vetiver">Paystack</p>
            </div>
          </section>

          <section className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-foreground/50">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-4">
                    <p className="font-medium text-vetiver">{course?.title ?? "Course enrolment"}</p>
                    <p className="text-xs text-foreground/60">Launch cohort · self-paced + Zoom · WhatsApp cohort support</p>
                  </td>
                  <td className="py-4 text-right font-medium text-vetiver">{fmt(subtotal)}</td>
                </tr>
                {discount > 0 && (
                  <tr className="border-b border-border">
                    <td className="py-3 text-sm text-foreground/70">Discount{enrolment?.coupon_code ? ` (${enrolment.coupon_code})` : ""}</td>
                    <td className="py-3 text-right text-sm font-medium text-ochre">-{fmt(discount)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 text-right text-xs uppercase tracking-wider text-foreground/50">Total paid</td>
                  <td className="pt-4 text-right font-serif text-2xl text-vetiver">{amountStr}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          {isSuccess && (
            <section className="rounded-xl border border-academy/30 bg-academy/5 p-6">
              <h2 className="mb-3 font-serif text-xl text-vetiver">Next steps to access your course</h2>
              <ol className="space-y-2 text-sm text-foreground/80">
                <li><span className="font-semibold text-vetiver">1.</span> Visit your Academy dashboard — your enrolment is now active.</li>
                <li><span className="font-semibold text-vetiver">2.</span> Watch your email ({enrolment?.email ?? payment.user_email}) for cohort welcome details and the WhatsApp group invite.</li>
                <li><span className="font-semibold text-vetiver">3.</span> Begin Module 1 at your own pace; live Zoom sessions and support are announced in WhatsApp.</li>
                <li><span className="font-semibold text-vetiver">4.</span> Questions? Email <a className="underline" href="mailto:info@lovetechgroup.com.ng">info@lovetechgroup.com.ng</a> or call 08026065189.</li>
              </ol>
            </section>
          )}

          <footer className="mt-8 border-t border-border pt-4 text-xs text-foreground/50">
            This receipt confirms payment for the course listed above. Please keep it for your records.
          </footer>
        </article>

        <div className="mt-6 flex flex-wrap gap-3 print:hidden">
          {isSuccess && (
            <Link to="/academy/dashboard" className="rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Go to dashboard</Link>
          )}
          {isSuccess && payment.invoice_pdf_url && <InvoiceDownload paymentId={payment.id} />}
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-sm border border-border bg-background px-5 py-2.5 text-sm font-semibold text-vetiver hover:bg-card">
            <Printer className="size-4" /> Print
          </button>
        </div>
      </div>
    </main>
  );
}

function InvoiceDownload({ paymentId }: { paymentId: string }) {
  const fn = useServerFn(getMyInvoiceUrl);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  async function open() {
    setLoading(true); setErr("");
    try {
      const r = await fn({ data: { payment_id: paymentId } });
      if (r.url) window.open(r.url, "_blank", "noopener");
      else setErr("Invoice not ready yet — refresh in a moment.");
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
    finally { setLoading(false); }
  }
  return (
    <>
      <button onClick={open} disabled={loading} className="inline-flex items-center gap-2 rounded-sm border border-vetiver/40 bg-background px-5 py-2.5 text-sm font-semibold text-vetiver hover:bg-card disabled:opacity-60">
        <FileText className="size-4" /> {loading ? "Preparing…" : "Download invoice (PDF)"}
      </button>
      {err && <span className="self-center text-xs text-destructive">{err}</span>}
    </>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen bg-card px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-background p-8 text-center">
        <h1 className="font-serif text-2xl text-vetiver">{title}</h1>
        <p className="mt-2 text-sm text-foreground/70">{body}</p>
        <Link to="/academy/dashboard" className="mt-6 inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Go to dashboard</Link>
      </div>
    </main>
  );
}

function Failed({ reference }: { reference: string }) {
  return (
    <main className="min-h-screen bg-card px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-border bg-background p-8 text-center">
        <AlertCircle className="mx-auto size-10 text-ochre" />
        <h1 className="mt-3 font-serif text-2xl text-vetiver">Payment was not completed</h1>
        <p className="mt-2 text-sm text-foreground/70">Reference: <span className="font-mono">{reference}</span></p>
        <p className="mt-2 text-sm text-foreground/70">No charge was confirmed. You can try again from the enrolment page.</p>
        <Link to="/academy/courses/professionals-ai-edge" hash="enrol" className="mt-6 inline-flex rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone">Try again</Link>
      </div>
    </main>
  );
}
