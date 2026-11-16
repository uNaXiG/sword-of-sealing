import type { Cell } from './grid.types'
import { cellKey, isInsideGrid } from './grid.utils.ts'

type MovementOptions = {
  start: Cell
  range: number
  size: number
  obstacles: readonly Cell[]
  occupied: readonly Cell[]
}

export function findReachablePaths({ start, range, size, obstacles, occupied }: MovementOptions): Map<string, Cell[]> {
  if (!Number.isInteger(size) || size <= 0 || !isInsideGrid(start, size) || !Number.isInteger(range) || range < 0) {
    throw new RangeError('Invalid grid size, starting cell, or movement range')
  }

  const blocked = new Set([...obstacles, ...occupied].map(cellKey))
  if (blocked.has(cellKey(start))) {
    throw new RangeError('The starting cell cannot be blocked')
  }

  const visited = new Set([cellKey(start)])
  const reachable = new Map<string, Cell[]>()
  const queue: Cell[][] = [[start]]

  for (let index = 0; index < queue.length; index += 1) {
    const path = queue[index]
    if (path.length - 1 >= range) continue
    const current = path[path.length - 1]
    const neighbors: Cell[] = [
      { column: current.column + 1, row: current.row },
      { column: current.column - 1, row: current.row },
      { column: current.column, row: current.row + 1 },
      { column: current.column, row: current.row - 1 },
    ]

    for (const neighbor of neighbors) {
      const key = cellKey(neighbor)
      if (!isInsideGrid(neighbor, size) || visited.has(key) || blocked.has(key)) continue
      const nextPath = [...path, neighbor]
      visited.add(key)
      reachable.set(key, nextPath)
      queue.push(nextPath)
    }
  }

  return reachable
}
