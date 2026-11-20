import type { BattleTurnState, TurnPreviewEntry } from '../../../game/battle/battle.turn.types'
import type { BattleUnit } from '../../../game/battle/battle.types'
import { selectBattleTimeline } from '../battleHud'
import BattleUnitPortrait from './BattleUnitPortrait'

export default function TurnOrderTimeline({
  turn,
  units,
  upcomingTurns,
  inspectedUnitId,
  baseUrl,
  onInspectUnit,
}: {
  turn: BattleTurnState
  units: readonly BattleUnit[]
  upcomingTurns: readonly TurnPreviewEntry[]
  inspectedUnitId: string | null
  baseUrl: string
  onInspectUnit: (unitId: string) => void
}) {
  const entries = selectBattleTimeline(turn, units, upcomingTurns, baseUrl)
  return (
    <section className="turn-timeline" aria-label="未來行動順序">
      <div className="turn-timeline-title">行動順序</div>
      <div className="turn-timeline-scroll" role="list">
        {entries.map((entry, index) => {
          const valueLabel = entry.actionValue === null ? '待補' : entry.actionValue.toFixed(2)
          const actionLabel = entry.isActive ? '目前行動' : '預測行動'
          const label = `第 ${index + 1} 順位，${entry.unit.name}，${actionLabel}，行動值 ${valueLabel}`
          return (
            <div className="turn-card-slot" key={`${entry.turnId}-${entry.unit.id}`} role="listitem">
              <button
                className={`turn-card${entry.isActive ? ' turn-card--active' : ''}${inspectedUnitId === entry.unit.id ? ' turn-card--inspected' : ''}`}
                type="button"
                aria-label={label}
                aria-pressed={inspectedUnitId === entry.unit.id}
                title={label}
                onClick={() => onInspectUnit(entry.unit.id)}
              >
                <span className="turn-card__rank" aria-hidden="true">{index + 1}</span>
                <BattleUnitPortrait src={entry.portraitUrl} label={entry.unit.name} />
                <span className="turn-card__value" aria-hidden="true">{valueLabel}</span>
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
