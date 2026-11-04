import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Bell, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Correo inválido")
  .max(255);

export function SubscribeAlerts() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const { selectedCategory } = useStore();

  const watermarkLogo =
    selectedCategory === "u13_varones"
      ? "/pelota-u13.png"
      : selectedCategory === "u15_varones"
        ? "/pelota-u15.png"
        : "/pelota-u18.png";

  useGSAP(
    () => {
      const el = ctaRef.current;
      if (!el) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          allowMotion: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set(el, { autoAlpha: 1, y: 0 });
            return;
          }

          gsap.fromTo(
            el,
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.65,
              ease: "power3.out",
              force3D: true,
              clearProps: "transform,opacity,visibility",
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
                once: true,
              },
            },
          );
        },
      );

      return () => mm.revert();
    },
    { scope: ctaRef, revertOnUpdate: true },
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Correo inválido");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("subscribers")
      .insert({ email: parsed.data });
    setLoading(false);
    if (error && error.code !== "23505") {
      toast.error("No pudimos registrar tu correo. Intenta más tarde.");
      return;
    }
    toast.success("¡Listo! Te avisaremos cuando estén los resultados.");
    setEmail("");
  }

  return (
    <section
      ref={ctaRef}
      aria-label="Suscripción a alertas de resultados"
      className="shadow-editorial relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 bg-[radial-gradient(110%_90%_at_85%_10%,color-mix(in_oklch,var(--primary)_28%,transparent)_0%,transparent_65%),linear-gradient(145deg,#13192b_0%,#0b0f1b_65%)] p-6 sm:p-10 lg:p-12"
    >
      {/* Resplandor direccional primario */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl"
      />

      {/* Marca de agua del logo oficial de la liga sutilmente difuminada en el fondo */}
      <img
        src={watermarkLogo}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 rotate-12 rounded-full object-cover opacity-[0.08] blur-[1px] select-none sm:h-80 sm:w-80"
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        {/* Columna Izquierda: Narrativa CTA (siempre sobre fondo oscuro) */}
        <div className="flex flex-col items-start lg:col-span-7">
          <div className="flex items-center gap-3">
            <div className="shadow-border grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <Bell className="h-6 w-6 stroke-[2.2]" />
            </div>
            <h2 className="font-editorial-title text-2xl text-white sm:text-4xl">
              Alertas Oficiales de Jornada
            </h2>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Recibe en tu correo el cierre de cada fecha, marcadores oficiales
            por categoría, actualizaciones de la tabla de posiciones y el
            jugador <strong className="text-white">MVP Obident</strong> de la
            jornada.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Resultados U13,
              U15 y U18
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Programación de
              sedes
            </span>
          </div>
        </div>

        {/* Columna Derecha: Formulario Interactivo con Radios Concéntricos (outer rounded-2xl p-2 -> inner rounded-xl) */}
        <div className="w-full lg:col-span-5">
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-slate-950/65 p-2.5 backdrop-blur-md sm:flex-row"
          >
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Correo electrónico"
              required
              className="h-12 flex-1 rounded-xl border-white/15 bg-slate-900/90 px-4 text-sm text-white placeholder:text-slate-400 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="press-scale shadow-layered-interactive inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary pl-6 pr-5 font-display text-xs font-black uppercase tracking-wider text-primary-foreground disabled:pointer-events-none disabled:opacity-50"
            >
              <span>{loading ? "Enviando…" : "Notificarme"}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.2]" />
            </button>
          </form>
          <p className="mt-2.5 px-1 text-[11px] text-slate-300">
            Comunicaciones oficiales de LIFOBA. Sin spam.
          </p>
        </div>
      </div>
    </section>
  );
}
