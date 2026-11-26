import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarDays,
  Clock,
  Crown,
  MapPin,
  Medal,
  Star,
  Trophy,
} from "lucide-react";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import {
  categoryLabel,
  getPlaceholderTeam,
  matchCategory,
} from "@/lib/category";
import { cn } from "@/lib/utils";
import type { Match, Team } from "@/lib/types";

interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isPast: boolean;
}

function computeCountdown(targetIso: string, nowMs: number): CountdownParts {
  const targetMs = new Date(targetIso).getTime();
  if (Number.isNaN(targetMs)) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      isPast: true,
    };
  }

  const diff = targetMs - nowMs;
  if (diff <= 0) {
    return {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      isPast: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    isPast: false,
  };
}

function formatFullDate(iso?: string | null): string {
  if (!iso) return "Fecha por confirmar";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Fecha por confirmar";
  return d.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatShortTime(iso?: string | null): string {
  if (!iso) return "Horario por confirmar";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Horario por confirmar";
  const formatted = d.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  });
  return `${formatted} HRS`;
}

export function FinalsSpotlight() {
  const { matches, teams, venues, players, selectedCategory } = useStore();
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const categoryMatches = useMemo(
    () => matches.filter((m) => matchCategory(m, teams) === selectedCategory),
    [matches, teams, selectedCategory],
  );

  const finalMatch: Match | undefined = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.phase === "final")
        .sort((a, b) => ((a.datetime ?? "") > (b.datetime ?? "") ? 1 : -1))[0],
    [categoryMatches],
  );

  const thirdPlaceMatch: Match | undefined = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.phase === "tercer_puesto")
        .sort((a, b) => ((a.datetime ?? "") > (b.datetime ?? "") ? 1 : -1))[0],
    [categoryMatches],
  );

  const isFinished = finalMatch?.status === "finished";

  useEffect(() => {
    if (!finalMatch || isFinished) return;
    setNowMs(Date.now());
    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [finalMatch, isFinished]);

  // Si en alguna categoría no existe ningún partido con phase === 'final', no renderizar nada
  if (!finalMatch) {
    return null;
  }

  const catName = categoryLabel(selectedCategory);

  const resolveTeam = (
    teamId: string | null | undefined,
    phase: Match["phase"],
    side: "home" | "away",
  ): { team: Team; isPlaceholder: boolean } => {
    const found = teamId ? teams.find((t) => t.id === teamId) : undefined;
    if (found) {
      return { team: found, isPlaceholder: false };
    }
    return {
      team: getPlaceholderTeam(phase, selectedCategory, side),
      isPlaceholder: true,
    };
  };

  const finalHome = resolveTeam(finalMatch.home_team_id, "final", "home");
  const finalAway = resolveTeam(finalMatch.away_team_id, "final", "away");
  const finalVenue = finalMatch.venue_id
    ? venues.find((v) => v.id === finalMatch.venue_id)
    : undefined;

  const thirdHome = thirdPlaceMatch
    ? resolveTeam(thirdPlaceMatch.home_team_id, "tercer_puesto", "home")
    : null;
  const thirdAway = thirdPlaceMatch
    ? resolveTeam(thirdPlaceMatch.away_team_id, "tercer_puesto", "away")
    : null;
  const thirdVenue = thirdPlaceMatch?.venue_id
    ? venues.find((v) => v.id === thirdPlaceMatch.venue_id)
    : undefined;

  // ============================================================================
  // ESTADO B — CAMPEÓN DEFINIDO (status === 'finished')
  // ============================================================================
  if (isFinished) {
    const homePts = finalMatch.score?.home_points ?? 0;
    const awayPts = finalMatch.score?.away_points ?? 0;
    const homeIsChampion = homePts >= awayPts;

    const champion = homeIsChampion ? finalHome.team : finalAway.team;
    const runnerUp = homeIsChampion ? finalAway.team : finalHome.team;
    const championPts = homeIsChampion ? homePts : awayPts;
    const runnerUpPts = homeIsChampion ? awayPts : homePts;

    // Determinar 3° y 4° lugar si el partido por el tercer puesto ya terminó
    let thirdPlaceWinner: Team | null = null;
    let fourthPlaceTeam: Team | null = null;
    let thirdPlaceScoreStr: string | null = null;
    if (
      thirdPlaceMatch &&
      thirdPlaceMatch.status === "finished" &&
      thirdHome &&
      thirdAway
    ) {
      const thPts = thirdPlaceMatch.score?.home_points ?? 0;
      const taPts = thirdPlaceMatch.score?.away_points ?? 0;
      if (thPts !== taPts) {
        const homeWonThird = thPts > taPts;
        thirdPlaceWinner = homeWonThird ? thirdHome.team : thirdAway.team;
        fourthPlaceTeam = homeWonThird ? thirdAway.team : thirdHome.team;
        thirdPlaceScoreStr = homeWonThird
          ? `${thPts} : ${taPts}`
          : `${taPts} : ${thPts}`;
      }
    }

    const finalMvp = finalMatch.mvp_player_id
      ? players.find((p) => p.id === finalMatch.mvp_player_id)
      : undefined;

    return (
      <section
        aria-label={`Campeón Oficial ${catName}`}
        className="relative isolate overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-50 via-white to-amber-100/60 px-5 py-8 shadow-[0_18px_50px_-15px_rgba(245,158,11,0.22)] dark:border-amber-400/35 dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_80%_65%_at_50%_-15%,rgba(245,158,11,0.24),transparent_65%),radial-gradient(ellipse_60%_50%_at_85%_105%,rgba(56,189,248,0.12),transparent_65%),linear-gradient(160deg,#121626_0%,#090c15_100%)] sm:px-10 sm:py-12 lg:px-14"
      >
        {/* Destello decorativo superior */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent"
        />

        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/15 px-4 py-1.5 font-display text-xs font-black uppercase tracking-[0.18em] text-amber-800 shadow-sm dark:border-amber-400/50 dark:bg-amber-400/15 dark:text-amber-200">
            <Crown className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300" />
            <span>👑 CAMPEÓN CLAUSURA 2026 · {catName}</span>
          </span>

          {/* Escudo y Nombre del Club Campeón */}
          <div className="mt-7 flex flex-col items-center">
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-4 rounded-full bg-amber-400/25 blur-2xl dark:bg-amber-400/20"
              />
              <div className="relative rounded-full bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 p-1 shadow-[0_0_32px_rgba(245,158,11,0.35)]">
                <TeamLogo
                  team={champion}
                  size={104}
                  className="bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <h2 className="font-editorial-title mt-5 text-3xl text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {champion.name}
            </h2>
            {champion.city && (
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300/90 sm:text-sm">
                {champion.city} · Monarca Oficial {catName}
              </p>
            )}
          </div>

          {/* Marcador Final contra Subcampeón */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-amber-500/30 bg-white/85 px-5 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.05] sm:gap-4 sm:px-7">
            <div className="flex items-center gap-2">
              <TeamLogo team={champion} size={28} />
              <span className="font-display text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white sm:text-sm">
                {champion.short_name || champion.name}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-amber-500/15 px-3.5 py-1 font-editorial-title text-2xl tabular-nums text-amber-800 dark:bg-amber-400/20 dark:text-amber-200 sm:text-3xl">
              <span>{championPts}</span>
              <span className="text-base opacity-60">:</span>
              <span className="text-slate-600 dark:text-slate-300">
                {runnerUpPts}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-display text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 sm:text-sm">
                {runnerUp.short_name || runnerUp.name}
              </span>
              <TeamLogo team={runnerUp} size={28} />
            </div>
          </div>

          {finalMvp && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>
                MVP Gran Final:{" "}
                <span className="text-primary">{finalMvp.name}</span>
              </span>
            </div>
          )}

          {/* Podio Oficial Completo (1°, 2°, 3° y reconocimiento a los 4 semifinalistas) */}
          <div
            className={cn(
              "mt-8 grid w-full max-w-5xl grid-cols-1 gap-4 text-left",
              thirdPlaceMatch ? "md:grid-cols-3" : "sm:grid-cols-2",
            )}
          >
            {/* 1° Lugar */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-amber-500/45 bg-amber-500/10 p-4 dark:border-amber-400/40 dark:bg-amber-400/10">
              <TeamLogo
                team={champion}
                size={48}
                className="ring-2 ring-amber-500/40"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  <Trophy className="h-3.5 w-3.5 shrink-0" />
                  <span>🥇 1º Lugar · Campeón</span>
                </div>
                <div className="truncate font-display text-sm font-black uppercase text-slate-900 dark:text-white sm:text-base">
                  {champion.name}
                </div>
                <div className="mt-0.5 truncate text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  Final: {championPts} : {runnerUpPts} vs{" "}
                  {runnerUp.short_name || runnerUp.name}
                </div>
              </div>
            </div>

            {/* 2° Lugar */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-300/80 bg-white/85 p-4 dark:border-slate-700/80 dark:bg-slate-900/75">
              <TeamLogo
                team={runnerUp}
                size={48}
                className="ring-2 ring-slate-400/35"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <Medal className="h-3.5 w-3.5 shrink-0" />
                  <span>🥈 2º Lugar · Subcampeón</span>
                </div>
                <div className="truncate font-display text-sm font-black uppercase text-slate-900 dark:text-white sm:text-base">
                  {runnerUp.name}
                </div>
                {runnerUp.city && (
                  <div className="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {runnerUp.city}
                  </div>
                )}
              </div>
            </div>

            {/* 3° Lugar (y reconocimiento al 4° semifinalista) */}
            {thirdPlaceWinner ? (
              <div className="flex items-center gap-3.5 rounded-2xl border border-amber-700/35 bg-amber-600/10 p-4 dark:border-orange-500/30 dark:bg-slate-900/75">
                <TeamLogo
                  team={thirdPlaceWinner}
                  size={48}
                  className="ring-2 ring-amber-600/40 dark:ring-orange-400/35"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-orange-300">
                    <Medal className="h-3.5 w-3.5 shrink-0" />
                    <span>🥉 3º Lugar · Podio</span>
                  </div>
                  <div className="truncate font-display text-sm font-black uppercase text-slate-900 dark:text-white sm:text-base">
                    {thirdPlaceWinner.name}
                  </div>
                  {fourthPlaceTeam && thirdPlaceScoreStr && (
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span className="tabular-nums font-bold text-amber-800 dark:text-orange-300">
                        {thirdPlaceScoreStr}
                      </span>
                      <span>vs</span>
                      <TeamLogo team={fourthPlaceTeam} size={16} />
                      <span className="truncate">
                        {fourthPlaceTeam.short_name || fourthPlaceTeam.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : thirdPlaceMatch && thirdHome && thirdAway ? (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-amber-700/35 bg-amber-600/10 p-4 dark:border-orange-500/25 dark:bg-slate-900/75">
                <div className="min-w-0">
                  <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-orange-300">
                    🥉 Disputa 3º Lugar · {formatShortTime(thirdPlaceMatch.datetime)}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <TeamLogo team={thirdHome.team} size={28} />
                    <span className="truncate font-display text-xs font-black uppercase text-slate-900 dark:text-white">
                      {thirdHome.team.short_name || thirdHome.team.name}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-orange-300">
                      VS
                    </span>
                    <TeamLogo team={thirdAway.team} size={28} />
                    <span className="truncate font-display text-xs font-black uppercase text-slate-900 dark:text-white">
                      {thirdAway.team.short_name || thirdAway.team.name}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-8">
            <Link
              to="/posiciones"
              search={{ tab: "playoffs" } as any}
              className="press-scale inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 font-display text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm transition-colors hover:bg-amber-400 sm:text-sm"
            >
              <Trophy className="h-4 w-4 shrink-0" />
              <span>Ir al Cuadro de Playoffs</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================================
  // ESTADO A — PREVIA DE LA GRAN FINAL (status !== 'finished')
  // ============================================================================
  const countdown = computeCountdown(finalMatch.datetime, nowMs);
  const isLive = finalMatch.status === "live";

  const thirdIsFinished = thirdPlaceMatch?.status === "finished";
  const thirdIsLive = thirdPlaceMatch?.status === "live";
  const thirdHomePts = thirdPlaceMatch?.score?.home_points ?? 0;
  const thirdAwayPts = thirdPlaceMatch?.score?.away_points ?? 0;
  const thirdHomeWon = thirdIsFinished && thirdHomePts > thirdAwayPts;
  const thirdAwayWon = thirdIsFinished && thirdAwayPts > thirdHomePts;

  return (
    <section
      aria-label={`Gran Final ${catName}`}
      className="relative isolate overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50/85 via-white to-sky-50/75 px-5 py-8 shadow-[0_18px_50px_-15px_rgba(245,158,11,0.16)] dark:border-amber-500/30 dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_75%_60%_at_50%_-10%,rgba(245,158,11,0.18),transparent_65%),radial-gradient(ellipse_65%_55%_at_85%_105%,rgba(56,189,248,0.14),transparent_65%),linear-gradient(160deg,#101729_0%,#090d18_100%)] sm:px-10 sm:py-11 lg:px-14"
    >
      {/* Línea superior dorada brillante */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/75 to-transparent"
      />

      {/* ENCABEZADO CENTRADO DE LA GRAN FINAL */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-500/45 bg-amber-500/15 px-4 py-1 font-display text-[11px] font-black uppercase tracking-[0.18em] text-amber-800 shadow-sm dark:border-amber-400/45 dark:bg-amber-400/15 dark:text-amber-200 sm:text-xs">
          <span>🏆 GRAN FINAL · {catName}</span>
          {isLive && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              EN VIVO
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 sm:text-sm">
          <span className="inline-flex items-center gap-1.5 capitalize">
            <CalendarDays className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            {formatFullDate(finalMatch.datetime)}
          </span>
          <span className="inline-flex items-center gap-1.5 tabular-nums">
            <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            {formatShortTime(finalMatch.datetime)}
          </span>
          {finalVenue && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              {finalVenue.name}
              {finalVenue.city ? ` · ${finalVenue.city}` : ""}
            </span>
          )}
        </div>

        {/* CUENTA REGRESIVA EN TIEMPO REAL */}
        {!countdown.isPast ? (
          <div
            role="timer"
            aria-live="off"
            aria-label="Cuenta regresiva para la Gran Final"
            className="mt-6 grid grid-cols-4 gap-2 sm:gap-3.5"
          >
            {[
              { value: countdown.days, label: "Días" },
              { value: countdown.hours, label: "Horas" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Seg" },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex min-w-[64px] flex-col items-center justify-center rounded-2xl border border-amber-500/25 bg-white/90 px-3 py-2.5 shadow-sm backdrop-blur-sm dark:border-amber-400/20 dark:bg-slate-900/85 sm:min-w-[82px] sm:px-4 sm:py-3"
              >
                <span className="font-editorial-title tabular-nums text-2xl leading-none text-slate-900 dark:text-white sm:text-4xl">
                  {unit.value}
                </span>
                <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300/90">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-200">
            <span className="h-2 w-2 animate-ping rounded-full bg-amber-500" />
            <span>
              {isLive
                ? "Gran Final en disputa en este momento"
                : "¡Llegó la hora de la Gran Final!"}
            </span>
          </div>
        )}
      </div>

      {/* ENFRENTAMIENTO CARA A CARA (GRAN FINAL) */}
      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr] sm:gap-8">
        {/* Finalista 1 (Local) */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-full bg-primary/15 blur-xl"
            />
            <TeamLogo
              team={finalHome.team}
              size={88}
              className={cn(
                "relative bg-white ring-2 ring-amber-500/35 dark:bg-slate-900",
                finalHome.isPlaceholder && "opacity-80 grayscale",
              )}
            />
          </div>
          <h3
            className={cn(
              "font-editorial-title mt-3.5 text-xl text-slate-900 dark:text-white sm:text-2xl lg:text-3xl",
              finalHome.isPlaceholder && "italic opacity-85",
            )}
          >
            {finalHome.team.name}
          </h3>
          <span className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {finalHome.isPlaceholder
              ? "Clasificado Llave A"
              : finalHome.team.city || "Finalista Oficial"}
          </span>
        </div>

        {/* Centro: VS o Marcador en Vivo */}
        <div className="flex flex-col items-center justify-center">
          {isLive ? (
            <div className="inline-flex items-center gap-3 rounded-2xl border border-amber-500/45 bg-white/90 px-5 py-3 shadow-md dark:bg-slate-900/90">
              <span className="font-editorial-title tabular-nums text-3xl text-slate-900 dark:text-white sm:text-4xl">
                {finalMatch.score?.home_points ?? 0}
              </span>
              <span className="font-display text-lg font-black text-amber-500">
                :
              </span>
              <span className="font-editorial-title tabular-nums text-3xl text-slate-900 dark:text-white sm:text-4xl">
                {finalMatch.score?.away_points ?? 0}
              </span>
            </div>
          ) : (
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/45 bg-gradient-to-br from-amber-500/20 via-amber-400/15 to-primary/20 shadow-[0_0_25px_rgba(245,158,11,0.2)] sm:h-20 sm:w-20">
              <span className="font-editorial-title text-2xl tracking-wider text-amber-700 dark:text-amber-300 sm:text-3xl">
                VS
              </span>
            </div>
          )}
          <span className="mt-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-700/90 dark:text-amber-300/80">
            Copa Mamba
          </span>
        </div>

        {/* Finalista 2 (Visita) */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-2 rounded-full bg-primary/15 blur-xl"
            />
            <TeamLogo
              team={finalAway.team}
              size={88}
              className={cn(
                "relative bg-white ring-2 ring-amber-500/35 dark:bg-slate-900",
                finalAway.isPlaceholder && "opacity-80 grayscale",
              )}
            />
          </div>
          <h3
            className={cn(
              "font-editorial-title mt-3.5 text-xl text-slate-900 dark:text-white sm:text-2xl lg:text-3xl",
              finalAway.isPlaceholder && "italic opacity-85",
            )}
          >
            {finalAway.team.name}
          </h3>
          <span className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {finalAway.isPlaceholder
              ? "Clasificado Llave B"
              : finalAway.team.city || "Finalista Oficial"}
          </span>
        </div>
      </div>

      {/* SUB-TARJETA DESTACADA: PARTIDO POR EL 3° Y 4° LUGAR */}
      {thirdPlaceMatch && thirdHome && thirdAway && (
        <div className="mx-auto mt-9 max-w-4xl rounded-2xl border border-amber-700/35 bg-amber-500/[0.06] p-5 shadow-sm backdrop-blur-sm dark:border-orange-500/25 dark:bg-slate-900/60 sm:p-6">
          {/* Encabezado de la sub-tarjeta */}
          <div className="flex flex-col items-center justify-between gap-2.5 border-b border-amber-700/20 pb-3.5 text-center dark:border-orange-500/20 sm:flex-row sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/45 bg-amber-600/15 px-3 py-1 font-display text-[11px] font-black uppercase tracking-widest text-amber-900 dark:border-orange-400/40 dark:bg-orange-500/15 dark:text-orange-200">
                🥉 DISPUTA 3º LUGAR · PODIO OFICIAL
              </span>
              {thirdIsLive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-white">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  EN VIVO
                </span>
              )}
              {thirdIsFinished && (
                <span className="inline-flex items-center rounded-full bg-slate-900/10 px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-slate-800 dark:bg-white/10 dark:text-slate-200">
                  FINALIZADO
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 sm:justify-end">
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Clock className="h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-orange-400" />
                {formatShortTime(thirdPlaceMatch.datetime)}
              </span>
              {thirdVenue && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-orange-400" />
                  {thirdVenue.name}
                </span>
              )}
            </div>
          </div>

          {/* Cruce visual con escudos medianos cara a cara */}
          <div className="mt-5 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            {/* Equipo Local (3° Lugar) */}
            <div
              className={cn(
                "flex flex-col items-center gap-2.5 text-center sm:flex-row sm:justify-end sm:text-right",
                thirdIsFinished && !thirdHomeWon && "opacity-75",
              )}
            >
              <div className="order-2 min-w-0 sm:order-1">
                {thirdHomeWon && (
                  <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-amber-700/45 bg-amber-500/20 px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-amber-900 dark:border-orange-400/45 dark:bg-orange-500/20 dark:text-orange-200">
                    🥉 3º LUGAR
                  </span>
                )}
                <div
                  className={cn(
                    "font-editorial-title text-base text-slate-900 dark:text-white sm:text-lg",
                    thirdHome.isPlaceholder && "italic opacity-85",
                  )}
                >
                  {thirdHome.team.name}
                </div>
                <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {thirdHome.isPlaceholder
                    ? "Semifinalista Llave A"
                    : thirdHome.team.city || "Semifinalista"}
                </div>
              </div>

              <TeamLogo
                team={thirdHome.team}
                size={54}
                className={cn(
                  "order-1 bg-white ring-2 ring-amber-700/30 dark:bg-slate-900 dark:ring-orange-400/30 sm:order-2",
                  thirdHomeWon &&
                    "ring-amber-600 shadow-[0_0_16px_rgba(217,119,6,0.3)] dark:ring-orange-400",
                  thirdHome.isPlaceholder && "opacity-80 grayscale",
                )}
              />
            </div>

            {/* Centro: Marcador Final/Vivo o Badge VS */}
            <div className="flex flex-col items-center justify-center">
              {thirdIsFinished || thirdIsLive ? (
                <div className="inline-flex items-center gap-2 rounded-xl border border-amber-700/35 bg-white/90 px-4 py-2 shadow-sm dark:border-orange-400/30 dark:bg-slate-950/90">
                  <span
                    className={cn(
                      "font-editorial-title tabular-nums text-2xl leading-none sm:text-3xl",
                      thirdHomeWon
                        ? "text-amber-700 dark:text-orange-300"
                        : "text-slate-600 dark:text-slate-300",
                    )}
                  >
                    {thirdHomePts}
                  </span>
                  <span className="font-display text-sm font-black text-slate-400">
                    :
                  </span>
                  <span
                    className={cn(
                      "font-editorial-title tabular-nums text-2xl leading-none sm:text-3xl",
                      thirdAwayWon
                        ? "text-amber-700 dark:text-orange-300"
                        : "text-slate-600 dark:text-slate-300",
                    )}
                  >
                    {thirdAwayPts}
                  </span>
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-700/40 bg-amber-600/15 font-editorial-title text-base tracking-wider text-amber-800 dark:border-orange-400/35 dark:bg-orange-500/15 dark:text-orange-200">
                  VS
                </div>
              )}
            </div>

            {/* Equipo Visita (3° Lugar) */}
            <div
              className={cn(
                "flex flex-col items-center gap-2.5 text-center sm:flex-row sm:justify-start sm:text-left",
                thirdIsFinished && !thirdAwayWon && "opacity-75",
              )}
            >
              <TeamLogo
                team={thirdAway.team}
                size={54}
                className={cn(
                  "bg-white ring-2 ring-amber-700/30 dark:bg-slate-900 dark:ring-orange-400/30",
                  thirdAwayWon &&
                    "ring-amber-600 shadow-[0_0_16px_rgba(217,119,6,0.3)] dark:ring-orange-400",
                  thirdAway.isPlaceholder && "opacity-80 grayscale",
                )}
              />

              <div className="min-w-0">
                {thirdAwayWon && (
                  <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-amber-700/45 bg-amber-500/20 px-2.5 py-0.5 font-display text-[10px] font-black uppercase tracking-wider text-amber-900 dark:border-orange-400/45 dark:bg-orange-500/20 dark:text-orange-200">
                    🥉 3º LUGAR
                  </span>
                )}
                <div
                  className={cn(
                    "font-editorial-title text-base text-slate-900 dark:text-white sm:text-lg",
                    thirdAway.isPlaceholder && "italic opacity-85",
                  )}
                >
                  {thirdAway.team.name}
                </div>
                <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {thirdAway.isPlaceholder
                    ? "Semifinalista Llave B"
                    : thirdAway.team.city || "Semifinalista"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIE CENTRADO CON BOTÓN DE ACCIÓN HACIA PLAYOFFS */}
      <div className="mt-7 flex justify-center">
        <Link
          to="/posiciones"
          search={{ tab: "playoffs" } as any}
          className="press-scale inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 font-display text-xs font-black uppercase tracking-wider text-slate-950 shadow-sm transition-colors hover:bg-amber-400 sm:w-auto sm:text-sm"
        >
          <Trophy className="h-4 w-4 shrink-0" />
          <span>Ir al Cuadro de Playoffs</span>
          <ArrowUpRight className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </section>
  );
}
