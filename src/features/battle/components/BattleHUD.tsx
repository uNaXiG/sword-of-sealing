import { useState } from 'react'
import type { BattleUnit, InteractionMode } from '../../../game/battle/battle.types'
import {
  BATTLE_ATTRIBUTE_PRESENTATION,
  createAttackPreviewGrid,
  getBattleAssetUrl,
  getProgressPercentage,
  selectBattleHudCharacter,
  type BattleHudCharacter,
} from '../battleHud'
import './BattleHUD.css'

type BattleHUDProps = {
  activeUnit: BattleUnit | null
  displayUnit: BattleUnit | null
  selectedUnit: BattleUnit | null
  interactionMode: InteractionMode
  canConfirmAttack: boolean
  battleBusy: boolean
  pendingTurnCompletion: boolean
  attackableTargetCount: number
  selectedAttackTarget: BattleUnit | null
  selectedAttackTargetDistance: number | null
  activityMessage: string | null
  combatFeedback: string | null
  onCancelMoveMode: () => void
  onConfirmAttack: () => void
  onCancelAttack: () => void
}

const BASE_URL = import.meta.env.BASE_URL

function CharacterPortrait({ character }: { character: BattleHudCharacter | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)

  if (!character) {
    return (
      <div className="battle-hud__portrait-fallback" aria-label="等待行動角色">
        <span>等待行動</span>
      </div>
    )
  }

  if (!character.characterArtUrl || failedUrl === character.characterArtUrl) {
    return (
      <div className="battle-hud__portrait-fallback" aria-label={`${character.displayName}沒有可用立繪`}>
        <span>{character.faction === 'enemy' ? '敵方行動' : '立繪無法載入'}</span>
      </div>
    )
  }

  return (
    <img
      className="battle-hud__portrait-image"
      src={character.characterArtUrl}
      alt={`${character.displayName}戰鬥立繪`}
      draggable={false}
      onError={() => setFailedUrl(character.characterArtUrl)}
    />
  )
}

function ResourceBar({
  label,
  value,
  maximum,
  variant,
}: {
  label: string
  value: number
  maximum: number
  variant: 'hp' | 'sp'
}) {
  const safeMaximum = Number.isFinite(maximum) && maximum > 0 ? maximum : 1
  const safeValue = Number.isFinite(value) ? Math.min(safeMaximum, Math.max(0, value)) : 0

  return (
    <div className={`battle-hud__resource battle-hud__resource--${variant}`}>
      <div className="battle-hud__resource-label">
        <span>{label}</span>
        <span>{value} / {maximum}</span>
      </div>
      <div
        className="battle-hud__resource-track"
        role="progressbar"
        aria-label={`${label} ${value} / ${maximum}`}
        aria-valuemin={0}
        aria-valuemax={safeMaximum}
        aria-valuenow={safeValue}
      >
        <span style={{ width: `${getProgressPercentage(value, maximum)}%` }} />
      </div>
    </div>
  )
}

function AttackPatternPreview({ character }: { character: BattleHudCharacter }) {
  const unit = {
    id: character.id,
    name: character.displayName,
    faction: character.faction,
    class: character.unitClass,
    position: { column: 0, row: 0 },
    movementPoints: character.movement,
    attackPattern: character.attackPattern,
    attackRange: character.attackRange,
    minAttackRange: character.minAttackRange,
    atk: character.attack,
    def: character.defense,
    agi: 1,
    hp: character.currentHp,
    maxHp: character.maxHp,
    sp: character.currentSp,
    maxSp: character.maxSp,
  } satisfies BattleUnit
  const cells = createAttackPreviewGrid(unit)
  const size = character.attackRange * 2 + 1
  const rangeLabel = character.minAttackRange === character.attackRange
    ? `${character.attackRange}`
    : `${character.minAttackRange}–${character.attackRange}`

  return (
    <div className="battle-hud__attack-preview">
      <span className="battle-hud__section-label">攻擊範圍</span>
      <div
        className="battle-hud__attack-grid"
        role="img"
        aria-label={`${character.attackPatternName}，距離 ${rangeLabel} 格`}
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {cells.map((cell) => (
          <span
            className={`battle-hud__attack-cell battle-hud__attack-cell--${cell.kind}`}
            data-cell={`${cell.column},${cell.row}`}
            key={`${cell.column}-${cell.row}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="battle-hud__attack-label">{character.attackPatternName} · {rangeLabel} 格</span>
    </div>
  )
}

function ActionButton({
  label,
  icon,
  disabled = false,
  onClick,
}: {
  label: string
  icon: string
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      className="battle-hud__action"
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <img src={getBattleAssetUrl(BASE_URL, `assets/images/ui/${icon}`)} alt="" aria-hidden="true" />
      <span>{label}</span>
    </button>
  )
}

function ActionControls({
  activeUnit,
  selectedUnit,
  interactionMode,
  canConfirmAttack,
  battleBusy,
  pendingTurnCompletion,
  onCancelMoveMode,
  onConfirmAttack,
  onCancelAttack,
}: Pick<BattleHUDProps,
  | 'activeUnit'
  | 'selectedUnit'
  | 'interactionMode'
  | 'canConfirmAttack'
  | 'battleBusy'
  | 'pendingTurnCompletion'
  | 'onCancelMoveMode'
  | 'onConfirmAttack'
  | 'onCancelAttack'
>) {
  const canIssueCommands = Boolean(
    activeUnit &&
    selectedUnit?.id === activeUnit.id &&
    activeUnit.faction === 'player' &&
    !battleBusy &&
    !pendingTurnCompletion,
  )

  if (!canIssueCommands || !selectedUnit) {
    return (
      <div className="battle-hud__controls-hint" aria-live="polite">
        {activeUnit?.faction === 'enemy' ? '敵方行動中' : '選取目前行動角色以使用指令'}
      </div>
    )
  }

  if (!activeUnit) return null

  if (interactionMode === 'MOVE') {
    return (
      <div className="battle-hud__actions" aria-label="移動指令">
        <ActionButton label="取消移動" icon="cancel.png" onClick={onCancelMoveMode} />
      </div>
    )
  }

  if (interactionMode === 'ATTACK') {
    return (
      <div className="battle-hud__actions" aria-label="攻擊指令">
        <ActionButton label="確認攻擊" icon="attack.png" disabled={!canConfirmAttack} onClick={onConfirmAttack} />
        <ActionButton label="取消攻擊" icon="cancel.png" onClick={onCancelAttack} />
      </div>
    )
  }

  return null
}

export default function BattleHUD({
  activeUnit,
  displayUnit,
  selectedUnit,
  interactionMode,
  canConfirmAttack,
  battleBusy,
  pendingTurnCompletion,
  attackableTargetCount,
  selectedAttackTarget,
  selectedAttackTargetDistance,
  activityMessage,
  combatFeedback,
  onCancelMoveMode,
  onConfirmAttack,
  onCancelAttack,
}: BattleHUDProps) {
  const character = displayUnit ? selectBattleHudCharacter(displayUnit, BASE_URL) : null

  return (
    <div className="battle-hud">
      <header className="battle-hud__topbar">
        <div>
        </div>
        <a className="battle-hud__menu-link" href="#" aria-label="返回主選單">返回主選單</a>
      </header>

      <div className="battle-hud__portrait-backdrop" aria-hidden="true" />
      <figure
        className={`battle-hud__portrait${character?.faction === 'enemy' ? ' battle-hud__portrait--enemy' : ''}`}
        aria-label="目前檢視角色立繪"
      >
        <CharacterPortrait key={character?.id ?? 'empty'} character={character} />
      </figure>

      <section className="battle-hud__status" aria-label="角色資訊" aria-live="polite">
          {character ? (
            <>
              <div className="battle-hud__status-content">
                <div className="battle-hud__identity">
                  <div className="battle-hud__identity-heading">
                    <h2>{character.displayName}</h2>
                    <span className={`battle-hud__faction battle-hud__faction--${character.faction}`}>
                      {character.id === activeUnit?.id ? '目前行動' : '檢視中'}
                    </span>
                  </div>
                  <p>{character.faction === 'enemy' ? '敵方' : '我方'} · {character.className}</p>
                  <div className="battle-hud__resources">
                    <ResourceBar label="HP" value={character.currentHp} maximum={character.maxHp} variant="hp" />
                    <ResourceBar label="SP" value={character.currentSp} maximum={character.maxSp} variant="sp" />
                  </div>
                </div>
                <AttackPatternPreview character={character} />
                <div className="battle-hud__attributes" role="list" aria-label="角色屬性">
                  {BATTLE_ATTRIBUTE_PRESENTATION.map((attribute) => {
                    const value = character[attribute.key]
                    return (
                      <div
                        className="battle-hud__attribute"
                        key={attribute.key}
                        role="listitem"
                        aria-label={`${attribute.label} ${attribute.accessibleName} ${value}`}
                        title={`${attribute.label} ${attribute.accessibleName}`}
                      >
                        <img
                          src={getBattleAssetUrl(BASE_URL, attribute.iconPath)}
                          alt=""
                          aria-hidden="true"
                          draggable={false}
                        />
                        <span>{value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <ActionControls
                activeUnit={activeUnit}
                selectedUnit={selectedUnit}
                interactionMode={interactionMode}
                canConfirmAttack={canConfirmAttack}
                battleBusy={battleBusy}
                pendingTurnCompletion={pendingTurnCompletion}
                onCancelMoveMode={onCancelMoveMode}
                onConfirmAttack={onConfirmAttack}
                onCancelAttack={onCancelAttack}
              />
              {activityMessage && <p className="battle-hud__activity" role="status">{activityMessage}</p>}
              {(combatFeedback || interactionMode === 'ATTACK') && (
                <p className="battle-hud__combat-feedback" role="status">
                  {combatFeedback ?? `合法目標：${attackableTargetCount}${selectedAttackTarget
                    ? ` · 目標：${selectedAttackTarget.name} · 距離：${selectedAttackTargetDistance ?? '—'} 格`
                    : ''}`}
                </p>
              )}
            </>
          ) : (
            <p className="battle-hud__empty">等待戰鬥行動</p>
          )}
      </section>
    </div>
  )
}
