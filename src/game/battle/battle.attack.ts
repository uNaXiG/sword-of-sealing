import { isAttackPattern, validateAttackProperties } from '../classes/class.data.ts'
import type { AttackPattern } from '../classes/class.types'
import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { isInsideGrid } from '../grid/grid.utils.ts'
import type { BattleUnit } from './battle.types'
import { isUnitAlive } from './battle.unit.ts'

export function getManhattanDistance(from: Cell, to: Cell): number {
  return Math.abs(from.column - to.column) + Math.abs(from.row - to.row)
}

export function getAttackDistance(from: Cell, to: Cell, pattern: AttackPattern): number {
  if (!isAttackPattern(pattern)) throw new Error('Invalid attack pattern')
  const dx = Math.abs(from.column - to.column)
  const dy = Math.abs(from.row - to.row)
  return pattern === 'SQUARE' ? Math.max(dx, dy) : dx + dy
}

export function isWithinAttackRange(attacker: BattleUnit, target: Cell, size = GRID_SIZE): boolean {
  if (!isInsideGrid(attacker.position, size) || !isInsideGrid(target, size)) return false
  try {
    validateAttackProperties(attacker)
  } catch {
    return false
  }
  const dx = Math.abs(attacker.position.column - target.column)
  const dy = Math.abs(attacker.position.row - target.row)
  const distance = getAttackDistance(attacker.position, target, attacker.attackPattern)
  if (distance < attacker.minAttackRange || distance > attacker.attackRange) return false
  return attacker.attackPattern !== 'CROSS' || dx === 0 || dy === 0
}

export function getAttackableTiles(attacker: BattleUnit, size = GRID_SIZE): Cell[] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('Attack range and grid size must be positive integers')
  }
  try {
    validateAttackProperties(attacker)
  } catch {
    throw new RangeError('Attack range and grid size must be positive integers')
  }
  if (!isInsideGrid(attacker.position, size)) {
    throw new RangeError('Attacker must be inside the grid')
  }

  const tiles: Cell[] = []
  for (let column = Math.max(0, attacker.position.column - attacker.attackRange);
    column <= Math.min(size - 1, attacker.position.column + attacker.attackRange);
    column += 1) {
    for (let row = Math.max(0, attacker.position.row - attacker.attackRange);
      row <= Math.min(size - 1, attacker.position.row + attacker.attackRange);
      row += 1) {
      const tile = { column, row }
      if (isWithinAttackRange(attacker, tile, size)) tiles.push(tile)
    }
  }
  return tiles
}

export function canAttackTarget(units: readonly BattleUnit[], attackerId: string, targetId: string): boolean {
  if (attackerId === targetId) return false
  const attacker = units.find((unit) => unit.id === attackerId)
  const target = units.find((unit) => unit.id === targetId)
  return Boolean(
    attacker &&
    target &&
    isUnitAlive(attacker) &&
    isUnitAlive(target) &&
    attacker.faction !== target.faction &&
    isWithinAttackRange(attacker, target.position),
  )
}

export function getAttackableTargets(units: readonly BattleUnit[], attackerId: string): BattleUnit[] {
  if (!units.some((unit) => unit.id === attackerId)) return []
  return units.filter((target) => canAttackTarget(units, attackerId, target.id))
}
