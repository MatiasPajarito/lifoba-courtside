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
import { Badge } from "@/components/ui/badge";
import { SponsorsSection } from "@/components/sponsors-section";
import { StandingsTable } from "@/components/standings-table";
import { MatchCard } from "@/components/match-card";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import { categoryLabel, matchCategory, teamCategory } from "@/lib/category";
import { computeStandings } from "@/lib/standings";
import type { Match } from "@/lib/types";

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

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function FeaturedScoreboard() {
  const { matches, teams, players, selectedCategory } = useStore();

  const featured = useMemo<Match | undefined>(() => {
    const catMatches = matches.filter(
      (m) => matchCategory(m, teams) === selectedCategory,
    );
    const finished = catMatches
      .filter((m) => m.status === "finished")
      .sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
      )[0];
    if (finished) return finished;
    return catMatches
      .filter((m) => m.status === "scheduled")
      .sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
      )[0];
  }, [matches, teams, selectedCategory]);

  if (!featured) {
    return (
      <Card className="grid h-full min-h-[280px] place-items-center border-primary/30 p-6 text-center">
        <div className="space-y-2">
          <Trophy className="mx-auto h-8 w-8 text-primary/60" />
          <p className="text-sm font-semibold text-secondary-foreground">
            No hay partidos disponibles para {categoryLabel(selectedCategory)}.
          </p>
          <p className="text-xs text-muted-foreground">
            Los resultados aparecerán aquí cuando comience la jornada.
          </p>
        </div>
      </Card>
    );
  }

  const home = teams.find((t) => t.id === featured.home_team_id);
  const away = teams.find((t) => t.id === featured.away_team_id);
  const mvpPlayer = featured.mvp_player_id
    ? players.find((p) => p.id === featured.mvp_player_id)
    : null;
  const mvpTeam = mvpPlayer
    ? teams.find((t) => t.id === mvpPlayer.team_id)
    : null;

  const homeTeam = home || {
    id: "tbd_home",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
    logo_color: "#334155",
    coach: "",
  };
  const awayTeam = away || {
    id: "tbd_away",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
    logo_color: "#334155",
    coach: "",
  };

  const finished = featured.status === "finished";

  return (
    <Card className="relative overflow-hidden border-primary/30 bg-card p-6 lg:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Badge variant={finished ? "secondary" : "outline"}>
          {finished ? "Final" : "Próximo partido"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          Fecha {featured.matchday} · {fmtDate(featured.datetime)} ·{" "}
          {fmtTime(featured.datetime)}
        </span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
          <TeamLogo team={homeTeam} size={72} />
          <div className="min-w-0">
            <div className="truncate text-lg font-black uppercase">
              {homeTeam.short_name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {homeTeam.name}
            </div>
          </div>
        </div>

        <div className="shrink-0 text-center">
          {finished ? (
            <div className="text-score text-5xl sm:text-6xl md:text-7xl">
              <span
                className={
                  featured.score.home_points > featured.score.away_points
                    ? "text-primary"
                    : ""
                }
              >
                {featured.score.home_points}
              </span>
              <span className="mx-1 text-muted-foreground">–</span>
              <span
                className={
                  featured.score.away_points > featured.score.home_points
                    ? "text-primary"
                    : ""
                }
              >
                {featured.score.away_points}
              </span>
            </div>
          ) : (
            <div className="font-display text-5xl font-black text-muted-foreground">
              VS
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-3 text-center">
          <TeamLogo team={awayTeam} size={72} />
          <div className="min-w-0">
            <div className="truncate text-lg font-black uppercase">
              {awayTeam.short_name}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {awayTeam.name}
            </div>
          </div>
        </div>
      </div>

      {finished && featured.score.quarters && featured.score.quarters.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-1.5">
          {featured.score.quarters.map((q) => (
            <span
              key={q.quarter}
              className="rounded-md border border-border bg-muted px-2 py-1 text-[11px] font-bold tabular-nums"
            >
              <span className="mr-1 text-primary">
                {q.quarter > 4 ? `TE${q.quarter - 4}` : `Q${q.quarter}`}
              </span>
              {q.home}–{q.away}
            </span>
          ))}
        </div>
      )}

      {finished && mvpPlayer && mvpTeam && (
        <div className="mt-4 flex justify-center border-t border-border/40 pt-4">
          <div className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-primary shadow-sm">
            <Star className="h-3.5 w-3.5 fill-primary" />
            MVP: {mvpPlayer.name} · {mvpTeam.short_name || mvpTeam.name}
          </div>
        </div>
      )}
    </Card>
  );
}

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
        .slice(0, 3),
    [catMatches],
  );

  return (
    <AppShell>
      <div className="space-y-12">
        {/* HERO — 2 columnas en desktop */}
        <section className="overflow-hidden rounded-2xl border border-primary/30 bg-secondary text-secondary-foreground shadow-lg">
          <div className="grid grid-cols-1 items-center gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-2">
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-6 -top-6 h-40 w-40 opacity-30 sm:-left-10 sm:-top-10"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.78 0.16 62 / 0.45) 0, transparent 70%)",
                }}
              />
              <div className="relative mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary font-display text-2xl font-black text-primary-foreground shadow-[var(--shadow-court)]">
                  L
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                    Liga Formativa de Básquetbol
                  </div>
                  <div className="truncate text-xs text-secondary-foreground/70">
                    Torneo Clausura 2026 · {categoryLabel(selectedCategory)}
                  </div>
                </div>
              </div>

              <h1 className="text-6xl font-black uppercase leading-none tracking-tight md:text-8xl">
                LIFO<span className="text-primary">BA</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base text-secondary-foreground/80 sm:text-lg">
                Liga Formativa de Básquetbol Clausura 2026. Competición enfocada
                en el desarrollo integral de los jugadores con categorías{" "}
                <strong>Sub 13, Sub 15 y Sub 18 Varones</strong>. Presentado por{" "}
                <strong>Clínica Dental Obident</strong>.
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

            <FeaturedScoreboard />
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

        {/* DASHBOARD — Posiciones + Últimos Partidos/Premios */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
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
            <StandingsTable rows={standings} teams={teams} />
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-black uppercase tracking-tight">
                Últimos partidos
              </h2>
              <div className="space-y-3">
                {recentMatches.length > 0 ? (
                  recentMatches.map((m) => <MatchCard key={m.id} match={m} />)
                ) : (
                  <Card className="p-5 text-sm text-muted-foreground">
                    Aún no hay resultados registrados en{" "}
                    {categoryLabel(selectedCategory)}.
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-black uppercase tracking-tight">
                Premios y reconocimientos
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
      </div>
    </AppShell>
  );
}
