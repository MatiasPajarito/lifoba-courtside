import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

const emailSchema = z.string().trim().toLowerCase().email("Correo inválido").max(255);

export function SubscribeAlerts() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Correo inválido");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("subscribers").insert({ email: parsed.data });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("No pudimos registrar tu correo. Intenta más tarde.");
      return;
    }
    toast.success("¡Listo! Te avisaremos cuando estén los resultados.");
    setEmail("");
  }

  return (
    <Card className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight">Suscripción a alertas</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Regístrate para recibir notificaciones cuando se completen los resultados de la fecha.
          </p>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex w-full gap-2 md:max-w-md">
        <Input
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Correo electrónico"
          required
        />
        <Button type="submit" disabled={loading} className="shrink-0 font-bold uppercase">
          {loading ? "Enviando…" : "Notificarme"}
        </Button>
      </form>
    </Card>
  );
}
