import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { isInsideGrid } from '../grid/grid.utils.ts'
import type { BattleUnit } from './battle.types'

export function getManhattanDistance(from: Cell, to: Cell): number {
  return Math.abs(from.column - to.column) + Math.abs(from.row - to.row)
}

export function isWithinAttackRange(attacker: BattleUnit, target: Cell, size = GRID_SIZE): boolean {
  if (
    !Number.isInteger(attacker.attackRange) ||
    attacker.attackRange <= 0 ||
    !isInsideGrid(attacker.position, size) ||
    !isInsideGrid(target, size)
  ) return false

  const distance = getManhattanDistance(attacker.position, target)
  return distance > 0 && distance <= attacker.attackRange
}

export function getAttackableTiles(attacker: BattleUnit, size = GRID_SIZE): Cell[] {
  if (!Number.isInteger(size) || size <= 0 || !Number.isInteger(attacker.attackRange) || attacker.attackRange <= 0) {
    throw new RangeError('Attack range and grid size must be positive integers')
  }
  if (!isInsideGrid(attacker.position, size)) {
    throw new RangeError('Attacker must be inside the grid')
  }

  const tiles: Cell[] = []
  const minColumn = Math.max(0, attacker.position.column - attacker.attackRange)
  const maxColumn = Math.min(size - 1, attacker.position.column + attacker.attackRange)
  const minRow = Math.max(0, attacker.position.row - attacker.attackRange)
  const maxRow = Math.min(size - 1, attacker.position.row + attacker.attackRange)

  for (let column = minColumn; column <= maxColumn; column += 1) {
    for (let row = minRow; row <= maxRow; row += 1) {
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
  return Boolean(attacker && target && attacker.faction !== target.faction && isWithinAttackRange(attacker, target.position))
}

export function getAttackableTargets(units: readonly BattleUnit[], attackerId: string): BattleUnit[] {
  if (!units.some((unit) => unit.id === attackerId)) return []
  return units.filter((target) => canAttackTarget(units, attackerId, target.id))
}
