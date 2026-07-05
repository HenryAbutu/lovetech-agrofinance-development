import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  listCoursesAdmin, upsertCourse,
  listModulesAdmin, upsertModule, deleteModule,
  listLessonsAdmin, upsertLesson, deleteLesson,
  createCourseMaterialUploadUrl, createCourseMaterialSignedUrl,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/courses")({
  component: CoursesAdmin,
});

function CoursesAdmin() {
  const list = useServerFn(listCoursesAdmin);
  const save = useServerFn(upsertCourse);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-courses"], queryFn: () => list() });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  const saveMut = useMutation({
    mutationFn: (c: any) => save({ data: c }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-courses"] }); setEditing(null); },
  });

  if (isLoading) return <p className="text-sm text-foreground/60">Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-vetiver">Courses</h2>
        <button onClick={() => setEditing({ slug: "", title: "", status: "draft" })} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone"><Plus className="size-4" /> New course</button>
      </div>

      <div className="rounded-2xl border border-border bg-card">
        {data?.courses.map((c: any) => (
          <div key={c.id} className="border-b border-border last:border-b-0">
            <div className="flex flex-wrap items-center gap-3 p-4">
              <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="text-vetiver">
                {expanded === c.id ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
              </button>
              <div className="flex-1">
                <p className="font-serif text-lg text-vetiver">{c.title}</p>
                <p className="text-xs text-foreground/60">/{c.slug} · {c.status} · ₦{Number(c.discount_price ?? c.regular_price ?? 0).toLocaleString()}</p>
              </div>
              <button onClick={() => setEditing(c)} className="rounded-sm border border-border px-3 py-1 text-xs font-semibold">Edit</button>
            </div>
            {expanded === c.id && <CourseContent courseId={c.id} />}
          </div>
        ))}
        {data?.courses.length === 0 && <p className="p-6 text-center text-foreground/60">No courses yet.</p>}
      </div>

      {editing && <CourseEditor initial={editing} onCancel={() => setEditing(null)} onSave={(c) => saveMut.mutate(c)} busy={saveMut.isPending} />}
    </div>
  );
}

function CourseEditor({ initial, onCancel, onSave, busy }: { initial: any; onCancel: () => void; onSave: (c: any) => void; busy: boolean }) {
  const [c, setC] = useState({ ...initial });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6">
        <h3 className="mb-4 font-serif text-xl text-vetiver">{c.id ? "Edit course" : "New course"}</h3>
        <div className="space-y-3 text-sm">
          <Field label="Title"><input value={c.title ?? ""} onChange={(e) => setC({ ...c, title: e.target.value })} className="input" /></Field>
          <Field label="Slug"><input value={c.slug ?? ""} onChange={(e) => setC({ ...c, slug: e.target.value })} className="input" /></Field>
          <Field label="Subtitle"><input value={c.subtitle ?? ""} onChange={(e) => setC({ ...c, subtitle: e.target.value })} className="input" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Regular price (₦)"><input type="number" value={c.regular_price ?? ""} onChange={(e) => setC({ ...c, regular_price: e.target.value })} className="input" /></Field>
            <Field label="Discount price (₦)"><input type="number" value={c.discount_price ?? ""} onChange={(e) => setC({ ...c, discount_price: e.target.value })} className="input" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status"><select value={c.status} onChange={(e) => setC({ ...c, status: e.target.value })} className="input"><option value="draft">Draft</option><option value="published">Published</option><option value="coming_soon">Coming soon</option></select></Field>
            <Field label="Delivery mode"><input value={c.delivery_mode ?? ""} onChange={(e) => setC({ ...c, delivery_mode: e.target.value })} className="input" /></Field>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-sm border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={() => onSave(c)} disabled={busy} className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function CourseContent({ courseId }: { courseId: string }) {
  const listMods = useServerFn(listModulesAdmin);
  const listLes = useServerFn(listLessonsAdmin);
  const saveMod = useServerFn(upsertModule);
  const delMod = useServerFn(deleteModule);
  const saveLes = useServerFn(upsertLesson);
  const delLes = useServerFn(deleteLesson);
  const qc = useQueryClient();

  const mods = useQuery({ queryKey: ["admin-mods", courseId], queryFn: () => listMods({ data: { course_id: courseId } }) });
  const les = useQuery({ queryKey: ["admin-les", courseId], queryFn: () => listLes({ data: { course_id: courseId } }) });

  const [editingMod, setEditingMod] = useState<any | null>(null);
  const [editingLes, setEditingLes] = useState<any | null>(null);

  const modMut = useMutation({ mutationFn: (m: any) => saveMod({ data: m }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-mods", courseId] }); setEditingMod(null); } });
  const modDelMut = useMutation({ mutationFn: (id: string) => delMod({ data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-mods", courseId] }) });
  const lesMut = useMutation({ mutationFn: (l: any) => saveLes({ data: l }), onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-les", courseId] }); setEditingLes(null); } });
  const lesDelMut = useMutation({ mutationFn: (id: string) => delLes({ data: { id } }), onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-les", courseId] }) });

  return (
    <div className="border-t border-border bg-muted/20 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-vetiver">Modules & lessons</h4>
        <button onClick={() => setEditingMod({ course_id: courseId, module_number: (mods.data?.modules.length ?? 0) + 1, title: "", sort_order: (mods.data?.modules.length ?? 0) + 1 })} className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 text-xs"><Plus className="size-3" /> Module</button>
      </div>
      <div className="space-y-3">
        {mods.data?.modules.map((m) => (
          <div key={m.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-vetiver">Module {m.module_number}: {m.title}</p>
              <div className="flex gap-1">
                <button onClick={() => setEditingLes({ course_id: courseId, module_id: m.id, title: "", sort_order: 0 })} className="rounded-sm border border-border px-2 py-1 text-xs">+ Lesson</button>
                <button onClick={() => setEditingMod(m)} className="rounded-sm border border-border px-2 py-1 text-xs">Edit</button>
                <button onClick={() => { if (confirm("Delete module (and its lessons will lose their parent)?")) modDelMut.mutate(m.id); }} className="rounded-sm border border-border px-2 py-1 text-xs text-red-600"><Trash2 className="size-3" /></button>
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {les.data?.lessons.filter((l) => l.module_id === m.id).map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-2 rounded border border-border/50 bg-background px-3 py-2 text-xs">
                  <span>{l.title}{l.is_preview && <span className="ml-2 rounded bg-ochre/10 px-1.5 py-0.5 text-[10px] font-semibold text-ochre">PREVIEW</span>}</span>
                  <span className="flex gap-1">
                    <button onClick={() => setEditingLes(l)} className="rounded-sm border border-border px-2 py-0.5">Edit</button>
                    <button onClick={() => { if (confirm("Delete lesson?")) lesDelMut.mutate(l.id); }} className="rounded-sm border border-border px-2 py-0.5 text-red-600"><Trash2 className="size-3" /></button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {mods.data?.modules.length === 0 && <p className="text-xs text-foreground/60">No modules yet.</p>}
      </div>

      {editingMod && <ModuleEditor initial={editingMod} onCancel={() => setEditingMod(null)} onSave={(m: any) => modMut.mutate(m)} busy={modMut.isPending} />}
      {editingLes && <LessonEditor initial={editingLes} onCancel={() => setEditingLes(null)} onSave={(l: any) => lesMut.mutate(l)} busy={lesMut.isPending} />}
    </div>
  );
}

function ModuleEditor({ initial, onCancel, onSave, busy }: any) {
  const [m, setM] = useState({ ...initial });
  return (
    <Modal title={m.id ? "Edit module" : "New module"} onCancel={onCancel} onSave={() => onSave(m)} busy={busy}>
      <Field label="Title"><input value={m.title ?? ""} onChange={(e) => setM({ ...m, title: e.target.value })} className="input" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Module #"><input type="number" value={m.module_number ?? 0} onChange={(e) => setM({ ...m, module_number: e.target.value })} className="input" /></Field>
        <Field label="Sort order"><input type="number" value={m.sort_order ?? 0} onChange={(e) => setM({ ...m, sort_order: e.target.value })} className="input" /></Field>
      </div>
    </Modal>
  );
}

function LessonEditor({ initial, onCancel, onSave, busy }: any) {
  const [l, setL] = useState({ ...initial });
  return (
    <Modal title={l.id ? "Edit lesson" : "New lesson"} onCancel={onCancel} onSave={() => onSave(l)} busy={busy}>
      <Field label="Title"><input value={l.title ?? ""} onChange={(e) => setL({ ...l, title: e.target.value })} className="input" /></Field>
      <Field label="Description"><textarea value={l.description ?? ""} onChange={(e) => setL({ ...l, description: e.target.value })} className="input min-h-[80px]" /></Field>
      <Field label="Video (URL or upload MP4)">
        <input value={l.video_url ?? ""} onChange={(e) => setL({ ...l, video_url: e.target.value })} className="input" placeholder="https://... or upload below" />
        <FileUploader courseId={l.course_id} kind="video" accept="video/*" onDone={(url) => setL((s: any) => ({ ...s, video_url: url }))} />
      </Field>
      <Field label="Resource (URL or upload PDF/file)">
        <input value={l.resource_url ?? ""} onChange={(e) => setL({ ...l, resource_url: e.target.value })} className="input" placeholder="https://... or upload below" />
        <FileUploader courseId={l.course_id} kind="resource" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*" onDone={(url) => setL((s: any) => ({ ...s, resource_url: url }))} />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Sort order"><input type="number" value={l.sort_order ?? 0} onChange={(e) => setL({ ...l, sort_order: e.target.value })} className="input" /></Field>
        <Field label="Duration (min)"><input type="number" value={l.duration_minutes ?? ""} onChange={(e) => setL({ ...l, duration_minutes: e.target.value })} className="input" /></Field>
        <Field label="Preview"><select value={String(l.is_preview ?? false)} onChange={(e) => setL({ ...l, is_preview: e.target.value === "true" })} className="input"><option value="false">No</option><option value="true">Yes</option></select></Field>
      </div>
    </Modal>
  );
}

function FileUploader({ courseId, kind, accept, onDone }: { courseId: string; kind: "video" | "resource"; accept: string; onDone: (url: string) => void }) {
  const getUploadUrl = useServerFn(createCourseMaterialUploadUrl);
  const getSignedUrl = useServerFn(createCourseMaterialSignedUrl);
  const [busy, setBusy] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { path, token } = await getUploadUrl({ data: { course_id: courseId, filename: file.name, kind } });
      const { error } = await supabase.storage.from("course-materials").uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (error) throw error;
      const { signedUrl } = await getSignedUrl({ data: { path, expires_in: 60 * 60 * 24 * 365 } });
      onDone(signedUrl);
      toast.success(`${kind === "video" ? "Video" : "Resource"} uploaded`);
    } catch (err: any) {
      toast.error(err?.message ?? "Upload failed");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-border bg-background px-3 py-1.5 text-xs font-semibold text-vetiver hover:bg-muted/40">
        <Upload className="size-3.5" /> {busy ? "Uploading…" : "Upload file"}
        <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={busy} />
      </label>
      <span className="text-[11px] text-foreground/50">Stored privately; signed URL valid 1 year.</span>
    </div>
  );
}

function Modal({ title, onCancel, onSave, busy, children }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6">
        <h3 className="mb-4 font-serif text-xl text-vetiver">{title}</h3>
        <div className="space-y-3 text-sm">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-sm border border-border px-4 py-2 text-sm">Cancel</button>
          <button onClick={onSave} disabled={busy} className="rounded-sm bg-vetiver px-4 py-2 text-sm font-semibold text-bone disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-foreground/60">{label}</span>{children}</label>;
}
