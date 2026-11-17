import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import { sponsors as defaultSponsors } from "./mock-data";
import { matchCategory, type Category } from "./category";
import type { Match, Team, Player, Venue, MatchScore, Sponsor } from "./types";

interface StoreCtx {
  matches: Match[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  addMatch: (m: Omit<Match, "id" | "score" | "status">) => Promise<void>;
  saveResult: (id: string, homePoints: number, awayPoints: number, mvpId?: string | null) => Promise<void>;
  resetData: () => Promise<void>;
  teams: Team[];
  players: Player[];
  venues: Venue[];
  sponsors: Sponsor[];
  deleteMatch: (matchId: string) => Promise<void>;
  updateMatchDetails: (matchId: string, details: Partial<Match>) => Promise<void>;
  updateTeam: (teamId: string, updates: Partial<Team>) => Promise<void>;
  saveRoster: (teamId: string, rosterData: any[]) => Promise<void>;
}

const Ctx = createContext<StoreCtx | null>(null);


export function StoreProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>(defaultSponsors);
  const [selectedCategory, setSelectedCategory] = useState<Category>("u18_varones");

  // Aplica la paleta de la rama activa a todo el documento
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-category", selectedCategory);
  }, [selectedCategory]);

  // 1. Cargar datos iniciales desde Supabase
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [tRes, pRes, vRes, mRes, sRes] = await Promise.all([
          supabase.from("teams").select("*"),
          supabase.from("players").select("*"),
          supabase.from("venues").select("*"),
          supabase.from("matches").select("*"),
          supabase.from("sponsors").select("*"),
        ]);

        if (tRes.error) console.error("Error teams:", tRes.error);
        if (pRes.error) console.error("Error players:", pRes.error);
        if (vRes.error) console.error("Error venues:", vRes.error);
        if (mRes.error) console.error("Error matches:", mRes.error);

        if (tRes.data) setTeams(tRes.data);
        if (pRes.data) setPlayers(pRes.data);
        if (vRes.data) setVenues(vRes.data);
        if (mRes.data) setMatches(mRes.data);
        if (sRes.data && sRes.data.length > 0) {
          const merged = [...(sRes.data as Sponsor[])];
          for (const item of defaultSponsors) {
            if (
              !merged.some(
                (existing) =>
                  existing.name.toLowerCase() === item.name.toLowerCase(),
              )
            ) {
              merged.push(item);
            }
          }
          setSponsors(merged);
        }
      } catch (err) {
        console.error("Error conectando con Supabase:", err);
      }
    }

    loadInitialData();

    // 2. Suscripción en Tiempo Real para partidos
    const channel = supabase
      .channel("public:matches")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMatches((prev) => [...prev, payload.new as Match]);
          } else if (payload.eventType === "UPDATE") {
            setMatches((prev) =>
              prev.map((m) => (m.id === payload.new.id ? (payload.new as Match) : m))
            );
          } else if (payload.eventType === "DELETE") {
            setMatches((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addMatch = useCallback(async (m: Omit<Match, "id" | "score" | "status">) => {
    const newMatchPayload = {
      ...m,
      status: "scheduled",
      score: { home_points: 0, away_points: 0, quarters: [] },
    };

    let { data, error } = await supabase
      .from("matches")
      .insert([newMatchPayload])
      .select()
      .single();

    if (error && /category/i.test(error.message)) {
      const { category: _omit, ...rest } = newMatchPayload as Record<string, unknown>;
      ({ data, error } = await supabase.from("matches").insert([rest]).select().single());
    }

    if (error) {
      console.error("Error al agregar partido en Supabase:", error);
      throw error;
    }
    if (data) {
      setMatches((prev) => [...prev, data]);
    }
  }, []);

  const saveResult = useCallback(async (id: string, homePoints: number, awayPoints: number, mvpId: string | null = null) => {
    // Resultado global final (sin detalle por cuartos). Mantenemos "quarters: []"
    // para no romper la columna JSONB existente en la base de datos.
    const updatedScore: MatchScore = {
      home_points: homePoints,
      away_points: awayPoints,
      quarters: [],
    };

    const { data: updatedRow, error } = await supabase
      .from("matches")
      .update({
        status: "finished",
        score: updatedScore,
        mvp_player_id: mvpId,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error al guardar resultado en Supabase:", error);
      // Propagamos el error para que la UI pueda mostrar el motivo real al usuario.
      throw error;
    }

    const currentMatch =
      (updatedRow as Match | null) || matches.find((m) => m.id === id);

    setMatches((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "finished", score: updatedScore, mvp_player_id: mvpId }
          : m
      )
    );

    // Auto-progresión de Playoffs: si el partido finalizado es de fase 'semifinal',
    // envía al ganador a 'final' y al perdedor a 'tercer_puesto' en el primer cupo libre.
    if (
      currentMatch &&
      currentMatch.phase === "semifinal" &&
      homePoints !== awayPoints &&
      currentMatch.home_team_id &&
      currentMatch.away_team_id
    ) {
      try {
        const winnerTeamId =
          homePoints > awayPoints
            ? currentMatch.home_team_id
            : currentMatch.away_team_id;
        const loserTeamId =
          homePoints > awayPoints
            ? currentMatch.away_team_id
            : currentMatch.home_team_id;
        const semiCat = matchCategory(currentMatch, teams);

        const { data: nextPhaseRows, error: nextErr } = await supabase
          .from("matches")
          .select("*")
          .in("phase", ["final", "tercer_puesto"]);

        if (nextErr) {
          console.error("Error consultando partidos de fase final:", nextErr);
          return;
        }

        const catNextMatches = ((nextPhaseRows as Match[]) || []).filter(
          (m) => matchCategory(m, teams) === semiCat,
        );

        const resolveSlotUpdate = (
          targetMatch: Match | undefined,
          teamToAssign: string,
          otherSemiTeam: string,
        ): Partial<Match> | null => {
          if (!targetMatch) return null;
          // Si ya está asignado en local o visita, no duplicar
          if (
            targetMatch.home_team_id === teamToAssign ||
            targetMatch.away_team_id === teamToAssign
          ) {
            return null;
          }
          // Si se corrigió el resultado de esta semifinal, reemplazar al otro equipo de la misma llave
          if (targetMatch.home_team_id === otherSemiTeam) {
            return { home_team_id: teamToAssign };
          }
          if (targetMatch.away_team_id === otherSemiTeam) {
            return { away_team_id: teamToAssign };
          }
          // Insertar en el primer espacio vacío (home_team_id o away_team_id)
          if (!targetMatch.home_team_id) {
            return { home_team_id: teamToAssign };
          }
          if (!targetMatch.away_team_id) {
            return { away_team_id: teamToAssign };
          }
          return null;
        };

        const finalMatch = catNextMatches.find((m) => m.phase === "final");
        const thirdPlaceMatch = catNextMatches.find(
          (m) => m.phase === "tercer_puesto",
        );

        const finalPatch = resolveSlotUpdate(
          finalMatch,
          winnerTeamId,
          loserTeamId,
        );
        if (finalMatch && finalPatch) {
          const { error: finalUpdateErr } = await supabase
            .from("matches")
            .update(finalPatch)
            .eq("id", finalMatch.id);
          if (!finalUpdateErr) {
            setMatches((prev) =>
              prev.map((m) =>
                m.id === finalMatch.id ? { ...m, ...finalPatch } : m,
              ),
            );
          } else {
            console.error(
              "Error asignando ganador a la Gran Final:",
              finalUpdateErr,
            );
          }
        }

        const thirdPatch = resolveSlotUpdate(
          thirdPlaceMatch,
          loserTeamId,
          winnerTeamId,
        );
        if (thirdPlaceMatch && thirdPatch) {
          const { error: thirdUpdateErr } = await supabase
            .from("matches")
            .update(thirdPatch)
            .eq("id", thirdPlaceMatch.id);
          if (!thirdUpdateErr) {
            setMatches((prev) =>
              prev.map((m) =>
                m.id === thirdPlaceMatch.id ? { ...m, ...thirdPatch } : m,
              ),
            );
          } else {
            console.error(
              "Error asignando perdedor al Tercer Puesto:",
              thirdUpdateErr,
            );
          }
        }
      } catch (autoErr) {
        console.error(
          "Error en la auto-progresión de llaves de Playoffs:",
          autoErr,
        );
      }
    }
  }, [matches, teams]);

  const resetData = useCallback(async () => {
    try {
      await supabase.from("matches").delete().neq("id", "0");
      setMatches([]);
    } catch (err) {
      console.error("Error al resetear datos:", err);
    }
  }, []);

  const deleteMatch = useCallback(async (matchId: string) => {
    const { error } = await supabase.from("matches").delete().eq("id", matchId);
    if (error) {
      console.error("Error al eliminar partido en Supabase:", error);
    } else {
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
    }
  }, []);

  const updateMatchDetails = useCallback(async (matchId: string, details: Partial<Match>) => {
    const { error } = await supabase
      .from("matches")
      .update(details)
      .eq("id", matchId);

    if (error) {
      console.error("Error al actualizar detalles del partido:", error);
      // Propagamos el error para que la UI pueda mostrar el motivo real al usuario.
      throw error;
    }
    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, ...details } : m))
    );
  }, []);

  const updateTeam = useCallback(async (teamId: string, updates: Partial<Team>) => {
    const { error } = await supabase
      .from("teams")
      .update(updates)
      .eq("id", teamId);

    if (error) {
      console.error("Error al actualizar detalles del equipo:", error);
      throw error;
    }
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, ...updates } : t))
    );
  }, []);

  const saveRoster = useCallback(async (teamId: string, rosterData: any[]) => {
    // Filtramos solo las filas que tengan al menos el nombre escrito
    const validPlayers = rosterData.filter((p) => p.name?.trim() !== "");
    
    // AQUÍ ESTÁ EL CAMBIO PRINCIPAL: Cambiamos p.position por p.date
    const payload = validPlayers.map((p) => ({
      id: `${teamId}_${p.number}`, // Generamos un ID único: Equipo + Número
      team_id: teamId,
      number: p.number,
      name: p.name,
      rut: p.rut || null, 
      date: p.date || null, // <--- Este campo ahora se conecta correctamente a Supabase
      is_captain: false 
    }));

    // 1. Borramos la nómina anterior del equipo
    await supabase.from("players").delete().eq("team_id", teamId);

    // 2. Insertamos la nueva nómina oficial
    if (payload.length > 0) {
      const { data, error } = await supabase.from("players").insert(payload).select();
      if (error) {
        console.error("Error guardando nómina:", error);
        throw error;
      }
      setPlayers((prev) => [...prev.filter((p) => p.team_id !== teamId), ...data]);
    } else {
      setPlayers((prev) => prev.filter((p) => p.team_id !== teamId));
    }
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      matches,
      selectedCategory,
      setSelectedCategory,
      addMatch,
      saveResult,
      resetData,
      deleteMatch,
      updateMatchDetails,
      updateTeam,
      saveRoster,
      teams,
      players,
      venues,
      sponsors,
    }),
    [matches, selectedCategory, addMatch, saveResult, resetData, deleteMatch, updateMatchDetails, updateTeam, saveRoster, teams, players, venues, sponsors]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used within StoreProvider");
  return v;
}

export function useTeam(id: string | null | undefined) {
  const { teams } = useStore();
  if (!id) return undefined;
  return teams.find((t) => t.id === id);
}

export function useVenue(id: string | null | undefined) {
  const { venues } = useStore();
  if (!id) return undefined;
  return venues.find((v) => v.id === id);
}
