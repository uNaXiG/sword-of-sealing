import type { BattleTurnState, TurnPreviewEntry } from '../../../game/battle/battle.turn.types'
import type { BattleUnit } from '../../../game/battle/battle.types'

function unitById(units: readonly BattleUnit[], unitId: string): BattleUnit | undefined {
  return units.find((unit) => unit.id === unitId)
}

export default function TurnOrderTimeline({
  turn,
  units,
  upcomingTurns,
}: {
  turn: BattleTurnState
  units: readonly BattleUnit[]
  upcomingTurns: readonly TurnPreviewEntry[]
}) {
  const activeUnit = turn.activeUnitId ? unitById(units, turn.activeUnitId) : undefined
  return (
    <section className="turn-timeline" aria-label="未來行動順序">
      <div className="turn-timeline-title">行動順序</div>
      <div className="turn-timeline-scroll">
        {activeUnit && (
          <div className={`turn-card current ${activeUnit.faction}`}>
            <span>現在</span>
            <strong>{activeUnit.name}</strong>
            <small>Turn {turn.turnId}</small>
          </div>
        )}
        {upcomingTurns.map((entry) => {
          const unit = unitById(units, entry.unitId)
          if (!unit) return null
          return (
            <div className={`turn-card ${unit.faction}`} key={`${entry.turnId}-${entry.unitId}`}>
              <span>+{entry.timeOffset.toFixed(2)}</span>
              <strong>{unit.name}</strong>
              <small>Turn {entry.turnId}</small>
            </div>
          )
        })}
      </div>
    </section>
  )
}
