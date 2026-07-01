import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Award, CheckCircle2 } from "lucide-react";
import { listCertificateApplicantsAdmin, approveCertificate, revokeCertificate } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/certificates")({
  component: CertificatesAdmin,
});

function CertificatesAdmin() {
  const list = useServerFn(listCertificateApplicantsAdmin);
  const approve = useServerFn(approveCertificate);
  const revoke = useServerFn(revokeCertificate);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-certs"], queryFn: () => list() });
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string>("");

  const approveMut = useMutation({
    mutationFn: (p: { user_id: string; course_id: string; certificate_name: string }) => approve({ data: p }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-certs"] }),
    onError: (e: Error) => setErr(e.message),
  });
  const revokeMut = useMutation({
    mutationFn: (id: string) => revoke({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-certs"] }),
  });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  const issuedKeys = new Set((data?.certificates ?? []).filter((c: any) => c.status === "issued").map((c: any) => `${c.user_id}::${c.course_id}`));

  return (
    <div className="space-y-8">
      {err && <div className="rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <section>
        <h2 className="mb-3 font-serif text-xl text-vetiver">Eligible learners</h2>
        <p className="mb-4 text-xs text-foreground/60">Learners with active enrolments. Approving generates a PDF certificate and unlocks download for the learner.</p>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-foreground/60">
              <tr>
                <th className="p-3">Learner</th>
                <th className="p-3">Course</th>
                <th className="p-3">Progress</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.eligible.map((e) => {
                const already = issuedKeys.has(`${e.user_id}::${e.course_id}`);
                const key = `${e.user_id}::${e.course_id}`;
                return (
                  <tr key={key} className="border-t border-border">
                    <td className="p-3"><div className="font-medium text-vetiver">{e.full_name}</div><div className="text-xs text-foreground/60">{e.email}</div></td>
                    <td className="p-3 text-xs">{e.course_title}</td>
                    <td className="p-3">
                      <div className="mb-1 flex items-center gap-2 text-xs"><span className="font-semibold">{e.completion_pct}%</span></div>
                      <div className="h-1.5 w-32 rounded-full bg-muted"><div className="h-full rounded-full bg-vetiver" style={{ width: `${e.completion_pct}%` }} /></div>
                    </td>
                    <td className="p-3 text-right">
                      {already ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-vetiver"><CheckCircle2 className="size-4" /> Issued</span>
                      ) : (
                        <button
                          onClick={() => {
                            const name = window.prompt("Name to appear on the certificate:", e.full_name ?? "");
                            if (!name) return;
                            setBusy(key); setErr("");
                            approveMut.mutate(
                              { user_id: e.user_id!, course_id: e.course_id!, certificate_name: name },
                              { onSettled: () => setBusy(null) },
                            );
                          }}
                          disabled={busy === key || e.completion_pct < 100}
                          className="rounded-sm bg-ochre px-3 py-1.5 text-xs font-semibold text-ink disabled:opacity-40"
                        >
                          {busy === key ? "Generating…" : "Approve & issue"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {data?.eligible.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-foreground/60">No eligible learners yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-serif text-xl text-vetiver">Issued certificates</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data?.certificates.filter((c: any) => c.status === "issued").map((c: any) => {
            const course = Array.isArray(c.course) ? c.course[0] : c.course;
            return (
              <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="mb-2 flex items-center gap-2 text-vetiver"><Award className="size-4" /> <span className="font-serif text-lg">{c.certificate_name}</span></div>
                <p className="text-xs text-foreground/70">{course?.title}</p>
                <p className="mt-1 font-mono text-xs text-foreground/60">{c.certificate_id}</p>
                <p className="text-xs text-foreground/60">Issued {c.issued_at ? new Date(c.issued_at).toLocaleDateString() : "—"}</p>
                <button
                  onClick={() => { if (confirm("Revoke this certificate?")) revokeMut.mutate(c.id); }}
                  className="mt-3 rounded-sm border border-border px-3 py-1 text-xs font-semibold"
                >Revoke</button>
              </div>
            );
          })}
          {data?.certificates.filter((c: any) => c.status === "issued").length === 0 && (
            <p className="text-sm text-foreground/60">None yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
