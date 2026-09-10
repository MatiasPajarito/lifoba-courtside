import { Link } from "@tanstack/react-router";
import { BarChart3, CalendarDays, Home, Menu, Trophy, Users } from "lucide-react";
import { useState, type ReactNode } from "react";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/posiciones", label: "Posiciones", icon: Trophy },
  { to: "/partidos", label: "Partidos", icon: CalendarDays },
  { to: "/equipos", label: "Equipos", icon: Users },
  { to: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen surface-court">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-primary font-display text-lg font-black text-primary-foreground">
              L
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg font-black tracking-tight">LIFOBA</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Clausura 2026
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "bg-secondary text-foreground" }}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
            className="ml-auto rounded-md border border-border p-2 text-foreground md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-4 py-2 md:hidden">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: to === "/" }}
                activeProps={{ className: "text-primary" }}
                className="flex items-center gap-3 rounded-md px-2 py-3 text-sm font-semibold text-muted-foreground"
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="border-t border-border/80 bg-background/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-foreground">
            LIFOBA · Liga Formativa de Básquetbol
          </p>
          <p>
            Auspicia <span className="font-semibold text-primary">Clínica Dental Obident</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
