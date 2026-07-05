import type { Bracket, Match } from '../types/bracket'
import { resolveSlot, winnerSide } from '../types/bracket'
import { formatDate, formatFull, formatTime } from '../utils/datetime'
import { TeamRow } from './TeamRow'

interface MatchCardProps {
  match: Match
  bracket: Bracket
  byId: Map<string, Match>
}

const STATUS_LABEL: Record<Match['status'], string> = {
  scheduled: 'Programado',
  live: 'En directo',
  finished: 'Final',
}

export function MatchCard({ match, bracket, byId }: MatchCardProps) {
  const home = resolveSlot(match.home, bracket, byId)
  const away = resolveSlot(match.away, bracket, byId)
  const winner = winnerSide(match)
  const decided = match.status === 'finished'
  const [penHome, penAway] = match.penalties ?? [null, null]

  return (
    <article
      className={`match match--${match.status}`}
      aria-label={`Partido ${match.order}: ${formatFull(match.kickoff)}`}
    >
      <header className="match__meta">
        <time dateTime={match.kickoff} title={formatFull(match.kickoff)}>
          <span className="match__date">{formatDate(match.kickoff)}</span>
          <span className="match__time">{formatTime(match.kickoff)}</span>
        </time>
        <span className={`match__status match__status--${match.status}`}>
          {match.status === 'live' && <span className="pulse" aria-hidden="true" />}
          {STATUS_LABEL[match.status]}
        </span>
      </header>

      <div className="match__teams">
        <TeamRow
          side={home}
          score={match.homeScore}
          pen={penHome}
          isWinner={winner === 'home'}
          decided={decided}
        />
        <TeamRow
          side={away}
          score={match.awayScore}
          pen={penAway}
          isWinner={winner === 'away'}
          decided={decided}
        />
      </div>

      <footer className="match__venue" title={match.venue}>
        {match.venue}
      </footer>
    </article>
  )
}
