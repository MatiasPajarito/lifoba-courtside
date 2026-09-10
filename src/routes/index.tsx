import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  Instagram,
  Medal,
  MessageCircle,
  Star,
  Ticket,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { SponsorsSection } from "@/components/sponsors-section";
import { useStore } from "@/lib/store";
import { categoryLabel } from "@/lib/category";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LIFOBA · Liga Formativa de Básquetbol Clausura 2026" },
      {
        name: "description",
        content:
          "LIFOBA, Liga Formativa de Básquetbol. Torneo Clausura 2026: Categorías Sub 13, Sub 15 y Sub 18 Varones.",
      },
      { property: "og:title", content: "LIFOBA · Liga Formativa de Básquetbol" },
      {
        property: "og:description",
        content:
          "Categorías formativas U13, U15 y U18. Partidos semi-cronometrados, premios y desarrollo deportivo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const SECTIONS = [
  {
    to: "/posiciones",
    title: "Posiciones y resultados",
    desc: "Tabla actualizada y diferencia de puntos por categoría.",
    icon: Trophy,
  },
  {
    to: "/calendario",
    title: "Calendario y sedes",
    desc: "Fechas, horarios y ubicaciones de cada partido.",
    icon: CalendarDays,
  },
  {
    to: "/equipos",
    title: "Clubes y planteles",
    desc: "Rosters oficiales con posiciones de básquetbol.",
    icon: Users,
  },
  {
    to: "/reglamento",
    title: "Reglamento",
    desc: "Normativa del torneo y sistema de juego.",
    icon: ClipboardList,
  },
] as const;

function Home() {
  const { sponsors, selectedCategory } = useStore();
  return (
    <AppShell>
      <div className="space-y-10">
        {/* HERO */}
        <section className="overflow-hidden rounded-2xl border border-primary/30 bg-secondary text-secondary-foreground shadow-lg">
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 15% 20%, oklch(0.78 0.14 82 / 0.5) 0, transparent 45%), radial-gradient(circle at 85% 80%, oklch(0.78 0.14 82 / 0.35) 0, transparent 50%)",
              }}
            />
            <div className="relative">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary font-display text-2xl font-black text-primary-foreground shadow-[var(--shadow-court)]">
                  L
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Liga Formativa de Básquetbol
                  </div>
                  <div className="text-xs text-secondary-foreground/70">
                    Torneo Clausura 2026 · {categoryLabel(selectedCategory)}
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-black uppercase leading-none tracking-tight sm:text-6xl">
                LIFO<span className="text-primary">BA</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-secondary-foreground/80 sm:text-base">
                Liga Formativa de Básquetbol Clausura 2026. Competición enfocada en el desarrollo integral de los jugadores con categorías <strong>Sub 13, Sub 15 y Sub 18 Varones</strong>. Presentado por <strong>Clínica Dental Obident</strong>.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/posiciones"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
                >
                  <Trophy className="h-4 w-4" /> Ver posiciones
                </Link>
                <Link
                  to="/calendario"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-transparent px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
                >
                  <CalendarDays className="h-4 w-4" /> Calendario
                </Link>
                <a
                  href="https://api.whatsapp.com/send?phone=56974203763"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/50 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/10"
                >
                  <MessageCircle className="h-4 w-4" /> Solicitar bases
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-primary/20 border-t border-primary/20 bg-black/20 text-center sm:grid-cols-4">
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                8
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Clubes (U15 y U18)
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                6
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Clubes (U13)
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                3
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Categorías
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">
                4
              </div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Cuartos de Juego
              </div>
            </div>
          </div>
        </section>

        {/* PREMIOS */}
        <section>
          <h2 className="mb-3 text-lg font-black uppercase tracking-tight">
            Premios y reconocimientos
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Trophy,
                title: "1° Lugar",
                desc: "14 Medallas y Trofeo de Campeón oficial.",
              },
              {
                icon: Medal,
                title: "2° y 3° Lugar",
                desc: "14 Medallas y Trofeo para el podio del torneo.",
              },
              {
                icon: Star,
                title: "MVP del Partido",
                desc: "Reconocimiento y fotografía al jugador destacado de cada encuentro.",
              },
            ].map((p) => (
              <Card key={p.title} className="p-5">
                <p.icon className="mb-2 h-6 w-6 text-primary" />
                <div className="text-sm font-black uppercase tracking-tight">
                  {p.title}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section>
          <Card className="p-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Sobre el torneo
            </h2>
            <h3 className="mb-3 text-2xl font-black leading-tight">
              Desarrollo integral, orden y competencia real.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Nuestra liga formativa prioriza el aprendizaje. Los partidos se disputan de manera semi-cronometrada con cuerpo arbitral oficial para fomentar la imparcialidad. Para las categorías U15 y U18 se utiliza el sistema 3x1 (un jugador no puede jugar más de 3 cuartos), asegurando la rotación. Contamos con registro fotográfico para los MVP y localías rotativas en distintos recintos deportivos de la zona.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
                <Camera className="h-3.5 w-3.5 text-primary" /> Fotografía Oficial MVP
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
                <Ticket className="h-3.5 w-3.5 text-primary" /> Recaudación para el Local
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-1">
                <Star className="h-3.5 w-3.5 text-primary" /> Sponsor Clínica Obident
              </span>
            </div>
          </Card>
        </section>

        {/* CONTACTO */}
        <section className="grid gap-3 sm:grid-cols-2">
          <a
            href="#"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <Instagram className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-sm font-black uppercase tracking-tight">Instagram oficial</div>
              <p className="truncate text-xs text-muted-foreground">@lifoba.chile</p>
            </div>
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=56974203763"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <MessageCircle className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-sm font-black uppercase tracking-tight">WhatsApp · Organización</div>
              <p className="truncate text-xs text-muted-foreground">+569 7420 3763</p>
            </div>
          </a>
        </section>

        {/* SECTIONS GRID */}
        <section>
          <h2 className="mb-3 text-lg font-black uppercase tracking-tight">
            Explora la Liga
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-black uppercase tracking-tight">
                      {s.title}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <SponsorsSection sponsors={sponsors} />
      </div>
    </AppShell>
  );
}