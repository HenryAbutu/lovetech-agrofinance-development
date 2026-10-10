export function AdminComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-ochre">Coming in Phase 2</p>
      <h2 className="mb-2 font-serif text-2xl text-vetiver">{title}</h2>
      <p className="mx-auto max-w-lg text-sm text-foreground/65">{description}</p>
    </div>
  );
}
