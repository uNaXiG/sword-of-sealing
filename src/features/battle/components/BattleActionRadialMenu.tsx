import type { BattleUnit } from '../../../game/battle/battle.types'
import { getBattleAssetUrl } from '../battleHud'

const BASE_URL = import.meta.env.BASE_URL

function ActionButton({
  label,
  accessibleLabel = label,
  icon,
  disabled,
  onClick,
  position,
}: {
  label: string
  accessibleLabel?: string
  icon: string
  disabled: boolean
  onClick?: () => void
  position: string
}) {
  return (
    <button
      className={`battle-action-radial__button battle-action-radial__button--${position}`}
      type="button"
      aria-label={accessibleLabel}
      title={accessibleLabel}
      disabled={disabled}
      onClick={onClick}
    >
      <img src={getBattleAssetUrl(BASE_URL, `assets/images/ui/${icon}`)} alt="" aria-hidden="true" />
      <span>{label}</span>
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
      <span className="battle-action-radial__center" aria-hidden="true">{activeUnit.name}</span>
      <ActionButton label="攻擊" icon="attack.png" disabled={!canEnterAttackMode} onClick={onAttackMode} position="attack" />
      <ActionButton label="技能" accessibleLabel="技能（尚未開放）" icon="skill.png" disabled position="skill" />
      <ActionButton
        label={hasUndoRecord ? '取消' : '移動'}
        icon={hasUndoRecord ? 'cancel.png' : 'move.png'}
        disabled={hasUndoRecord ? !canUndoMove : !canEnterMoveMode}
        onClick={hasUndoRecord ? onUndoMove : onMoveMode}
        position="move"
      />
      <ActionButton label="道具" accessibleLabel="道具（尚未開放）" icon="bag.png" disabled position="item" />
      <ActionButton label="待命" icon="stay.png" disabled={!canStandby} onClick={onStandby} position="standby" />
    </nav>
  )
}
