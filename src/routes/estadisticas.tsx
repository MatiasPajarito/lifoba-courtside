import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/estadisticas")({
  head: () => ({
    meta: [
      { title: "Estadísticas · LIFOBA Clausura 2026" },
      {
        name: "description",
        content:
          "Estadísticas de la Liga Formativa de Básquetbol: puntos a favor y en contra, diferencia y ranking de MVP del Clausura 2026.",
      },
      { property: "og:title", content: "Estadísticas · LIFOBA" },
      {
        property: "og:description",
        content: "Números del torneo: anotación, diferencia de puntos y MVP más repetidos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        title="Estadísticas"
        desc="Aquí se conectarán los indicadores de anotación y el ranking de MVP."
      />
    </AppShell>
  ),
});
