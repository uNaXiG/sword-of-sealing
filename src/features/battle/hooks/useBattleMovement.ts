import { useCallback, useMemo, useReducer } from 'react'
import { INITIAL_UNITS } from '../../../game/battle/battle.data'
import { reachableForUnit } from '../../../game/battle/battle.movement'
import { battleReducer, createBattleState } from '../../../game/battle/battle.state'
import { INITIAL_OBSTACLES, obstacleCell } from '../../../game/battle/obstacles'
import type { Cell } from '../../../game/grid/grid.types'

export function useBattleMovement() {
  const [state, dispatch] = useReducer(battleReducer, undefined, () => createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES))
  const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId) ?? null
  const reachable = useMemo(
    () => selectedUnit ? reachableForUnit(state.units, selectedUnit.id, state.obstacles.map(obstacleCell)) : new Map<string, Cell[]>(),
    [state.units, state.obstacles, selectedUnit],
  )

  const selectUnit = useCallback((unitId: string) => dispatch({ type: 'select', unitId }), [])
  const clearSelection = useCallback(() => dispatch({ type: 'clear' }), [])
  const selectCell = useCallback((cell: Cell) => dispatch({ type: 'cell', cell }), [])
  const finishMove = useCallback((unitId: string) => dispatch({ type: 'finish', unitId }), [])

  return { ...state, selectedUnit, reachable, selectUnit, clearSelection, selectCell, finishMove }
}
