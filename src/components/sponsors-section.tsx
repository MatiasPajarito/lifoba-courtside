import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Sponsor } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SPONSOR_DESCRIPTIONS: Record<string, { role: string; summary: string }> = {
  "clínica dental obident": {
    role: "Main Sponsor Oficial · Clausura 2026",
    summary:
      "Auspiciador principal del campeonato, trofeos oficiales y reconocimiento MVP en todas las jornadas de U13, U15 y U18.",
  },
  "cabañas glamen": {
    role: "Partner Oficial · Hospitalidad & Deporte",
    summary:
      "Apoyo permanente al desarrollo formativo y la comunidad deportiva de la liga en cada fecha del torneo.",
  },
  "zeus sport": {
    role: "Sponsor Técnico · Indumentaria Deportiva",
    summary:
      "Especialistas en equipamiento e indumentaria deportiva de alto desempeño para clubes y atletas en competencia.",
  },
  rigorer: {
    role: "Partner Oficial · Basketball Gear",
    summary:
      "Tecnología, accesorios y equipamiento técnico de baloncesto diseñado para el máximo rendimiento en cancha.",
  },
  "impresiones carolina": {
    role: "Partner Oficial · Gráfica & Impresión",
    summary:
      "Soluciones gráficas, impresión profesional y soporte visual oficial para las jornadas del Torneo Clausura 2026.",
  },
};

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const scopeEl = sectionRef.current;
      if (!scopeEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};
          const cards = gsap.utils.toArray<HTMLElement>(
            ".sponsor-grid-card",
            scopeEl,
          );
          if (cards.length === 0) return;

          if (reduceMotion) {
            gsap.set(cards, {
              y: 0,
              clearProps: "transform,opacity,visibility",
            });
            return;
          }

          gsap.from(cards, {
            y: 22,
            duration: 0.65,
            stagger: 0.1,
            ease: "power3.out",
            force3D: true,
            immediateRender: false,
            clearProps: "transform",
            scrollTrigger: {
              trigger: scopeEl,
              start: "top 85%",
              once: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [sponsors.length], revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="space-y-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-end">
        <h2 className="font-editorial-title text-2xl text-foreground sm:text-3xl">
          Nuestros Patrocinadores
        </h2>
        <p className="max-w-md text-xs text-muted-foreground sm:text-right sm:text-sm">
          Instituciones y marcas que impulsan el básquetbol formativo en el
          Torneo Clausura 2026.
        </p>
      </div>

      {/* GRID DE PATROCINADORES ANCHO Y ESPACIOSO (Radios concéntricos: outer rounded-3xl p-3 -> inner rounded-2xl) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sponsors.map((sponsor) => {
          const meta = SPONSOR_DESCRIPTIONS[sponsor.name.toLowerCase()] ?? {
            role:
              sponsor.tier === "oro"
                ? "Sponsor Oficial · Categoría Oro"
                : "Partner Oficial LIFOBA",
            summary:
              "Colaborador oficial en el desarrollo deportivo y formativo de la temporada Clausura 2026.",
          };

          const cardInner = (
            <article className="sponsor-grid-card shadow-layered group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/90 p-3 opacity-90 transition-[opacity,transform,box-shadow,border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] hover:-translate-y-1 hover:border-primary/50 hover:bg-card hover:opacity-100 hover:shadow-[0_0_20px_color-mix(in_oklch,var(--primary)_32%,transparent)]">
              {/* Superficie interior con radio concéntrico (rounded-2xl = rounded-3xl - p-3) */}
              <div className="surface-court relative flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-border/40 px-8 py-6 transition-colors duration-[var(--duration-fast)] group-hover:border-primary/30">
                {sponsor.logo_url ? (
                  <img
                    src={sponsor.logo_url}
                    alt={sponsor.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-24 w-auto max-w-[220px] object-contain drop-shadow-lg transition-transform duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <span className="font-editorial-title text-2xl text-foreground">
                    {sponsor.name}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between px-4 pb-3 pt-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-editorial-subtitle text-lg text-foreground sm:text-xl">
                      {sponsor.name}
                    </h3>
                    {sponsor.website_url ? (
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-[transform,color,background-color] duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-foreground">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {meta.summary}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-3.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>{meta.role}</span>
                </div>
              </div>
            </article>
          );

          return sponsor.website_url ? (
            <a
              key={sponsor.id}
              href={sponsor.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Visitar sitio oficial de ${sponsor.name}`}
            >
              {cardInner}
            </a>
          ) : (
            <div key={sponsor.id} className="h-full">
              {cardInner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
