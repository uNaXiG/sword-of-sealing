import type { BattleUnit } from '../../../game/battle/battle.types'
import { getBattleAssetUrl } from '../battleHud'

const BASE_URL = import.meta.env.BASE_URL
const CENTER = 112
const OUTER_RADIUS = 110
const INNER_RADIUS = 58
const SECTOR_ANGLE = 72

function point(angle: number, radius: number) {
  const radians = angle * Math.PI / 180
  return { x: CENTER + Math.cos(radians) * radius, y: CENTER + Math.sin(radians) * radius }
}

function createSector(index: number) {
  const mid = -90 + index * SECTOR_ANGLE
  const start = mid - SECTOR_ANGLE / 2
  const end = mid + SECTOR_ANGLE / 2
  const outerStart = point(start, OUTER_RADIUS)
  const outerEnd = point(end, OUTER_RADIUS)
  const innerStart = point(start, INNER_RADIUS)
  const innerEnd = point(end, INNER_RADIUS)
  const bounds = [outerStart, outerEnd, innerStart, innerEnd]
  for (let angle = Math.ceil(start / 90) * 90; angle < end; angle += 90) {
    bounds.push(point(angle, OUTER_RADIUS), point(angle, INNER_RADIUS))
  }
  const left = Math.floor(Math.min(...bounds.map(({ x }) => x)))
  const top = Math.floor(Math.min(...bounds.map(({ y }) => y)))
  const width = Math.ceil(Math.max(...bounds.map(({ x }) => x))) - left
  const height = Math.ceil(Math.max(...bounds.map(({ y }) => y))) - top
  const local = ({ x, y }: ReturnType<typeof point>) => `${(x - left).toFixed(3)} ${(y - top).toFixed(3)}`
  const path = `M ${local(outerStart)} A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${local(outerEnd)} L ${local(innerEnd)} A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${local(innerStart)} Z`
  const label = point(mid, (OUTER_RADIUS + INNER_RADIUS) / 2)
  return { left, top, width, height, path, labelX: label.x - left, labelY: label.y - top }
}

const SECTORS = [0, 1, 2, 3, 4].map(createSector)

function ActionButton({
  label,
  accessibleLabel = label,
  icon,
  disabled,
  onClick,
  sectorIndex,
}: {
  label: string
  accessibleLabel?: string
  icon: string
  disabled: boolean
  onClick?: () => void
  sectorIndex: number
}) {
  const { left, top, width, height, path, labelX, labelY } = SECTORS[sectorIndex]
  return (
    <button
      className="battle-action-radial__button"
      style={{ left, top, width, height, clipPath: `path('${path}')` }}
      type="button"
      aria-label={accessibleLabel}
      title={accessibleLabel}
      disabled={disabled}
      onClick={onClick}
    >
      <svg className="battle-action-radial__border" width={width} height={height} aria-hidden="true">
        <path d={path} />
      </svg>
      <span className="battle-action-radial__label" style={{ left: labelX, top: labelY }}>
        <img src={getBattleAssetUrl(BASE_URL, `assets/images/ui/${icon}`)} alt="" aria-hidden="true" />
        {label}
      </span>
    </button>
  )
}

export default function BattleActionRadialMenu({
  activeUnit,
  canEnterMoveMode,
  canEnterAttackMode,
  canStandby,
  canUndoMove,
  hasUndoRecord,
  onMoveMode,
  onAttackMode,
  onUndoMove,
  onStandby,
}: {
  activeUnit: BattleUnit
  canEnterMoveMode: boolean
  canEnterAttackMode: boolean
  canStandby: boolean
  canUndoMove: boolean
  hasUndoRecord: boolean
  onMoveMode: () => void
  onAttackMode: () => void
  onUndoMove: () => void
  onStandby: () => void
}) {
  return (
    <nav className="battle-action-radial" aria-label={`${activeUnit.name}角色指令`}>
      <ActionButton label="攻擊" icon="attack.png" disabled={!canEnterAttackMode} onClick={onAttackMode} sectorIndex={0} />
      <ActionButton label="技能" accessibleLabel="技能（尚未開放）" icon="skill.png" disabled sectorIndex={1} />
      <ActionButton
        label={hasUndoRecord ? '取消' : '移動'}
        icon={hasUndoRecord ? 'cancel.png' : 'move.png'}
        disabled={hasUndoRecord ? !canUndoMove : !canEnterMoveMode}
        onClick={hasUndoRecord ? onUndoMove : onMoveMode}
        sectorIndex={2}
      />
      <ActionButton label="道具" accessibleLabel="道具（尚未開放）" icon="bag.png" disabled sectorIndex={3} />
      <ActionButton label="待命" icon="stay.png" disabled={!canStandby} onClick={onStandby} sectorIndex={4} />
    </nav>
  )
}
