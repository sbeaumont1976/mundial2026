import { useMemo, useState } from 'react'
import type { Bracket as BracketData, Match, RoundId } from '../types/bracket'
import { ROUNDS } from '../types/bracket'
import { RoundColumn } from './RoundColumn'

interface BracketProps {
  data: BracketData
}

export function Bracket({ data }: BracketProps) {
  const [active, setActive] = useState<RoundId>('r16')

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
