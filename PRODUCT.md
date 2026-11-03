# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Jugadores, familias y seguidores de LIFOBA:** Consultan en tiempo real (principalmente desde móvil y escritorio en días de jornada) la tabla de posiciones por categoría (U13, U15, U18 Varones), los marcadores totales y por cuarto, el calendario de partidos, las sedes con mapa interactivo, los planteles oficiales y los jugadores destacados (MVP).
- **Delegados y entrenadores de clubes participantes:** Revisan programación, recintos de localía, reglamento oficial (como la regla 3x1 en U15 y U18 y los límites de nómina de 20/23 jugadores) y estadísticas de puntos a favor/en contra.
- **Administradores de la liga (LIFOBA):** Gestionan desde el panel administrativo (`/admin`) la creación y edición de partidos, el registro de marcadores con desglose por los 4 cuartos (`QuarterDetail`), la asignación del MVP del encuentro (`mvp_player_id`) y la administración de equipos, jugadores y auspiciadores.

## Product Purpose

**LIFOBA Basketball Hub** es la plataforma digital oficial de gestión, seguimiento y difusión de la **Liga Formativa de Básquetbol (LIFOBA) · Torneo Clausura 2026**. Centraliza toda la operación competitiva de las categorías formativas Sub 13, Sub 15 y Sub 18 Varones para dar visibilidad profesional al básquetbol formativo en la zona (Melipilla, San Antonio, Curacaví, Padre Hurtado) con datos precisos y en tiempo real.

## Positioning

A diferencia de planillas aisladas o portales genéricos de torneos, LIFOBA Basketball Hub implementa de forma nativa las reglas formativas específicas del campeonato: marcador desglosado en 4 cuartos semi-cronometrados, sistema de puntuación FIBA/LIFOBA (2 pts por victoria, 1 pt por derrota, diferencia de puntos `PF - PC`), regla formativa 3x1 en U15 y U18, identidad cromática dinámica por categoría (`u13_varones`, `u15_varones`, `u18_varones`) y reconocimiento oficial del MVP por partido auspiciado por Clínica Dental Obident.

## Operating Context

- **Categorías oficiales:**
  - `u13_varones` (Sub 13 Varones · 6 clubes)
  - `u15_varones` (Sub 15 Varones · 8 clubes)
  - `u18_varones` (Sub 18 Varones · 8 clubes)
- **Clubes participantes:** Mamba Club Melipilla, Liceo Curacaví, Gobernación de San Antonio, Padre Hurtado Basketball, Deportivo San Manuel de Melipilla (DSM), San Luis de San Antonio, Club Español de San Antonio y Club Esparta de San Antonio.
- **Condiciones de jornada y recintos:** Localías rotativas con entrada general ($1.500 CLP) y entrada jugadores ($1.000 CLP), reloj de 24 segundos, tablero marcador, arbitraje oficial y registro fotográfico del MVP de cada encuentro.

## Capabilities and Constraints

- **Stack tecnológico:** React 19, TanStack Start + TanStack Router + TanStack Query, Vite 8, Tailwind CSS v4 (colores en espacio `oklch`), Radix UI / shadcn, Leaflet (`react-leaflet`) para mapas de sedes, `html-to-image` para compartir programación, y Supabase como backend de persistencia y almacenamiento (`lifoba-assets`).
- **Integridad de datos y reglas críticas:**
  - Nunca reintroducir lógica o terminología heredada de voleibol (sets); toda la nomenclatura es estrictamente de básquetbol (cuartos, puntos, Base, Escolta, Alero, Ala-Pívot, Pívot, MVP).
  - La tabla `matches` en Supabase utiliza `home_points`, `away_points`, `score` (`QuarterDetail` por cuarto) y `mvp_player_id`. No se deben realizar cambios destructivos sobre el esquema de Supabase.
  - Sincronización continua con Lovable y GitHub sin reescribir el historial de Git publicado.

## Brand Commitments

- **Nombre oficial:** LIFOBA · Liga Formativa de Básquetbol (Torneo Clausura 2026).
- **Patrocinador principal:** Clínica Dental Obident (integrado en cabeceras, hero, trofeos y sección de auspiciadores; azul corporativo `#364DA0` / `oklch(0.4489 0.1371 269)`).
- **Sistema cromático dinámico por categoría:**
  - Base / Tema oscuro nativo con soporte claro (`ThemeToggle`).
  - Sub 13 (`[data-category="u13_varones"]`): Turquesa/Verde menta (`#58d2b7` / `oklch(0.78 0.12 170)`), pelota `/pelota-u13.png`.
  - Sub 15 (`[data-category="u15_varones"]`): Azul claro (`#3d85c6` / `oklch(0.60 0.14 250)`), pelota `/pelota-u15.png`.
  - Sub 18 (`[data-category="u18_varones"]`): Azul vibrante (`#0048b2` / `oklch(0.46 0.17 262)`), pelota `/pelota-u18.png`.
- **Tipografía:** `Archivo` (`--font-display`) para titulares y marcadores (`tabular-nums`), y `Barlow` (`--font-sans`) para cuerpo de texto e interfaz.

## Evidence on Hand

- Recursos gráficos reales en `/public` (`/pelota-u13.png`, `/pelota-u15.png`, `/pelota-u18.png`, `/lifoba-logo.png`, `/mamba-logo.png`, `/obident-trofeos.png`) y bucket público de Supabase (`https://qoetfmvloppsnasjkpoa.supabase.co/storage/v1/object/public/lifoba-assets/logo_y_trofeos_mejorado.png`, escudos de clubes).
- Rutas activas: `/` (`src/routes/index.tsx`), `/posiciones` (`src/routes/posiciones.tsx`), `/calendario` (`src/routes/calendario.tsx`), `/equipos` (`src/routes/equipos.tsx`), `/reglamento` (`src/routes/reglamento.tsx`), `/login` (`src/routes/login.tsx`) y `/admin` (`src/routes/admin.tsx`).
- Créditos del autor en el pie de página: Matías Pajarito (Ingeniería Civil en Informática · `https://github.com/MatiasPajarito`).

## Product Principles

1. **Precisión deportiva ante todo:** Cada tabla, tarjeta de partido y formulario refleja fielmente el reglamento de básquetbol formativo de LIFOBA (4 cuartos, clasificación 2/1 pts, regla 3x1 en U15/U18).
2. **Claridad inmediata en día de partido:** Los marcadores, horarios, sedes y tablas de posiciones deben leerse de un vistazo en móvil y escritorio usando números tabulares y jerarquía deportiva clara.
3. **Identidad de liga profesional para el deporte formativo:** Dar a las categorías U13, U15 y U18 una presentación visual de alto impacto (estilo broadcast/courtside) que motive a los jugadores, clubes y familias.
4. **Evolución segura sobre Supabase:** Mejorar la experiencia visual, las animaciones y las microinteracciones preservando intactos los contratos de datos, el store y la compatibilidad con Lovable.
