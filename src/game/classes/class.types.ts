export type UnitClass = 'knight' | 'assassin' | 'mage' | 'cleric' | 'ranger' | 'goblin'

export type AttackPattern = 'SQUARE' | 'CROSS' | 'DIAMOND' | 'DIAMOND_RING'

export interface ClassDefinition {
  readonly type: UnitClass
  readonly name: string
  readonly maxHp: number
  readonly maxSp: number
  readonly atk: number
  readonly def: number
  readonly agi: number
  readonly movementPoints: number
  readonly attackPattern: AttackPattern
  readonly attackRange: number
  readonly minAttackRange: number
}

export const ATTACK_PATTERN_NAMES: Readonly<Record<AttackPattern, string>> = {
  SQUARE: '方形',
  CROSS: '十字形',
  DIAMOND: '菱形',
  DIAMOND_RING: '菱形環',
}
