import { useMemo } from "react";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import { getPlaceholderTeam, matchCategory } from "@/lib/category";
import { cn } from "@/lib/utils";
import type { Match, StandingRow, Team, Venue } from "@/lib/types";

interface BracketNodeProps {
  badge: string;
  badgeClass: string;
  title: string;
  subtitle?: string;
  match?: Match;
  team1?: Team;
  team2?: Team;
  score1?: number;
  score2?: number;
  isFinal?: boolean;
  isThirdPlace?: boolean;
  dateStr?: string;
  venueName?: string;
}

function formatBracketDateTime(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const datePart = d.toLocaleDateString("es-CL", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const timePart = d.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} · ${timePart} hrs`;
}

function hasRecordedScore(match?: Match): boolean {
  if (!match) return false;
  if (match.status === "finished" || match.status === "live") return true;
  const hp = match.score?.home_points ?? 0;
  const ap = match.score?.away_points ?? 0;
  return hp > 0 || ap > 0;
}

function getMatchWinnerAndLoser(
  match: Match | undefined,
  teams: Team[],
): { winner?: Team; loser?: Team } {
  if (!match || !hasRecordedScore(match)) return {};
  const hp = match.score?.home_points ?? 0;
  const ap = match.score?.away_points ?? 0;
  if (hp === ap) return {};
  const home = teams.find((t) => t.id === match.home_team_id);
  const away = teams.find((t) => t.id === match.away_team_id);
  return hp > ap
    ? { winner: home, loser: away }
    : { winner: away, loser: home };
}

function BracketMatchNode({
  badge,
  badgeClass,
  title,
  subtitle,
  match,
  team1,
  team2,
  score1,
  score2,
  isFinal = false,
  isThirdPlace = false,
  dateStr,
  venueName,
}: BracketNodeProps) {
  const { selectedCategory } = useStore();
  const finished = match?.status === "finished";
  const isLive = match?.status === "live";
  const hasScores = score1 !== undefined && score2 !== undefined;
  const team1Won = hasScores && score1 > score2;
  const team2Won = hasScores && score2 > score1;

  const effectivePhase =
    match?.phase ??
    (isFinal ? "final" : isThirdPlace ? "tercer_puesto" : "semifinal");
  const effectiveCategory = match?.category ?? selectedCategory;

  const displayTeam1 =
    team1 || getPlaceholderTeam(effectivePhase, effectiveCategory, "home");
  const displayTeam2 =
    team2 || getPlaceholderTeam(effectivePhase, effectiveCategory, "away");

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-2 flex flex-col items-center text-center">
        <span
          className={cn(
            "mb-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-widest",
            badgeClass,
          )}
        >
          {badge}
        </span>
        <span
          className={cn(
            "block text-xs font-black uppercase tracking-wider sm:text-sm",
            isFinal
              ? "text-amber-600 dark:text-yellow-300"
              : "text-foreground",
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-[11px] font-medium text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>

      <Card
        className={cn(
          "w-full overflow-hidden border transition-all",
          isFinal
            ? "border-yellow-500/70 bg-gradient-to-b from-card via-card to-yellow-500/10 shadow-[0_0_24px_rgba(234,179,8,0.18)] md:scale-[1.03] dark:border-yellow-400/60"
            : isThirdPlace
              ? "border-amber-500/45 bg-card/95 shadow-sm dark:border-amber-400/40"
              : "border-rose-500/35 bg-card/95 shadow-sm dark:border-rose-400/35",
        )}
      >
        {/* Cabecera de estado del encuentro */}
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>
            {match ? `Fecha ${match.matchday}` : "Fase Eliminatoria"}
          </span>
          {finished ? (
            <span className="rounded bg-secondary px-1.5 py-0.5 font-black text-foreground">
              Finalizado
            </span>
          ) : isLive ? (
            <span className="inline-flex items-center gap-1 rounded bg-destructive/20 px-1.5 py-0.5 font-black text-destructive">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              En Vivo
            </span>
          ) : (
            <span className="text-muted-foreground">
              {match ? "Programado" : "Por definir"}
            </span>
          )}
        </div>

        <div className="divide-y divide-border/50">
          {/* Equipo 1 (Local) */}
          <div
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2.5 transition-colors",
              team1Won && "bg-primary/10",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <TeamLogo
                team={displayTeam1}
                size={28}
                className={!team1 ? "opacity-75 grayscale" : undefined}
              />
              <span
                className={cn(
                  "truncate text-xs sm:text-sm",
                  !team1
                    ? "italic font-semibold text-muted-foreground"
                    : team1Won
                      ? "font-black text-foreground"
                      : "font-bold text-foreground/90",
                )}
              >
                {displayTeam1.name}
              </span>
            </div>
            <span
              className={cn(
                "ml-2 shrink-0 font-mono text-sm font-black tabular-nums sm:text-base",
                team1Won
                  ? "text-primary"
                  : hasScores
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60",
              )}
            >
              {score1 !== undefined ? score1 : "-"}
            </span>
          </div>

          {/* Equipo 2 (Visita) */}
          <div
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2.5 transition-colors",
              team2Won && "bg-primary/10",
            )}
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <TeamLogo
                team={displayTeam2}
                size={28}
                className={!team2 ? "opacity-75 grayscale" : undefined}
              />
              <span
                className={cn(
                  "truncate text-xs sm:text-sm",
                  !team2
                    ? "italic font-semibold text-muted-foreground"
                    : team2Won
                      ? "font-black text-foreground"
                      : "font-bold text-foreground/90",
                )}
              >
                {displayTeam2.name}
              </span>
            </div>
            <span
              className={cn(
                "ml-2 shrink-0 font-mono text-sm font-black tabular-nums sm:text-base",
                team2Won
                  ? "text-primary"
                  : hasScores
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60",
              )}
            >
              {score2 !== undefined ? score2 : "-"}
            </span>
          </div>
        </div>
      </Card>

      {/* Pie con horario real de Supabase y recinto */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-1 capitalize">
          <CalendarDays className="h-3 w-3 shrink-0 text-primary" />
          {dateStr || "Horario por confirmar"}
        </span>
        {venueName && (
          <span className="inline-flex items-center gap-1 text-muted-foreground/90">
            <MapPin className="h-3 w-3 shrink-0 text-primary" />
            {venueName}
          </span>
        )}
      </div>
    </div>
  );
}

export function PlayoffBracket({ standings }: { standings?: StandingRow[] }) {
  const { matches, teams, venues, selectedCategory } = useStore();

  // Partidos de la categoría activa
  const categoryMatches = useMemo(
    () => matches.filter((m) => matchCategory(m, teams) === selectedCategory),
    [matches, teams, selectedCategory],
  );

  // Respaldo del Top 4 de la fase regular por si alguna llave aún no tiene equipos asignados
  const sortedTeams = useMemo(() => {
    if (standings && standings.length >= 4) {
      return standings
        .map((row) => teams.find((t) => t.id === (row.team_id || (row as any).id)))
        .filter(Boolean) as Team[];
    }
    return [];
  }, [standings, teams]);

  // Semifinales reales desde Supabase (phase === 'semifinal')
  const semifinalMatches = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.phase === "semifinal")
        .sort((a, b) =>
          (a.datetime ?? "") !== (b.datetime ?? "")
            ? (a.datetime ?? "") > (b.datetime ?? "")
              ? 1
              : -1
            : a.id.localeCompare(b.id),
        ),
    [categoryMatches],
  );

  const semiAMatch = semifinalMatches[0];
  const semiBMatch = semifinalMatches[1];

  // Partido por el 3° Lugar desde Supabase (phase === 'tercer_puesto')
  const thirdPlaceMatch = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.phase === "tercer_puesto")
        .sort((a, b) => ((a.datetime ?? "") > (b.datetime ?? "") ? 1 : -1))[0],
    [categoryMatches],
  );

  // Gran Final desde Supabase (phase === 'final')
  const finalMatch = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.phase === "final")
        .sort((a, b) => ((a.datetime ?? "") > (b.datetime ?? "") ? 1 : -1))[0],
    [categoryMatches],
  );

  // Equipos de Semifinal A
  const semiATeam1 = semiAMatch
    ? teams.find((t) => t.id === semiAMatch.home_team_id)
    : sortedTeams[0];
  const semiATeam2 = semiAMatch
    ? teams.find((t) => t.id === semiAMatch.away_team_id)
    : sortedTeams[3];

  // Equipos de Semifinal B
  const semiBTeam1 = semiBMatch
    ? teams.find((t) => t.id === semiBMatch.home_team_id)
    : sortedTeams[1];
  const semiBTeam2 = semiBMatch
    ? teams.find((t) => t.id === semiBMatch.away_team_id)
    : sortedTeams[2];

  // Ganadores y perdedores de semifinales (para autocompletar Final / 3° Lugar si aún no tienen ID en BD)
  const semiAOutcome = getMatchWinnerAndLoser(semiAMatch, teams);
  const semiBOutcome = getMatchWinnerAndLoser(semiBMatch, teams);

  // Equipos de Gran Final
  const finalTeam1 =
    (finalMatch && teams.find((t) => t.id === finalMatch.home_team_id)) ||
    semiAOutcome.winner;
  const finalTeam2 =
    (finalMatch && teams.find((t) => t.id === finalMatch.away_team_id)) ||
    semiBOutcome.winner;

  // Equipos de Disputa 3° Lugar
  const thirdTeam1 =
    (thirdPlaceMatch &&
      teams.find((t) => t.id === thirdPlaceMatch.home_team_id)) ||
    semiAOutcome.loser;
  const thirdTeam2 =
    (thirdPlaceMatch &&
      teams.find((t) => t.id === thirdPlaceMatch.away_team_id)) ||
    semiBOutcome.loser;

  const findVenueName = (vId?: string | null, allVenues: Venue[] = venues) =>
    vId ? allVenues.find((v) => v.id === vId)?.name : undefined;

  return (
    <div className="w-full space-y-6 py-4">
      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-primary">
          <Trophy className="h-3.5 w-3.5" />
          Fase Final Oficial
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
          Cuadro de <span className="text-primary">Playoffs</span>
        </h2>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground sm:text-sm">
          CUADRO OFICIAL DE PLAYOFFS - Llave eliminatoria por el título del Clausura 2026
        </p>
      </div>

      {/* Rejilla Simétrica del Cuadro Eliminatorio */}
      <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-6 px-2 pt-2 md:grid-cols-3">
        {/* Columna Izquierda: Semifinal A */}
        <div className="relative space-y-4">
          <BracketMatchNode
            badge="🔥 SEMIFINAL"
            badgeClass="border border-rose-500/45 bg-rose-500/15 text-rose-700 dark:border-rose-400/45 dark:bg-rose-500/20 dark:text-rose-200"
            title="Semifinal A"
            subtitle="Llave Eliminatoria 1"
            match={semiAMatch}
            team1={semiATeam1}
            team2={semiATeam2}
            score1={
              hasRecordedScore(semiAMatch)
                ? semiAMatch?.score?.home_points
                : undefined
            }
            score2={
              hasRecordedScore(semiAMatch)
                ? semiAMatch?.score?.away_points
                : undefined
            }
            dateStr={formatBracketDateTime(semiAMatch?.datetime)}
            venueName={findVenueName(semiAMatch?.venue_id)}
          />
        </div>

        {/* Columna Central: GRAN FINAL y 3° LUGAR */}
        <div className="z-10 order-first my-2 space-y-8 md:order-none md:my-0">
          <BracketMatchNode
            badge="🏆 GRAN FINAL"
            badgeClass="border border-yellow-500/65 bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 text-amber-900 shadow-[0_0_12px_rgba(234,179,8,0.25)] dark:border-yellow-400/60 dark:text-yellow-200"
            title="👑 GRAN FINAL COPA MAMBA"
            subtitle="Definición por el Campeonato Clausura 2026"
            match={finalMatch}
            team1={finalTeam1}
            team2={finalTeam2}
            score1={
              hasRecordedScore(finalMatch)
                ? finalMatch?.score?.home_points
                : undefined
            }
            score2={
              hasRecordedScore(finalMatch)
                ? finalMatch?.score?.away_points
                : undefined
            }
            isFinal={true}
            dateStr={formatBracketDateTime(finalMatch?.datetime)}
            venueName={findVenueName(finalMatch?.venue_id)}
          />

          <div className="pt-2">
            <BracketMatchNode
              badge="🥉 3º LUGAR"
              badgeClass="border border-amber-600/45 bg-amber-500/15 text-amber-800 dark:border-amber-400/45 dark:bg-amber-500/20 dark:text-amber-200"
              title="Disputa 3° Lugar"
              subtitle="Definición por el Podio Oficial"
              match={thirdPlaceMatch}
              team1={thirdTeam1}
              team2={thirdTeam2}
              score1={
                hasRecordedScore(thirdPlaceMatch)
                  ? thirdPlaceMatch?.score?.home_points
                  : undefined
              }
              score2={
                hasRecordedScore(thirdPlaceMatch)
                  ? thirdPlaceMatch?.score?.away_points
                  : undefined
              }
              isThirdPlace={true}
              dateStr={formatBracketDateTime(thirdPlaceMatch?.datetime)}
              venueName={findVenueName(thirdPlaceMatch?.venue_id)}
            />
          </div>
        </div>

        {/* Columna Derecha: Semifinal B */}
        <div className="relative space-y-4">
          <BracketMatchNode
            badge="🔥 SEMIFINAL"
            badgeClass="border border-rose-500/45 bg-rose-500/15 text-rose-700 dark:border-rose-400/45 dark:bg-rose-500/20 dark:text-rose-200"
            title="Semifinal B"
            subtitle="Llave Eliminatoria 2"
            match={semiBMatch}
            team1={semiBTeam1}
            team2={semiBTeam2}
            score1={
              hasRecordedScore(semiBMatch)
                ? semiBMatch?.score?.home_points
                : undefined
            }
            score2={
              hasRecordedScore(semiBMatch)
                ? semiBMatch?.score?.away_points
                : undefined
            }
            dateStr={formatBracketDateTime(semiBMatch?.datetime)}
            venueName={findVenueName(semiBMatch?.venue_id)}
          />
        </div>
      </div>
    </div>
  );
}
