import { createFileRoute } from "@tanstack/react-router";
import { ScoreEditor } from "./admin";
import type { Match } from "@/lib/types";

const fakeMatch: Match = {
  id: "m1",
  matchday: 1,
  phase: "regular",
  datetime: "2026-10-12T18:00:00-03:00",
  status: "scheduled",
  home_team_id: "esp",
  away_team_id: "gob",
  venue_id: "v1",
  category: "u18_varones",
  mvp_player_id: null,
  score: { home_points: 0, away_points: 0, quarters: [] },
};

export const Route = createFileRoute("/mvp-check")({
  ssr: false,
  component: () => <ScoreEditor match={fakeMatch} onClose={() => {}} />,
});
