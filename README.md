# Mundial 2026 · Cuadro de fases finales

Cuadro interactivo y responsive de la fase eliminatoria del Mundial 2026
(dieciseisavos → octavos → cuartos → semifinales → final), construido con
**React + TypeScript + Vite**.

- Banderas SVG (`flag-icons`), nombres y marcadores de cada equipo.
- Fechas y horas mostradas en la **zona horaria local** del visitante.
- Los ganadores **avanzan automáticamente** a la siguiente ronda (los huecos sin
  decidir muestran «Ganador 1/8 · P3»).
- Estados de partido: programado, **en directo** (con pulso) y final.
- Vista de cuadro completo en escritorio; **pestañas por ronda** en móvil.
- Datos mock incluidos: funciona sin backend. Al configurar Supabase, tira de ahí.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173 (o 5183 con la config de .claude)
npm run build     # type-check + build de producción en dist/
npm run preview   # sirve el build
```

## Datos: Supabase (opcional)

El frontend usa datos mock (`src/data/mockBracket.ts`) mientras no haya Supabase
configurado. Para conectar tu base de datos:

Todo vive en un **schema propio `mundial2026`** (aislado de `public`), así que
puedes reutilizar un proyecto Supabase existente sin mezclar tablas.

1. Usa tu proyecto de [supabase.com](https://supabase.com) (o crea uno).
2. Abre el **SQL Editor**, pega el contenido de [`supabase/setup.sql`](supabase/setup.sql)
   y ejecútalo. Crea el schema `mundial2026`, sus tablas, los grants, activa RLS,
   registra `matches` en realtime y **carga todos los datos iniciales**
   (los mismos 32 equipos y 31 partidos del mock).
3. **Expón el schema**: Settings → API → **Exposed schemas** → añade `mundial2026`
   y guarda. Sin esto, PostgREST no deja consultar el schema y las lecturas fallan.
4. Copia `.env.example` a `.env.local` y rellena `VITE_SUPABASE_URL` y
   `VITE_SUPABASE_ANON_KEY` (Project Settings → API → «Project URL» y «anon public»).
5. **Reinicia** `npm run dev` (Vite solo lee el `.env` al arrancar). La cabecera
   mostrará el badge verde **«Conectado»**.

### Seguridad (importante)

La **anon key** está diseñada para ir en el frontend: **no es un secreto**. Lo que
protege tus datos es **Row Level Security (RLS)** con solo políticas de `SELECT`.
La `service_role` key **nunca** debe aparecer en el frontend ni en este repo — solo
la usas tú desde el panel de Supabase para editar los datos a mano.

### Esquema y datos

Todo el SQL (tablas, RLS y datos iniciales) está en
[`supabase/setup.sql`](supabase/setup.sql), listo para pegar en el SQL Editor.

**Tabla `teams`**: `id`, `name`, `code` (código flag-icons: `es`, `ar`, `gb-eng`…).

**Tabla `matches`**: `id`, `round` (`r32`/`r16`/`qf`/`sf`/`final`), `order`,
`kickoff` (timestamptz), `venue`, y para cada lado **o** un equipo (`home_team`)
**o** el ganador de otro partido (`home_winner_of`) — nunca ambos. Más
`home_score`/`away_score`, `pen_home`/`pen_away` y `status`
(`scheduled`/`live`/`finished`).

Para cada partido, rellena **o** `home_team` **o** `home_winner_of` (no ambos);
igual con el lado visitante. Cuando marques un partido como `finished` con su
marcador, el ganador aparecerá solo en la ronda siguiente.

### Tiempo real (condicional, ya implementado)

`src/hooks/useBracket.ts` abre una suscripción realtime (WebSocket) **solo cuando
hay algún partido dentro de su ventana de juego** (desde su `kickoff` y durante
3 h, o si lo marcas `status = 'live'`). Fuera de esas ventanas **no hay ninguna
conexión abierta**: se usa la carga inicial y punto. Un temporizador en cliente
(que no consulta nada) re-evalúa en la siguiente frontera para engancharse o
soltarse solo. Mientras hay partido activo, la cabecera muestra **«En directo»**.

Esto evita coste innecesario: el realtime de Supabase **no hace polling** (no
lanza consultas repetidas), solo empuja cambios cuando los hay; y aquí ni siquiera
mantiene la conexión abierta si no se está jugando nada. El único límite a vigilar
es el de **conexiones concurrentes** (200 en el plan Free = 200 espectadores a la
vez). Ajusta la ventana con `LIVE_WINDOW_MS` en el hook.

## Estructura

```
src/
├── components/    Bracket, RoundColumn, MatchCard, TeamRow, Flag
├── data/          mockBracket.ts  (datos de ejemplo)
├── hooks/         useBracket.ts   (mock ↔ Supabase con fallback)
├── lib/           supabase.ts     (cliente de solo lectura)
├── types/         bracket.ts      (modelo + resolución de ganadores)
└── utils/         datetime.ts     (formato es-ES, zona local)
```
