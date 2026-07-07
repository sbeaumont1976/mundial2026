import type { Bracket, Match, Round } from '../types/bracket'
import { MatchCard } from './MatchCard'

interface RoundColumnProps {
  round: Round
  matches: Match[]
  bracket: Bracket
  byId: Map<string, Match>
}

export function RoundColumn({ round, matches, bracket, byId }: RoundColumnProps) {
  return (
    <section className={`round round--${round.id}`} aria-label={round.label}>
      <h2 className="round__title">
        <span className="round__short">{round.short}</span>
        <span className="round__label">{round.label}</span>
      </h2>
      <div className="round__matches">
        {matches.map((match) => (
          <div className="round__slot" key={match.id}>
            <MatchCard match={match} bracket={bracket} byId={byId} />
          </div>
        ))}
      </div>
    </section>
  )
}
