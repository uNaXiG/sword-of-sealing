import type { Cell } from './grid.types'

export function cellKey(cell: Cell): string {
  return `${cell.column},${cell.row}`
}

export function sameCell(first: Cell, second: Cell): boolean {
  return first.column === second.column && first.row === second.row
}

export function isInsideGrid(cell: Cell, size: number): boolean {
  return Number.isInteger(cell.column) && Number.isInteger(cell.row)
    && cell.column >= 0 && cell.column < size && cell.row >= 0 && cell.row < size
}
