import { GRID_SIZE } from '../../../game/grid/grid.constants'
import type { Cell } from '../../../game/grid/grid.types'

export function cellPosition(cell: Cell): [number, number, number] {
  return [cell.column - (GRID_SIZE - 1) / 2, 0, cell.row - (GRID_SIZE - 1) / 2]
}
