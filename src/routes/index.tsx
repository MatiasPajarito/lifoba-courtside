import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Camera,
  ClipboardList,
  Flame,
  Instagram,
  MapPin,
  Medal,
  MessageCircle,
  Shield,
  Star,
  Ticket,
  Trophy,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { SponsorsSection } from "@/components/sponsors-section";
import { SubscribeAlerts } from "@/components/subscribe-alerts";
import { StandingsTable } from "@/components/standings-table";
import { MatchCard } from "@/components/match-card";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import {
  CATEGORIES,
  categoryLabel,
  matchCategory,
  teamCategory,
} from "@/lib/category";
import { computeStandings } from "@/lib/standings";
import type { Match, Sponsor } from "@/lib/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

const EDITORIAL_FEATURES = {
  lead: {
    to: "/calendario" as const,
    title: "El Torneo Clausura ya está aquí",
    desc: "Revisa la programación oficial por jornada, horarios confirmados y geolocalización de los gimnasios sede en Melipilla, San Antonio, Curacaví y Padre Hurtado.",
    cta: "Explorar calendario y sedes",
    tag: "Programación Oficial · Clausura 2026",
    image: "/logo y trofeos mejorado.png",
    icon: CalendarDays,
  },
  side: [
    {
      to: "/posiciones" as const,
      title: "Tabla de Posiciones y Carrera al Podio",
      desc: "Seguimiento en tiempo real de puntos de clasificación, invictos y diferencia de puntos (PF − PC) por categoría.",
      tag: "Estadísticas FIBA",
      image: "/pelota-u18.png",
      icon: Trophy,
    },
    {
      to: "/equipos" as const,
      title: "Clubes Oficiales y Planteles Inscritos",
      desc: "Conoce las nóminas oficiales de los 8 clubes en competencia y sus jugadores por categoría formativa.",
      tag: "8 Clubes · 3 Ramas",
      image: "/pelota-u15.png",
      icon: Users,
    },
    {
      to: "/reglamento" as const,
      title: "Reglamento Oficial y Sistema 3x1",
      desc: "Normativa deportiva del campeonato, cuartos semi-cronometrados, rotación formativa 3x1 y bases de localía.",
      tag: "Normativa LIFOBA",
      image: "/pelota-u13.png",
      icon: ClipboardList,
    },
  ],
} as const;

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
  { name: "Mamba Club", short: "MAM", city: "Melipilla", match: ["mamba"], logo: "" },
  { name: "San Luis", short: "SLU", city: "San Antonio", match: ["san luis"], logo: "" },
  {
    name: "Español",
    short: "ESP",
    city: "San Antonio",
    match: ["español", "espaniol", "san antonio"],
    logo: `${SUPABASE_STORAGE}/espaniol_mejorado.png`,
  },
  { name: "Esparta", short: "EST", city: "San Antonio", match: ["esparta"], logo: "" },
  { name: "DSM Melipilla", short: "DSM", city: "Melipilla", match: ["dsm"], logo: "" },
  { name: "Liceo Curacaví", short: "LIC", city: "Curacaví", match: ["liceo"], logo: "" },
  {
    name: "Gobernación",
    short: "GOB",
    city: "San Antonio",
    match: ["goberna"],
    logo: `${SUPABASE_STORAGE}/gobernacion_mejorado.png`,
  },
  { name: "Padre Hurtado", short: "PH", city: "Padre Hurtado", match: ["hurtado"], logo: "" },
] as const;

const DEFAULT_SPONSORS: Sponsor[] = [
  {
    id: "sp-obident",
    name: "Clínica Dental Obident",
    logo_url: "/obident_mejorado.png",
    website_url: "https://www.instagram.com/clinicaobident?stkn=OWNyOGMwejBxNXd6",
    tier: "oro",
  },
  {
    id: "sp-glamen",
    name: "Cabañas Glamen",
    logo_url: "/logo-glamen.jpg",
    website_url: "https://www.instagram.com/cabanasglamen?stkn=MTlxYzFkaHkzNTNvYw==",
    tier: "oro",
  },
  {
    id: "sp-zeus-sport",
    name: "Zeus Sport",
    logo_url: "/zeus-sport.png",
    website_url: "https://www.instagram.com/zeussportzs/",
    tier: "plata",
  },
  {
    id: "sp-rigorer",
    name: "Rigorer",
    logo_url: "/rigorer.png",
    website_url: "https://www.instagram.com/rigorer_oficial/",
    tier: "plata",
  },
  {
    id: "sp-carolina",
    name: "Impresiones Carolina",
    logo_url: "/carolina.png",
    website_url: "",
    tier: "plata",
  },
];

function parseCssDurationToSeconds(rawValue: string, fallbackSeconds = 0.15): number {
  const trimmed = rawValue.trim();
  if (!trimmed) return fallbackSeconds;
  if (trimmed.endsWith("ms")) {
    const ms = Number.parseFloat(trimmed);
    return Number.isFinite(ms) ? ms / 1000 : fallbackSeconds;
  }
  if (trimmed.endsWith("s")) {
    const s = Number.parseFloat(trimmed);
    return Number.isFinite(s) ? s : fallbackSeconds;
  }
  return fallbackSeconds;
}

function Home() {
  const {
    matches,
    teams: allTeams,
    players,
    sponsors,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const heroScopeRef = useRef<HTMLDivElement>(null);
  const statsBandRef = useRef<HTMLElement>(null);
  const magazineSectionRef = useRef<HTMLElement>(null);

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

  // Partidos finalizados con marcador válido (evita restas sobre datos vacíos).
  const hasValidScore = (m: Match) =>
    typeof m.score?.home_points === "number" &&
    Number.isFinite(m.score.home_points) &&
    typeof m.score?.away_points === "number" &&
    Number.isFinite(m.score.away_points);

  // Estadísticas generales reales del torneo calculadas desde matches, teams y players (useStore)
  const tournamentStats = useMemo(() => {
    const finishedMatches = matches.filter(
      (m) => m.status === "finished" && hasValidScore(m),
    );
    const totalPointsScored = finishedMatches.reduce(
      (acc, m) => acc + (m.score?.home_points ?? 0) + (m.score?.away_points ?? 0),
      0,
    );

    const uniqueClubsCount =
      allTeams.length > 0
        ? Math.max(
            CLUBES.length,
            new Set(allTeams.map((t) => t.short_name.trim().toLowerCase())).size,
          )
        : CLUBES.length;

    const totalTeamsRegistered = allTeams.length > 0 ? allTeams.length : 22;

    return [
      {
        id: "stat-matches",
        label: "Partidos Disputados",
        sublabel:
          matches.length > 0
            ? `${matches.length} encuentros en programación oficial`
            : "Fase regular y playoffs Clausura 2026",
        value: finishedMatches.length > 0 ? finishedMatches.length : matches.length,
        icon: Activity,
      },
      {
        id: "stat-clubs",
        label: "Clubes Oficiales",
        sublabel: `${totalTeamsRegistered} planteles en U13, U15 y U18`,
        value: uniqueClubsCount,
        icon: Shield,
      },
      {
        id: "stat-points",
        label: "Puntos Anotados",
        sublabel: "Acumulado oficial en marcadores LIFOBA",
        value: totalPointsScored,
        icon: Flame,
      },
      {
        id: "stat-players",
        label: "Jugadores Inscritos",
        sublabel: "Nóminas oficiales en desarrollo formativo",
        value: players.length,
        icon: Users,
      },
    ];
  }, [matches, allTeams, players]);

  // Combina los patrocinadores dinámicos de useStore() con el respaldo oficial (los 5 sponsors oficiales)
  const featuredSponsors = useMemo(() => {
    const merged: Sponsor[] = [...sponsors];
    for (const fallback of DEFAULT_SPONSORS) {
      if (merged.length >= 5) break;
      const alreadyExists = merged.some(
        (s) => s.name.toLowerCase() === fallback.name.toLowerCase(),
      );
      if (!alreadyExists) {
        merged.push(fallback);
      }
    }
    return merged.slice(0, 5);
  }, [sponsors]);

  // Coreografía de entrada para el Hero Cinematográfico y la Franja de Sponsors (sin parpadeo de opacidad en imágenes)
  useGSAP(
    () => {
      const scopeEl = heroScopeRef.current;
      if (!scopeEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 640px)",
          isMobile: "(max-width: 639px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set(
              [
                ".hero-bg-layer",
                ".hero-animate-item",
                ".hero-visual-stage",
                ".sponsor-bar-item",
              ],
              { clearProps: "all" },
            );
            return;
          }

          const rawQuick = getComputedStyle(
            document.documentElement,
          ).getPropertyValue("--duration-quick");
          const staggerQuick = parseCssDurationToSeconds(rawQuick, 0.15);
          const yOffset = isMobile ? 16 : 24;

          const tl = gsap.timeline({
            defaults: {
              ease: "power3.out",
              force3D: true,
            },
          });

          tl.from(
            ".hero-animate-item",
            {
              y: yOffset,
              duration: 0.65,
              stagger: staggerQuick,
              clearProps: "transform",
            },
            0,
          )
            .from(
              ".hero-visual-stage",
              {
                y: isMobile ? 12 : 18,
                scale: 0.98,
                duration: 0.7,
                clearProps: "transform",
              },
              0.1,
            )
            .from(
              ".sponsor-bar-item",
              {
                y: 10,
                duration: 0.45,
                stagger: 0.06,
                clearProps: "transform",
              },
              0.2,
            );
        },
      );

      return () => mm.revert();
    },
    {
      scope: heroScopeRef,
      dependencies: [featuredSponsors.length],
      revertOnUpdate: true,
    },
  );

  // Animación GSAP ScrollTrigger para los Contadores Progresivos de Estadísticas Generales
  useGSAP(
    () => {
      const scopeEl = statsBandRef.current;
      if (!scopeEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};
          const numberNodes = gsap.utils.toArray<HTMLElement>(
            ".gsap-stat-counter",
            scopeEl,
          );
          const statItems = gsap.utils.toArray<HTMLElement>(
            ".stat-band-item",
            scopeEl,
          );

          if (reduceMotion) {
            gsap.set(statItems, { autoAlpha: 1, y: 0 });
            numberNodes.forEach((node) => {
              const targetVal = Number(node.dataset.target ?? "0");
              node.textContent = targetVal.toLocaleString("es-CL");
            });
            return;
          }

          gsap.fromTo(
            statItems,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              stagger: 0.1,
              ease: "power3.out",
              force3D: true,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: scopeEl,
                start: "top 85%",
                once: true,
              },
            },
          );

          numberNodes.forEach((node) => {
            const targetVal = Number(node.dataset.target ?? "0");
            const counterState = { current: 0 };

            gsap.to(counterState, {
              current: targetVal,
              duration: 1.5,
              ease: "power3.out",
              snap: { current: 1 },
              scrollTrigger: {
                trigger: scopeEl,
                start: "top 85%",
                once: true,
              },
              onUpdate: () => {
                node.textContent = Math.round(
                  counterState.current,
                ).toLocaleString("es-CL");
              },
            });
          });
        },
      );

      return () => mm.revert();
    },
    {
      scope: statsBandRef,
      dependencies: [tournamentStats],
      revertOnUpdate: true,
    },
  );

  // Animación GSAP ScrollTrigger + Parallax Y acelerado por GPU para el Grid Editorial "Explora la Liga"
  useGSAP(
    () => {
      const scopeEl = magazineSectionRef.current;
      if (!scopeEl) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 640px)",
          isMobile: "(max-width: 639px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isMobile, reduceMotion } = context.conditions ?? {};
          const cards = gsap.utils.toArray<HTMLElement>(
            ".magazine-card",
            scopeEl,
          );
          const parallaxLayers = gsap.utils.toArray<HTMLElement>(
            ".magazine-parallax-layer",
            scopeEl,
          );

          if (reduceMotion) {
            gsap.set(cards, { y: 0, clearProps: "transform" });
            gsap.set(parallaxLayers, { yPercent: 0, clearProps: "transform" });
            return;
          }

          // Entrada escalonada de las tarjetas editoriales sin ocultar imágenes antes del scroll
          gsap.from(cards, {
            y: isMobile ? 16 : 24,
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

          // Movimiento Parallax suave en el eje Y acelerado por GPU (scrub suave)
          const parallaxDelta = isMobile ? 5 : 8;
          parallaxLayers.forEach((layer) => {
            const cardParent = layer.closest(".magazine-card") ?? scopeEl;
            gsap.fromTo(
              layer,
              { yPercent: -parallaxDelta, force3D: true },
              {
                yPercent: parallaxDelta,
                force3D: true,
                ease: "none",
                scrollTrigger: {
                  trigger: cardParent,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            );
          });
        },
      );

      return () => mm.revert();
    },
    { scope: magazineSectionRef, revertOnUpdate: true },
  );

  // "Más peleados de la fecha más reciente":
  const recentMatches = useMemo(() => {
    const finished = catMatches
      .filter((m) => m.status === "finished" && hasValidScore(m))
      .sort(
        (a, b) =>
          new Date(b.datetime).getTime() - new Date(a.datetime).getTime(),
      );

    if (finished.length === 0) return [];

    const lastMatchday = Math.max(...finished.map((m) => m.matchday));
    const jornada = finished.filter((m) => m.matchday === lastMatchday);
    const latest = jornada.length >= 3 ? jornada : finished.slice(0, 6);

    return latest
      .sort(
        (a, b) =>
          Math.abs(a.score.home_points - a.score.away_points) -
          Math.abs(b.score.home_points - b.score.away_points),
      )
      .slice(0, 3);
  }, [catMatches]);

  const isU13 = selectedCategory === "u13_varones";

  const footerLogoUrl =
    selectedCategory === "u13_varones"
      ? "/pelota-u13.png"
      : selectedCategory === "u15_varones"
        ? "/pelota-u15.png"
        : "/pelota-u18.png";

  return (
    <AppShell>
      <div className="space-y-16">
        {/* CONTENEDOR DE SCOPE GSAP PARA HERO CINEMATOGRÁFICO CON PIE DE SPONSORS INTEGRADO */}
        <div ref={heroScopeRef}>
          <section className="shadow-editorial relative flex min-h-[82vh] flex-col justify-between overflow-hidden rounded-3xl border border-border/60 px-5 pt-8 pb-0 sm:min-h-[85vh] sm:px-10 sm:pt-14 lg:px-14 lg:pt-16">
            <div
              aria-hidden
              className="hero-bg-layer surface-court pointer-events-none absolute inset-0 -z-10 opacity-95"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(1_0_0/0.03)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_40%,black_40%,transparent_100%)]"
            />

            <div className="my-auto grid grid-cols-1 items-center gap-8 py-4 sm:gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="flex flex-col items-start lg:col-span-7">
                <h1 className="hero-animate-item font-editorial-title text-4xl text-slate-900 dark:text-white sm:text-7xl xl:text-[5.5rem]">
                  LIFO<span className="text-primary">BA</span>{" "}
                  <span className="block text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white/90 sm:text-5xl xl:text-6xl">
                    Clausura 2026
                  </span>
                </h1>

                <p className="hero-animate-item mt-5 max-w-[62ch] text-sm leading-relaxed text-slate-600 dark:text-gray-300 sm:mt-6 sm:text-lg md:text-xl">
                  Liga Formativa de Básquetbol enfocada en el desarrollo competitivo
                  integral de las categorías{" "}
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    Sub 13, Sub 15 y Sub 18 Varones
                  </strong>
                  . Marcadores por cuarto, arbitraje oficial y seguimiento en vivo,
                  presentado por{" "}
                  <strong className="font-semibold text-primary">
                    Clínica Dental Obident
                  </strong>
                  .
                </p>

                <div className="hero-animate-item mt-7 flex w-full flex-col items-stretch gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
                  <Link
                    to="/posiciones"
                    className="press-scale shadow-layered-interactive inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl bg-primary pl-6 pr-5 py-3 text-sm font-black uppercase tracking-wider text-primary-foreground sm:justify-start"
                  >
                    <Trophy className="h-4 w-4 shrink-0 stroke-[2.2]" />
                    <span>Ver posiciones</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 opacity-80" />
                  </Link>

                  <Link
                    to="/calendario"
                    className="press-scale shadow-border inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-secondary/70 pl-5 pr-4.5 py-3 text-sm font-bold uppercase tracking-wider text-foreground backdrop-blur-sm hover:bg-secondary sm:justify-start"
                  >
                    <CalendarDays className="h-4 w-4 shrink-0 text-primary stroke-[2]" />
                    <span>Calendario y sedes</span>
                  </Link>

                  <a
                    href="https://api.whatsapp.com/send?phone=56974203763"
                    target="_blank"
                    rel="noreferrer"
                    className="press-scale inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 pl-5 pr-4.5 py-3 text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/15 sm:justify-start"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0 stroke-[2]" />
                    <span>Solicitar bases</span>
                  </a>
                </div>
              </div>

              <div className="hero-visual-stage relative flex items-center justify-center lg:col-span-5">
                <div
                  aria-hidden
                  className="surface-court pointer-events-none absolute -inset-4 rounded-3xl opacity-80 blur-2xl"
                />
                <div className="shadow-editorial relative w-full overflow-hidden rounded-2xl bg-card/60 p-2 backdrop-blur-sm">
                  <img
                    src="/logo y trofeos mejorado.png"
                    alt="Trofeos LIFOBA junto al sponsor oficial Clínica Dental Obident"
                    loading="eager"
                    decoding="async"
                    className="img-outline h-auto w-full rounded-xl object-cover"
                  />
                </div>
              </div>
            </div>

            {/* PIE EDITORIAL DEL HERO: Franja de Patrocinadores anclada en la base con los 5 sponsors distribuidos a lo ancho */}
            <div
              aria-label="Patrocinadores Oficiales"
              className="relative -mx-5 mt-10 border-t border-slate-200/80 bg-gradient-to-t from-background/85 via-background/40 to-transparent px-5 py-6 backdrop-blur-sm dark:border-white/[0.08] sm:-mx-10 sm:mt-12 sm:px-10 sm:py-7 lg:-mx-14 lg:px-14"
            >
              <div className="flex flex-col gap-4">
                <span className="font-editorial-subtitle text-center text-[11px] tracking-[0.2em] text-slate-600 dark:text-gray-300 sm:text-left">
                  Official Partners · Clausura 2026
                </span>

                <div className="flex w-full flex-wrap items-center justify-between gap-4 sm:gap-6">
                  {featuredSponsors.map((sponsor) => {
                    const isSvgWordmark = sponsor.logo_url?.endsWith(".svg");
                    const isWhiteLogo =
                      sponsor.logo_url?.includes("rigorer") ||
                      sponsor.logo_url?.includes("zeus");
                    const itemContent = (
                      <div className="group inline-flex items-center gap-3">
                        {sponsor.logo_url ? (
                          <img
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                            loading="eager"
                            decoding="async"
                            className={`h-10 w-auto object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 hover:grayscale-0 hover:opacity-100 sm:h-12 ${
                              isWhiteLogo ? "invert dark:invert-0" : ""
                            }`}
                          />
                        ) : null}
                        {!isSvgWordmark && (
                          <span className="font-display text-xs font-extrabold uppercase tracking-wider text-slate-800 transition-colors duration-300 group-hover:text-slate-950 dark:text-white/85 dark:group-hover:text-white sm:text-sm">
                            {sponsor.name}
                          </span>
                        )}
                      </div>
                    );

                    return (
                      <div
                        key={sponsor.id}
                        className="sponsor-bar-item flex items-center justify-center"
                      >
                        {sponsor.website_url ? (
                          <a
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            aria-label={`Visitar patrocinador ${sponsor.name}`}
                          >
                            {itemContent}
                          </a>
                        ) : (
                          itemContent
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ETAPA 4 · 1: SECCIÓN DE ESTADÍSTICAS GENERALES */}
        <section
          ref={statsBandRef}
          aria-label="Estadísticas Generales del Torneo"
          className="surface-court shadow-layered relative overflow-hidden rounded-3xl px-6 py-10 sm:px-10 sm:py-12 lg:px-14"
        >
          <div className="mb-8 flex flex-col justify-between gap-2 border-b border-border/60 pb-5 sm:flex-row sm:items-end">
            <h2 className="font-editorial-title text-2xl text-slate-900 dark:text-white sm:text-3xl">
              Pulso Oficial del Campeonato
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              Cifras en tiempo real · Temporada Clausura 2026
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tournamentStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className="stat-band-item relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-none dark:bg-slate-800/50 dark:shadow-none"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-gray-300">
                      {stat.label}
                    </span>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                      <Icon className="h-4 w-4 stroke-[2.2]" />
                    </span>
                  </div>

                  <div className="my-4">
                    <span
                      className="gsap-stat-counter tabular-figures font-display text-5xl font-black tracking-tight text-slate-900 dark:text-white sm:text-6xl"
                      data-target={stat.value}
                    >
                      0
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-gray-300">
                    {stat.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ETAPA 4 · 2: CARRUSEL INFINITO DE CLUBES */}
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-4">
            <h2 className="font-editorial-title text-2xl text-foreground sm:text-3xl">
              Clubes Participantes
            </h2>
            <Link
              to="/equipos"
              className="press-scale inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-secondary px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-secondary/80"
            >
              <span>Ver planteles oficiales</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="marquee-hover relative overflow-hidden rounded-3xl bg-card/50 py-5 shadow-border [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:py-6 sm:[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="animate-marquee flex w-max items-stretch gap-3.5 px-3 sm:gap-5 sm:px-4">
              {[...CLUBES, ...CLUBES].map((c, i) => {
                const matchedTeams = allTeams.filter((x) => {
                  const shortMatch =
                    x.short_name.toLowerCase() === c.short.toLowerCase();
                  const nameMatch = c.match.some((m) =>
                    x.name.toLowerCase().includes(m),
                  );
                  return shortMatch || nameMatch;
                });

                const primaryTeam = matchedTeams[0];
                const resolvedLogo = c.logo || primaryTeam?.logo_url || "";
                const resolvedCity = primaryTeam?.city || c.city;

                return (
                  <Link
                    key={`${c.name}-${i}`}
                    to="/equipos"
                    className="shadow-layered group flex w-40 shrink-0 flex-col justify-between rounded-2xl bg-card p-2.5 transition-[transform,box-shadow,background-color] duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] hover:-translate-y-1 hover:bg-secondary/70 sm:w-48"
                  >
                    <div className="surface-court flex h-24 w-full items-center justify-center rounded-xl p-3 sm:h-28 sm:p-4">
                      <div className="transition-transform duration-[var(--duration-fast)] ease-[var(--ease-smooth-out)] group-hover:-translate-y-1 group-hover:scale-105">
                        <TeamLogo
                          team={{
                            name: c.name,
                            short_name: c.short,
                            logo_color: primaryTeam?.logo_color || "#364DA0",
                            logo_url: resolvedLogo,
                          }}
                          size={64}
                        />
                      </div>
                    </div>

                    <div className="px-2 pb-1.5 pt-3 text-center">
                      <div className="truncate font-display text-sm font-black uppercase tracking-tight text-foreground">
                        {c.name}
                      </div>
                      <div className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                        {resolvedCity}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ETAPA 5: DASHBOARD DE COMPETICIÓN — Tabla de Posiciones + Últimos Partidos */}
        <section className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr] items-stretch">
          <div className="flex flex-col space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-3">
              <h2 className="font-editorial-title text-2xl text-foreground sm:text-3xl">
                Tabla de Posiciones{" "}
                <span className="text-lg text-primary sm:text-xl">
                  · {categoryLabel(selectedCategory)}
                </span>
              </h2>
              <Link
                to="/posiciones"
                className="press-scale inline-flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
              >
                <span>Ver completa</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <StandingsTable rows={standings} teams={teams} />
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-3">
              <h2 className="font-editorial-title text-2xl text-foreground sm:text-3xl">
                Match Center{" "}
                <span className="text-lg text-primary sm:text-xl">
                  · {categoryLabel(selectedCategory)}
                </span>
              </h2>
              <Link
                to="/calendario"
                className="press-scale inline-flex shrink-0 items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
              >
                <span>Calendario</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className={`flex flex-col flex-1 min-h-0 ${isU13 ? "gap-3" : "gap-4"}`}>
              {recentMatches.length > 0 ? (
                recentMatches.map((m) => (
                  <MatchCard key={m.id} match={m} hideVenue={true} />
                ))
              ) : (
                <Card className="shadow-layered flex flex-1 items-center justify-center rounded-3xl bg-card/90 p-6 text-center text-sm text-muted-foreground">
                  Aún no hay resultados finalizados en{" "}
                  {categoryLabel(selectedCategory)}.
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* ETAPA 4 · 3: SEGUNDA SECCIÓN DE PATROCINADORES (Grid 2x2) */}
        <SponsorsSection sponsors={featuredSponsors} />

        {/* ETAPA 6 · 1: SECCIÓN 'EXPLORA LA LIGA' (Grid Editorial estilo Magazine Deportivo con Parallax GSAP) */}
        <section ref={magazineSectionRef} className="space-y-6">
          <div className="flex flex-col justify-between gap-2 border-b border-border/60 pb-4 sm:flex-row sm:items-end">
            <h2 className="font-editorial-title text-2xl text-slate-900 dark:text-white sm:text-3xl">
              Explora la Liga
            </h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              Cobertura, programación, planteles y reglamento oficial
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* NOTICIA / PORTADA PRINCIPAL GRANDE (7 columnas en desktop) */}
            <Link
              to={EDITORIAL_FEATURES.lead.to}
              className="magazine-card shadow-layered-interactive group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl border border-slate-200/80 p-6 dark:border-transparent sm:min-h-[480px] sm:p-10 lg:col-span-7"
            >
              {/* Capa de imagen con Parallax en eje Y acelerado por GPU (GSAP) y Zoom en Hover (CSS) */}
              <div
                aria-hidden
                className="magazine-parallax-layer gsap-gpu pointer-events-none absolute -inset-y-10 inset-x-0 -z-20"
              >
                <img
                  src={EDITORIAL_FEATURES.lead.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth-out)] group-hover:scale-105"
                />
              </div>

              {/* Overlay adaptativo (claro en Light Mode, oscuro en Dark Mode) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 bg-white/85 bg-gradient-to-t from-white/95 via-white/85 to-white/45 dark:bg-black/60 dark:from-black/95 dark:via-black/65 dark:to-black/25"
              />

              <div className="relative z-10 flex flex-col items-start">
                <h3 className="font-editorial-title text-3xl text-slate-900 dark:text-white sm:text-5xl">
                  {EDITORIAL_FEATURES.lead.title}
                </h3>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-gray-300 sm:text-base">
                  {EDITORIAL_FEATURES.lead.desc}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-display text-xs font-black uppercase tracking-wider text-primary-foreground shadow-sm transition-transform duration-[var(--duration-quick)] group-hover:translate-x-0.5">
                    <CalendarDays className="h-4 w-4" />
                    <span>{EDITORIAL_FEATURES.lead.cta}</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                  <span className="rounded-lg bg-slate-900/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-800 backdrop-blur-sm dark:bg-white/10 dark:text-white/90">
                    {EDITORIAL_FEATURES.lead.tag}
                  </span>
                </div>
              </div>
            </Link>

            {/* COLUMNA DERECHA: 3 TARJETAS EDITORIALES APILADAS (5 columnas en desktop) */}
            <div className="flex flex-col gap-5 lg:col-span-5">
              {EDITORIAL_FEATURES.side.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="magazine-card shadow-layered-interactive group relative flex min-h-[148px] flex-1 flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 p-6 dark:border-transparent"
                  >
                    {/* Imagen de fondo con Parallax GSAP acelerado por GPU + Hover Scale */}
                    <div
                      aria-hidden
                      className="magazine-parallax-layer gsap-gpu pointer-events-none absolute -inset-y-8 inset-x-0 -z-20"
                    >
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover opacity-55 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-smooth-out)] group-hover:scale-105"
                      />
                    </div>

                    {/* Overlay adaptativo (claro en Light Mode, oscuro en Dark Mode) */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 bg-white/88 bg-gradient-to-r from-white/95 via-white/88 to-white/60 dark:bg-black/65 dark:from-black/90 dark:via-black/75 dark:to-black/45"
                    />

                    <div className="relative z-10 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="font-editorial-title text-lg text-slate-900 dark:text-white sm:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-gray-300 sm:text-sm">
                          {item.desc}
                        </p>
                      </div>

                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900/10 text-slate-900 backdrop-blur-sm transition-[background-color,color,transform] duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-primary group-hover:text-primary-foreground dark:bg-white/10 dark:text-white">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>

                    <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.tag}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SOBRE EL TORNEO Y PREMIACIÓN */}
        <section className="shadow-layered rounded-3xl bg-card p-6 md:p-10">
          <h2 className="font-editorial-title mb-3 text-2xl text-foreground md:text-3xl">
            Desarrollo integral, orden y competencia real.
          </h2>
          <p className="max-w-4xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Nuestra liga formativa prioriza el aprendizaje. Los partidos se
            disputan de manera semi-cronometrada con cuerpo arbitral oficial
            para fomentar la imparcialidad. Para las categorías U15 y U18 se
            utiliza el sistema 3x1 (un jugador no puede jugar más de 3
            cuartos), asegurando la rotación. Contamos con registro fotográfico
            para los MVP y localías rotativas en distintos recintos deportivos
            de la zona.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5">
              <Camera className="h-3.5 w-3.5 text-primary" /> Fotografía Oficial MVP
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5">
              <Ticket className="h-3.5 w-3.5 text-primary" /> Recaudación para el Local
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5">
              <Star className="h-3.5 w-3.5 text-primary" /> Sponsor Clínica Obident
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border/60 pt-8 md:grid-cols-3">
            {PREMIOS.map((p) => (
              <div
                key={p.title}
                className="flex items-start gap-4 rounded-2xl bg-secondary/50 p-5"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-sm font-black uppercase tracking-tight text-foreground">
                    {p.title}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ETAPA 6 · 2: SUSCRIPCIÓN Y ALERTAS (CTA Impactante con marca de agua) */}
        <SubscribeAlerts />

        {/* ETAPA 6 · 3: FOOTER EDITORIAL COMPLETO Y MODERNO */}
        <footer className="mt-16 rounded-3xl border border-border/60 bg-card/85 px-6 py-12 backdrop-blur-md sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 gap-10 pb-10 lg:grid-cols-12">
            {/* Columna 1: Identidad y Logos Oficiales (5 cols) */}
            <div className="flex flex-col items-start lg:col-span-5">
              <div className="flex items-center gap-3.5">
                <div className="shadow-border flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-background/70 p-1">
                  <img
                    src={footerLogoUrl}
                    alt="Logo LIFOBA"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div>
                  <div className="font-editorial-title text-xl text-foreground">
                    LIFO<span className="text-primary">BA</span>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Liga Formativa de Básquetbol · Clausura 2026
                  </div>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Plataforma oficial de seguimiento competitivo, tablas de
                posiciones, programación de sedes y planteles para las categorías
                Sub 13, Sub 15 y Sub 18 Varones.
              </p>

              {/* Logos Oficiales en Footer */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="shadow-border flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2">
                  <img
                    src="/obident_mejorado.png"
                    alt="Clínica Dental Obident"
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-auto object-contain"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/90">
                    Main Sponsor
                  </span>
                </div>
                <div className="shadow-border flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2">
                  <img
                    src="/logo-glamen.jpg"
                    alt="Cabañas Glamen"
                    loading="lazy"
                    decoding="async"
                    className="h-7 w-auto rounded object-contain"
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/90">
                    Partner Oficial
                  </span>
                </div>
              </div>
            </div>

            {/* Columna 2: Accesos Rápidos (3 cols) */}
            <div className="lg:col-span-3">
              <h3 className="font-editorial-subtitle text-xs tracking-[0.15em] text-foreground">
                Navegación Rápida
              </h3>
              <ul className="mt-4 space-y-2.5 text-xs font-medium text-muted-foreground sm:text-sm">
                <li>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-quick)] hover:text-primary"
                  >
                    Inicio · Portada Oficial
                  </Link>
                </li>
                <li>
                  <Link
                    to="/posiciones"
                    className="inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-quick)] hover:text-primary"
                  >
                    Tabla de Posiciones y Resultados
                  </Link>
                </li>
                <li>
                  <Link
                    to="/calendario"
                    className="inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-quick)] hover:text-primary"
                  >
                    Calendario y Mapa de Sedes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/equipos"
                    className="inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-quick)] hover:text-primary"
                  >
                    Clubes y Planteles Oficiales
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reglamento"
                    className="inline-flex items-center gap-1.5 transition-colors duration-[var(--duration-quick)] hover:text-primary"
                  >
                    Reglamento y Sistema 3x1
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-muted-foreground/75 transition-colors duration-[var(--duration-quick)] hover:text-primary"
                  >
                    Acceso Mesa / Administración
                  </Link>
                </li>
              </ul>
            </div>

            {/* Columna 3: Categorías y Contacto Oficial (4 cols) */}
            <div className="flex flex-col justify-between gap-6 lg:col-span-4">
              <div>
                <h3 className="font-editorial-subtitle text-xs tracking-[0.15em] text-foreground">
                  Categorías y Sedes
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedCategory(c.value)}
                      className={`press-scale rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        selectedCategory === c.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>Melipilla · San Antonio · Curacaví · Padre Hurtado</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  href="https://www.instagram.com/lifoba_/"
                  target="_blank"
                  rel="noreferrer"
                  className="press-scale shadow-border flex items-center gap-3 rounded-xl bg-background/60 p-3 transition-colors hover:bg-secondary"
                >
                  <Instagram className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-tight text-foreground">
                      Instagram
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      @lifoba.chile
                    </p>
                  </div>
                </a>
                <a
                  href="https://api.whatsapp.com/send?phone=56974203763"
                  target="_blank"
                  rel="noreferrer"
                  className="press-scale shadow-border flex items-center gap-3 rounded-xl bg-background/60 p-3 transition-colors hover:bg-secondary"
                >
                  <MessageCircle className="h-5 w-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <div className="text-xs font-black uppercase tracking-tight text-foreground">
                      WhatsApp
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      +569 7420 3763
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Barra Inferior: Copyright y Créditos del Desarrollador */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
            <p className="text-[11px] tracking-wide text-muted-foreground/80">
              © 2026 LIFOBA · Liga Formativa de Básquetbol. Todos los derechos
              reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px]">
              <span>Plataforma diseñada y desarrollada por</span>
              <a
                href="https://github.com/MatiasPajarito"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                Matías Pajarito
              </a>
              <span className="text-muted-foreground/50">·</span>
              <span className="uppercase tracking-widest text-muted-foreground/70">
                Ingeniería Civil en Informática
              </span>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  );
}
