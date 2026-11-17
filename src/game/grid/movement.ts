import type { Cell } from './grid.types'
import { cellKey, isInsideGrid } from './grid.utils.ts'

type MovementOptions = {
  start: Cell
  budget: number
  size: number
  obstacles: readonly Cell[]
  occupied: readonly Cell[]
  movementCostAt?: (cell: Cell) => number
}

export type ReachableTile = { path: Cell[]; cost: number }
export type UniformMovementOptions = Omit<MovementOptions, 'budget' | 'movementCostAt'> & { range: number }

type FrontierNode = ReachableTile & { cell: Cell; order: number }

const DIRECTIONS: readonly [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]

export function getReachableTiles({ start, budget, size, obstacles, occupied, movementCostAt = () => 1 }: MovementOptions): Map<string, ReachableTile> {
  if (!Number.isInteger(size) || size <= 0 || !isInsideGrid(start, size) || Number.isNaN(budget) || budget < 0) {
    throw new RangeError('Invalid grid size, starting cell, or movement-point budget')
  }

  const blocked = new Set([...obstacles, ...occupied].map(cellKey))
  if (blocked.has(cellKey(start))) {
    throw new RangeError('The starting cell cannot be blocked')
  }

  const bestCost = new Map<string, number>([[cellKey(start), 0]])
  const reachable = new Map<string, ReachableTile>()
  const frontier: FrontierNode[] = [{ cell: start, path: [start], cost: 0, order: 0 }]
  let order = 1

  while (frontier.length > 0) {
    frontier.sort((first, second) => first.cost - second.cost || first.order - second.order)
    const current = frontier.shift()!
    const currentKey = cellKey(current.cell)
    if (current.cost !== bestCost.get(currentKey)) continue

    for (const [columnDelta, rowDelta] of DIRECTIONS) {
      const neighbor = { column: current.cell.column + columnDelta, row: current.cell.row + rowDelta }
      const key = cellKey(neighbor)
      if (!isInsideGrid(neighbor, size) || blocked.has(key)) continue

      const terrainCost = movementCostAt(neighbor)
      if (terrainCost === Number.POSITIVE_INFINITY) continue
      if (!Number.isFinite(terrainCost) || terrainCost <= 0) {
        throw new RangeError(`Invalid movement cost at ${key}`)
      }

      const nextCost = current.cost + terrainCost
      if (nextCost > budget || nextCost >= (bestCost.get(key) ?? Number.POSITIVE_INFINITY)) continue
      const nextPath = [...current.path, neighbor]
      bestCost.set(key, nextCost)
      const tile = { path: nextPath, cost: nextCost }
      reachable.set(key, tile)
      frontier.push({ ...tile, cell: neighbor, order: order++ })
    }
  }

  return reachable
}

export function findLowestCostPath(options: Omit<MovementOptions, 'budget'>, target: Cell): Cell[] | null {
  return getReachableTiles({ ...options, budget: Number.POSITIVE_INFINITY }).get(cellKey(target))?.path ?? null
}

export function calculatePathCost(path: readonly Cell[], movementCostAt: (cell: Cell) => number = () => 1): number {
  let cost = 0
  for (let index = 1; index < path.length; index += 1) {
    const previous = path[index - 1]
    const current = path[index]
    if (Math.abs(current.column - previous.column) + Math.abs(current.row - previous.row) !== 1) {
      return Number.POSITIVE_INFINITY
    }
    const stepCost = movementCostAt(current)
    if (stepCost === Number.POSITIVE_INFINITY) return stepCost
    if (!Number.isFinite(stepCost) || stepCost <= 0) throw new RangeError(`Invalid movement cost at ${cellKey(current)}`)
    cost += stepCost
  }
  return cost
}

export function findReachablePaths({ start, range, size, obstacles, occupied }: UniformMovementOptions): Map<string, Cell[]> {
  const tiles = getReachableTiles({ start, budget: range, size, obstacles, occupied })
  return new Map([...tiles].map(([key, tile]) => [key, tile.path]))
}
