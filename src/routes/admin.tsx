import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Plus, Save, Trash2, Users } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamLogo } from "@/components/team-logo";
import { useStore } from "@/lib/store";
import type { Match, QuarterDetail } from "@/lib/types";
import { type Category, teamCategory, matchCategory, CATEGORY_LABELS } from "@/lib/category";

export const Route = createFileRoute("/admin")({
  component: Admin,
  head: () => ({
    meta: [{ title: "Backoffice · LIFOBA" }, { name: "robots", content: "noindex" }],
  }),
});

const ADMIN_PASS = "admin";

function Admin() {
  const [ok, setOk] = useState(false);
  const [pass, setPass] = useState("");
  const { selectedCategory } = useStore();

  if (!ok) {
    return (
      <AppShell>
        <div className="mx-auto max-w-sm space-y-4 pt-8">
          <div className="text-center">
            <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-black uppercase tracking-tight">Acceso Administrador</h1>
            <p className="text-xs text-muted-foreground">
              Ingresa la clave de la organización LIFOBA (demo: admin)
            </p>
          </div>
          <Card className="space-y-3 p-4">
            <div>
              <Label htmlFor="pw">Clave</Label>
              <Input
                id="pw"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && setOk(pass === ADMIN_PASS)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (pass === ADMIN_PASS) setOk(true);
                else toast.error("Clave incorrecta");
              }}
            >
              Ingresar
            </Button>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Tabs defaultValue="digitalizar">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">Backoffice</h1>
            <p className="text-xs text-muted-foreground">
              Administrando rama: <strong className="text-primary">{CATEGORY_LABELS[selectedCategory]}</strong>
            </p>
          </div>
          <TabsList>
            <TabsTrigger value="digitalizar">Digitalizar</TabsTrigger>
            <TabsTrigger value="programar">Programar</TabsTrigger>
            <TabsTrigger value="equipos">Clubes</TabsTrigger>
            <TabsTrigger value="jugadores">Planteles</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="digitalizar" className="mt-0">
          <DigitalizarTab />
        </TabsContent>
        <TabsContent value="programar" className="mt-0">
          <ProgramarTab />
        </TabsContent>
        <TabsContent value="equipos" className="mt-0">
          <EquiposTab />
        </TabsContent>
        <TabsContent value="jugadores" className="mt-0">
          <JugadoresTab />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function DigitalizarTab() {
  const { matches, selectedCategory } = useStore();
  const [selected, setSelected] = useState<Match | null>(null);
  const [showFinished, setShowFinished] = useState(false);

  // Filtramos los partidos por la categoría activa en el header
  const categoryMatches = useMemo(
    () => matches.filter((m) => matchCategory(m) === selectedCategory),
    [matches, selectedCategory],
  );

  const pending = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.status !== "finished")
        .sort((a, b) => (a.datetime > b.datetime ? 1 : -1)),
    [categoryMatches],
  );
  const finished = useMemo(
    () =>
      categoryMatches
        .filter((m) => m.status === "finished")
        .sort((a, b) => (a.datetime < b.datetime ? 1 : -1)),
    [categoryMatches],
  );
  const list = showFinished ? finished : pending;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {showFinished
            ? `${finished.length} partidos finalizados (${CATEGORY_LABELS[selectedCategory]}).`
            : `${pending.length} partidos pendientes (${CATEGORY_LABELS[selectedCategory]}).`}
        </p>
        <Button variant="outline" size="sm" onClick={() => setShowFinished((v) => !v)}>
          {showFinished ? "Ver pendientes" : "Editar finalizados"}
        </Button>
      </div>
      <div className="grid gap-2">
        {list.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {showFinished
              ? `No hay partidos finalizados en ${CATEGORY_LABELS[selectedCategory]}.`
              : `No quedan partidos pendientes en ${CATEGORY_LABELS[selectedCategory]}. 🎉`}
          </p>
        )}
        {list.map((m) => (
          <PendingMatchRow key={m.id} match={m} onSelect={() => setSelected(m)} />
        ))}
      </div>
      {selected && <ScoreEditor match={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function PendingMatchRow({ match, onSelect }: { match: Match; onSelect: () => void }) {
  const { teams, deleteMatch } = useStore();
  
  const home = teams.find((t) => t.id === match.home_team_id) || {
    id: "tbd_h",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
  };
  const away = teams.find((t) => t.id === match.away_team_id) || {
    id: "tbd_a",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de eliminar el partido: ${home.short_name} vs ${away.short_name}?`)) {
      deleteMatch(match.id);
      toast.success("Partido eliminado correctamente.");
    }
  };

  return (
    <Card className="flex items-center justify-between gap-3 p-3 hover:bg-muted/50 transition-colors">
      <button onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <TeamLogo team={home as any} size={28} />
        <span className="truncate text-sm font-semibold">{home.short_name}</span>
        <span className="text-muted-foreground">vs</span>
        <TeamLogo team={away as any} size={28} />
        <span className="truncate text-sm font-semibold">{away.short_name}</span>
      </button>

      <div className="shrink-0 flex items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mr-1">
          {match.status === "finished" && (
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-semibold text-primary">
              {match.score.home_points}-{match.score.away_points}
            </span>
          )}
          <span>Fecha {match.matchday}</span>
        </div>
        
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={handleDelete}
          title="Eliminar partido"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function ScoreEditor({ match, onClose }: { match: Match; onClose: () => void }) {
  const { saveResult, teams, deleteMatch, updateMatchDetails, players } = useStore();
  
  const home = teams.find((t) => t.id === match.home_team_id) || {
    id: "tbd_h",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
  };
  const away = teams.find((t) => t.id === match.away_team_id) || {
    id: "tbd_a",
    name: "Por definir",
    short_name: "TBD",
    logo_url: "",
    city: "",
  };

  const availableTeams = useMemo(() => {
    const cat = matchCategory(match);
    return teams.filter((t) => teamCategory(t) === cat);
  }, [teams, match]);

  // BÁSQUETBOL: Inicializamos 4 cuartos por defecto
  const [quarters, setQuarters] = useState<QuarterDetail[]>(
    match.score.quarters && match.score.quarters.length > 0
      ? match.score.quarters
      : Array.from({ length: 4 }, (_, i) => ({ quarter: i + 1, home: 0, away: 0 }))
  );

  const [mvpId, setMvpId] = useState<string>(match.mvp_player_id || "none");

  const matchPlayers = useMemo(() => {
    return players.filter(
      (p) => 
        (p.team_id === match.home_team_id || p.team_id === match.away_team_id) && 
        p.name && 
        p.name.trim() !== ""
    );
  }, [players, match.home_team_id, match.away_team_id]);

  // Sumar puntos totales
  const totals = quarters.reduce(
    (acc, q) => {
      acc.home += q.home || 0;
      acc.away += q.away || 0;
      return acc;
    },
    { home: 0, away: 0 },
  );
  
  // Un partido de básquetbol es válido si tiene al menos 4 cuartos y no termina en empate
  const matchDecided = quarters.length >= 4 && totals.home !== totals.away;

  const updateQuarter = (idx: number, key: "home" | "away", val: number) => {
    setQuarters((prev) => prev.map((q, i) => (i === idx ? { ...q, [key]: Math.max(0, val) } : q)));
  };

  const addQuarter = () => {
    setQuarters((prev) => [...prev, { quarter: prev.length + 1, home: 0, away: 0 }]);
  };
  
  const removeQuarter = () => {
    if (quarters.length > 4) {
      setQuarters((prev) => prev.slice(0, -1));
    }
  };

  return (
    <Card className="sticky bottom-20 z-10 mt-3 space-y-4 border-primary p-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="text-sm font-bold uppercase tracking-wide">
          Ingresar marcador (Por Cuartos)
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cerrar
        </Button>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm pt-1">
        <Select
          value={match.home_team_id}
          onValueChange={(newId) => {
            if (newId === match.away_team_id) return toast.error("Local y visita deben ser distintos");
            updateMatchDetails(match.id, { home_team_id: newId });
            toast.success("Equipo local actualizado");
          }}
        >
          <SelectTrigger className="h-12 border-dashed bg-muted/30">
            <div className="flex items-center gap-2 overflow-hidden">
              <TeamLogo team={home as any} size={24} />
              <span className="truncate font-bold">{home.short_name}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {availableTeams.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-xs font-black text-muted-foreground px-1">VS</div>

        <Select
          value={match.away_team_id}
          onValueChange={(newId) => {
            if (newId === match.home_team_id) return toast.error("Local y visita deben ser distintos");
            updateMatchDetails(match.id, { away_team_id: newId });
            toast.success("Equipo visita actualizado");
          }}
        >
          <SelectTrigger className="h-12 border-dashed bg-muted/30">
            <div className="flex items-center gap-2 overflow-hidden flex-row-reverse w-full justify-end">
              <TeamLogo team={away as any} size={24} />
              <span className="truncate font-bold">{away.short_name}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {availableTeams.map((t) => (
              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 mt-4">
        {quarters.map((q, i) => {
          const isOvertime = i >= 4;
          const label = isOvertime ? `TE${i - 3}` : `${i + 1}C`;
          
          return (
            <div key={i}>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <Input
                  inputMode="numeric"
                  type="number"
                  value={q.home}
                  onChange={(e) => updateQuarter(i, "home", Number(e.target.value))}
                  className="text-center font-mono text-lg"
                />
                <div className="text-xs font-bold uppercase text-muted-foreground w-12 text-center">
                  {label}
                </div>
                <Input
                  inputMode="numeric"
                  type="number"
                  value={q.away}
                  onChange={(e) => updateQuarter(i, "away", Number(e.target.value))}
                  className="text-center font-mono text-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={removeQuarter} disabled={quarters.length <= 4}>
          − Tiempo Extra
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addQuarter}
          disabled={matchDecided}
        >
          <Plus className="mr-1 h-3 w-3" /> Tiempo Extra
        </Button>
      </div>
      
      <div className="rounded-md bg-muted p-3 text-center text-sm">
        Puntos Totales:{" "}
        <span className="font-black text-primary text-lg">
          {totals.home} – {totals.away}
        </span>
      </div>

      {matchDecided && (
        <div className="space-y-1.5 rounded-md border border-primary/20 bg-primary/5 p-3">
          <Label className="text-xs font-bold uppercase text-primary">MVP del Partido</Label>
          <Select onValueChange={setMvpId} value={mvpId}>
            <SelectTrigger className="mt-1 h-9 bg-background">
              <SelectValue placeholder="Seleccionar jugador destacado..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ninguno / Sin definir</SelectItem>
              {matchPlayers.map((p) => {
                const t = teams.find((team) => team.id === p.team_id);
                return (
                  <SelectItem key={p.id} value={p.id}>
                    {p.number} - {p.name} ({t?.short_name || t?.name})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        className="w-full"
        disabled={!matchDecided}
        onClick={() => {
          const finalMvp = mvpId === "none" ? null : mvpId;
          saveResult(match.id, quarters, finalMvp);
          toast.success(
            match.status === "finished"
              ? "Resultado y MVP corregidos."
              : "Resultado y MVP guardados.",
          );
          onClose();
        }}
      >
        <Save className="mr-2 h-4 w-4" />{" "}
        {match.status === "finished" ? "Corregir y recalcular tabla" : "Guardar marcador"}
      </Button>
      {!matchDecided && quarters.length >= 4 && totals.home === totals.away && (
        <p className="text-center text-xs text-destructive">
          El partido está empatado. Agrega un Tiempo Extra (TE) para definir un ganador.
        </p>
      )}

      <div className="flex items-center justify-between border-t border-border/40 pt-3">
        <span className="text-xs text-muted-foreground">¿Programado por error?</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            if (
              window.confirm(
                `¿Estás seguro de eliminar el partido de ${home.short_name} vs ${away.short_name}? Esta acción no se puede deshacer.`,
              )
            ) {
              deleteMatch(match.id);
              toast.success("Partido eliminado correctamente.");
              onClose();
            }
          }}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Eliminar partido
        </Button>
      </div>
    </Card>
  );
}

const scheduleSchema = z
  .object({
    category: z.enum(["u13_varones", "u15_varones", "u18_varones"]),
    matchday: z.coerce.number().int().min(1),
    datetime: z.string().min(1, "Requerido"),
    home_team_id: z.string().min(1, "Selecciona local"),
    away_team_id: z.string().min(1, "Selecciona visita"),
    venue_id: z.string().min(1, "Selecciona sede"),
  })
  .refine((d) => d.home_team_id !== d.away_team_id, {
    message: "Local y visita deben ser distintos",
    path: ["away_team_id"],
  });
type ScheduleForm = z.infer<typeof scheduleSchema>;

function ProgramarTab() {
  const { teams, venues, addMatch, selectedCategory } = useStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ScheduleForm>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { matchday: 1, category: selectedCategory as any },
  });

  const formCategory = watch("category") || selectedCategory;

  useEffect(() => {
    setValue("category", selectedCategory as any);
    setValue("home_team_id", "");
    setValue("away_team_id", "");
  }, [selectedCategory, setValue]);

  const availableTeams = useMemo(
    () => teams.filter((t) => teamCategory(t) === formCategory),
    [teams, formCategory],
  );

  const onSubmit = (data: ScheduleForm) => {
    addMatch({
      category: data.category as Category,
      matchday: data.matchday,
      phase: "regular",
      datetime: new Date(data.datetime).toISOString(),
      home_team_id: data.home_team_id,
      away_team_id: data.away_team_id,
      venue_id: data.venue_id,
    });
    toast.success(`Partido programado en ${CATEGORY_LABELS[data.category as Category]}`);
    reset({ matchday: data.matchday, category: data.category });
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label>Rama / Categoría</Label>
            <Select
              value={watch("category")}
              onValueChange={(v: Category) => {
                setValue("category", v, { shouldValidate: true });
                setValue("home_team_id", "");
                setValue("away_team_id", "");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="u13_varones">Sub 13 Varones</SelectItem>
                <SelectItem value="u15_varones">Sub 15 Varones</SelectItem>
                <SelectItem value="u18_varones">Sub 18 Varones</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Fecha (jornada)</Label>
            <Input type="number" min={1} max={7} {...register("matchday")} />
          </div>

          <div>
            <Label>Fecha y hora</Label>
            <Input type="datetime-local" {...register("datetime")} />
            {errors.datetime && (
              <p className="text-xs text-destructive">{errors.datetime.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Local ({CATEGORY_LABELS[formCategory as Category]})</Label>
            <Select
              value={watch("home_team_id")}
              onValueChange={(v) => setValue("home_team_id", v, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Equipo local" />
              </SelectTrigger>
              <SelectContent>
                {availableTeams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.home_team_id && (
              <p className="text-xs text-destructive">{errors.home_team_id.message}</p>
            )}
          </div>

          <div>
            <Label>Visita ({CATEGORY_LABELS[formCategory as Category]})</Label>
            <Select
              value={watch("away_team_id")}
              onValueChange={(v) => setValue("away_team_id", v, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Equipo visita" />
              </SelectTrigger>
              <SelectContent>
                {availableTeams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.away_team_id && (
              <p className="text-xs text-destructive">{errors.away_team_id.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label>Sede</Label>
          <Select
            value={watch("venue_id")}
            onValueChange={(v) => setValue("venue_id", v, { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Recinto" />
            </SelectTrigger>
            <SelectContent>
              {venues.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} · {v.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.venue_id && (
            <p className="text-xs text-destructive">{errors.venue_id.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Programar partido
        </Button>
      </form>
    </Card>
  );
}

function EquiposTab() {
  const { teams, updateTeam, selectedCategory } = useStore();
  
  // Equipos filtrados por la categoría activa en el header
  const categoryTeams = useMemo(
    () => teams.filter((t) => teamCategory(t) === selectedCategory),
    [teams, selectedCategory],
  );

  const [selectedId, setSelectedId] = useState<string>(categoryTeams[0]?.id || "");
  const selectedTeam = teams.find((t) => t.id === selectedId);

  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [city, setCity] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [category, setCategory] = useState<Category>("u18_varones");

  useEffect(() => {
    if (categoryTeams.length > 0 && !categoryTeams.some((t) => t.id === selectedId)) {
      setSelectedId(categoryTeams[0].id);
    }
  }, [categoryTeams, selectedId]);

  useEffect(() => {
    if (selectedTeam) {
      setName(selectedTeam.name || "");
      setShortName(selectedTeam.short_name || "");
      setCity(selectedTeam.city || "");
      setLogoUrl(selectedTeam.logo_url || "");
      setCategory(teamCategory(selectedTeam));
    }
  }, [selectedTeam]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    try {
      await updateTeam(selectedId, {
        name,
        short_name: shortName,
        city,
        logo_url: logoUrl,
        category,
      });
      toast.success("Club actualizado correctamente.");
    } catch {
      toast.error("Error al actualizar los datos del club.");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[250px_1fr]">
      <Card className="p-3 space-y-2 h-fit">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Clubes ({CATEGORY_LABELS[selectedCategory]})
          </Label>
          <span className="text-[10px] font-bold text-primary font-mono">{categoryTeams.length}/8</span>
        </div>
        <div className="flex flex-col gap-1">
          {categoryTeams.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center">
              No hay clubes registrados en esta rama.
            </p>
          )}
          {categoryTeams.map((t) => (
            <Button
              key={t.id}
              variant={t.id === selectedId ? "default" : "ghost"}
              className="justify-start gap-2 h-10 px-2"
              onClick={() => setSelectedId(t.id)}
            >
              <TeamLogo team={t as any} size={24} />
              <span className="truncate font-semibold text-sm">{t.short_name || t.name}</span>
            </Button>
          ))}
        </div>
      </Card>

      {selectedTeam && (
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">Editar Identidad del Club</h3>
              <p className="text-xs text-muted-foreground">
                ID interno: <span className="font-mono">{selectedTeam.id}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg border">
              <TeamLogo team={{ ...selectedTeam, logo_url: logoUrl } as any} size={32} />
              <span className="font-bold text-sm">{shortName || "Sigla"}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Label htmlFor="t-name">Nombre Oficial del Club</Label>
                <Input
                  id="t-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Mamba Club"
                  required
                />
              </div>
              <div>
                <Label htmlFor="t-cat">Categoría / Rama</Label>
                <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
                  <SelectTrigger id="t-cat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="u13_varones">Sub 13 Varones</SelectItem>
                    <SelectItem value="u15_varones">Sub 15 Varones</SelectItem>
                    <SelectItem value="u18_varones">Sub 18 Varones</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="t-short">Sigla / Nombre Corto</Label>
                <Input
                  id="t-short"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Ej: Mamba"
                  maxLength={15}
                  required
                />
              </div>
              <div>
                <Label htmlFor="t-city">Ciudad / Comuna</Label>
                <Input
                  id="t-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej: Melipilla"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="t-logo">Ruta o URL del Escudo (.png / .jpg)</Label>
              <Input
                id="t-logo"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="/escudos/mambito.png o https://..."
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="w-full sm:w-auto font-bold">
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

function JugadoresTab() {
  const { teams, players, saveRoster, selectedCategory } = useStore();
  
  // Posiciones oficiales de básquetbol
  const positions = ["Base", "Escolta", "Alero", "Ala-Pívot", "Pívot"];

  // Filtrar clubes por la rama seleccionada
  const categoryTeams = useMemo(
    () => teams.filter((t) => teamCategory(t) === selectedCategory),
    [teams, selectedCategory],
  );

  const [selectedId, setSelectedId] = useState<string>(categoryTeams[0]?.id || "");
  const selectedTeam = teams.find((t) => t.id === selectedId);

  useEffect(() => {
    if (categoryTeams.length > 0 && !categoryTeams.some((t) => t.id === selectedId)) {
      setSelectedId(categoryTeams[0].id);
    }
  }, [categoryTeams, selectedId]);

  // Generamos siempre 20 espacios fijos
  const [roster, setRoster] = useState(() => Array.from({ length: 20 }, (_, i) => ({
    number: i + 1, name: "", rut: "", position: ""
  })));

  // Cargar jugadores del equipo en sus números respectivos
  useEffect(() => {
    if (!selectedId) return;
    const teamPlayers = players.filter((p) => p.team_id === selectedId);
    
    setRoster(
      Array.from({ length: 20 }, (_, i) => {
        const num = i + 1;
        const existing = teamPlayers.find((p) => p.number === num);
        return existing 
          ? { number: num, name: existing.name, rut: existing.rut || "", position: existing.position || "" }
          : { number: num, name: "", rut: "", position: "" };
      })
    );
  }, [selectedId, players]);

  const updateSlot = (index: number, field: string, value: string) => {
    setRoster((prev) => {
      const newRoster = [...prev];
      newRoster[index] = { ...newRoster[index], [field]: value };
      return newRoster;
    });
  };

  const handleSave = async () => {
    if (!selectedId) return;
    try {
      await saveRoster(selectedId, roster);
      toast.success(`Nómina de ${selectedTeam?.short_name || 'equipo'} guardada correctamente.`);
    } catch {
      toast.error("Error al guardar la nómina en la base de datos.");
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-[250px_1fr]">
      <Card className="p-3 space-y-2 h-fit">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold uppercase text-muted-foreground">
            Clubes ({CATEGORY_LABELS[selectedCategory]})
          </Label>
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1">
          {categoryTeams.length === 0 && (
            <p className="text-xs text-muted-foreground py-2 text-center">
              No hay clubes registrados en esta rama.
            </p>
          )}
          {categoryTeams.map((t) => (
            <Button
              key={t.id}
              variant={t.id === selectedId ? "default" : "ghost"}
              className="justify-start gap-2 h-10 px-2"
              onClick={() => setSelectedId(t.id)}
            >
              <TeamLogo team={t as any} size={24} />
              <span className="truncate font-semibold text-sm">{t.short_name || t.name}</span>
            </Button>
          ))}
        </div>
      </Card>

      {selectedTeam && (
        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between border-b p-4 bg-muted/30">
            <div>
              <h3 className="font-black text-lg uppercase tracking-tight">Registro de Jugadores</h3>
              <p className="text-xs text-muted-foreground">
                20 cupos habilitados para <strong className="text-primary">{selectedTeam.name}</strong> ({CATEGORY_LABELS[teamCategory(selectedTeam)]}).
              </p>
            </div>
            <Button onClick={handleSave} className="font-bold">
              <Save className="mr-2 h-4 w-4" /> Guardar Nómina
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-xs uppercase font-bold text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 w-16 text-center">N°</th>
                  <th className="px-4 py-3">Nombre y Apellido</th>
                  <th className="px-4 py-3 w-40">RUT</th>
                  <th className="px-4 py-3 w-48">Posición</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {roster.map((slot, index) => (
                  <tr key={slot.number} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2 text-center font-mono font-bold text-muted-foreground">
                      {slot.number}
                    </td>
                    <td className="px-4 py-2">
                      <Input 
                        placeholder="Nombre completo" 
                        value={slot.name} 
                        onChange={(e) => updateSlot(index, "name", e.target.value)}
                        className="h-8 border-transparent hover:border-input focus:border-input bg-transparent"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input 
                        placeholder="12.345.678-9" 
                        value={slot.rut} 
                        onChange={(e) => updateSlot(index, "rut", e.target.value)}
                        className="h-8 border-transparent hover:border-input focus:border-input bg-transparent font-mono text-xs"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Select value={slot.position} onValueChange={(val) => updateSlot(index, "position", val)}>
                        <SelectTrigger className="h-8 border-transparent hover:border-input focus:border-input bg-transparent text-xs">
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Los números asignados en esta planilla deben coincidir con las camisetas usadas en cancha.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}