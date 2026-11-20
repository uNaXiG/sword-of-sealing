import { getAttackableTiles } from '../../game/battle/battle.attack.ts'
import type { BattleUnit } from '../../game/battle/battle.types'
import { CLASS_DEFINITIONS } from '../../game/classes/class.data.ts'
import { ATTACK_PATTERN_NAMES } from '../../game/classes/class.types.ts'

const CHARACTER_PORTRAITS: Readonly<Record<string, string>> = {
  assassin: 'assets/images/cg/hero/女主-戰鬥1.png',
  knight: 'assets/images/cg/hero/男主-戰鬥1.png',
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
}

export type AttackPreviewCell = {
  column: number
  row: number
  kind: 'center' | 'attack' | 'empty'
}

export function getBattleAssetUrl(baseUrl: string, assetPath: string): string {
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const path = assetPath.replace(/^\/+/, '').split('/').map(encodeURIComponent).join('/')
  return `${base}${path}`
}

export function getPortraitUrl(unitId: string, baseUrl: string): string | null {
  const assetPath = CHARACTER_PORTRAITS[unitId]
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
    portraitUrl: unit.faction === 'player' ? getPortraitUrl(unit.id, baseUrl) : null,
  }
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
