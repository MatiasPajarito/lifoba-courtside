import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, ClipboardList, Home, Trophy, Users } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { CATEGORIES } from "@/lib/category";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/posiciones", label: "Posiciones", icon: Trophy },
  { to: "/calendario", label: "Calendario", icon: CalendarDays },
  { to: "/equipos", label: "Equipos", icon: Users },
  { to: "/reglamento", label: "Reglas", icon: ClipboardList },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { selectedCategory, setSelectedCategory } = useStore();

  // Lógica para cambiar la imagen del logo según la categoría activa
  const getLogoUrl = () => {
    switch (selectedCategory) {
      case "u13_varones":
        return "/pelota-u13.png";
      case "u15_varones":
        return "/pelota-u15.png";
      case "u18_varones":
      default:
        return "/pelota-u18.png";
    }
  };

  return (
    <div
      data-category={selectedCategory}
      className="min-h-screen overflow-x-clip bg-background pb-20"
    >
      <header className="sticky top-0 z-30 border-b border-border/70 bg-secondary/90 text-secondary-foreground backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-2.5 px-4 py-3 sm:gap-3 md:px-8">
          <Link
            to="/"
            className="press-scale flex min-w-0 flex-1 items-center gap-2.5 rounded-xl pr-2 transition-opacity duration-[var(--duration-quick)] hover:opacity-90 sm:flex-initial sm:gap-3"
            aria-label="Ir al inicio"
          >
            {/* LOGO CON IMAGEN DINÁMICA PRE-DISEÑADA */}
            <div className="shadow-border flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background/60 p-0.5">
              <img
                src={getLogoUrl()}
                alt="Logo LIFOBA"
                className="h-full w-full rounded-[10px] object-cover transition-opacity duration-[var(--duration-fast)]"
              />
            </div>

            <div className="min-w-0">
              <div className="truncate font-display text-sm font-black uppercase tracking-wider text-foreground">
                LIFOBA
              </div>
              <div className="truncate text-[11px] font-medium text-muted-foreground">
                Liga Formativa de Básquetbol · Clausura 2026
              </div>
            </div>
          </Link>

          <div className="shadow-border ml-auto hidden shrink-0 items-center gap-2 rounded-full bg-background/55 px-3.5 py-1.5 lg:flex">
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Sponsor oficial
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-primary">
              Clínica Dental Obident
            </span>
          </div>

          <div className="ml-auto lg:ml-3">
            <ThemeToggle />
          </div>

          {/* SELECTOR DE CATEGORÍAS REDISEÑADO (Scroll horizontal suave en móvil + relieve 3D sutil) */}
          <div className="w-full max-w-full px-2 sm:ml-auto sm:w-auto sm:px-0 lg:ml-3">
            <div
              role="tablist"
              aria-label="Categoría del torneo"
              className="scrollbar-hide shadow-border flex w-full max-w-full flex-nowrap items-center gap-1.5 overflow-x-auto scroll-smooth rounded-2xl bg-background/75 px-2 py-1.5 backdrop-blur-sm sm:w-auto sm:gap-1 sm:p-1"
            >
              {CATEGORIES.map((c) => {
                const isActive = selectedCategory === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setSelectedCategory(c.value)}
                    className={cn(
                      "press-scale relative inline-flex min-h-9 shrink-0 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-[11px] font-black uppercase tracking-wider transition-[background-color,color,box-shadow,transform] duration-[var(--duration-quick)] ease-[var(--ease-smooth-out)] sm:flex-initial sm:px-3.5",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_1px_0_0_oklch(1_0_0/0.25)_inset,0_6px_14px_-3px_color-mix(in_oklch,var(--primary)_60%,transparent),0_2px_4px_0_oklch(0_0_0/0.45)]"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full transition-[transform,background-color,opacity] duration-[var(--duration-quick)]",
                        isActive
                          ? "scale-100 bg-primary-foreground opacity-100"
                          : "scale-75 bg-muted-foreground/40 opacity-60",
                      )}
                    />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:py-6 md:px-8">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/70 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/85">
        <ul className="mx-auto grid w-full max-w-[1600px] grid-cols-5 px-4 md:px-8">
          {NAV.map((n) => {
            const active =
              n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={cn(
                    "press-scale flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold transition-colors duration-[var(--duration-quick)]",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active ? "stroke-[2.2]" : "stroke-[1.75]")} />
                  <span className="uppercase tracking-wider">{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
