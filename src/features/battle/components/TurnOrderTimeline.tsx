import { useLayoutEffect, useRef, useState } from 'react'
import type { BattleTurnState, TurnPreviewEntry } from '../../../game/battle/battle.turn.types'
import type { BattleUnit } from '../../../game/battle/battle.types'
import { formatTimelineActionValue, selectBattleTimeline } from '../battleHud'
import { observeTimelineCapacity } from '../battleTimelineLayout'
import BattleUnitPortrait from './BattleUnitPortrait'

export default function TurnOrderTimeline({
  turn,
  units,
  upcomingTurns,
  inspectedUnitId,
  baseUrl,
  canInspect,
  onInspectUnit,
}: {
  turn: BattleTurnState
  units: readonly BattleUnit[]
  upcomingTurns: readonly TurnPreviewEntry[]
  inspectedUnitId: string | null
  baseUrl: string
  canInspect: boolean
  onInspectUnit: (unitId: string) => void
}) {
  const entries = selectBattleTimeline(turn, units, upcomingTurns, baseUrl)
  const capacityRef = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)

  useLayoutEffect(() => {
    if (!capacityRef.current) return
    return observeTimelineCapacity(capacityRef.current, setVisibleCount)
  }, [])

  const visibleEntries = entries.slice(0, visibleCount)

  return (
    <>
      <div className="turn-timeline-capacity" ref={capacityRef} aria-hidden="true" />
      {visibleEntries.length > 0 && (
        <section className="turn-timeline" aria-label="未來行動順序">
          <div className="turn-timeline-list" role="list">
            {visibleEntries.map((entry, index) => {
              const valueLabel = formatTimelineActionValue(entry.actionValue)
              const actionLabel = entry.isActive ? '目前行動' : '預測行動'
              const label = `第 ${index + 1} 順位，${entry.unit.name}，${actionLabel}，行動值 ${valueLabel}`
              const isActivePreview = !entry.isActive && entry.unit.id === turn.activeUnitId
              return (
                <div className="turn-card-slot" key={`${entry.turnId}-${entry.unit.id}`} role="listitem">
                  <button
                    className={`turn-card${entry.isActive ? ' turn-card--active' : ''}${isActivePreview ? ' turn-card--active-preview' : ''}${entry.unit.faction === 'enemy' ? ' turn-card--enemy' : ''}${inspectedUnitId === entry.unit.id ? ' turn-card--inspected' : ''}`}
                    type="button"
                    aria-label={label}
                    aria-pressed={inspectedUnitId === entry.unit.id}
                    title={label}
                    disabled={!canInspect}
                    onClick={() => canInspect && onInspectUnit(entry.unit.id)}
                  >
                    <BattleUnitPortrait src={entry.portraitUrl} label={entry.unit.name} />
                    <span className="turn-card__value" aria-hidden="true">{valueLabel}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}
