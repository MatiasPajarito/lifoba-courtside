import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PagePlaceholder } from "@/components/PagePlaceholder";

export const Route = createFileRoute("/posiciones")({
  head: () => ({
    meta: [
      { title: "Tabla de posiciones · LIFOBA Clausura 2026" },
      {
        name: "description",
        content:
          "Tabla de posiciones de LIFOBA: 2 puntos por victoria, 1 por derrota y desempate por diferencia de puntos en U13, U15 y U18 varones.",
      },
      { property: "og:title", content: "Tabla de posiciones · LIFOBA" },
      {
        property: "og:description",
        content: "Posiciones actualizadas de la Liga Formativa de Básquetbol, Clausura 2026.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell>
      <PagePlaceholder
        title="Tabla de posiciones"
        desc="Aquí se conectará el cálculo de posiciones por categoría (PJ, PG, PP, PF, PC, DIF y puntos)."
      />
    </AppShell>
  ),
});
