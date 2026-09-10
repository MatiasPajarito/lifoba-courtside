import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/equipos")({
  head: () => ({
    meta: [
      { title: "Equipos y planteles · LIFOBA Clausura 2026" },
      {
        name: "description",
        content:
          "Equipos y planteles de LIFOBA con hasta 23 jugadores por club en las posiciones Base, Escolta, Alero, Ala-Pívot y Pívot.",
      },
      { property: "og:title", content: "Equipos y planteles · LIFOBA" },
      {
        property: "og:description",
        content: "Clubes participantes y sus planteles en el Clausura 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        title="Equipos"
        desc="Aquí se conectarán los clubes y sus planteles por categoría."
      />
    </AppShell>
  ),
});
