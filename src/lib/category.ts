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

/** Categoría de un partido: La propia si existe, si no la del club local. */
export function matchCategory(match: Match, teams?: Team[]): Category {
  if (
    match.category === "u13_varones" || 
    match.category === "u15_varones" || 
    match.category === "u18_varones"
  ) {
    return match.category as Category;
  }
  
  if (!teams) return "u18_varones";
  return teamCategory(teams.find((t) => t.id === match.home_team_id));
}