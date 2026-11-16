export type Cell = { column: number; row: number }

export const knightCell: Cell = { column: 4, row: 4 }

export function cellPosition(cell: Cell): [number, number, number] {
  return [cell.column - 3.5, 0, cell.row - 3.5]
}
