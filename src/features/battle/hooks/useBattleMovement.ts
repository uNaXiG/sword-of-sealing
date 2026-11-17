import { useCallback, useMemo, useReducer } from 'react'
import { INITIAL_UNITS } from '../../../game/battle/battle.data'
import { reachableForUnit } from '../../../game/battle/battle.movement'
import { battleReducer, canUndoLastMove, createBattleState } from '../../../game/battle/battle.state'
import { INITIAL_OBSTACLES, obstacleCell } from '../../../game/battle/obstacles'
import type { Cell } from '../../../game/grid/grid.types'
import type { ReachableTile } from '../../../game/grid/movement'

export function useBattleMovement() {
  const [state, dispatch] = useReducer(battleReducer, undefined, () => createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES))
  const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId) ?? null
  const reachable = useMemo(
    () => selectedUnit ? reachableForUnit(state.units, selectedUnit.id, state.obstacles.map(obstacleCell)) : new Map<string, ReachableTile>(),
    [state.units, state.obstacles, selectedUnit],
  )

  const selectUnit = useCallback((unitId: string) => dispatch({ type: 'select', unitId }), [])
  const clearSelection = useCallback(() => dispatch({ type: 'clear' }), [])
  const selectCell = useCallback((cell: Cell) => dispatch({ type: 'cell', cell }), [])
  const finishMove = useCallback((unitId: string, motionId: number) => dispatch({ type: 'finish', unitId, motionId }), [])
  const cancelMove = useCallback((unitId: string, motionId: number) => dispatch({ type: 'cancel', unitId, motionId }), [])
  const undoMove = useCallback(() => dispatch({ type: 'undo' }), [])
  const commitMove = useCallback(() => dispatch({ type: 'commit' }), [])

  return {
    ...state,
    selectedUnit,
    reachable,
    canUndoMove: canUndoLastMove(state),
    selectUnit,
    clearSelection,
    selectCell,
    finishMove,
    cancelMove,
    undoMove,
    commitMove,
  }
}
