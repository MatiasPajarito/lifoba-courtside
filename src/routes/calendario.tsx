import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navigation, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MatchCard } from "@/components/match-card";
import { ShareSchedule } from "@/components/share-schedule";
import { directionsUrl } from "@/lib/geo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { categoryLabel, matchCategory, teamCategory } from "@/lib/category";
import type { Match, Venue } from "@/lib/types";

export const Route = createFileRoute("/calendario")({
  component: Calendario,
  head: () => ({
    meta: [
      { title: "Calendario y Sedes · LIFOBA" },
      {
        name: "description",
        content: "Filtra el calendario por club, revisa sedes y obtén indicaciones GPS.",
      },
      { property: "og:title", content: "Calendario y Sedes · LIFOBA" },
      {
        property: "og:description",
        content:
          "Fechas, horarios y recintos de LIFOBA en Melipilla, San Antonio y Curacaví.",
      },
    ],
  }),
});

/** Clave estable para agrupar partidos de una misma jornada (fase + número de fecha). */
function matchdayKey(m: Match) {
  return `${m.phase}:${m.matchday}`;
}

function Calendario() {
  const { matches: allMatches, teams: allTeams, venues, selectedCategory } = useStore();
  const [teamId, setTeamId] = useState<string>("all");
  const [fechaKey, setFechaKey] = useState<string>("all");

  const teams = useMemo(
    () => allTeams.filter((t) => teamCategory(t) === selectedCategory),
    [allTeams, selectedCategory],
  );
  const matches = useMemo(
    () => allMatches.filter((m) => matchCategory(m, allTeams) === selectedCategory),
    [allMatches, allTeams, selectedCategory],
  );

  // Opciones de fecha calculadas sobre TODOS los partidos (no sobre el filtro de equipo),
  // para que el filtro de fecha no cambie de opciones al elegir un club.
  const fechaOptions = useMemo(() => {
    const map = new Map<
      string,
      { key: string; matchday: number; phase: Match["phase"]; firstDate: string }
    >();
    for (const m of matches) {
      const key = matchdayKey(m);
      const existing = map.get(key);
      if (!existing || m.datetime < existing.firstDate) {
        map.set(key, { key, matchday: m.matchday, phase: m.phase, firstDate: m.datetime });
      }
    }
    return Array.from(map.values()).sort((a, b) => (a.firstDate > b.firstDate ? 1 : -1));
  }, [matches]);

  const filtered = useMemo(() => {
    let list = matches;
    if (teamId !== "all") {
      list = list.filter((m) => m.home_team_id === teamId || m.away_team_id === teamId);
    }
    if (fechaKey !== "all") {
      list = list.filter((m) => matchdayKey(m) === fechaKey);
    }
    return [...list].sort((a, b) => (a.datetime > b.datetime ? 1 : -1));
  }, [matches, teamId, fechaKey]);

  // Agrupa el listado filtrado por fecha, en orden cronológico.
  const groups = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of filtered) {
      const key = matchdayKey(m);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries())
      .map(([key, list]) => ({
        key,
        matchday: list[0].matchday,
        phase: list[0].phase,
        matches: list.sort((a, b) => (a.datetime > b.datetime ? 1 : -1)),
      }))
      .sort((a, b) => (a.matches[0].datetime > b.matches[0].datetime ? 1 : -1));
  }, [filtered]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            Calendario y sedes
          </h1>
          <p className="text-xs text-muted-foreground">
            {categoryLabel(selectedCategory)} · Filtra por club o por fecha para ver solo
            lo que te interesa.
          </p>
        </div>

        <div className="grid gap-3 rounded-lg border bg-card p-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ver mi equipo
            </label>
            <Select value={teamId} onValueChange={setTeamId}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Ver fecha
            </label>
            <Select value={fechaKey} onValueChange={setFechaKey}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                {fechaOptions.map((f) => (
                  <SelectItem key={f.key} value={f.key}>
                    Fecha {f.matchday}
                    {f.phase === "playoffs" ? " · Playoffs" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wide">Programación</h2>

          {groups.length === 0 && (
            <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
              No hay partidos para este filtro.
            </div>
          )}
          {groups.map((g) => (
            <FechaGroup
              key={g.key}
              matchday={g.matchday}
              isPlayoffs={g.phase === "playoffs"}
              matches={g.matches}
              venues={venues}
            />
          ))}
        </section>
      </div>
    </AppShell>
  );
}

function FechaGroup({
  matchday,
  isPlayoffs,
  matches,
  venues,
}: {
  matchday: number;
  isPlayoffs: boolean;
  matches: Match[];
  venues: Venue[];
}) {
  const venueGroups = useMemo(() => {
    const ids: string[] = [];
    for (const m of matches) {
      if (!ids.includes(m.venue_id)) ids.push(m.venue_id);
    }
    return ids.map((id) => ({
      id,
      venue: venues.find((v) => v.id === id),
      venueMatches: matches.filter((m) => m.venue_id === id),
    }));
  }, [matches, venues]);

  return (
    <div className="space-y-3">
      {/* Contenedor reorganizado para mobile y desktop */}
      <div className="flex flex-col gap-3 border-b-2 border-primary/40 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-black uppercase tracking-tight sm:text-xl">
          Fecha {matchday}
          {isPlayoffs && <span className="ml-2 text-sm font-bold text-primary">Playoffs</span>}
        </h3>

        {/* Bloque Derecho: Botón de compartir adaptado a 100% de ancho en móviles */}
        <div className="w-full sm:w-auto [&_button]:w-full">
          <ShareSchedule matchday={matchday} matches={matches} />
        </div>
      </div>

      {/* Partidos sub-agrupados por recinto; 2 columnas solo en desktop */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
      {venueGroups.map((g) => (
        <div key={g.id} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-sm font-bold uppercase tracking-wide">
              {g.venue?.name ?? "Recinto por definir"}
            </span>
            {g.venue?.address && (
              <span className="min-w-0 truncate text-xs text-muted-foreground">
                · {g.venue.address}
              </span>
            )}
            {g.venue && (
              <a
                href={directionsUrl(g.venue)}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                <Navigation className="h-3 w-3" /> Cómo llegar
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {g.venueMatches.map((m) => (
              <MatchCard key={m.id} match={m} hideVenue />
            ))}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}