import type { Team } from '../types/bracket'
import { Flag } from './Flag'

interface TeamRowProps {
  team: Team
  score: number | null
  /** Penaltis de este lado, si hubo tanda */
  pen: number | null
  isWinner: boolean
  /** El partido ya terminó (para atenuar al perdedor) */
  decided: boolean
}

export function TeamRow({ team, score, pen, isWinner, decided }: TeamRowProps) {
  const classes = [
    'team',
    isWinner && 'team--winner',
    decided && !isWinner && 'team--out',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <Flag code={team.code} title={team.name} />
      <span className="team__name">{team.name}</span>
      {pen !== null && <span className="team__pen">({pen})</span>}
      <span className="team__score">{score ?? ''}</span>
    </div>
  )
}
