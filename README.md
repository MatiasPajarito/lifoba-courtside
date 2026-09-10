# LIFOBA Courtside

CONTEXTO MAESTRO DEL PROYECTO: LIFOBA (BÁSQUETBOL)

1. Estado Actual y Objetivo Estás asumiendo el desarrollo de este repositorio. Este es un sistema web de gestión deportiva (React, Tailwind, Supabase) para la Liga Formativa de Básquetbol (LIFOBA) - Clausura 2026. El "backend" (Supabase) y la lógica matemática de este proyecto ya están terminados y son 100% funcionales. Tu objetivo principal es actuar como Diseñador UI/UX y Frontend Developer para modernizar la interfaz, aplicar la identidad corporativa y limpiar cualquier rastro de código heredado de un proyecto anterior de voleibol, SIN romper la lógica existente.

2. Reglas de Negocio y Lógica (ESTRICTO - NO MODIFICAR): Toda esta lógica ya está implementada en src/lib/. Debes respetarla al construir la UI:

Categorías: Solo existen u13_varones, u15_varones y u18_varones.

Formato de Partido: Se juega por Cuartos (4 regulares + Tiempos Extras). La interfaz del administrador ya usa QuarterDetail y suma home_points y away_points. (¡No uses la palabra "sets"!).

Tabla de Posiciones: El cálculo ya está en standings.ts. Se otorgan 2 puntos al ganador y 1 al perdedor. El desempate principal es la Diferencia de Puntos (dif = pf - pc).

Planteles (Roster): Hasta 20-23 jugadores. Las posiciones válidas son: Base, Escolta, Alero, Ala-Pívot y Pívot.

MVP: Cada partido finalizado registra obligatoriamente un mvp_player_id.

3. Identidad Visual y UI Requerida (TU TAREA PRINCIPAL): Necesito que audites visualmente la plataforma y apliques el siguiente diseño:

Tema Principal: Dark Mode nativo y corporativo (fondos Navy/Gris muy oscuro).

Colores de Marca:

Primario: Naranja vibrante de básquetbol (tipo #FF6B00 o orange-500). Úsalo para botones principales, bordes activos y detalles clave.

Secundario: Azul Marino/Navy (inspirado en el sponsor oficial "Clínica Dental Obident").

Tipografía y Marcadores: Los números de los marcadores y los encabezados principales deben usar tipografías pesadas (font-black o font-extrabold) para transmitir un estilo deportivo e imponente (estilo NBA/FIBA).

Iconografía: Revisa los íconos de lucide-react. Elimina cualquier ícono que parezca de voleibol y usa versiones genéricas de deportes, estadísticas y comunidad.

4. Limpieza de Textos (Global Search & Replace) Busca en todo el proyecto (especialmente en AppShell, Index y Admin) y asegúrate de que:

NO exista la palabra "LIVOCOM" (cambiar a "LIFOBA").

NO exista "Liga de Voleibol Competitiva" (cambiar a "Liga Formativa de Básquetbol").

El torneo actual diga "Clausura 2026".

Primer paso: Confírmame que has leído y entendido estas reglas, y comienza actualizando la paleta de colores en la configuración de Tailwind (index.css o tailwind.config) y limpiando el AppShell.

Mi repositorio ehttps://github.com/MatiasPajarito/lifoba-basketball-hub

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/50cc18df-eb91-41a8-84f4-d9979c603423).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
