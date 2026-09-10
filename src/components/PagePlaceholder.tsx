export function PagePlaceholder({ title, desc }: { title: string; desc: string }) {
  return (
    <section className="rounded-xl border border-border bg-card p-8">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Clausura 2026</p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight">{title}</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">{desc}</p>
    </section>
  );
}
