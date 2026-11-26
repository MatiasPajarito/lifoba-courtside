# 🏀 LIFOBA Basketball Hub

### Plataforma de gestión deportiva · Liga Formativa de Básquetbol · Clausura 2026

<p align="center">
  <strong>Una plataforma digital para gestionar, organizar y dar visibilidad al básquetbol formativo.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Deporte-Básquetbol-F97316?style=for-the-badge" alt="Básquetbol" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 📌 Tabla de contenidos

- [1. Acerca del proyecto](#-1-acerca-del-proyecto)
- [2. Patrocinio](#-2-patrocinio)
- [3. Funcionalidades principales](#-3-funcionalidades-principales)
- [4. Categorías y clubes participantes](#-4-categorías-y-clubes-participantes)
- [5. Reglamento y lógica deportiva](#-5-reglamento-y-lógica-deportiva)
- [6. Arquitectura y tecnologías](#-6-arquitectura-y-tecnologías)
- [7. Instalación y desarrollo local](#-7-instalación-y-desarrollo-local)
- [8. Variables de entorno](#-8-variables-de-entorno)

---

## 🏀 1. Acerca del proyecto

**LIFOBA Basketball Hub** es una aplicación web en producción diseñada para centralizar la operación y difusión de la **Liga Formativa de Básquetbol (LIFOBA)** durante el torneo Clausura 2026.

La plataforma conecta el trabajo de la mesa de control con jugadores, entrenadores y familias, ofreciendo resultados actualizados, tablas de posiciones calculadas dinámicamente, geolocalización de recintos y un cuadro de eliminación directa (Playoffs) que avanza de forma automática al finalizar cada llave.

---

## 🏅 2. Patrocinio
El torneo Clausura 2026 cuenta con el auspicio oficial de:
- [Clínica Dental Obident](https://www.instagram.com/clinicaobident/)
- [Cabañas Glamen](https://www.instagram.com/cabanasglamen)
- [Zeus Sport](https://www.instagram.com/zeussportzs/)
- [Rigorer](https://www.instagram.com/rigorer_oficial/)
- [Impresiones Carolina](https://lifoba.vercel.app/)

---

## ⚙️ 3. Funcionalidades principales

- **Calendario y sedes:** Programación por fecha y categoría con filtros instantáneos, horarios confirmados y enlaces de ubicación a los gimnasios sede en Melipilla, San Antonio, Curacaví y Padre Hurtado.
- **Tablas de posiciones en tiempo real:** Cálculo automático de puntos de clasificación (sistema FIBA), partidos jugados, ganados, perdidos, puntos a favor (PF), puntos en contra (PC) y diferencia de puntos (DP).
- **Cuadro oficial de Playoffs automatizado:** Llaves de Semifinales, Tercer Lugar y Gran Final conectadas a Supabase. Al registrar el resultado de una semifinal en el panel administrativo, el sistema asigna automáticamente al ganador a la Final y al perdedor al partido por el 3º puesto (con soporte para correcciones de marcador).
- **Gestión de clubes y planteles:** Nóminas oficiales por categoría, posiciones de juego y Carnet Digital de Cancha para validación en mesa de control.
- **Panel de administración:** Digitalización de resultados, desglose por cuartos, programación de jornadas, edición de clubes y asignación de MVP por partido.
- **Interfaz adaptable:** Soporte para modo claro y oscuro, diseño responsivo y tarjetas diferenciadas visualmente para fases decisivas (`Semifinal`, `3º Lugar` y `Gran Final`).

---

## 🏆 4. Categorías y clubes participantes

La competición se organiza en tres categorías formativas masculinas:

| Categoría | Denominación | Formato |
|---|---|---|
| **U13** | Sub 13 Varones | 4 clubes · Cuadrangular + Playoffs |
| **U15** | Sub 15 Varones | 8 equipos · Todos contra todos + Playoffs |
| **U18** | Sub 18 Varones | 8 clubes · Todos contra todos + Playoffs |

### Clubes participantes

1. **Mamba Club Melipilla** *(Mamba Blanco y Mamba Negro en Sub 15)*
2. **Tiburones Basketball** *(Padre Hurtado)*
3. **Español de San Antonio**
4. **Esparta de San Antonio**
5. **Gobernación de San Antonio**
6. **San Luis de San Antonio**
7. **Liceo Curacaví**
8. **DSM Melipilla** *(Deportivo San Manuel)*

---

## 📋 5. Reglamento y lógica deportiva

La lógica de negocio de la plataforma implementa directamente las bases oficiales de LIFOBA:

- **Formato de partidos:** Cuatro cuartos de tiempo semi-cronometrado, con registro de marcador total y desglose parcial por cuarto.
- **Sistema de rotación 3x1 (exclusivo Sub 13):** Aplicable únicamente a la categoría formativa **Sub 13**, promoviendo la participación equitativa de los jugadores en cancha.
- **Límite de planteles:** Cada club puede inscribir hasta un **máximo de 20 jugadores por plantel**.
- **Posiciones válidas:** `Base`, `Escolta`, `Alero`, `Ala-Pívot` y `Pívot`.
- **Sistema de puntuación:**
  - **Victoria:** 2 puntos de clasificación.
  - **Derrota:** 1 punto de clasificación.
  - **Desempate:** Diferencia de puntos (`PF − PC`).
- **Premiación y MVP:** Reconocimiento al jugador más valioso (MVP) por encuentro y premiación oficial para 1º, 2º y 3º lugar en cada categoría.

---

## 🧱 6. Arquitectura y tecnologías

| Tecnología | Responsabilidad |
|---|---|
| **React + TypeScript** | Interfaz modular basada en componentes y tipado estricto de datos deportivos. |
| **Vite** | Entorno de desarrollo rápido y empaquetado optimizado para producción. |
| **Tailwind CSS + Shadcn/ui** | Sistema de diseño responsivo con soporte de tema claro y oscuro. |
| **Supabase (PostgreSQL)** | Base de datos relacional (`teams`, `players`, `matches`, `venues`), almacenamiento de escudos y reglas de acceso. |
| **Vercel** | Despliegue continuo conectado a GitHub. |

### Modelo de datos principal

- `teams`: Identidad del club, sigla, ciudad, escudo y categoría.
- `players`: Nómina asociada a club y categoría con posición oficial.
- `matches`: Encuentros con `category`, `matchday`, `phase` (`regular`, `semifinal`, `tercer_puesto`, `final`), estado, marcador en JSON (`home_points`, `away_points`, `quarters`), `mvp_player_id` y soporte seguro para cruces por definir (`NULL`).

---

## 💻 7. Instalación y desarrollo local

### Requisitos previos

- Node.js (v18 o superior)
- npm
- Proyecto configurado en Supabase

### Pasos

```bash
# 1. Clonar el repositorio
git clone [https://github.com/MatiasPajarito/lifoba-courtside.git](https://github.com/MatiasPajarito/lifoba-courtside.git)
cd lifoba-courtside

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev

```

## 🔐 8. Variables de entorno

Crea un archivo .env en la raíz del proyecto (ignorado por Git) con las credenciales públicas de tu instancia de Supabase:

```bash
VITE_SUPABASE_URL=tu_supabase_project_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```