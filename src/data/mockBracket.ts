import type { Bracket, Match, RoundId, Slot, Team } from '../types/bracket'

// Datos reales del Mundial 2026 (contrastados, julio 2026), en el mismo estado
// que carga supabase/setup.sql. Se usan como fallback si Supabase no está
// configurado o falla. `code` es el código para flag-icons.

const TEAM_LIST: Team[] = [
  { id: 'za', name: 'Sudáfrica', code: 'za' },
  { id: 'ca', name: 'Canadá', code: 'ca' },
  { id: 'br', name: 'Brasil', code: 'br' },
  { id: 'jp', name: 'Japón', code: 'jp' },
  { id: 'de', name: 'Alemania', code: 'de' },
  { id: 'py', name: 'Paraguay', code: 'py' },
  { id: 'nl', name: 'Países Bajos', code: 'nl' },
  { id: 'ma', name: 'Marruecos', code: 'ma' },
  { id: 'ci', name: 'Costa de Marfil', code: 'ci' },
  { id: 'no', name: 'Noruega', code: 'no' },
  { id: 'fr', name: 'Francia', code: 'fr' },
  { id: 'se', name: 'Suecia', code: 'se' },
  { id: 'mx', name: 'México', code: 'mx' },
  { id: 'ec', name: 'Ecuador', code: 'ec' },
  { id: 'gb-eng', name: 'Inglaterra', code: 'gb-eng' },
  { id: 'cd', name: 'RD Congo', code: 'cd' },
  { id: 'be', name: 'Bélgica', code: 'be' },
  { id: 'sn', name: 'Senegal', code: 'sn' },
  { id: 'us', name: 'Estados Unidos', code: 'us' },
  { id: 'ba', name: 'Bosnia y Herzegovina', code: 'ba' },
  { id: 'es', name: 'España', code: 'es' },
  { id: 'at', name: 'Austria', code: 'at' },
  { id: 'pt', name: 'Portugal', code: 'pt' },
  { id: 'hr', name: 'Croacia', code: 'hr' },
  { id: 'ch', name: 'Suiza', code: 'ch' },
  { id: 'dz', name: 'Argelia', code: 'dz' },
  { id: 'au', name: 'Australia', code: 'au' },
  { id: 'eg', name: 'Egipto', code: 'eg' },
  { id: 'ar', name: 'Argentina', code: 'ar' },
  { id: 'cv', name: 'Cabo Verde', code: 'cv' },
  { id: 'co', name: 'Colombia', code: 'co' },
  { id: 'gh', name: 'Ghana', code: 'gh' },
]

const teams: Record<string, Team> = Object.fromEntries(
  TEAM_LIST.map((t) => [t.id, t]),
)

const T = (teamId: string): Slot => ({ teamId })
const W = (matchId: string): Slot => ({ winnerOf: matchId })

interface MatchSeed {
  id: string
  round: RoundId
  order: number
  kickoff: string
  venue: string
  home: Slot
  away: Slot
  home_score?: number
  away_score?: number
  pens?: [number, number]
  status?: Match['status']
}

function m(seed: MatchSeed): Match {
  return {
    id: seed.id,
    round: seed.round,
    order: seed.order,
    kickoff: seed.kickoff,
    venue: seed.venue,
    home: seed.home,
    away: seed.away,
    homeScore: seed.home_score ?? null,
    awayScore: seed.away_score ?? null,
    penalties: seed.pens ?? null,
    status: seed.status ?? 'scheduled',
  }
}

// ————— Dieciseisavos (resultados reales) —————
const r32: Match[] = [
  m({ id: 'm32_1', round: 'r32', order: 1, kickoff: '2026-06-28T12:00:00-07:00', venue: 'SoFi Stadium · Los Ángeles', home: T('za'), away: T('ca'), home_score: 0, away_score: 1, status: 'finished' }),
  m({ id: 'm32_2', round: 'r32', order: 2, kickoff: '2026-06-29T12:00:00-05:00', venue: 'NRG Stadium · Houston', home: T('br'), away: T('jp'), home_score: 2, away_score: 1, status: 'finished' }),
  m({ id: 'm32_3', round: 'r32', order: 3, kickoff: '2026-06-29T16:30:00-04:00', venue: 'Gillette Stadium · Boston', home: T('de'), away: T('py'), home_score: 1, away_score: 1, pens: [3, 4], status: 'finished' }),
  m({ id: 'm32_4', round: 'r32', order: 4, kickoff: '2026-06-30T18:00:00-06:00', venue: 'Estadio BBVA · Monterrey', home: T('nl'), away: T('ma'), home_score: 1, away_score: 1, pens: [2, 3], status: 'finished' }),
  m({ id: 'm32_5', round: 'r32', order: 5, kickoff: '2026-06-30T15:00:00-07:00', venue: 'BC Place · Vancouver', home: T('ci'), away: T('no'), home_score: 1, away_score: 2, status: 'finished' }),
  m({ id: 'm32_6', round: 'r32', order: 6, kickoff: '2026-07-01T18:00:00-04:00', venue: 'MetLife Stadium · Nueva York/N.J.', home: T('fr'), away: T('se'), home_score: 3, away_score: 0, status: 'finished' }),
  m({ id: 'm32_7', round: 'r32', order: 7, kickoff: '2026-07-01T17:00:00-06:00', venue: 'Estadio Akron · Guadalajara', home: T('mx'), away: T('ec'), home_score: 2, away_score: 0, status: 'finished' }),
  m({ id: 'm32_8', round: 'r32', order: 8, kickoff: '2026-07-02T18:00:00-04:00', venue: 'Lincoln Financial Field · Filadelfia', home: T('gb-eng'), away: T('cd'), home_score: 2, away_score: 1, status: 'finished' }),
  m({ id: 'm32_9', round: 'r32', order: 9, kickoff: '2026-07-02T20:00:00-05:00', venue: 'Arrowhead Stadium · Kansas City', home: T('be'), away: T('sn'), home_score: 3, away_score: 2, status: 'finished' }),
  m({ id: 'm32_10', round: 'r32', order: 10, kickoff: '2026-07-02T19:00:00-07:00', venue: 'Lumen Field · Seattle', home: T('us'), away: T('ba'), home_score: 2, away_score: 0, status: 'finished' }),
  m({ id: 'm32_11', round: 'r32', order: 11, kickoff: '2026-07-03T15:00:00-05:00', venue: 'AT&T Stadium · Dallas', home: T('es'), away: T('at'), home_score: 3, away_score: 0, status: 'finished' }),
  m({ id: 'm32_12', round: 'r32', order: 12, kickoff: '2026-07-03T18:00:00-04:00', venue: 'Hard Rock Stadium · Miami', home: T('pt'), away: T('hr'), home_score: 2, away_score: 1, status: 'finished' }),
  m({ id: 'm32_13', round: 'r32', order: 13, kickoff: '2026-07-03T16:00:00-07:00', venue: "Levi's Stadium · San Francisco", home: T('ch'), away: T('dz'), home_score: 2, away_score: 0, status: 'finished' }),
  m({ id: 'm32_14', round: 'r32', order: 14, kickoff: '2026-07-03T21:00:00-04:00', venue: 'Mercedes-Benz Stadium · Atlanta', home: T('au'), away: T('eg'), home_score: 1, away_score: 1, pens: [2, 4], status: 'finished' }),
  m({ id: 'm32_15', round: 'r32', order: 15, kickoff: '2026-07-03T19:00:00-06:00', venue: 'Estadio Azteca · Ciudad de México', home: T('ar'), away: T('cv'), home_score: 3, away_score: 2, status: 'finished' }),
  m({ id: 'm32_16', round: 'r32', order: 16, kickoff: '2026-07-03T20:00:00-04:00', venue: 'BMO Field · Toronto', home: T('co'), away: T('gh'), home_score: 1, away_score: 0, status: 'finished' }),
]

// ————— Octavos (cruces reales, programados) —————
const r16: Match[] = [
  m({ id: 'm16_1', round: 'r16', order: 1, kickoff: '2026-07-04T15:00:00-05:00', venue: 'NRG Stadium · Houston', home: W('m32_1'), away: W('m32_4') }),
  m({ id: 'm16_2', round: 'r16', order: 2, kickoff: '2026-07-04T18:00:00-04:00', venue: 'Lincoln Financial Field · Filadelfia', home: W('m32_3'), away: W('m32_6') }),
  m({ id: 'm16_3', round: 'r16', order: 3, kickoff: '2026-07-05T16:00:00-04:00', venue: 'MetLife Stadium · Nueva York/N.J.', home: W('m32_2'), away: W('m32_5') }),
  m({ id: 'm16_4', round: 'r16', order: 4, kickoff: '2026-07-05T18:00:00-06:00', venue: 'Estadio Azteca · Ciudad de México', home: W('m32_7'), away: W('m32_8') }),
  m({ id: 'm16_5', round: 'r16', order: 5, kickoff: '2026-07-06T15:00:00-05:00', venue: 'AT&T Stadium · Dallas', home: W('m32_12'), away: W('m32_11') }),
  m({ id: 'm16_6', round: 'r16', order: 6, kickoff: '2026-07-06T17:00:00-07:00', venue: 'Lumen Field · Seattle', home: W('m32_10'), away: W('m32_9') }),
  m({ id: 'm16_7', round: 'r16', order: 7, kickoff: '2026-07-07T18:00:00-04:00', venue: 'Mercedes-Benz Stadium · Atlanta', home: W('m32_15'), away: W('m32_14') }),
  m({ id: 'm16_8', round: 'r16', order: 8, kickoff: '2026-07-07T16:00:00-07:00', venue: 'BC Place · Vancouver', home: W('m32_13'), away: W('m32_16') }),
]

// ————— Cuartos —————
const qf: Match[] = [
  m({ id: 'qf_1', round: 'qf', order: 1, kickoff: '2026-07-09T18:00:00-04:00', venue: 'Gillette Stadium · Boston', home: W('m16_1'), away: W('m16_2') }),
  m({ id: 'qf_2', round: 'qf', order: 2, kickoff: '2026-07-11T18:00:00-04:00', venue: 'Hard Rock Stadium · Miami', home: W('m16_3'), away: W('m16_4') }),
  m({ id: 'qf_3', round: 'qf', order: 3, kickoff: '2026-07-10T16:00:00-07:00', venue: 'SoFi Stadium · Los Ángeles', home: W('m16_5'), away: W('m16_6') }),
  m({ id: 'qf_4', round: 'qf', order: 4, kickoff: '2026-07-11T15:00:00-05:00', venue: 'Arrowhead Stadium · Kansas City', home: W('m16_7'), away: W('m16_8') }),
]

// ————— Semifinales —————
const sf: Match[] = [
  m({ id: 'sf_1', round: 'sf', order: 1, kickoff: '2026-07-14T19:00:00-05:00', venue: 'AT&T Stadium · Dallas', home: W('qf_1'), away: W('qf_2') }),
  m({ id: 'sf_2', round: 'sf', order: 2, kickoff: '2026-07-15T19:00:00-04:00', venue: 'Mercedes-Benz Stadium · Atlanta', home: W('qf_3'), away: W('qf_4') }),
]

// ————— Final —————
const final: Match[] = [
  m({ id: 'final_1', round: 'final', order: 1, kickoff: '2026-07-19T15:00:00-04:00', venue: 'MetLife Stadium · Nueva York/N.J.', home: W('sf_1'), away: W('sf_2') }),
]

export const mockBracket: Bracket = {
  teams,
  matches: [...r32, ...r16, ...qf, ...sf, ...final],
}
