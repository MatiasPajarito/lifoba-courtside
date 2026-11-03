# 🏀 LIFOBA Basketball Hub

### Plataforma de gestión deportiva · Liga Formativa de Básquetbol · Clausura 2026

<p align="center">
  <strong>Una plataforma digital para gestionar, organizar y dar visibilidad al básquetbol formativo.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Temporada-Clausura%202026-111827?style=for-the-badge" alt="Temporada Clausura 2026" />
  <img src="https://img.shields.io/badge/Deporte-Básquetbol-F97316?style=for-the-badge" alt="Básquetbol" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 📌 Tabla de contenidos

- [1. Acerca del proyecto](#-1-acerca-del-proyecto)
- [2. Objetivos](#-2-objetivos-del-sistema)
- [3. Identidad deportiva y categorías](#-3-identidad-deportiva-y-categorías)
- [4. Clubes participantes](#-4-clubes-participantes)
- [5. Reglamento y lógica deportiva](#-5-reglamento-y-lógica-deportiva)
- [6. Funcionalidades de la plataforma](#-6-funcionalidades-de-la-plataforma)
- [7. Arquitectura y tecnologías](#-7-arquitectura-y-tecnologías)
- [8. Modelo de datos y reglas críticas](#-8-modelo-de-datos-y-reglas-críticas)
- [9. Identidad visual y experiencia de usuario](#-9-identidad-visual-y-experiencia-de-usuario)
- [10. Instalación y desarrollo local](#-10-instalación-y-desarrollo-local)
- [11. Variables de entorno](#-11-variables-de-entorno)
- [12. Flujo de desarrollo con Lovable](#-12-flujo-de-desarrollo-con-lovable)
- [13. Hoja de ruta](#-13-hoja-de-ruta)
- [14. Patrocinio y reconocimientos](#-14-patrocinio-y-reconocimientos)
- [15. Contribuciones](#-15-contribuciones)

---

## 🏀 1. Acerca del proyecto

**LIFOBA Basketball Hub** es una plataforma web orientada a la gestión y difusión de la Liga Formativa de Básquetbol (LIFOBA), correspondiente al torneo Clausura 2026.

El sistema busca centralizar la información deportiva de la competición mediante una interfaz moderna, accesible y coherente con las necesidades de una liga de formación. Su propósito es facilitar el seguimiento del campeonato, la consulta de resultados y posiciones, la administración de los equipos y el registro de información relevante de cada encuentro.

El proyecto parte de una base tecnológica previamente utilizada para gestionar una competición de voleibol. Su evolución contempla una adaptación integral al básquetbol, tanto en la interfaz como en los modelos de información, las reglas deportivas y los flujos de administración.

La prioridad es consolidar una plataforma que represente correctamente la identidad de LIFOBA y que pueda evolucionar sin comprometer la integridad de sus datos.

### Principios del proyecto

- **Precisión deportiva:** los resultados, las estadísticas y las posiciones deben responder a las reglas definidas para el campeonato.
- **Gestión centralizada:** equipos, jugadores, partidos y reconocimientos deben mantener información consistente.
- **Experiencia de usuario:** la información debe presentarse de manera clara para administradores, clubes y seguidores.
- **Identidad propia:** toda la plataforma debe comunicar una identidad visual de básquetbol formativo.
- **Evolución segura:** las mejoras deben respetar la estructura existente de Supabase y evitar regresiones funcionales.

---

## 🎯 2. Objetivos del sistema

### Objetivo general

Desarrollar y consolidar una plataforma digital para administrar y visualizar la información deportiva de LIFOBA, mejorando la organización del torneo y el acceso a sus resultados durante el Clausura 2026.

### Objetivos específicos

- Publicar resultados y marcadores de los encuentros.
- Presentar tablas de posiciones actualizadas según los criterios de clasificación.
- Organizar la información de clubes, planteles y jugadores por categoría.
- Facilitar la administración de partidos y el registro de sus resultados.
- Permitir la asignación del jugador más valioso (MVP) de cada encuentro.
- Ofrecer una experiencia visual consistente en las vistas públicas y administrativas.
- Mantener una estructura técnica preparada para futuras temporadas y nuevas funcionalidades.

---

## 🏆 3. Identidad deportiva y categorías

La competición se organiza en tres categorías oficiales:

| Categoría | Denominación | Participación |
|---|---|---|
| U13 | Sub 13 Varones | 6 clubes |
| U15 | Sub 15 Varones | 8 clubes |
| U18 | Sub 18 Varones | 8 clubes |

La interfaz debe utilizar estas denominaciones de forma consistente en calendarios, resultados, filtros, formularios, paneles administrativos y tablas de posiciones.

**Criterio de nomenclatura:** se utilizarán términos propios del básquetbol, como cuartos, puntos, faltas, plantel, base, escolta, alero, ala-pívot, pívot y MVP. Las denominaciones heredadas de la competición de voleibol deben eliminarse de las vistas, los formularios y la lógica de negocio cuando ya no correspondan.

---

## 🏟️ 4. Clubes participantes

El torneo contempla ocho clubes participantes en las categorías U15 y U18, y seis en U13.

1. Mamba Club Melipilla
2. Liceo Curacavi
3. Gobernación de San Antonio
4. Padre Hurtado Basketball
5. Deportivo San Manuel de Melipilla
6. San Luis de San Antonio
7. Club Español de San Antonio
8. Club Esparta de San Antonio

La asignación definitiva de los seis clubes correspondientes a U13 debe respetar la configuración oficial de la competición.

La plataforma debe permitir identificar los clubes por categoría y asociarlos correctamente con sus planteles, encuentros, resultados y estadísticas.

---

## 📋 5. Reglamento y lógica deportiva

Las reglas deportivas constituyen una parte fundamental del sistema. Cualquier cambio en su implementación debe respetar las condiciones establecidas por LIFOBA.

### 5.1. Formato de los encuentros

Los partidos se disputan mediante un sistema de **cuatro cuartos de tiempo semi-cronometrado**.

El marcador debe contemplar:

- Puntos acumulados del equipo local.
- Puntos acumulados del equipo visitante.
- Desglose del marcador por cada uno de los cuatro cuartos.
- Registro consistente del resultado final.

La presentación del marcador debe diferenciar claramente el resultado total del detalle parcial por cuarto.

### 5.2. Regla 3x1 para U15 y U18

En las categorías U15 y U18 se aplica la regla 3x1: un jugador no puede disputar más de tres de los cuatro cuartos reglamentarios.

La solución debe considerar esta restricción en los flujos de gestión de las alineaciones y, cuando corresponda, incorporar validaciones que permitan detectar incumplimientos.

Esta regla no debe extenderse automáticamente a U13 sin una disposición oficial que lo establezca.

### 5.3. Gestión de planteles

El sistema contempla los siguientes límites de inscripción:

- **Nómina inicial:** hasta 20 jugadores por equipo.
- **Ampliación excepcional:** hasta 23 jugadores cuando sea necesario incorporar nuevos jugadores sin eliminar a los previamente registrados.

La gestión de planteles debe conservar la información de los jugadores existentes y evitar duplicaciones o eliminaciones accidentales.

### 5.4. Posiciones de los jugadores

Las posiciones válidas en el sistema son:

| Posición | Descripción |
|---|---|
| Base | Organiza el juego y la distribución del balón. |
| Escolta | Participa en la creación ofensiva y la anotación. |
| Alero | Desempeña funciones ofensivas y defensivas versátiles. |
| Ala-pívot | Combina juego interior, rebotes y aportes ofensivos. |
| Pívot | Participa principalmente en el juego interior, los rebotes y la protección del aro. |

Estas posiciones deben utilizarse de forma consistente en los formularios de jugadores, fichas de plantel y vistas administrativas.

### 5.5. Sistema de clasificación

La tabla de posiciones utiliza puntos de clasificación y diferencia de puntos.

| Indicador | Criterio |
|---|---|
| Victoria | 2 puntos de clasificación |
| Derrota | 1 punto de clasificación |
| Puntos a favor (PF) | Total de puntos anotados |
| Puntos en contra (PC) | Total de puntos recibidos |
| Diferencia de puntos (DP) | PF − PC |

La tabla debe calcular los indicadores a partir de los resultados registrados y aplicar los criterios de desempate definidos para el torneo.

**Importante:** no se debe reemplazar este sistema por puntuaciones basadas en sets ni por sistemas de clasificación genéricos que contradigan las reglas de LIFOBA.

### 5.6. Localías y condiciones de los recintos

Los clubes pueden ejercer la localía en sus propios recintos, de acuerdo con las condiciones establecidas por la organización.

Las condiciones informadas para el torneo incluyen:

- Entrada general: $1.500 CLP.
- Entrada para jugadores: $1.000 CLP.
- Disponibilidad de marcador.
- Reloj de 24 segundos.
- Camarines y condiciones mínimas para el desarrollo de los encuentros.
- Aplicación de multas económicas en situaciones de W.O., conforme a la normativa correspondiente.

Estos antecedentes pueden presentarse en la información administrativa y organizativa del campeonato. Los valores y condiciones deben poder actualizarse cuando la organización publique modificaciones oficiales.

---

## ⚙️ 6. Funcionalidades de la plataforma

La plataforma se organiza en módulos funcionales que conectan la información pública del campeonato con las herramientas de administración.

### 6.1. Inicio y navegación

La página principal debe ofrecer una visión general de la competición, con una navegación intuitiva hacia las categorías, los partidos, los resultados y las posiciones.

Elementos esperados:

- Identidad visual de LIFOBA.
- Acceso a las categorías U13, U15 y U18.
- Información destacada del campeonato.
- Resultados recientes y próximos encuentros, cuando exista información disponible.
- Acceso diferenciado a las herramientas administrativas.

### 6.2. Resultados y marcadores

El módulo de resultados debe permitir consultar los encuentros y sus marcadores finales.

Cada encuentro debe presentar, según la información disponible:

- Equipos participantes.
- Categoría.
- Resultado total.
- Puntuación por cuarto.
- Estado del partido.
- Jugador MVP, cuando haya sido asignado.

### 6.3. Tablas de posiciones

Cada categoría debe disponer de su propia tabla de posiciones.

La vista debe mostrar, como mínimo, los equipos y los indicadores de clasificación disponibles, incluyendo puntos de clasificación, puntos a favor, puntos en contra y diferencia de puntos.

Los datos deben corresponder a los partidos registrados y no depender de valores estáticos definidos únicamente en el frontend.

### 6.4. Gestión de equipos y jugadores

Las herramientas administrativas deben facilitar la consulta y modificación de los planteles.

Las funcionalidades deben respetar:

- Asociación entre jugador, equipo y categoría.
- Posiciones oficiales de básquetbol.
- Límites de inscripción establecidos.
- Conservación de los registros existentes.
- Validaciones para evitar información incompleta o inconsistente.

### 6.5. Administración de partidos

El panel de administración debe permitir gestionar los encuentros y sus resultados, de acuerdo con los permisos disponibles.

La gestión del marcador debe mantener la consistencia entre los puntos totales y el detalle de los cuatro cuartos.

### 6.6. MVP por encuentro

Cada partido puede tener un jugador más valioso (MVP), seleccionado por la administración.

El sistema ya contempla el campo `mvp_player_id` para asociar al jugador reconocido con su encuentro.

La interfaz debe facilitar la selección del MVP, mostrar el reconocimiento en las vistas correspondientes y contemplar el registro fotográfico exigido por la organización como parte del proceso de reconocimiento.

### 6.7. Panel de administración

El panel administrativo centraliza las operaciones de gestión del campeonato.

Su diseño debe priorizar:

- Claridad en los formularios.
- Validaciones visibles y comprensibles.
- Confirmaciones para acciones sensibles.
- Manejo adecuado de errores.
- Coherencia entre la información mostrada y los datos persistidos en Supabase.

Las funciones específicas deben corresponder a las capacidades realmente implementadas y a los permisos de cada usuario.

---

## 🧱 7. Arquitectura y tecnologías

LIFOBA Basketball Hub utiliza una arquitectura web basada en tecnologías modernas de desarrollo frontend y servicios de backend administrados.

| Tecnología | Responsabilidad |
|---|---|
| React | Construcción de interfaces mediante componentes reutilizables. |
| TypeScript / JavaScript | Implementación de la lógica de aplicación, según la configuración del proyecto. |
| Vite | Servidor de desarrollo y proceso de construcción. |
| Tailwind CSS | Estilización y definición de una interfaz consistente. |
| Supabase | Persistencia de datos y servicios backend utilizados por la aplicación. |
| Lovable | Entorno de desarrollo asistido y sincronización con el repositorio. |
| Git y GitHub | Control de versiones y colaboración. |

> **Nota:** la presencia de una tecnología en esta tabla describe el stack previsto del proyecto. La implementación efectiva de TypeScript, autenticación, almacenamiento de imágenes y otras capacidades debe verificarse en el código y la configuración existentes.

### Organización conceptual

La aplicación se puede entender mediante tres capas:

1. **Presentación:** páginas, componentes, navegación, tablas, tarjetas y formularios.
2. **Lógica de aplicación:** validaciones deportivas, gestión de estados, procesamiento de resultados y reglas de presentación.
3. **Persistencia y servicios:** consultas y operaciones sobre Supabase, sujetas a las políticas y restricciones configuradas en la base de datos.

Esta separación facilita mantener una interfaz coherente y reduce el riesgo de duplicar reglas deportivas en distintos componentes.

---

## 🗄️ 8. Modelo de datos y reglas críticas

La migración desde voleibol a básquetbol requiere prestar especial atención a los datos ya adaptados en Supabase.

### 8.1. Marcadores de los encuentros

La tabla `matches` utiliza los siguientes campos para representar los resultados:

| Campo | Propósito |
|---|---|
| `home_points` | Puntos totales del equipo local. |
| `away_points` | Puntos totales del equipo visitante. |
| `score` | Detalle del marcador por cuarto mediante la estructura `QuarterDetail`. |

La columna `score` almacena el detalle por cuartos, mientras que `home_points` y `away_points` representan los totales del encuentro.

**Regla crítica:** no volver a implementar la lógica de sets ni sustituir los campos existentes por un modelo de puntuación de voleibol.

La estructura exacta de `QuarterDetail` debe consultarse en el código y en el esquema vigente antes de modificar cualquier operación de lectura o escritura.

### 8.2. Clasificación

La clasificación debe calcularse a partir de los resultados de básquetbol utilizando:

- Dos puntos de clasificación por victoria.
- Un punto de clasificación por derrota.
- Diferencia de puntos calculada como `PF - PC`.

Se debe revisar que las consultas y funciones de cálculo no dependan de sets, parciales de voleibol ni reglas antiguas de desempate.

### 8.3. Jugadores

Las posiciones válidas son:

`Base`, `Escolta`, `Alero`, `Ala-Pívot`, `Pívot`.

Los formularios, filtros, validaciones y valores persistidos deben utilizar las opciones admitidas por el modelo de datos actual.

### 8.4. Asignación del MVP

El campo `mvp_player_id` permite asociar el jugador reconocido con un partido.

Antes de modificar esta funcionalidad, se debe comprobar la relación existente entre las tablas, las restricciones de integridad y la forma en que el panel administrativo actualiza el registro.

### 8.5. Principios para proteger los datos

- No eliminar columnas ni tablas por asumir que pertenecen a la versión anterior.
- No ejecutar migraciones destructivas sin revisar dependencias.
- No reemplazar estructuras existentes sin verificar sus consumidores.
- Mantener consistentes los resultados totales y los detalles por cuarto.
- Respetar las restricciones y políticas de seguridad configuradas en Supabase.
- Validar las operaciones de escritura tanto en la aplicación como en las capas de persistencia que corresponda.
- Probar los cambios con datos representativos antes de publicarlos.

---

## 🎨 9. Identidad visual y experiencia de usuario

La interfaz debe transmitir una identidad de **básquetbol formativo**, con una presentación moderna, deportiva y profesional.

La adaptación visual debe abarcar toda la aplicación, no únicamente la página principal.

### Dirección de diseño

- **Paleta cromática:** colores deportivos coherentes, con tonos oscuros para estructura y contraste, y acentos cálidos asociados visualmente al básquetbol.
- **Jerarquía visual:** títulos, marcadores, estadísticas y acciones claramente diferenciados.
- **Espaciado:** distribución limpia, alineaciones consistentes y separación suficiente entre secciones.
- **Componentes:** tarjetas, tablas, formularios, botones y ventanas de confirmación con estilos compartidos.
- **Diseño adaptable:** experiencia funcional en dispositivos móviles, tabletas y pantallas de escritorio.
- **Accesibilidad:** contraste legible, etiquetas descriptivas, estados visibles y controles comprensibles.

### Componentes prioritarios para la revisión

- `AppShell` y estructura general de navegación.
- Página `Home`.
- Tarjetas de partidos, equipos y jugadores.
- Tablas de posiciones.
- Vistas de resultados y marcadores.
- Formularios de administración.
- Selectores de categorías, posiciones y MVP.
- Mensajes de error, confirmaciones y estados vacíos.

Los nombres anteriores son referencias de componentes que deben localizarse en el repositorio; su estructura exacta puede variar.

### Limpieza de la herencia de voleibol

La revisión debe eliminar referencias obsoletas en:

- Textos visibles y etiquetas.
- Placeholders y mensajes de validación.
- Nombres de variables y funciones que ya no representen la lógica actual.
- Opciones de formularios.
- Cálculos de resultados y clasificación.
- Datos de demostración.
- Comentarios y documentación desactualizados.

No se deben modificar indiscriminadamente nombres de campos persistidos o contratos de API sin analizar sus dependencias.

---

## 💻 10. Instalación y desarrollo local

### Requisitos previos

- Node.js en una versión compatible con el proyecto.
- npm.
- Git.
- Acceso a las variables y credenciales de Supabase necesarias para el entorno de desarrollo.

Se recomienda utilizar una versión LTS de Node.js compatible con las dependencias del repositorio.

### Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_REPOSITORIO>
```

### Instalar dependencias

```bash
npm install
```

### Configurar las variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las variables requeridas por la configuración actual.

Los nombres deben verificarse en los archivos de inicialización de Supabase y en la documentación del repositorio.

### Iniciar el servidor de desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para acceder a la aplicación.

### Construir para producción

```bash
npm run build
```

### Revisar el código

```bash
npm run lint
```

Este último comando debe utilizarse si el script `lint` está definido en `package.json`.

Para conocer todos los comandos disponibles:

```bash
npm run
```

---

## 🔐 11. Variables de entorno

La aplicación puede requerir variables para conectar el frontend con Supabase.

En una configuración habitual de Vite, los nombres pueden ser:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Estos nombres son ejemplos: **se deben conservar los nombres que realmente utiliza el repositorio**.

Consideraciones de seguridad:

- No publicar contraseñas, tokens privados ni claves de servicio.
- No incluir archivos `.env` con credenciales reales en Git.
- Utilizar únicamente credenciales apropiadas para el frontend.
- Mantener activas y correctamente configuradas las políticas de acceso de Supabase.
- Verificar permisos de lectura y escritura antes de desplegar.
- Gestionar las claves privilegiadas exclusivamente en entornos seguros de servidor.

---

## 🔄 12. Flujo de desarrollo con Lovable

El proyecto utiliza [Lovable](https://lovable.dev) como entorno de desarrollo asistido y mantiene una integración con GitHub.

**Editor del proyecto:**  
[Continuar desarrollando en Lovable](https://lovable.dev/projects/4906f8ad-63c6-4c02-bd44-74f543905370)

### Flujo de trabajo recomendado

1. Revisar el componente o funcionalidad existente antes de solicitar cambios.
2. Definir el alcance de cada modificación.
3. Identificar las dependencias con Supabase y otros componentes.
4. Implementar los cambios procurando reutilizar los patrones existentes.
5. Revisar el resultado visual en las distintas resoluciones.
6. Ejecutar las comprobaciones disponibles.
7. Probar las operaciones que consultan o modifican datos.
8. Confirmar los cambios en Git y verificar la sincronización con el repositorio.

### Criterios para solicitar cambios a Lovable

- Mantener la arquitectura existente salvo que exista una justificación concreta para modificarla.
- No reconstruir módulos que ya funcionan sin necesidad.
- Respetar el esquema de Supabase y sus relaciones.
- Evitar regresiones en la administración de resultados y jugadores.
- Aplicar los estilos compartidos en lugar de crear variantes inconsistentes.
- Confirmar que los cambios deportivos sean compatibles con las reglas oficiales.
- No dar por implementada una funcionalidad únicamente porque exista un elemento visual para ella.

---

## 🗺️ 13. Hoja de ruta

La siguiente hoja de ruta representa las prioridades de evolución del proyecto, no una afirmación de que todas estas tareas estén pendientes.

### Fase 1 · Consolidación visual

- [ ] Unificar la navegación y la estructura de las páginas.
- [ ] Definir una paleta cromática y un sistema consistente de componentes.
- [ ] Adaptar las tarjetas, tablas y formularios al básquetbol.
- [ ] Revisar la experiencia en dispositivos móviles.

### Fase 2 · Consistencia deportiva

- [ ] Auditar las referencias heredadas de voleibol.
- [ ] Validar los marcadores por cuarto y los totales.
- [ ] Comprobar los cálculos de clasificación y diferencia de puntos.
- [ ] Revisar las categorías y posiciones de los jugadores.
- [ ] Validar los límites de inscripción de los planteles.
- [ ] Revisar los flujos relacionados con la regla 3x1 en U15 y U18.

### Fase 3 · Administración y reconocimientos

- [ ] Revisar el flujo de asignación del MVP.
- [ ] Verificar la consistencia entre jugadores, equipos y partidos.
- [ ] Mejorar las validaciones y los mensajes administrativos.
- [ ] Definir el flujo de registro y presentación de las fotografías de los MVP, si aún no está implementado.

### Fase 4 · Calidad y publicación

- [ ] Probar las principales operaciones de la aplicación.
- [ ] Revisar las políticas de seguridad y permisos de Supabase.
- [ ] Verificar el comportamiento de la aplicación con distintos tamaños de pantalla.
- [ ] Ejecutar las comprobaciones de compilación y calidad disponibles.
- [ ] Preparar el despliegue y documentar los procedimientos operativos.

---

## 🏅 14. Patrocinio y reconocimientos

### Patrocinador oficial

La competición cuenta con el auspicio principal de **Clínica Dental Obident**.

La identidad del patrocinador debe integrarse de manera coherente con la imagen de LIFOBA, respetando los recursos gráficos oficiales y sin afectar la legibilidad de la interfaz.

### Reconocimiento MVP

Cada encuentro debe contemplar la elección de un jugador más valioso (MVP).

El reconocimiento incluye:

- Selección del jugador por parte de la administración.
- Asociación del MVP con el encuentro correspondiente.
- Entrega de un reconocimiento físico.
- Registro fotográfico del jugador reconocido.

### Premiación del campeonato

La liga contempla reconocimientos para los equipos que finalicen en los siguientes lugares:

- Primer lugar.
- Segundo lugar.
- Tercer lugar.

La premiación informada considera 14 medallas y un trofeo por cada lugar premiado, según las condiciones de organización del campeonato.

---

## 🤝 15. Contribuciones

Las mejoras y correcciones deben mantener la coherencia técnica y deportiva de la plataforma.

Antes de proponer un cambio, se recomienda:

1. Identificar el módulo afectado.
2. Revisar las dependencias y el modelo de datos.
3. Comprobar que no se introduzcan referencias a reglas de voleibol.
4. Verificar que las funcionalidades existentes sigan operativas.
5. Documentar cualquier modificación relevante del modelo de datos o de las reglas deportivas.

Los cambios que afecten a la clasificación, la puntuación, la elegibilidad de los jugadores o las reglas del campeonato deben contrastarse con la normativa oficial antes de su incorporación.

---

## 📄 Licencia y propiedad del código

Este repositorio contiene el código fuente de LIFOBA Basketball Hub. La licencia de distribución y reutilización debe consultarse en el archivo de licencia del repositorio, si existe.

---

<p align="center">
  <strong>LIFOBA Basketball Hub</strong><br/>
  Básquetbol formativo · Organización · Comunidad · Competencia
</p>

<p align="center">
  <sub>Clausura 2026 · Liga Formativa de Básquetbol</sub>
</p>
