import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Star, Trophy, Users } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIFOBA · Liga Formativa de Básquetbol — Clausura 2026" },
      {
        name: "description",
        content:
          "Posiciones, partidos, planteles y estadísticas de la Liga Formativa de Básquetbol (LIFOBA), Clausura 2026 en categorías U13, U15 y U18 varones.",
      },
      { property: "og:title", content: "LIFOBA · Clausura 2026" },
      {
        property: "og:description",
        content:
          "Toda la Liga Formativa de Básquetbol: tabla de posiciones, resultados por cuartos, planteles y MVP de cada partido.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORIAS = [
  { code: "u13_varones", label: "U13 Varones" },
  { code: "u15_varones", label: "U15 Varones" },
  { code: "u18_varones", label: "U18 Varones" },
];

const ACCESOS = [
  {
    icon: Trophy,
    title: "Tabla de posiciones",
    desc: "2 puntos por victoria, 1 por derrota. Desempate por diferencia de puntos.",
  },
  {
    icon: CalendarDays,
    title: "Partidos por cuartos",
    desc: "Marcador cuarto a cuarto, más tiempos extras cuando corresponde.",
  },
  { icon: Users, title: "Planteles", desc: "Base, Escolta, Alero, Ala-Pívot y Pívot." },
  { icon: Star, title: "MVP del partido", desc: "Cada partido finalizado registra su jugador más valioso." },
];

function Index() {
  return (
    <AppShell>
      <section className="rounded-xl border border-border bg-card/70 p-8 shadow-[var(--shadow-court)] sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">
          Clausura 2026
        </p>
        <h1 className="mt-4 font-display text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-7xl">
          Liga Formativa
          <span className="block text-gradient-primary">de Básquetbol</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Resultados, tabla de posiciones y planteles de las categorías U13, U15 y U18 varones.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <span
              key={c.code}
              className="rounded-md border border-primary/40 bg-primary/10 px-4 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-primary"
            >
              {c.label}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {ACCESOS.map(({ icon: Icon, title, desc }) => (
          <article
            key={title}
            className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <Icon className="size-6 text-primary" />
            <h2 className="mt-4 font-display text-xl font-extrabold uppercase tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
