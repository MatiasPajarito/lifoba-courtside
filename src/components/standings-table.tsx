import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Trophy } from "lucide-react";
import { TeamLogo } from "@/components/team-logo";
import { cn } from "@/lib/utils";
import type { StandingRow, Team } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  rows: StandingRow[];
  teams: Team[];
}

export function StandingsTable({ rows, teams }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const teamMap = new Map(teams.map((t) => [t.id, t]));

  useGSAP(
    () => {
      const scopeEl = containerRef.current;
      if (!scopeEl || rows.length === 0) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 640px)",
          isMobile: "(max-width: 639px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions ?? {};
          const targetSelector = isDesktop
            ? ".standing-row-desktop"
            : ".standing-row-mobile";
          const targetRows = gsap.utils.toArray<HTMLElement>(
            targetSelector,
            scopeEl,
          );

          if (targetRows.length === 0) return;

          if (reduceMotion) {
            gsap.set(targetRows, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            targetRows,
            { y: 16, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.42,
              stagger: 0.045,
              ease: "power3.out",
              force3D: true,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: scopeEl,
                start: "top 88%",
                once: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [rows], revertOnUpdate: true },
  );

  return (
    <div ref={containerRef} className="flex flex-1 flex-col">
      {/* Móvil: tarjetas integradas estilo broadcast sin scroll horizontal */}
      <div className="shadow-layered flex flex-col gap-2 rounded-3xl bg-card/90 p-2.5 sm:hidden">
        {rows.map((r) => {
          const team = teamMap.get(r.team_id);
          if (!team) return null;
          const diff = r.pf - r.pc;
          const isLeader = r.position === 1;
          const isPodium = r.position <= 3;
          const isTopFour = r.position <= 4;

          return (
            <div
              key={r.team_id}
              className={cn(
                "standing-row-mobile flex items-center gap-3 rounded-2xl px-3.5 py-3 transition-[transform,background-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] hover:-translate-y-[1px] hover:shadow-md",
                isLeader
                  ? "bg-primary/14 shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_40%,transparent)]"
                  : isPodium
                    ? "bg-secondary/75 shadow-[0_0_0_1px_oklch(1_0_0/0.06)]"
                    : isTopFour
                      ? "bg-secondary/45"
                      : "bg-background/35 hover:bg-secondary/50",
              )}
            >
              {/* Posición con insignia de Líder / Top 4 */}
              <div
                className={cn(
                  "tabular-nums tabular-figures flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-display text-xs font-black",
                  isLeader
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isPodium
                      ? "border border-primary/45 bg-primary/15 text-primary"
                      : isTopFour
                        ? "border border-border bg-secondary text-foreground"
                        : "text-muted-foreground",
                )}
              >
                {isLeader ? <Trophy className="h-3.5 w-3.5" /> : r.position}
              </div>

              <TeamLogo team={team} size={36} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "truncate text-sm",
                      isTopFour
                        ? "font-black text-foreground"
                        : "font-semibold text-foreground/85",
                    )}
                  >
                    {team.name}
                  </span>
                </div>
                <div className="tabular-nums tabular-figures mt-0.5 flex flex-wrap gap-x-2.5 text-[11px] font-medium text-muted-foreground">
                  <span>PJ {r.pj}</span>
                  <span>PG {r.pg}</span>
                  <span>PP {r.pp}</span>
                  <span>PF {r.pf}</span>
                  <span>PC {r.pc}</span>
                  <span
                    className={cn(
                      "font-bold",
                      diff > 0
                        ? "text-primary"
                        : diff < 0
                          ? "text-destructive"
                          : "text-muted-foreground",
                    )}
                  >
                    Dif {diff > 0 ? `+${diff}` : diff}
                  </span>
                </div>
              </div>

              <div
                className={cn(
                  "tabular-nums tabular-figures shrink-0 rounded-xl px-3 py-1.5 text-center font-display text-sm font-black",
                  isLeader
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-primary/15 text-primary",
                )}
              >
                {r.pts}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tablet / Desktop: Tabla integrada estilo ESPN / Broadcast */}
      <div className="shadow-layered hidden flex-1 flex-col justify-between overflow-x-auto rounded-3xl bg-card/90 p-3 sm:flex">
        <table className="w-full min-w-[620px] border-separate border-spacing-y-1.5 text-sm">
          <thead>
            <tr className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <th className="w-14 px-3 py-2 text-left">Pos</th>
              <th className="px-3 py-2 text-left">Club</th>
              <th className="px-2.5 py-2 text-center">
                <span className="rounded-md bg-primary/15 px-2 py-0.5 font-display font-black text-primary">
                  Pts
                </span>
              </th>
              <th className="px-2.5 py-2 text-center">PJ</th>
              <th className="px-2.5 py-2 text-center">PG</th>
              <th className="px-2.5 py-2 text-center">PP</th>
              <th className="px-2.5 py-2 text-center">PF</th>
              <th className="px-2.5 py-2 text-center">PC</th>
              <th className="px-3 py-2 text-right">Dif</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const team = teamMap.get(r.team_id);
              if (!team) return null;
              const diff = r.pf - r.pc;
              const isLeader = r.position === 1;
              const isPodium = r.position <= 3;
              const isTopFour = r.position <= 4;

              return (
                <tr
                  key={r.team_id}
                  className={cn(
                    "standing-row-desktop group rounded-2xl transition-[transform,background-color,box-shadow] duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] hover:-translate-y-[1px] hover:shadow-md",
                    isLeader
                      ? "bg-primary/14 hover:bg-primary/20"
                      : isPodium
                        ? "bg-secondary/70 hover:bg-secondary"
                        : isTopFour
                          ? "bg-secondary/45 hover:bg-secondary/80"
                          : "bg-background/35 hover:bg-secondary/60",
                  )}
                >
                  {/* Celda 1: Posición con trofeo en #1 */}
                  <td className="rounded-l-2xl px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "tabular-nums tabular-figures inline-flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs font-black",
                          isLeader
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : isPodium
                              ? "border border-primary/45 bg-primary/15 text-primary"
                              : isTopFour
                                ? "border border-border bg-secondary text-foreground"
                                : "text-muted-foreground",
                        )}
                      >
                        {r.position}
                      </span>
                      {isLeader && (
                        <Trophy
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          aria-label="Líder de la categoría"
                        />
                      )}
                    </div>
                  </td>

                  {/* Celda 2: Equipo + Ciudad */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="transition-transform duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] group-hover:scale-105">
                        <TeamLogo team={team} size={32} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "truncate",
                            isTopFour
                              ? "font-display font-black tracking-tight text-foreground"
                              : "font-semibold text-foreground/85",
                          )}
                        >
                          {team.name}
                        </div>
                        <div className="truncate text-[11px] text-muted-foreground">
                          {team.city}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Celda 3: Puntos de Clasificación */}
                  <td className="px-2.5 py-2.5 text-center">
                    <span
                      className={cn(
                        "tabular-nums tabular-figures inline-block min-w-8 rounded-lg px-2 py-1 font-display text-sm font-black",
                        isLeader
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : isTopFour
                            ? "bg-primary/18 text-primary"
                            : "bg-secondary text-foreground",
                      )}
                    >
                      {r.pts}
                    </span>
                  </td>

                  {/* Celdas Estadísticas con tabular-nums */}
                  <td className="tabular-nums tabular-figures px-2.5 py-2.5 text-center font-medium text-foreground/90">
                    {r.pj}
                  </td>
                  <td className="tabular-nums tabular-figures px-2.5 py-2.5 text-center font-semibold text-foreground">
                    {r.pg}
                  </td>
                  <td className="tabular-nums tabular-figures px-2.5 py-2.5 text-center text-muted-foreground">
                    {r.pp}
                  </td>
                  <td className="tabular-nums tabular-figures px-2.5 py-2.5 text-center text-muted-foreground">
                    {r.pf}
                  </td>
                  <td className="tabular-nums tabular-figures px-2.5 py-2.5 text-center text-muted-foreground">
                    {r.pc}
                  </td>

                  {/* Celda Final: Diferencia de Puntos */}
                  <td className="rounded-r-2xl px-3 py-2.5 text-right">
                    <span
                      className={cn(
                        "tabular-nums tabular-figures inline-block font-display text-xs font-black",
                        diff > 0
                          ? "text-primary"
                          : diff < 0
                            ? "text-destructive"
                            : "text-muted-foreground",
                      )}
                    >
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Leyenda compacta de zona de clasificación */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 px-2 pt-2.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground/90">
              <span className="h-2 w-2 rounded-full bg-primary" /> Top 4 · Zona
              de Podio / Clasificación
            </span>
          </div>
          <span className="tabular-nums">
            Victoria: 2 pts · Derrota: 1 pt · Dif: PF − PC
          </span>
        </div>
      </div>
    </div>
  );
}
