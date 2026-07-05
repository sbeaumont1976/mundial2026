-- ============================================================
--  Mundial 2026 · Setup completo de Supabase (DATOS REALES)
--  Schema propio: `mundial2026`. Pega TODO en el SQL Editor.
--
--  Contenido real (contrastado con Wikipedia, julio 2026):
--   · 32 selecciones clasificadas a dieciseisavos.
--   · Los 16 resultados REALES de dieciseisavos (Round of 32).
--   · Octavos → final: cruces oficiales cableados por "ganador de…".
--     Se dejan PROGRAMADOS (sin marcador): los de octavos con marcador
--     circulando son contradictorios entre fuentes y/o aún no jugados hoy,
--     así que no se cargan resultados no verificados. Los metes tú según
--     se jueguen (Table Editor), y los equipos avanzan solos.
--
--  Nota: fecha/sede de dieciseisavos están confirmadas para los primeros
--  partidos; para el resto se usa una sede REAL del Mundial pero la
--  asignación exacta partido↔sede/hora es aproximada (revísala si quieres).
--  Los RESULTADOS de dieciseisavos sí son reales.
--
--  ⚠️ Tras ejecutar: Settings → API → "Exposed schemas" → añade `mundial2026`.
-- ============================================================

create schema if not exists mundial2026;

-- ————— Esquema —————

create table if not exists mundial2026.teams (
  id   text primary key,
  name text not null,
  code text not null                 -- código flag-icons: 'es', 'ar', 'gb-eng'…
);

create table if not exists mundial2026.matches (
  id             text primary key,
  round          text not null check (round in ('r32','r16','qf','sf','final')),
  "order"        int  not null,
  kickoff        timestamptz not null,
  venue          text not null,
  home_team      text references mundial2026.teams(id),
  home_winner_of text references mundial2026.matches(id),
  away_team      text references mundial2026.teams(id),
  away_winner_of text references mundial2026.matches(id),
  home_score     int,
  away_score     int,
  pen_home       int,
  pen_away       int,
  status         text not null default 'scheduled'
                 check (status in ('scheduled','live','finished'))
);

-- ————— Grants —————
grant usage on schema mundial2026 to anon, authenticated, service_role;
grant select on all tables in schema mundial2026 to anon, authenticated;
grant all    on all tables in schema mundial2026 to service_role;
alter default privileges in schema mundial2026 grant select on tables to anon, authenticated;
alter default privileges in schema mundial2026 grant all    on tables to service_role;

-- ————— Row Level Security: lectura pública, escritura ninguna —————
alter table mundial2026.teams   enable row level security;
alter table mundial2026.matches enable row level security;

drop policy if exists "lectura publica teams"   on mundial2026.teams;
drop policy if exists "lectura publica matches" on mundial2026.matches;

create policy "lectura publica teams"
  on mundial2026.teams for select using (true);
create policy "lectura publica matches"
  on mundial2026.matches for select using (true);

-- ————— Realtime (solo matches) —————
do $$
begin
  alter publication supabase_realtime add table mundial2026.matches;
exception
  when duplicate_object then null;
end $$;

-- ————— Recarga limpia de datos —————
-- (matches primero por la FK a teams)
delete from mundial2026.matches;
delete from mundial2026.teams;

-- ————— Equipos (32 clasificados reales) —————

insert into mundial2026.teams (id, name, code) values
  ('za', 'Sudáfrica', 'za'),
  ('ca', 'Canadá', 'ca'),
  ('br', 'Brasil', 'br'),
  ('jp', 'Japón', 'jp'),
  ('de', 'Alemania', 'de'),
  ('py', 'Paraguay', 'py'),
  ('nl', 'Países Bajos', 'nl'),
  ('ma', 'Marruecos', 'ma'),
  ('ci', 'Costa de Marfil', 'ci'),
  ('no', 'Noruega', 'no'),
  ('fr', 'Francia', 'fr'),
  ('se', 'Suecia', 'se'),
  ('mx', 'México', 'mx'),
  ('ec', 'Ecuador', 'ec'),
  ('gb-eng', 'Inglaterra', 'gb-eng'),
  ('cd', 'RD Congo', 'cd'),
  ('be', 'Bélgica', 'be'),
  ('sn', 'Senegal', 'sn'),
  ('us', 'Estados Unidos', 'us'),
  ('ba', 'Bosnia y Herzegovina', 'ba'),
  ('es', 'España', 'es'),
  ('at', 'Austria', 'at'),
  ('pt', 'Portugal', 'pt'),
  ('hr', 'Croacia', 'hr'),
  ('ch', 'Suiza', 'ch'),
  ('dz', 'Argelia', 'dz'),
  ('au', 'Australia', 'au'),
  ('eg', 'Egipto', 'eg'),
  ('ar', 'Argentina', 'ar'),
  ('cv', 'Cabo Verde', 'cv'),
  ('co', 'Colombia', 'co'),
  ('gh', 'Ghana', 'gh');

-- ————— Dieciseisavos (Round of 32) · RESULTADOS REALES —————

insert into mundial2026.matches
  (id, round, "order", kickoff, venue,
   home_team, home_winner_of, away_team, away_winner_of,
   home_score, away_score, pen_home, pen_away, status) values
  ('m32_1',  'r32', 1,  '2026-06-28T21:00:00+02:00', 'SoFi Stadium · Los Ángeles',        'za', null, 'ca', null, 0, 1, null, null, 'finished'),
  ('m32_2',  'r32', 2,  '2026-06-29T19:00:00+02:00', 'NRG Stadium · Houston',             'br', null, 'jp', null, 2, 1, null, null, 'finished'),
  ('m32_3',  'r32', 3,  '2026-06-29T22:30:00+02:00', 'Gillette Stadium · Boston',         'de', null, 'py', null, 1, 1, 3, 4, 'finished'),
  ('m32_4',  'r32', 4,  '2026-06-30T18:00:00-06:00', 'Estadio BBVA · Monterrey',          'nl', null, 'ma', null, 1, 1, 2, 3, 'finished'),
  ('m32_5',  'r32', 5,  '2026-06-30T15:00:00-07:00', 'BC Place · Vancouver',              'ci', null, 'no', null, 1, 2, null, null, 'finished'),
  ('m32_6',  'r32', 6,  '2026-07-01T18:00:00-04:00', 'MetLife Stadium · Nueva York/N.J.', 'fr', null, 'se', null, 3, 0, null, null, 'finished'),
  ('m32_7',  'r32', 7,  '2026-07-01T17:00:00-06:00', 'Estadio Akron · Guadalajara',       'mx', null, 'ec', null, 2, 0, null, null, 'finished'),
  ('m32_8',  'r32', 8,  '2026-07-02T18:00:00-04:00', 'Lincoln Financial Field · Filadelfia','gb-eng', null, 'cd', null, 2, 1, null, null, 'finished'),
  ('m32_9',  'r32', 9,  '2026-07-02T20:00:00-05:00', 'Arrowhead Stadium · Kansas City',   'be', null, 'sn', null, 3, 2, null, null, 'finished'),
  ('m32_10', 'r32', 10, '2026-07-02T19:00:00-07:00', 'Lumen Field · Seattle',             'us', null, 'ba', null, 2, 0, null, null, 'finished'),
  ('m32_11', 'r32', 11, '2026-07-03T15:00:00-05:00', 'AT&T Stadium · Dallas',             'es', null, 'at', null, 3, 0, null, null, 'finished'),
  ('m32_12', 'r32', 12, '2026-07-03T18:00:00-04:00', 'Hard Rock Stadium · Miami',         'pt', null, 'hr', null, 2, 1, null, null, 'finished'),
  ('m32_13', 'r32', 13, '2026-07-03T16:00:00-07:00', 'Levi''s Stadium · San Francisco',   'ch', null, 'dz', null, 2, 0, null, null, 'finished'),
  ('m32_14', 'r32', 14, '2026-07-03T21:00:00-04:00', 'Mercedes-Benz Stadium · Atlanta',   'au', null, 'eg', null, 1, 1, 2, 4, 'finished'),
  ('m32_15', 'r32', 15, '2026-07-03T19:00:00-06:00', 'Estadio Azteca · Ciudad de México', 'ar', null, 'cv', null, 3, 2, null, null, 'finished'),
  ('m32_16', 'r32', 16, '2026-07-03T20:00:00-04:00', 'BMO Field · Toronto',               'co', null, 'gh', null, 1, 0, null, null, 'finished');

-- ————— Octavos (Round of 16) · cruces reales, PROGRAMADOS —————
-- Cada lado = ganador del dieciseisavos correspondiente (avanza solo).

insert into mundial2026.matches
  (id, round, "order", kickoff, venue,
   home_team, home_winner_of, away_team, away_winner_of,
   home_score, away_score, pen_home, pen_away, status) values
  ('m16_1', 'r16', 1, '2026-07-04T19:00:00+02:00', 'NRG Stadium · Houston',             null, 'm32_1',  null, 'm32_4',  null, null, null, null, 'scheduled'),
  ('m16_2', 'r16', 2, '2026-07-04T23:00:00+02:00', 'Lincoln Financial Field · Filadelfia', null, 'm32_3', null, 'm32_6', null, null, null, null, 'scheduled'),
  ('m16_3', 'r16', 3, '2026-07-05T22:00:00+02:00', 'MetLife Stadium · Nueva York/N.J.', null, 'm32_2',  null, 'm32_5',  null, null, null, null, 'scheduled'),
  ('m16_4', 'r16', 4, '2026-07-06T02:00:00+02:00', 'Estadio Azteca · Ciudad de México', null, 'm32_7',  null, 'm32_8',  null, null, null, null, 'scheduled'),
  ('m16_5', 'r16', 5, '2026-07-06T21:00:00+02:00', 'AT&T Stadium · Dallas',             null, 'm32_12', null, 'm32_11', null, null, null, null, 'scheduled'),
  ('m16_6', 'r16', 6, '2026-07-07T02:00:00+02:00', 'Lumen Field · Seattle',             null, 'm32_10', null, 'm32_9',  null, null, null, null, 'scheduled'),
  ('m16_7', 'r16', 7, '2026-07-07T18:00:00+02:00', 'Mercedes-Benz Stadium · Atlanta',   null, 'm32_15', null, 'm32_14', null, null, null, null, 'scheduled'),
  ('m16_8', 'r16', 8, '2026-07-07T22:00:00+02:00', 'BC Place · Vancouver',              null, 'm32_13', null, 'm32_16', null, null, null, null, 'scheduled');

-- ————— Cuartos (Round of 16 winners) —————

insert into mundial2026.matches
  (id, round, "order", kickoff, venue,
   home_team, home_winner_of, away_team, away_winner_of,
   home_score, away_score, pen_home, pen_away, status) values
  ('qf_1', 'qf', 1, '2026-07-09T22:00:00+02:00', 'Gillette Stadium · Boston',       null, 'm16_1', null, 'm16_2', null, null, null, null, 'scheduled'),
  ('qf_2', 'qf', 2, '2026-07-11T23:00:00+02:00', 'Hard Rock Stadium · Miami',       null, 'm16_3', null, 'm16_4', null, null, null, null, 'scheduled'),
  ('qf_3', 'qf', 3, '2026-07-10T21:00:00+02:00', 'SoFi Stadium · Los Ángeles',      null, 'm16_5', null, 'm16_6', null, null, null, null, 'scheduled'),
  ('qf_4', 'qf', 4, '2026-07-12T03:00:00+02:00', 'Arrowhead Stadium · Kansas City', null, 'm16_7', null, 'm16_8', null, null, null, null, 'scheduled');

-- ————— Semifinales —————

insert into mundial2026.matches
  (id, round, "order", kickoff, venue,
   home_team, home_winner_of, away_team, away_winner_of,
   home_score, away_score, pen_home, pen_away, status) values
  ('sf_1', 'sf', 1, '2026-07-14T21:00:00+02:00', 'AT&T Stadium · Dallas',           null, 'qf_1', null, 'qf_2', null, null, null, null, 'scheduled'),
  ('sf_2', 'sf', 2, '2026-07-15T21:00:00+02:00', 'Mercedes-Benz Stadium · Atlanta', null, 'qf_3', null, 'qf_4', null, null, null, null, 'scheduled');

-- ————— Final —————

insert into mundial2026.matches
  (id, round, "order", kickoff, venue,
   home_team, home_winner_of, away_team, away_winner_of,
   home_score, away_score, pen_home, pen_away, status) values
  ('final_1', 'final', 1, '2026-07-19T21:00:00+02:00', 'MetLife Stadium · Nueva York/N.J.', null, 'sf_1', null, 'sf_2', null, null, null, null, 'scheduled');
