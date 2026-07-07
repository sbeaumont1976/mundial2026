import type { Bracket, Match, ResolvedSide } from '../types/bracket'
import { resolveSlot, winnerSide } from '../types/bracket'
import { formatDate, formatFull, formatTime, isToday } from '../utils/datetime'
import { PendingSlot } from './PendingSlot'
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

/** Pinta un lado del partido: equipo concreto o plaza con posibles candidatos. */
function renderSide(
  side: ResolvedSide,
  score: number | null,
  pen: number | null,
  isWinner: boolean,
  decided: boolean,
) {
  if (side.kind === 'team') {
    return (
      <TeamRow
        team={side.team}
        score={score}
        pen={pen}
        isWinner={isWinner}
        decided={decided}
      />
    )
  }
  return <PendingSlot candidates={side.candidates} label={side.label} />
}

export function MatchCard({ match, bracket, byId }: MatchCardProps) {
  const home = resolveSlot(match.home, bracket, byId)
  const away = resolveSlot(match.away, bracket, byId)
  const winner = winnerSide(match)
  const decided = match.status === 'finished'
  const today = isToday(match.kickoff)
  const [penHome, penAway] = match.penalties ?? [null, null]

  return (
    <article
      className={`match match--${match.status}${today ? ' match--today' : ''}`}
      aria-label={`Partido ${match.order}${today ? ' (hoy)' : ''}: ${formatFull(match.kickoff)}`}
    >
      <header className="match__meta">
        <span className="match__when">
          <time dateTime={match.kickoff} title={formatFull(match.kickoff)}>
            <span className="match__date">{formatDate(match.kickoff)}</span>
            <span className="match__time">{formatTime(match.kickoff)}</span>
          </time>
          {today && <span className="tag-today">Hoy</span>}
        </span>
        {match.status !== 'scheduled' && (
          <span className={`match__status match__status--${match.status}`}>
            {match.status === 'live' && <span className="pulse" aria-hidden="true" />}
            {STATUS_LABEL[match.status]}
          </span>
        )}
      </header>

      <div className="match__teams">
        {renderSide(home, match.homeScore, penHome, winner === 'home', decided)}
        {renderSide(away, match.awayScore, penAway, winner === 'away', decided)}
      </div>

      <footer className="match__venue" title={match.venue}>
        {match.venue}
      </footer>
    </article>
  )
}
