import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey } from '../grid/grid.utils.ts'
import { getReachableTiles, type ReachableTile } from '../grid/movement.ts'
import { TERRAIN_MOVEMENT_COST } from '../grid/terrain.constants.ts'
import { getTerrainType } from '../grid/terrain.data.ts'
import type { BattleUnit } from './battle.types'
import { getOccupancy } from './occupancy.ts'

export function reachableForUnit(
  units: readonly BattleUnit[],
  unitId: string,
  obstacles: readonly Cell[] = [],
): Map<string, ReachableTile> {
  const occupancy = getOccupancy(units)
  const unit = units.find((candidate) => candidate.id === unitId)
  if (!unit) throw new Error(`Unknown unit: ${unitId}`)
  for (const obstacle of obstacles) {
    if (occupancy.has(cellKey(obstacle))) {
      throw new Error(`Obstacle overlaps a unit at ${cellKey(obstacle)}`)
    }
  }
  const occupied = [...occupancy.values()]
    .filter((occupant) => occupant.id !== unitId && occupant.faction !== unit.faction)
    .map((occupant) => occupant.position)
  const reachable = getReachableTiles({
    start: unit.position,
    budget: unit.movementPoints,
    size: GRID_SIZE,
    obstacles,
    occupied,
    movementCostAt: (cell) => TERRAIN_MOVEMENT_COST[getTerrainType(cell)],
  })
  for (const [key, occupant] of occupancy) {
    if (occupant.id !== unitId) reachable.delete(key)
  }
  return reachable
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
