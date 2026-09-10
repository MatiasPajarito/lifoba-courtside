# LIFOBA Basketball Hub

CONTEXTO DEL PROYECTO: LIFOBA (LIGA FORMATIVA DE BÁSQUETBOL) - CLAUSURA 2026

1. Estado Actual y Origen

Este proyecto es un sistema web de gestión deportiva construido con React, Tailwind CSS, Supabase y Vite. El código base proviene de una liga de voleibol anterior, pero estamos pivotando el 100% de la lógica y la interfaz (UI/UX) hacia el Básquetbol. Necesitamos unificar el diseño para que se vea como una plataforma profesional, cohesiva y libre de cualquier terminología de voleibol (eliminar referencias a "sets", "líberos", "varón tc", etc.).

2. Reglas Oficiales y Formato del Torneo El sistema debe reflejar estrictamente las siguientes normativas de LIFOBA:

Categorías Oficiales: Sub 13 Varones, Sub 15 Varones y Sub 18 Varones.

Clubes Participantes (8 en total para U15 y U18): Mamba Club Melipilla, Liceo Curacavi, Gobernación de San Antonio, Padre Hurtado Basketball, Deportivo San Manuel de Melipilla, San Luis de San Antonio, Club Español de San Antonio y Club Esparta de San Antonio. (Sub 13 cuenta con 6 de estos clubes).

Sistema de Juego: Partidos de básquetbol semi-cronometrados (4 cuartos). Para las categorías U15 y U18 se aplica un sistema 3x1 (un jugador no puede disputar más de 3 cuartos).

Gestión de Planteles: Listas iniciales de hasta 20 jugadores. Si un equipo necesita agregar jugadores sin eliminar a otros, la nómina puede ampliarse a un máximo de 23 cupos.

Sponsor Oficial: El torneo cuenta con el auspicio principal de "Clínica Dental Obident".

Reconocimientos y Premios: Se exige la elección de un MVP por partido, quien recibe un reconocimiento físico y debe ser fotografiado. La liga premiará al 1°, 2° y 3° lugar con 14 medallas y un trofeo.

Localías: Los clubes pueden ser locales en sus recintos (cobrando entradas a $1.500 general y $1.000 jugadores), debiendo garantizar condiciones mínimas como marcador, reloj de 24 segundos, y camarines. En caso de W.O., existe una multa económica.

3. Adaptaciones Técnicas ya implementadas en Supabase (No sobreescribir)

Marcador: La tabla matches ahora guarda los puntos totales (home_points, away_points) y los detalles por cuartos en la columna score (QuarterDetail), reemplazando los sets.

Tabla de Posiciones: El sistema de desempate se basa en Puntos de clasificación (2 pts victoria, 1 pt derrota), y la Diferencia de Puntos (Puntos a favor pf - Puntos en contra pc).

Jugadores: Las posiciones válidas ahora son Base, Escolta, Alero, Ala-Pívot y Pívot.

MVP: El panel de administrador ya cuenta con un selector para asignar el mvp_player_id al finalizar cada partido.

4. Objetivo Inmediato para Lovable

Revisa todos los componentes visuales (AppShell, Home, Cards, Tablas de posiciones, Panel de Administración) para:

Limpiar el código heredado de Voleibol.

Unificar la paleta de colores y la estética general para darle una identidad de "Básquetbol Formativo" (colores corporativos, espacios limpios, diseño moderno).

Asegurar que los textos, placeholders y alertas reflejen las categorías (U13, U15, U18) y posiciones correctas.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4906f8ad-63c6-4c02-bd44-74f543905370).

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
