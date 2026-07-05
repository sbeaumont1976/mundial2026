import type { Team } from '../types/bracket'
import { Flag } from './Flag'

interface PendingSlotProps {
  candidates: Team[]
  /** Etiqueta de reserva cuando no hay candidatos calculables */
  label: string
}

// A partir de este número de candidatos se muestran solo banderas (el nombre
// aparece al pasar el ratón, y en móvil se muestra igualmente por CSS).
const COMPACT_FROM = 5

export function PendingSlot({ candidates, label }: PendingSlotProps) {
  if (candidates.length === 0) {
    return (
      <div className="slot-pending">
        <span className="team--pending team__name">{label}</span>
      </div>
    )
  }

  const compact = candidates.length >= COMPACT_FROM

  return (
    <div className="slot-pending">
      <span className="posibles">
        <span className="posibles__dot" aria-hidden="true" />
        {candidates.length} posibles
      </span>
      <div className={`cands ${compact ? 'cands--compact' : ''}`}>
        {candidates.map((team) => (
          <span className="cand" key={team.id}>
            <Flag code={team.code} title={team.name} />
            <span className="cand__name">{team.name}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
