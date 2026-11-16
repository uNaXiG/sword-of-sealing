import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey, isInsideGrid } from '../grid/grid.utils.ts'
import type { BattleUnit } from './battle.types'
import { getOccupancy } from './occupancy.ts'

export type BattleObstacle = {
  id: string
  type: 'rock' | 'tree' | 'wall'
  position: { x: number; y: number }
  walkable: false
}

export const INITIAL_OBSTACLES: readonly BattleObstacle[] = [
  { id: 'rock-1', type: 'rock', position: { x: 3, y: 2 }, walkable: false },
  { id: 'tree-1', type: 'tree', position: { x: 1, y: 3 }, walkable: false },
  { id: 'wall-1', type: 'wall', position: { x: 5, y: 4 }, walkable: false },
  { id: 'rock-2', type: 'rock', position: { x: 6, y: 3 }, walkable: false },
  { id: 'tree-2', type: 'tree', position: { x: 2, y: 1 }, walkable: false },
  { id: 'wall-2', type: 'wall', position: { x: 4, y: 6 }, walkable: false },
  { id: 'rock-3', type: 'rock', position: { x: 6, y: 6 }, walkable: false },
]

export function obstacleCell(obstacle: BattleObstacle): Cell {
  return { column: obstacle.position.x, row: obstacle.position.y }
}

export function validateObstacles(obstacles: readonly BattleObstacle[], units: readonly BattleUnit[]): void {
  const occupied = getOccupancy(units)
  const ids = new Set<string>()
  const cells = new Set<string>()

  for (const obstacle of obstacles) {
    const cell = obstacleCell(obstacle)
    const key = cellKey(cell)
    if (ids.has(obstacle.id) || cells.has(key) || !isInsideGrid(cell, GRID_SIZE) || occupied.has(key) || obstacle.walkable !== false) {
      throw new Error(`Invalid or overlapping obstacle: ${obstacle.id} at ${key}`)
    }
    ids.add(obstacle.id)
    cells.add(key)
  }
}
