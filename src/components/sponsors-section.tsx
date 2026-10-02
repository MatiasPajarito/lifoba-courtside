import { Instagram } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Sponsor } from "@/lib/types";

const GLAMEN_URL =
  "https://www.instagram.com/cabanasglamen?stkn=MTlxYzFkaHkzNTNvYw==";

function GlamenCard() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardContent className="p-0">
        <div className="flex aspect-video w-full items-center justify-center bg-black p-4">
          <img
            src="/logo-glamen.jpg"
            alt="Cabañas Glamen"
            className="h-full w-full object-contain"
          />
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <a href={GLAMEN_URL} target="_blank" rel="noopener noreferrer" className="w-full">
          <Button variant="outline" className="w-full">
            <Instagram className="h-4 w-4" /> Visitar Instagram
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

function SponsorTile({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Card className="flex h-24 items-center justify-center gap-3 p-4 transition-shadow hover:shadow-md">
      {sponsor.logo_url ? (
        <img
          src={sponsor.logo_url}
          alt={sponsor.name}
          className="max-h-14 max-w-full object-contain"
        />
      ) : (
        <span className="text-center text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {sponsor.name}
        </span>
      )}
    </Card>
  );
}

/** Sección de auspiciadores para el home. Muestra a los auspiciadores cargados
 * (más el sponsor oficial Cabañas Glamen) en una cuadrícula escalable. */
export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-black uppercase tracking-tight">
        Auspiciadores
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <GlamenCard />
        {sponsors.map((s) => (
          <SponsorTile key={s.id} sponsor={s} />
        ))}
      </div>
    </section>
  );
}
