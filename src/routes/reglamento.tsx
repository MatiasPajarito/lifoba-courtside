import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/reglamento")({
  component: Reglamento,
  head: () => ({
    meta: [
      { title: "Reglamento Oficial · LIFOBA" },
      { name: "description", content: "Bases oficiales de LIFOBA Clausura 2026: partidos a 4 cuartos, 2 puntos por victoria y 1 por derrota, planteles y MVP obligatorio." },
      { property: "og:title", content: "Reglamento Oficial · LIFOBA" },
      { property: "og:description", content: "Formato, puntuación, premios y bases oficiales de la Liga Formativa de Básquetbol." },
    ],
  }),
});

interface Rule { id: string; title: string; body: string[]; }
interface Section { id: string; title: string; rules: Rule[]; }

const SECTIONS: Section[] = [
  {
    id: "s1",
    title: "1. Formato de Competencia y Puntuación",
    rules: [
      { id: "r11", title: "Sistema de juego", body: [
        "Categorías: LIFOBA se disputa en tres categorías formativas independientes: U13 Varones, U15 Varones y U18 Varones.",
        "Fase Regular: todos contra todos dentro de cada categoría.",
        "Cada partido se juega a 4 cuartos. Si el marcador termina igualado, se disputan los tiempos extras necesarios hasta definir un ganador.",
        "Torneo vigente: Clausura 2026.",
      ]},
      { id: "r12", title: "Sistema de puntuación en Tabla", body: [
        "Victoria: 2 puntos para el ganador.",
        "Derrota: 1 punto para el perdedor.",
        "Criterios de Desempate: 1) Mayor cantidad de puntos de tabla, 2) Diferencia de puntos (puntos a favor menos puntos en contra), 3) Mayor cantidad de puntos a favor.",
      ]},
      { id: "r13", title: "MVP y premiación", body: [
        "Todo partido finalizado registra obligatoriamente al Jugador Más Valioso (MVP) del encuentro.",
        "Copa y medallas para el 1° y 2° lugar de cada categoría.",
        "Reconocimiento al MVP más repetido de la temporada en cada categoría.",
      ]},
      { id: "r14", title: "Localía, medios y contacto", body: [
        "Los clubes socios pueden solicitar la localía de una fecha y autogestionar la venta de entradas de ese encuentro.",
        "Registro fotográfico oficial rotativo para todos los clubes y transmisión de resúmenes en el canal oficial de la liga.",
        "Auspicia Clínica Dental Obident.",
      ]},
    ],
  },
  {
    id: "s2",
    title: "2. Planteles, Inscripciones y Carnet",
    rules: [
      { id: "r21", title: "Nómina del plantel", body: [
        "Cada club puede inscribir hasta 23 jugadores por plantel.",
        "Las posiciones válidas son: Base, Escolta, Alero, Ala-Pívot y Pívot.",
        "Es obligatorio presentar la nómina oficial del equipo antes del inicio de cada partido.",
      ]},
      { id: "r22", title: "Suplantación de identidad", body: [
        "Toda suplantación conlleva la pérdida automática del partido (W.O.) y una sanción al club involucrado por 2 fechas.",
        "La mesa de control validará la identidad mediante el Carnet Digital de Cancha disponible en esta plataforma.",
      ]},
    ],
  },
  {
    id: "s3",
    title: "3. Cancha, Indumentaria y Categorías",
    rules: [
      { id: "r30", title: "Altura del aro", body: [
        "U15 y U18 juegan con aro reglamentario a 3.05 metros. En U13 se podrá utilizar aro rebajado según acuerdo previo entre los clubes.",
      ]},
      { id: "r31", title: "Uniforme", body: [
        "Todos los jugadores deben vestir camiseta idéntica con número visible en pecho y espalda.",
      ]},
      { id: "r32", title: "Edades por categoría", body: [
        "Cada jugador solo puede competir en la categoría que le corresponde por año de nacimiento: U13, U15 o U18 varones.",
        "El ascenso puntual de un jugador a una categoría mayor requiere autorización previa de la organización.",
      ]},
    ],
  },
  {
    id: "s4",
    title: "4. Puntualidad, Tiempos de Espera y W.O.",
    rules: [
      { id: "r41", title: "Hora de citación", body: [
        "Los equipos deben presentarse 30 minutos antes del inicio programado del partido.",
      ]},
      { id: "r42", title: "Atraso y W.O.", body: [
        "Tolerancia máxima: 15 minutos desde la hora oficial de inicio fijada en el calendario.",
        "Superado ese tiempo, se declara W.O. a favor del rival con marcador de 20-0.",
        "El equipo que reincida en atrasos o ausencias podrá ser sancionado con el descuento de puntos en la tabla general.",
      ]},
      { id: "r43", title: "Sustituciones", body: [
        "Las sustituciones son ilimitadas y se realizan durante las detenciones del reloj autorizadas por la mesa de control.",
      ]},
    ],
  },
];

function highlight(text: string, q: string) {
  if (!q) return text;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig"));
  return parts.map((p, i) =>
    p.toLowerCase() === q.toLowerCase()
      ? <mark key={i} className="rounded bg-accent px-0.5 text-accent-foreground">{p}</mark>
      : <span key={i}>{p}</span>,
  );
}

function Reglamento() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return SECTIONS;
    const needle = q.toLowerCase();
    return SECTIONS
      .map((s) => ({
        ...s,
        rules: s.rules.filter(
          (r) => r.title.toLowerCase().includes(needle) || r.body.some((b) => b.toLowerCase().includes(needle)),
        ),
      }))
      .filter((s) => s.rules.length > 0);
  }, [q]);

  const openAll = q.trim() ? filtered.map((s) => s.id) : undefined;

  return (
    <AppShell>
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">Reglamento oficial</h1>
          <p className="text-xs text-muted-foreground">Prueba con: "O-2 bis", "W.O.", "red", "desempate".</p>
        </div>

        <div className="sticky top-14 z-10 -mx-3 bg-background px-3 py-2 sm:mx-0 sm:px-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar en el reglamento..."
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
            Sin resultados para "{q}".
          </div>
        )}

        <Accordion
          type="multiple"
          value={openAll}
          className="overflow-hidden rounded-lg border bg-card"
        >
          {filtered.map((s) => (
            <AccordionItem key={s.id} value={s.id} className="border-b last:border-b-0">
              <AccordionTrigger className="px-4 text-left text-sm font-bold uppercase tracking-wide">
                {s.title}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-4">
                  {s.rules.map((r) => (
                    <div key={r.id}>
                      <h3 className="mb-1 text-sm font-bold">{highlight(r.title, q)}</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {r.body.map((line, i) => (
                          <li key={i} className="leading-relaxed">• {highlight(line, q)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </AppShell>
  );
}