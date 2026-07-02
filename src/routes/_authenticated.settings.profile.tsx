import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Save, User, Globe } from "lucide-react";
import { getMyProfile, updateMyProfile } from "@/lib/profiles-public.functions";
import { PushToggle } from "@/components/push-toggle";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  head: () => ({ meta: [{ title: "Profile settings · LoveTech Academy" }] }),
  component: ProfileSettings,
});

function ProfileSettings() {
  const fetchProfile = useServerFn(getMyProfile);
  const update = useServerFn(updateMyProfile);
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchProfile(),
  });

  const [form, setForm] = useState({
    full_name: "",
    headline: "",
    bio: "",
    location: "",
    website_url: "",
    avatar_url: "",
    is_public: false,
    public_slug: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      headline: profile.headline ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      website_url: profile.website_url ?? "",
      avatar_url: profile.avatar_url ?? "",
      is_public: profile.is_public ?? false,
      public_slug: profile.public_slug ?? "",
    });
  }, [profile]);

  const save = useMutation({
    mutationFn: () => update({
      data: {
        full_name: form.full_name || undefined,
        headline: form.headline || null,
        bio: form.bio || null,
        location: form.location || null,
        website_url: form.website_url || null,
        avatar_url: form.avatar_url || null,
        is_public: form.is_public,
        public_slug: form.public_slug ? form.public_slug.toLowerCase() : null,
      },
    }),
    onSuccess: () => {
      setMsg("Saved");
      setErr(null);
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      setTimeout(() => setMsg(null), 2500);
    },
    onError: (e: Error) => { setErr(e.message); setMsg(null); },
  });

  if (isLoading) return <main className="grid min-h-[40vh] place-items-center text-sm text-foreground/60">Loading…</main>;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-ochre">Settings</p>
        <h1 className="font-serif text-3xl text-vetiver">Your profile</h1>
        <p className="mt-1 text-sm text-foreground/60">This appears next to your posts and, if you turn on your public profile, on your learner page.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
        className="space-y-8"
      >
        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-vetiver"><User className="size-5" /><h2 className="font-serif text-xl">Basics</h2></div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Full name" required>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="input" required maxLength={120} />
            </Field>
            <Field label="Headline">
              <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className="input" placeholder="e.g. Poultry farmer & MSME owner" maxLength={160} />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input" placeholder="Abuja, Nigeria" maxLength={120} />
            </Field>
            <Field label="Website">
              <input type="url" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="input" placeholder="https://" maxLength={500} />
            </Field>
            <Field label="Avatar URL" full>
              <input type="url" value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} className="input" placeholder="https://…" maxLength={500} />
            </Field>
            <Field label="Bio" full>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="input" maxLength={2000} placeholder="Share a few sentences about your business or work." />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-2 text-vetiver"><Globe className="size-5" /><h2 className="font-serif text-xl">Public profile</h2></div>
          <p className="mb-4 text-sm text-foreground/60">Turn this on to appear in the learner directory. Anyone with your link can view your name, headline, bio, badges, and issued certificates.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Public username">
              <input
                value={form.public_slug}
                onChange={(e) => setForm({ ...form, public_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                className="input"
                placeholder="e.g. jane-adaeze"
                maxLength={60}
              />
              {form.public_slug && (
                <p className="mt-1 text-xs text-foreground/50">Your page: /learners/{form.public_slug}</p>
              )}
            </Field>
            <label className="flex items-end gap-3">
              <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="size-5 accent-vetiver" />
              <span className="text-sm">Show me in the public learner directory</span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-2 font-serif text-xl text-vetiver">Notifications</h2>
          <p className="mb-4 text-sm text-foreground/60">Get push notifications on this device when new lessons drop or your submission is graded.</p>
          <PushToggle />
        </section>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={save.isPending} className="inline-flex items-center gap-2 rounded-sm bg-vetiver px-5 py-2.5 text-sm font-semibold text-bone disabled:opacity-50">
            <Save className="size-4" /> {save.isPending ? "Saving…" : "Save changes"}
          </button>
          {msg && <span className="text-sm text-vetiver">{msg}</span>}
          {err && <span className="text-sm text-red-600">{err}</span>}
        </div>
      </form>

      <style>{`.input{width:100%;border-radius:.375rem;border:1px solid hsl(var(--border));background:hsl(var(--background));padding:.5rem .75rem;font-size:.875rem;outline:none} .input:focus{border-color:var(--vetiver);box-shadow:0 0 0 3px color-mix(in oklab, var(--vetiver) 20%, transparent)}`}</style>
    </main>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-foreground/60">{label}{required && <span className="text-red-600"> *</span>}</span>
      {children}
    </label>
  );
}
