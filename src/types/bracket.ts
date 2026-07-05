// Modelo de dominio del cuadro de fases finales.
// Pensado para mapear 1:1 con tablas de Supabase más adelante (ver src/lib/supabase.ts).

export type RoundId = 'r32' | 'r16' | 'qf' | 'sf' | 'final'

export interface Round {
  id: RoundId
  /** Nombre corto para pestañas móviles */
  short: string
  /** Nombre completo para cabeceras */
  label: string
}

export const ROUNDS: Round[] = [
  { id: 'r32', short: '1/16', label: 'Dieciseisavos' },
  { id: 'r16', short: '1/8', label: 'Octavos' },
  { id: 'qf', short: '1/4', label: 'Cuartos' },
  { id: 'sf', short: '1/2', label: 'Semifinales' },
  { id: 'final', short: 'Final', label: 'Final' },
]

export interface Team {
  /** Identificador estable (p.ej. 'ar', 'br'); útil como clave */
  id: string
  name: string
  /** Código para flag-icons: ISO 3166-1 alpha-2 en minúscula, o 'gb-eng' etc. */
  code: string
}

/**
 * Origen de un contendiente en un partido:
 *  - un id de equipo concreto (equipo ya clasificado), o
 *  - `{ winnerOf: matchId }` = el ganador de un partido previo (aún por decidir).
 */
export type Slot =
  | { teamId: string }
  | { winnerOf: string }

export type MatchStatus = 'scheduled' | 'live' | 'finished'

export interface Match {
  id: string
  round: RoundId
  /** Orden dentro de la ronda (1..n), controla la posición vertical en el cuadro */
  order: number
  /** Fecha y hora de inicio en ISO 8601 (con zona horaria) */
  kickoff: string
  venue: string
  home: Slot
  away: Slot
  homeScore: number | null
  awayScore: number | null
  /** Penaltis [local, visitante] si hubo tanda; si no, null */
  penalties: [number, number] | null
  status: MatchStatus
}

export interface Bracket {
  teams: Record<string, Team>
  matches: Match[]
}

// ————— Helpers de resolución —————

export type ResolvedSide =
  | { kind: 'team'; team: Team }
  | { kind: 'pending'; label: string }

export type Side = 'home' | 'away'

/** Devuelve el ganador ('home' | 'away') de un partido terminado, o null. */
export function winnerSide(match: Match): Side | null {
  if (match.status !== 'finished') return null
  if (match.homeScore === null || match.awayScore === null) return null
  if (match.homeScore > match.awayScore) return 'home'
  if (match.awayScore > match.homeScore) return 'away'
  // Empate en tiempo reglamentario: decide la tanda de penaltis
  if (match.penalties) {
    const [ph, pa] = match.penalties
    if (ph > pa) return 'home'
    if (pa > ph) return 'away'
  }
  return null
}

/**
 * Resuelve un `Slot` a un equipo concreto o a una etiqueta "pendiente"
 * (p.ej. "Ganador 1/8 · P3"), navegando recursivamente los `winnerOf`.
 */
export function resolveSlot(
  slot: Slot,
  bracket: Bracket,
  byId: Map<string, Match>,
): ResolvedSide {
  if ('teamId' in slot) {
    const team = bracket.teams[slot.teamId]
    return team
      ? { kind: 'team', team }
      : { kind: 'pending', label: 'Por determinar' }
  }

  const source = byId.get(slot.winnerOf)
  if (!source) return { kind: 'pending', label: 'Por determinar' }

  const w = winnerSide(source)
  if (!w) {
    const roundLabel = ROUNDS.find((r) => r.id === source.round)?.short ?? ''
    return { kind: 'pending', label: `Ganador ${roundLabel} · P${source.order}` }
  }
  return resolveSlot(w === 'home' ? source.home : source.away, bracket, byId)
}
