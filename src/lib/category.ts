import type { Match, Team } from "./types";

// Definimos las 3 nuevas categorías de LIFOBA
export type Category = "u13_varones" | "u15_varones" | "u18_varones";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "u13_varones", label: "Sub 13 Varones" },
  { value: "u15_varones", label: "Sub 15 Varones" },
  { value: "u18_varones", label: "Sub 18 Varones" },
];

export const CATEGORY_LABELS: Record<Category, string> = {
  u13_varones: "Sub 13 Varones",
  u15_varones: "Sub 15 Varones",
  u18_varones: "Sub 18 Varones",
};

export function categoryLabel(cat: Category) {
  return CATEGORY_LABELS[cat] || "Sub 18 Varones";
}

/** Categoría de un club (por defecto u18_varones para evitar errores). */
export function teamCategory(team: Pick<Team, "category"> | undefined): Category {
  if (team?.category === "u13_varones") return "u13_varones";
  if (team?.category === "u15_varones") return "u15_varones";
  return "u18_varones"; // Categoría por defecto
}

/** Categoría de un partido: La propia si existe, si no la del club local o visita. */
export function matchCategory(match: Match, teams?: Team[]): Category {
  if (
    match.category === "u13_varones" || 
    match.category === "u15_varones" || 
    match.category === "u18_varones"
  ) {
    return match.category as Category;
  }
  
  if (!teams) return "u18_varones";
  const refTeam =
    (match.home_team_id
      ? teams.find((t) => t.id === match.home_team_id)
      : undefined) ||
    (match.away_team_id
      ? teams.find((t) => t.id === match.away_team_id)
      : undefined);
  return teamCategory(refTeam);
}

/** Logo oficial por defecto de LIFOBA según la categoría del encuentro. */
export function getLifobaDefaultLogo(category?: Category | string | null): string {
  if (category === "u13_varones") return "/pelota-u13.png";
  if (category === "u15_varones") return "/pelota-u15.png";
  return "/pelota-u18.png";
}

/** Nombre descriptivo para equipos TBD (nulos) según la fase del partido. */
export function getPlaceholderTeamName(phase?: Match["phase"] | string | null): string {
  if (phase === "final") return "Ganador Semifinal";
  if (phase === "tercer_puesto") return "Perdedor Semifinal";
  return "Por definir";
}

/** Objeto Team de respaldo seguro cuando home_team_id o away_team_id es null. */
export function getPlaceholderTeam(
  phase?: Match["phase"] | string | null,
  category?: Category | string | null,
  side: "home" | "away" = "home",
): Team {
  const placeholderName = getPlaceholderTeamName(phase);
  return {
    id: `tbd_${side}`,
    name: placeholderName,
    short_name: placeholderName,
    logo_color: "#64748B",
    logo_url: getLifobaDefaultLogo(category),
    city: "LIFOBA",
    coach: "",
  };
}