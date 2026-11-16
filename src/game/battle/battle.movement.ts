import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey } from '../grid/grid.utils.ts'
import { findReachablePaths } from '../grid/movement.ts'
import type { BattleUnit } from './battle.types'
import { getOccupancy } from './occupancy.ts'

export function reachableForUnit(
  units: readonly BattleUnit[],
  unitId: string,
  obstacles: readonly Cell[] = [],
): Map<string, Cell[]> {
  const occupancy = getOccupancy(units)
  const unit = units.find((candidate) => candidate.id === unitId)
  if (!unit) throw new Error(`Unknown unit: ${unitId}`)
  for (const obstacle of obstacles) {
    if (occupancy.has(cellKey(obstacle))) {
      throw new Error(`Obstacle overlaps a unit at ${cellKey(obstacle)}`)
    }
  }
  const occupied = [...occupancy.values()].filter((other) => other.id !== unitId).map((other) => other.position)
  return findReachablePaths({ start: unit.position, range: unit.movement, size: GRID_SIZE, obstacles, occupied })
}

export function moveUnit(
  units: readonly BattleUnit[],
  unitId: string,
  destination: Cell,
  obstacles: readonly Cell[] = [],
): BattleUnit[] {
  if (!reachableForUnit(units, unitId, obstacles).has(cellKey(destination))) {
    throw new Error(`Invalid movement destination: ${unitId} to ${cellKey(destination)}`)
  }
  return units.map((unit) => unit.id === unitId ? { ...unit, position: { ...destination } } : unit)
}
