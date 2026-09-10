export type PlayerPosition =
  | "Base"
  | "Escolta"
  | "Alero"
  | "Ala-Pívot"
  | "Pívot";

export interface Sponsor {
  id: string;
  name: string;
  /** Logo del auspiciador. Si no está, se muestra el nombre en texto. */
  logo_url?: string;
  website_url?: string;
  tier?: "oro" | "plata" | "bronce";
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  image_url?: string;
}

export interface Team {
  id: string;
  name: string;
  short_name: string;
  city: string;
  logo_color: string;
  coach: string;
  /** Logo real del club. Si no está, se muestra el círculo con sus iniciales. */
  logo_url?: string;
  /** Rama del torneo. Si no está definida se asume u18_varones. */
  category?: "u13_varones" | "u15_varones" | "u18_varones";
}

export interface Player {
  id: string;
  team_id: string;
  number: number;
  name: string;
  position: PlayerPosition;
  is_captain: boolean;
  rut?: string;
}

// NUEVO: Pasamos de Sets a Cuartos
export interface QuarterDetail {
  quarter: number;
  home: number;
  away: number;
}

export type MatchStatus = "scheduled" | "live" | "finished";
export type Phase = "regular" | "playoffs";

// NUEVO: Estructura del score para básquetbol
export interface MatchScore {
  home_points: number;
  away_points: number;
  quarters: QuarterDetail[];
}

export interface Match {
  id: string;
  matchday: number;
  phase: Phase;
  datetime: string;
  status: MatchStatus;
  home_team_id: string;
  away_team_id: string;
  venue_id: string;
  /** Rama del torneo. Si no está definida se deduce del club local. */
  category?: "u13_varones" | "u15_varones" | "u18_varones";
  score: MatchScore & {
    mvp_player_id?: string | null;
  };
}

// NUEVO: Tabla adaptada a básquet (sin ratios de sets, sumando Diferencia de Puntos)
export interface StandingRow {
  team_id: string;
  position: number;
  pj: number;
  pg: number;
  pp: number;
  pts: number;
  pf: number; // Puntos a favor
  pc: number; // Puntos en contra
  dif: number; // Diferencia de puntos (pf - pc)
}