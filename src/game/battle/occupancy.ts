import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey, isInsideGrid } from '../grid/grid.utils.ts'
import type { BattleUnit } from './battle.types'

export function getOccupancy(units: readonly BattleUnit[]): Map<string, BattleUnit> {
  const cells = new Map<string, BattleUnit>()
  const ids = new Set<string>()
  for (const unit of units) {
    const key = cellKey(unit.position)
    if (ids.has(unit.id) || !isInsideGrid(unit.position, GRID_SIZE) || cells.has(key)) {
      throw new Error(`Invalid or duplicate unit placement: ${unit.id} at ${key}`)
    }
    ids.add(unit.id)
    cells.set(key, unit)
  }
  return cells
}

export function unitAt(units: readonly BattleUnit[], cell: Cell): BattleUnit | undefined {
  return getOccupancy(units).get(cellKey(cell))
}
