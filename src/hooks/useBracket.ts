import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Bracket, Match, Slot, Team } from '../types/bracket'
import { mockBracket } from '../data/mockBracket'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export type Source = 'mock' | 'supabase'

// Ventana durante la cual consideramos un partido "en directo" a partir de su
// hora de inicio: cubre 90' + descanso + añadido + prórroga + penaltis.
const LIVE_WINDOW_MS = 3 * 60 * 60 * 1000
// Tope de un setTimeout: si la próxima frontera está muy lejos, re-evaluamos
// cada 6 h (barato: es un timer en cliente, no consulta nada).
const MAX_TIMER_MS = 6 * 60 * 60 * 1000

interface BracketState {
  bracket: Bracket
  loading: boolean
  error: string | null
  source: Source
  /** ¿Hay algún partido dentro de su ventana de juego ahora mismo? */
  live: boolean
}

// ————— Mapeo de filas de Supabase al modelo de dominio —————
// Esquema esperado (ver supabase/setup.sql):
//   mundial2026.teams(id, name, code)
//   mundial2026.matches(id, round, order, kickoff, venue,
//           home_team, home_winner_of, away_team, away_winner_of,
//           home_score, away_score, pen_home, pen_away, status)

interface TeamRow {
  id: string
  name: string
  code: string
}

interface MatchRow {
  id: string
  round: Match['round']
  order: number
  kickoff: string
  venue: string
  home_team: string | null
  home_winner_of: string | null
  away_team: string | null
  away_winner_of: string | null
  home_score: number | null
  away_score: number | null
  pen_home: number | null
  pen_away: number | null
  status: Match['status']
}

function toSlot(teamId: string | null, winnerOf: string | null): Slot {
  if (teamId) return { teamId }
  if (winnerOf) return { winnerOf }
  // Fila incompleta: se tratará como "por determinar" al resolver.
  return { winnerOf: '' }
}

function mapRows(teamRows: TeamRow[], matchRows: MatchRow[]): Bracket {
  const teams: Record<string, Team> = {}
  for (const t of teamRows) teams[t.id] = { id: t.id, name: t.name, code: t.code }

  const matches: Match[] = matchRows.map((r) => ({
    id: r.id,
    round: r.round,
    order: r.order,
    kickoff: r.kickoff,
    venue: r.venue,
    home: toSlot(r.home_team, r.home_winner_of),
    away: toSlot(r.away_team, r.away_winner_of),
    homeScore: r.home_score,
    awayScore: r.away_score,
    penalties:
      r.pen_home !== null && r.pen_away !== null
        ? [r.pen_home, r.pen_away]
        : null,
    status: r.status,
  }))

  return { teams, matches }
}

// ————— Cálculo de "partido activo" y próxima frontera temporal —————

/**
 * Recorre los partidos y decide si hay alguno activo ahora, y cuándo será el
 * próximo cambio de estado (un partido que empieza, o uno activo que termina).
 * Ese instante se usa para (re)activar o soltar la suscripción realtime.
 */
function computeLive(matches: Match[], now: number): {
  hasActive: boolean
  nextBoundary: number | null
} {
  let hasActive = false
  let nextBoundary = Infinity

  for (const m of matches) {
    const start = Date.parse(m.kickoff)
    if (Number.isNaN(start)) continue
    const end = start + LIVE_WINDOW_MS

    if (m.status === 'live' || (now >= start && now < end)) {
      hasActive = true
      if (end > now) nextBoundary = Math.min(nextBoundary, end)
    } else if (start > now) {
      nextBoundary = Math.min(nextBoundary, start)
    }
  }

  return {
    hasActive,
    nextBoundary: Number.isFinite(nextBoundary) ? nextBoundary : null,
  }
}

export function useBracket(): BracketState {
  const [state, setState] = useState<BracketState>({
    bracket: mockBracket,
    loading: isSupabaseConfigured,
    error: null,
    source: isSupabaseConfigured ? 'supabase' : 'mock',
    live: false,
  })

  // Carga desde Supabase. Reutilizable: la llamamos al montar y en cada evento
  // realtime para recomputar el cuadro (incluida la propagación de ganadores).
  const load = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return
    try {
      const [teamsRes, matchesRes] = await Promise.all([
        supabase.from('teams').select('*'),
        supabase.from('matches').select('*'),
      ])
      if (teamsRes.error) throw teamsRes.error
      if (matchesRes.error) throw matchesRes.error

      setState((s) => ({
        ...s,
        bracket: mapRows(teamsRes.data as TeamRow[], matchesRes.data as MatchRow[]),
        loading: false,
        error: null,
        source: 'supabase',
      }))
    } catch (err) {
      // Si falla, conservamos lo que ya hubiera en pantalla (mock en el primer
      // intento, o el último dato bueno de Supabase en un refetch en vivo).
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : 'Error cargando datos',
      }))
    }
  }, [])

  // Carga inicial
  useEffect(() => {
    if (isSupabaseConfigured) void load()
  }, [load])

  // Clave estable de "calendario": cambia solo si cambian horarios o estados,
  // NO si cambia un marcador. Así un refetch por gol no reinicia la suscripción.
  const matches = state.bracket.matches
  const scheduleKey = useMemo(
    () => matches.map((m) => `${m.id}:${m.status}:${m.kickoff}`).join('|'),
    [matches],
  )
  const matchesRef = useRef(matches)
  matchesRef.current = matches

  // `tick` lo incrementa el temporizador para forzar re-evaluación en la frontera.
  const [tick, setTick] = useState(0)

  // Realtime CONDICIONAL: solo suscribe el WebSocket mientras haya partido activo.
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    const sb = supabase // capturado no-nulo para las clausuras

    const now = Date.now()
    const { hasActive, nextBoundary } = computeLive(matchesRef.current, now)

    // Refleja el estado "en directo" en la UI (sin provocar bucles de render).
    setState((s) => (s.live === hasActive ? s : { ...s, live: hasActive }))

    let channel: ReturnType<typeof sb.channel> | null = null
    if (hasActive) {
      channel = sb
        .channel('mundial2026-matches')
        .on(
          'postgres_changes',
          { event: '*', schema: 'mundial2026', table: 'matches' },
          () => void load(),
        )
        .subscribe()
    }

    // Re-evalúa en la próxima frontera (inicio o fin de partido), con tope.
    const delay = nextBoundary
      ? Math.min(Math.max(nextBoundary - now + 1000, 1000), MAX_TIMER_MS)
      : MAX_TIMER_MS
    const timer = window.setTimeout(() => setTick((t) => t + 1), delay)

    return () => {
      window.clearTimeout(timer)
      if (channel) void sb.removeChannel(channel)
    }
  }, [scheduleKey, tick, load])

  return state
}
