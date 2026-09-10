import type { Match, StandingRow, Team } from "./types";

/**
 * Asigna los puntos de la tabla de posiciones según reglas FIBA:
 * - Partido Ganado: 2 puntos de torneo
 * - Partido Perdido: 1 punto de torneo
 */
export function computePointsForMatch(homePoints: number, awayPoints: number) {
  if (homePoints > awayPoints) return { home: 2, away: 1 };
  if (awayPoints > homePoints) return { home: 1, away: 2 };
  return { home: 0, away: 0 }; // El empate no está permitido en el básquetbol
}

/**
 * Genera y ordena la tabla de posiciones de la Fase Regular.
 * Criterios de desempate Básquetbol:
 * 1. Puntos del torneo (2 por victoria, 1 por derrota)
 * 2. Diferencia de puntos (Puntos a favor - Puntos en contra)
 * 3. Puntos a favor
 */
export function computeStandings(teams: Team[], matches: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  
  // Inicializamos la tabla en cero para todos los equipos
  for (const t of teams) {
    rows.set(t.id, {
      team_id: t.id,
      position: 0,
      pj: 0, // Partidos Jugados
      pg: 0, // Partidos Ganados
      pp: 0, // Partidos Perdidos
      pts: 0, // Puntos de Torneo
      pf: 0, // Puntos a Favor
      pc: 0, // Puntos en Contra
      dif: 0, // Diferencia de Puntos
    });
  }

  for (const m of matches) {
    // Solo contamos los partidos finalizados de la fase regular
    if (m.status !== "finished" || m.phase !== "regular") continue;
    const home = rows.get(m.home_team_id);
    const away = rows.get(m.away_team_id);
    if (!home || !away) continue;

    const { home_points, away_points } = m.score;
    const pts = computePointsForMatch(home_points, away_points);

    // Sumar Partidos Jugados
    home.pj++;
    away.pj++;
    
    // Sumar Puntos a Favor y en Contra
    home.pf += home_points;
    home.pc += away_points;
    away.pf += away_points;
    away.pc += home_points;

    // Sumar Victorias y Derrotas
    if (home_points > away_points) {
      home.pg++;
      away.pp++;
    } else if (away_points > home_points) {
      away.pg++;
      home.pp++;
    }
    
    // Sumar Puntos de Clasificación (Torneo)
    home.pts += pts.home;
    away.pts += pts.away;
  }

  // Calculamos la Diferencia de Puntos final para cada equipo
  const list = Array.from(rows.values()).map((r) => ({
    ...r,
    dif: r.pf - r.pc, 
  }));

  // Ordenamiento oficial
  list.sort((a, b) => {
    // 1. Mayor cantidad de puntos de clasificación
    if (b.pts !== a.pts) return b.pts - a.pts;
    // 2. Mayor Diferencia de puntos
    if (b.dif !== a.dif) return b.dif - a.dif;
    // 3. Mayor cantidad de puntos a favor
    return b.pf - a.pf;
  });

  // Asignamos el número de posición final
  list.forEach((r, i) => (r.position = i + 1));
  return list;
}

// ------------------------------------------------------------------
// FUNCIONES LEGACY (Dejamos estas funciones vacías para que los 
// imports antiguos en otros archivos no rompan tu compilación en Vite)
// ------------------------------------------------------------------
export function isDecidingSetIndex() { return false; }
export function validateScoreSheet() { return { valid: true, errors: {} }; }