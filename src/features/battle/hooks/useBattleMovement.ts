import { useCallback, useMemo, useState } from 'react'
import { GRID_SIZE, KNIGHT_MOVEMENT, KNIGHT_START } from '../../../game/grid/grid.constants'
import type { Cell } from '../../../game/grid/grid.types'
import { cellKey, sameCell } from '../../../game/grid/grid.utils'
import { findReachablePaths } from '../../../game/grid/movement'

const obstacles: readonly Cell[] = []
const otherCharacters: readonly Cell[] = []

export function useBattleMovement() {
  const [position, setPosition] = useState<Cell>(KNIGHT_START)
  const [selected, setSelected] = useState(false)
  const [path, setPath] = useState<Cell[] | null>(null)

  const reachable = useMemo(() => findReachablePaths({
    start: position,
    range: KNIGHT_MOVEMENT,
    size: GRID_SIZE,
    obstacles,
    occupied: otherCharacters,
  }), [position])

  const selectKnight = useCallback(() => {
    if (!path) setSelected(true)
  }, [path])

  const clearSelection = useCallback(() => {
    if (!path) setSelected(false)
  }, [path])

  const selectCell = useCallback((cell: Cell) => {
    if (path) return
    if (sameCell(cell, position)) {
      setSelected(true)
      return
    }
    const nextPath = selected ? reachable.get(cellKey(cell)) : undefined
    if (nextPath) {
      setPath(nextPath)
    } else {
      setSelected(false)
    }
  }, [path, position, reachable, selected])

  const finishMove = useCallback(() => {
    if (!path) return
    setPosition(path[path.length - 1])
    setPath(null)
  }, [path])

  return { position, selected, path, reachable, selectKnight, clearSelection, selectCell, finishMove }
}
