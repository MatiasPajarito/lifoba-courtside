import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CalendarDays, MapPin, Navigation, Star } from "lucide-react";
import { directionsUrl } from "@/lib/geo";
import { TeamLogo } from "@/components/team-logo";
import { cn } from "@/lib/utils";
import type { Match } from "@/lib/types";
import { useTeam, useVenue, useStore } from "@/lib/store";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

export function MatchCard({
  match,
  hideVenue = false,
}: {
  match: Match;
  hideVenue?: boolean;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const home = useTeam(match.home_team_id);
  const away = useTeam(match.away_team_id);
  const venue = useVenue(match.venue_id);

  // Importamos players y teams completos para buscar al MVP
  const { players, teams } = useStore();

  useGSAP(
    () => {
      const el = cardRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set(el, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            el,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.48,
              ease: "power3.out",
              force3D: true,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: cardRef, dependencies: [match.id], revertOnUpdate: true },
  );

  // 1. Respaldo seguro para partidos de playoffs donde los equipos aún no están definidos en la base de datos
  const homeTeam = home || {
    id: "tbd_home",
    name: "Por definir",
    short_name: "TBD",
    logo_color: "#364DA0",
    logo_url: "",
    city: "",
  };

  const awayTeam = away || {
    id: "tbd_away",
    name: "Por definir",
    short_name: "TBD",
    logo_color: "#364DA0",
    logo_url: "",
    city: "",
  };

  const finished = match.status === "finished";
  const isLive = match.status === "live";

  const homePoints = match.score?.home_points ?? 0;
  const awayPoints = match.score?.away_points ?? 0;
  const homeWon = finished && homePoints > awayPoints;
  const awayWon = finished && awayPoints > homePoints;

  // Buscar datos del MVP si el partido ya terminó y tiene uno asignado
  const mvpPlayer = match.mvp_player_id
    ? players.find((p) => p.id === match.mvp_player_id)
    : null;
  const mvpTeam = mvpPlayer
    ? teams.find((t) => t.id === mvpPlayer.team_id)
    : null;

  return (
    <article
      ref={cardRef}
      className="shadow-layered-interactive group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card/95 p-4 transition-[transform,box-shadow,background-color] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] hover:-translate-y-0.5"
    >
      {/* CABECERA DE TRANSMISIÓN (Broadcast Top Bar) */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5 text-[11px] font-medium text-muted-foreground">
        <span className="tabular-nums flex min-w-0 items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate font-semibold uppercase tracking-wider">
            Fecha {match.matchday} · {fmtDate(match.datetime)} ·{" "}
            {fmtTime(match.datetime)}
          </span>
        </span>

        {finished ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-widest text-foreground">
            Final
          </span>
        ) : isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-destructive/20 px-2 py-0.5 font-display text-[10px] font-black uppercase tracking-widest text-destructive">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
            En Vivo
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md border border-border/80 bg-background/40 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Programado
          </span>
        )}
      </div>

      {/* CUERPO PRINCIPAL: SCOREBOARD BROADCAST (Optimizado para < 375px sin truncado extremo ni superposición) */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 py-1 sm:gap-3">
        {/* EQUIPO LOCAL */}
        <div
          className={cn(
            "flex min-w-0 flex-col items-center justify-center gap-1.5 text-center transition-opacity duration-[var(--duration-quick)]",
            finished ? (homeWon ? "opacity-100" : "opacity-75") : "opacity-100",
          )}
        >
          <div className="shrink-0">
            <TeamLogo team={homeTeam as any} size={40} />
          </div>
          <div className="w-full min-w-0">
            <div
              className={cn(
                "line-clamp-2 whitespace-normal break-words text-center text-xs leading-tight sm:text-sm",
                homeWon
                  ? "font-display font-black text-foreground"
                  : "font-bold text-foreground/90",
              )}
            >
              {homeTeam.name}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Local
            </div>
          </div>
        </div>

        {/* MARCADOR CENTRAL MONUMENTAL (Solo números centrados vertical y horizontalmente) */}
        <div className="flex shrink-0 flex-col items-center justify-center px-1">
          {finished || isLive ? (
            <div className="shadow-border inline-flex items-center justify-center gap-2 rounded-xl bg-background/75 px-3.5 py-2.5 sm:gap-2.5 sm:px-4">
              <span
                className={cn(
                  "font-editorial-title tabular-nums tabular-figures text-3xl leading-none sm:text-4xl",
                  homeWon ? "text-primary" : "text-muted-foreground/85",
                )}
              >
                {homePoints}
              </span>

              <span className="font-display text-lg font-black leading-none text-muted-foreground/50 sm:text-xl">
                :
              </span>

              <span
                className={cn(
                  "font-editorial-title tabular-nums tabular-figures text-3xl leading-none sm:text-4xl",
                  awayWon ? "text-primary" : "text-muted-foreground/85",
                )}
              >
                {awayPoints}
              </span>
            </div>
          ) : (
            <div className="shadow-border inline-flex items-center justify-center rounded-xl bg-background/60 px-3.5 py-2 font-editorial-title text-lg leading-none text-muted-foreground">
              VS
            </div>
          )}

          {/* Desglose por cuartos si está disponible */}
          {finished &&
            Array.isArray(match.score?.quarters) &&
            match.score.quarters.length > 0 && (
              <div className="tabular-nums tabular-figures mt-1 flex flex-wrap items-center justify-center gap-1 text-[10px] font-semibold text-muted-foreground">
                {match.score.quarters.map((q) => (
                  <span
                    key={q.quarter}
                    className="rounded bg-secondary/70 px-1.5 py-0.5"
                  >
                    C{q.quarter}: {q.home}-{q.away}
                  </span>
                ))}
              </div>
            )}
        </div>

        {/* EQUIPO VISITANTE */}
        <div
          className={cn(
            "flex min-w-0 flex-col items-center justify-center gap-1.5 text-center transition-opacity duration-[var(--duration-quick)]",
            finished ? (awayWon ? "opacity-100" : "opacity-75") : "opacity-100",
          )}
        >
          <div className="shrink-0">
            <TeamLogo team={awayTeam as any} size={40} />
          </div>
          <div className="w-full min-w-0">
            <div
              className={cn(
                "line-clamp-2 whitespace-normal break-words text-center text-xs leading-tight sm:text-sm",
                awayWon
                  ? "font-display font-black text-foreground"
                  : "font-bold text-foreground/90",
              )}
            >
              {awayTeam.name}
            </div>
            <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Visita
            </div>
          </div>
        </div>
      </div>

      {/* LOWER-THIRD DEL MVP DEL PARTIDO */}
      {finished && mvpPlayer && mvpTeam && (
        <div className="mt-3.5 flex justify-center border-t border-border/50 pt-3">
          <div className="shadow-border inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-foreground">
            <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
            <span className="truncate">
              MVP: <span className="text-primary">{mvpPlayer.name}</span>{" "}
              <span className="font-semibold text-muted-foreground">
                · {mvpTeam.short_name || mvpTeam.name}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* PIE DE RECINTO / SEDE */}
      {venue && !hideVenue && (
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3 text-xs">
          <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium">
              {venue.name} · {venue.city}
            </span>
          </div>
          <a
            href={directionsUrl(venue)}
            target="_blank"
            rel="noreferrer"
            className="press-scale shadow-border inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <Navigation className="h-3 w-3" /> Cómo llegar
          </a>
        </div>
      )}
    </article>
  );
}
