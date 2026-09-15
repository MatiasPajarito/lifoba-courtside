import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
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
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { SponsorsSection } from "@/components/sponsors-section";
import { StandingsTable } from "@/components/standings-table";
import { MatchCard } from "@/components/match-card";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import { categoryLabel, matchCategory, teamCategory } from "@/lib/category";
import { computeStandings } from "@/lib/standings";

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

const PREMIOS = [
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
] as const;

const SUPABASE_STORAGE =
  "https://qoetfmvloppsnasjkpoa.supabase.co/storage/v1/object/public/lifoba-assets";

const CLUBES = [
  { name: "Mamba Club", short: "MAM", match: ["mamba"], logo: "" },
  { name: "San Luis", short: "SLU", match: ["san luis"], logo: "" },
  {
    name: "Español",
    short: "ESP",
    match: ["español", "espaniol", "san antonio"],
    logo: `${SUPABASE_STORAGE}/espaniol_mejorado.png`,
  },
  { name: "Esparta", short: "EST", match: ["esparta"], logo: "" },
  { name: "DSM Melipilla", short: "DSM", match: ["dsm"], logo: "" },
  { name: "Liceo Curacaví", short: "LIC", match: ["liceo"], logo: "" },
  {
    name: "Gobernación",
    short: "GOB",
    match: ["goberna"],
    logo: `${SUPABASE_STORAGE}/gobernacion_mejorado.png`,
  },
  { name: "Padre Hurtado", short: "PH", match: ["hurtado"], logo: "" },
] as const;

function Home() {
  const {
    matches,
    teams: allTeams,
    sponsors,
    selectedCategory,
  } = useStore();

  const teams = useMemo(
    () => allTeams.filter((t) => teamCategory(t) === selectedCategory),
    [allTeams, selectedCategory],
  );

  const catMatches = useMemo(
    () => matches.filter((m) => matchCategory(m, allTeams) === selectedCategory),
    [matches, allTeams, selectedCategory],
  );

  const standings = useMemo(
    () => computeStandings(teams, catMatches),
    [teams, catMatches],
  );

  const recentMatches = useMemo(
    () =>
      catMatches
        .filter((m) => m.status === "finished")
        .sort(
          (a, b) =>
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
        )
        .slice(0, 2),
    [catMatches],
  );
  
  const isU13 = selectedCategory === "u13_varones";

  return (
    <AppShell>
      <div className="space-y-12">
        {/* HERO — 2 columnas en desktop */}
        <section className="overflow-hidden rounded-2xl border border-primary/30 bg-secondary text-secondary-foreground shadow-lg">
          <div className="grid grid-cols-1 items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2">
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 opacity-40 sm:-left-10 sm:-top-10"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.5798 0.132 270 / 0.45) 0, transparent 70%)",
                }}
              />
              
              <h1 className="text-6xl font-black uppercase leading-none tracking-tight md:text-8xl relative z-10">
                LIFO<span className="text-primary">BA</span>
              </h1>
              
              <p className="mt-4 max-w-2xl text-base text-secondary-foreground/80 sm:text-lg relative z-10">
                Liga Formativa de Básquetbol Clausura 2026. Competición enfocada
                en el desarrollo integral de los jugadores con categorías{" "}
                <strong>Sub 13, Sub 15 y Sub 18 Varones</strong>. Presentado por{" "}
                <strong>Clínica Dental Obident</strong>.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 relative z-10">
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

            {/* BANNER TROFEOS OBIDENT */}
            <div className="relative flex h-full w-full items-center justify-center">
              <img
                src="https://qoetfmvloppsnasjkpoa.supabase.co/storage/v1/object/public/lifoba-assets/logo_y_trofeos_mejorado.png"
                alt="Trofeos LIFOBA junto al sponsor oficial Clínica Dental Obident"
                className="h-auto w-full max-w-md lg:max-w-none rounded-2xl border border-primary/20 object-cover shadow-2xl transition-transform hover:scale-[1.01]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-primary/20 border-t border-primary/20 bg-black/20 text-center sm:grid-cols-4">
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">8</div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Clubes (U15 y U18)
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">6</div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Clubes (U13)
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">3</div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Categorías
              </div>
            </div>
            <div className="px-3 py-4">
              <div className="text-2xl font-black text-primary sm:text-3xl">4</div>
              <div className="text-[10px] uppercase tracking-wider text-secondary-foreground/70">
                Cuartos de Juego
              </div>
            </div>
          </div>
        </section>

        {/* CLUBES PARTICIPANTES */}
        <section>
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-black uppercase tracking-tight">
              Clubes participantes
            </h2>
            <Link
              to="/equipos"
              className="shrink-0 text-xs font-bold uppercase tracking-wide text-primary hover:underline"
            >
              Ver planteles
            </Link>
          </div>
          <div className="marquee-hover relative overflow-hidden rounded-xl border border-primary/20 bg-card py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="animate-marquee flex w-max items-center gap-4 px-2">
              {[...CLUBES, ...CLUBES].map((c, i) => {
                const t =
                  allTeams.find(
                    (x) => x.short_name.toLowerCase() === c.short.toLowerCase(),
                  ) ??
                  allTeams.find((x) => {
                    const n = x.name.toLowerCase();
                    return c.match.some((m) => n.includes(m));
                  });
                return (
                  <div
                    key={`${c.name}-${i}`}
                    className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-lg border border-primary/20 bg-background/40 p-4 transition-colors hover:border-primary"
                  >
                    <TeamLogo
                      team={{
                        name: c.name,
                        short_name: c.short,
                        logo_color: "#364DA0",
                        logo_url: c.logo || t?.logo_url || "",
                      }}
                      size={56}
                    />
                    <div className="text-center text-[11px] font-black uppercase leading-tight tracking-tight">
                      {c.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* DASHBOARD — Posiciones + Últimos Partidos/Premios */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr] items-stretch">
          
          {/* COLUMNA IZQUIERDA: TABLA DE POSICIONES */}
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-black uppercase tracking-tight">
                Tabla de posiciones
              </h2>
              <Link
                to="/posiciones"
                className="shrink-0 text-xs font-bold uppercase tracking-wide text-primary hover:underline"
              >
                Ver completa
              </Link>
            </div>
            <div className="flex-1 flex flex-col [&>div:last-child]:flex-1 [&_table]:h-full">
              <StandingsTable rows={standings} teams={teams} />
            </div>
          </div>

          {/* COLUMNA DERECHA: ÚLTIMOS PARTIDOS */}
          <div className="flex flex-col space-y-3">
            <h2 className="text-lg font-black uppercase tracking-tight">
              Últimos partidos
            </h2>
            <div className={`flex flex-col flex-1 min-h-0 ${isU13 ? 'gap-2' : 'gap-4'}`}>
              {recentMatches.length > 0 ? (
                recentMatches.map((m) => (
                  <div 
                    key={m.id} 
                    className={`flex-1 flex flex-col min-h-0 [&>div]:flex-1 [&>div]:flex [&>div]:flex-col [&>div]:justify-center ${
                      isU13 ? "[&>div]:p-3 [&_.mb-3]:mb-1 [&_.mt-3]:mt-1.5 [&_.pt-3]:pt-2" : ""
                    }`}
                  >
                    <MatchCard match={m} hideVenue={true} />
                  </div>
                ))
              ) : (
                <Card className="flex-1 flex items-center justify-center p-5 text-sm text-muted-foreground">
                  Aún no hay resultados registrados en {categoryLabel(selectedCategory)}.
                </Card>
              )}
            </div>
          </div>

        </section>

        {/* ABOUT */}
        <section>
          <Card className="p-6 md:p-8">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Sobre el torneo
            </h2>
            <h3 className="mb-3 text-2xl font-black leading-tight md:text-3xl">
              Desarrollo integral, orden y competencia real.
            </h3>
            <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Nuestra liga formativa prioriza el aprendizaje. Los partidos se
              disputan de manera semi-cronometrada con cuerpo arbitral oficial
              para fomentar la imparcialidad. Para las categorías U15 y U18 se
              utiliza el sistema 3x1 (un jugador no puede jugar más de 3
              cuartos), asegurando la rotación. Contamos con registro fotográfico
              para los MVP y localías rotativas en distintos recintos deportivos
              de la zona.
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

            <div className="mt-8 border-t border-primary/20 pt-8">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {PREMIOS.map((p) => (
                  <Card key={p.title} className="p-5">
                    <p.icon className="mb-2 h-6 w-6 text-primary" />
                    <div className="text-sm font-black uppercase tracking-tight">
                      {p.title}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* CONTACTO */}
        <section className="grid gap-3 sm:grid-cols-2">
          <a
            href="https://www.instagram.com/lifoba_/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            <Instagram className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="text-sm font-black uppercase tracking-tight">
                Instagram oficial
              </div>
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
              <div className="text-sm font-black uppercase tracking-tight">
                WhatsApp · Organización
              </div>
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
                    <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <SponsorsSection sponsors={sponsors} />
        
        {/* FOOTER DEL DESARROLLADOR */}
        <footer className="mt-12 flex flex-col items-center justify-center border-t border-primary/20 py-8 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Plataforma diseñada y desarrollada por</span>
            <a 
              href="https://github.com/MatiasPajarito"
              target="_blank" 
              rel="noreferrer"
              className="font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Matías Pajarito
            </a>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Ingeniería Civil en Informática
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
