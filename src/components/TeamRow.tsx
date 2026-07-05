import type { ResolvedSide } from '../types/bracket'
import { Flag } from './Flag'

interface TeamRowProps {
  side: ResolvedSide
  score: number | null
  /** Penaltis de este lado, si hubo tanda */
  pen: number | null
  isWinner: boolean
  /** El partido ya terminó (para atenuar al perdedor) */
  decided: boolean
}

export function TeamRow({ side, score, pen, isWinner, decided }: TeamRowProps) {
  const isPending = side.kind === 'pending'
  const name = side.kind === 'team' ? side.team.name : side.label
  const code = side.kind === 'team' ? side.team.code : undefined

  const classes = [
    'team',
    isWinner && 'team--winner',
    decided && !isWinner && 'team--out',
    isPending && 'team--pending',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <Flag code={code} title={name} />
      <span className="team__name">{name}</span>
      {pen !== null && <span className="team__pen">({pen})</span>}
      <span className="team__score">{score ?? ''}</span>
    </div>
  )
}
