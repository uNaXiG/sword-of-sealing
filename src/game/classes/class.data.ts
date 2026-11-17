import type { AttackPattern, ClassDefinition, UnitClass } from './class.types'

export const UNIT_CLASSES: readonly UnitClass[] = ['knight', 'assassin', 'mage', 'cleric', 'ranger', 'goblin']
export const ATTACK_PATTERNS: readonly AttackPattern[] = ['SQUARE', 'CROSS', 'DIAMOND', 'DIAMOND_RING']

export const CLASS_DEFINITIONS = {
  knight: { type: 'knight', name: '劍士', maxHp: 100, maxSp: 30, atk: 20, def: 10, agi: 5, movementPoints: 4, attackRange: 1, minAttackRange: 1, attackPattern: 'SQUARE' },
  assassin: { type: 'assassin', name: '刺客', maxHp: 75, maxSp: 35, atk: 28, def: 5, agi: 10, movementPoints: 6, attackRange: 1, minAttackRange: 1, attackPattern: 'SQUARE' },
  mage: { type: 'mage', name: '法師', maxHp: 65, maxSp: 60, atk: 12, def: 6, agi: 4, movementPoints: 3, attackRange: 2, minAttackRange: 1, attackPattern: 'CROSS' },
  cleric: { type: 'cleric', name: '牧師', maxHp: 80, maxSp: 70, atk: 24, def: 6, agi: 4, movementPoints: 3, attackRange: 2, minAttackRange: 1, attackPattern: 'CROSS' },
  ranger: { type: 'ranger', name: '遊俠', maxHp: 80, maxSp: 40, atk: 18, def: 5, agi: 8, movementPoints: 5, attackRange: 3, minAttackRange: 3, attackPattern: 'DIAMOND_RING' },
  goblin: { type: 'goblin', name: '哥布林', maxHp: 60, maxSp: 15, atk: 15, def: 5, agi: 4, movementPoints: 3, attackRange: 1, minAttackRange: 1, attackPattern: 'DIAMOND' },
} as const satisfies Record<UnitClass, ClassDefinition>

export function isUnitClass(value: unknown): value is UnitClass {
  return typeof value === 'string' && UNIT_CLASSES.includes(value as UnitClass)
}

export function isAttackPattern(value: unknown): value is AttackPattern {
  return typeof value === 'string' && ATTACK_PATTERNS.includes(value as AttackPattern)
}

export function validateClassDefinition(definition: ClassDefinition): void {
  if (!isUnitClass(definition.type) || definition.name.trim().length === 0) {
    throw new Error('Class definition requires a valid type and display name')
  }
  const nonNegative = [definition.maxSp, definition.atk, definition.def, definition.agi, definition.movementPoints]
  if (!Number.isSafeInteger(definition.maxHp) || definition.maxHp <= 0 || nonNegative.some((value) => !Number.isSafeInteger(value) || value < 0)) {
    throw new RangeError(`Invalid class attributes: ${definition.type}`)
  }
  validateAttackProperties(definition)
}

export function validateAttackProperties(properties: Pick<ClassDefinition, 'attackPattern' | 'attackRange' | 'minAttackRange'>): void {
  if (!isAttackPattern(properties.attackPattern)) throw new Error('Invalid attack pattern')
  if (!Number.isSafeInteger(properties.attackRange) || properties.attackRange <= 0 ||
      !Number.isSafeInteger(properties.minAttackRange) || properties.minAttackRange <= 0 ||
      properties.minAttackRange > properties.attackRange) {
    throw new RangeError('Attack range must be a valid positive integer interval')
  }
  if (properties.attackPattern === 'DIAMOND' && properties.minAttackRange !== 1) {
    throw new RangeError('DIAMOND attack patterns require minAttackRange 1')
  }
  if (properties.attackPattern === 'DIAMOND_RING' && properties.minAttackRange <= 1) {
    throw new RangeError('DIAMOND_RING attack patterns require minAttackRange greater than 1')
  }
}

for (const [key, definition] of Object.entries(CLASS_DEFINITIONS)) {
  if (key !== definition.type) throw new Error(`Class registry key does not match definition type: ${key}`)
  validateClassDefinition(definition)
}
