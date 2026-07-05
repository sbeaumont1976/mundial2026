import { useMemo, useState } from 'react'
import type { Bracket as BracketData, Match, RoundId } from '../types/bracket'
import { ROUNDS } from '../types/bracket'
import { isToday } from '../utils/datetime'
import { RoundColumn } from './RoundColumn'

interface BracketProps {
  data: BracketData
}

/**
 * Ronda que se muestra por defecto: la que tiene partidos HOY; si hoy no hay
 * ninguno, la del próximo partido; y si ya terminó todo, la final.
 */
function pickDefaultRound(matches: Match[]): RoundId {
  const now = Date.now()

  const today = matches
    .filter((m) => isToday(m.kickoff))
    .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
  if (today.length) return today[0].round

  const upcoming = matches
    .filter((m) => Date.parse(m.kickoff) > now)
    .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))
  if (upcoming.length) return upcoming[0].round

  return 'final'
}

export function Bracket({ data }: BracketProps) {
  const [active, setActive] = useState<RoundId>(() =>
    pickDefaultRound(data.matches),
  )

  const byId = useMemo(
    () => new Map(data.matches.map((m) => [m.id, m])),
    [data.matches],
  )

  const byRound = useMemo(() => {
    const groups = new Map<RoundId, Match[]>()
    for (const round of ROUNDS) groups.set(round.id, [])
    for (const match of data.matches) groups.get(match.round)?.push(match)
    for (const list of groups.values()) list.sort((a, b) => a.order - b.order)
    return groups
  }, [data.matches])

  return (
    <div className="bracket-wrap">
      {/* Selector de ronda — solo visible en móvil (CSS) */}
      <span className="phases-label">Fases</span>
      <nav className="round-tabs" aria-label="Seleccionar ronda">
        {ROUNDS.map((round) => (
          <button
            key={round.id}
            type="button"
            className={`round-tab ${active === round.id ? 'is-active' : ''}`}
            aria-pressed={active === round.id}
            onClick={() => setActive(round.id)}
          >
            {round.short}
          </button>
        ))}
      </nav>

      <div className="bracket" role="list">
        {ROUNDS.map((round) => (
          <div
            role="listitem"
            key={round.id}
            className={`bracket__col ${active === round.id ? 'is-active' : ''}`}
          >
            <RoundColumn
              round={round}
              matches={byRound.get(round.id) ?? []}
              bracket={data}
              byId={byId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
