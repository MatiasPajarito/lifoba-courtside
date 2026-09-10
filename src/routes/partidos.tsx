import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/partidos")({
  head: () => ({
    meta: [
      { title: "Partidos y resultados · LIFOBA Clausura 2026" },
      {
        name: "description",
        content:
          "Calendario y resultados por cuartos de la Liga Formativa de Básquetbol, incluyendo tiempos extras y el MVP de cada partido.",
      },
      { property: "og:title", content: "Partidos y resultados · LIFOBA" },
      {
        property: "og:description",
        content: "Marcadores cuarto a cuarto y MVP de cada encuentro del Clausura 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        title="Partidos"
        desc="Aquí se conectará el listado de encuentros con el detalle por cuartos, tiempos extras y MVP."
      />
    </AppShell>
  ),
});
