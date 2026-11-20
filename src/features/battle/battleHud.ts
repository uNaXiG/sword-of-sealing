import { getAttackableTiles } from '../../game/battle/battle.attack.ts'
import type { BattleUnit, InteractionMode } from '../../game/battle/battle.types'
import { CLASS_DEFINITIONS } from '../../game/classes/class.data.ts'
import { ATTACK_PATTERN_NAMES, type UnitClass } from '../../game/classes/class.types.ts'
import { calculateActionValue } from '../../game/battle/battle.turn.ts'
import type { BattleTurnState, TurnPreviewEntry } from '../../game/battle/battle.turn.types.ts'
import { isUnitAlive } from '../../game/battle/battle.unit.ts'

const PLAYER_PORTRAITS: Readonly<Record<string, string>> = {
  assassin: 'assets/images/battle/女主.png',
  knight: 'assets/images/battle/男主.png',
}

const PLAYER_CHARACTER_ART: Readonly<Record<string, string>> = {
  assassin: 'assets/images/cg/hero/女主-戰鬥1.png',
  knight: 'assets/images/cg/hero/男主-戰鬥1.png',
}

const ENEMY_PORTRAITS: Readonly<Partial<Record<UnitClass, string>>> = {
  goblin: 'assets/images/battle/哥布林.png',
}

export const BATTLE_ATTRIBUTE_PRESENTATION = [
  { key: 'attack', label: 'ATK', accessibleName: '攻擊', iconPath: 'assets/images/ui/atk.png' },
  { key: 'movement', label: 'MOV', accessibleName: '移動', iconPath: 'assets/images/ui/mov.png' },
  { key: 'defense', label: 'DEF', accessibleName: '防禦', iconPath: 'assets/images/ui/def.png' },
] as const

export type BattleHudCharacter = {
  id: string
  displayName: string
  faction: BattleUnit['faction']
  unitClass: BattleUnit['class']
  className: string
  currentHp: number
  maxHp: number
  currentSp: number
  maxSp: number
  attack: number
  defense: number
  movement: number
  attackPattern: BattleUnit['attackPattern']
  attackPatternName: string
  minAttackRange: number
  attackRange: number
  portraitUrl: string | null
  characterArtUrl: string | null
}

export type AttackPreviewCell = {
  column: number
  row: number
  kind: 'center' | 'attack' | 'empty'
}

export type BattleTimelineEntry = {
  unit: BattleUnit
  turnId: number
  actionValue: number | null
  isActive: boolean
  portraitUrl: string | null
}

export function selectBattleCombatFeedback({
  combatFeedback,
}: {
  combatFeedback: string | null
}): string | null {
  if (combatFeedback) return combatFeedback
  return null
}

export function formatTimelineActionValue(actionValue: number | null): string {
  if (actionValue === null || !Number.isFinite(actionValue)) return '待補'
  return String(Math.round(actionValue))
}

export function getBattleAssetUrl(baseUrl: string, assetPath: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const path = assetPath.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')
  return `${base}${path}`
}

export function getPortraitUrl(
  unit: Pick<BattleUnit, 'id' | 'class' | 'faction'>,
  baseUrl: string,
): string | null {
  const assetPath = unit.faction === 'player'
    ? PLAYER_PORTRAITS[unit.id]
    : ENEMY_PORTRAITS[unit.class]
  return assetPath ? getBattleAssetUrl(baseUrl, assetPath) : null
}

export function getCharacterArtUrl(
  unit: Pick<BattleUnit, 'id' | 'class' | 'faction'>,
  baseUrl: string,
): string | null {
  const assetPath = unit.faction === 'player'
    ? PLAYER_CHARACTER_ART[unit.id]
    : ENEMY_PORTRAITS[unit.class]
  return assetPath ? getBattleAssetUrl(baseUrl, assetPath) : null
}

export function selectBattleHudCharacter(unit: BattleUnit, baseUrl: string): BattleHudCharacter {
  return {
    id: unit.id,
    displayName: unit.name,
    faction: unit.faction,
    unitClass: unit.class,
    className: CLASS_DEFINITIONS[unit.class].name,
    currentHp: unit.hp,
    maxHp: unit.maxHp,
    currentSp: unit.sp,
    maxSp: unit.maxSp,
    attack: unit.atk,
    defense: unit.def,
    movement: unit.movementPoints,
    attackPattern: unit.attackPattern,
    attackPatternName: ATTACK_PATTERN_NAMES[unit.attackPattern],
    minAttackRange: unit.minAttackRange,
    attackRange: unit.attackRange,
    portraitUrl: getPortraitUrl(unit, baseUrl),
    characterArtUrl: getCharacterArtUrl(unit, baseUrl),
  }
}

export function canInspectUnit(interactionMode: InteractionMode, battleBusy: boolean): boolean {
  return !battleBusy && interactionMode !== 'MOVE'
}

export function canShowBattleActionRadial({
  activeUnit,
  selectedUnitId,
  displayUnitId,
  interactionMode,
  battleBusy,
  pendingTurnCompletion,
}: {
  activeUnit: Pick<BattleUnit, 'id' | 'faction'> | null
  selectedUnitId: string | null
  displayUnitId: string | null
  interactionMode: InteractionMode
  battleBusy: boolean
  pendingTurnCompletion: boolean
}): boolean {
  return Boolean(
    activeUnit &&
    activeUnit.faction === 'player' &&
    activeUnit.id === selectedUnitId &&
    activeUnit.id === displayUnitId &&
    interactionMode === 'COMMAND' &&
    !battleBusy &&
    !pendingTurnCompletion,
  )
}

export function selectInspectedUnit(
  units: readonly BattleUnit[],
  inspectedUnitId: string | null,
  activeUnitId: string | null,
): BattleUnit | null {
  const inspectedUnit = inspectedUnitId
    ? units.find((unit) => unit.id === inspectedUnitId && isUnitAlive(unit))
    : undefined
  if (inspectedUnit) return inspectedUnit

  const activeUnit = activeUnitId
    ? units.find((unit) => unit.id === activeUnitId && isUnitAlive(unit))
    : undefined
  return activeUnit ?? units.find(isUnitAlive) ?? null
}

export function selectBattleTimeline(
  turn: BattleTurnState,
  units: readonly BattleUnit[],
  upcomingTurns: readonly TurnPreviewEntry[],
  baseUrl: string,
  maxItems = 8,
): BattleTimelineEntry[] {
  const limit = Math.min(8, Math.max(0, Math.floor(maxItems)))
  if (limit === 0 || !turn.activeUnitId) return []

  const activeUnit = units.find((unit) => unit.id === turn.activeUnitId && isUnitAlive(unit))
  const activeTurnState = turn.timeline.find((entry) => entry.unitId === turn.activeUnitId)
  if (!activeUnit || !activeTurnState) return []

  const entries: BattleTimelineEntry[] = [{
    unit: activeUnit,
    turnId: turn.turnId,
    actionValue: calculateActionValue(activeTurnState.remainingDistance, activeTurnState.velocity),
    isActive: true,
    portraitUrl: getPortraitUrl(activeUnit, baseUrl),
  }]

  for (const upcoming of upcomingTurns) {
    if (entries.length >= limit) break
    const unit = units.find((candidate) => candidate.id === upcoming.unitId && isUnitAlive(candidate))
    if (!unit) continue
    entries.push({
      unit,
      turnId: upcoming.turnId,
      actionValue: Number.isFinite(upcoming.timeOffset) ? upcoming.timeOffset : null,
      isActive: false,
      portraitUrl: getPortraitUrl(unit, baseUrl),
    })
  }

  return entries
}

export function getProgressPercentage(value: number, maximum: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(maximum) || maximum <= 0) return 0
  return Math.min(100, Math.max(0, (value / maximum) * 100))
}

export function createAttackPreviewGrid(unit: BattleUnit): AttackPreviewCell[] {
  if (!Number.isSafeInteger(unit.attackRange) || unit.attackRange <= 0) return []

  const size = unit.attackRange * 2 + 1
  const center = { column: unit.attackRange, row: unit.attackRange }
  const previewUnit = { ...unit, position: center }
  const attackableTiles = new Set(
    getAttackableTiles(previewUnit, size).map(({ column, row }) => `${column},${row}`),
  )

  return Array.from({ length: size * size }, (_, index) => {
    const column = index % size
    const row = Math.floor(index / size)
    const isCenter = column === center.column && row === center.row
    return {
      column,
      row,
      kind: isCenter
        ? 'center'
        : attackableTiles.has(`${column},${row}`)
          ? 'attack'
          : 'empty',
    }
  })
}
