import { useCallback, useMemo, useReducer } from 'react'
import { INITIAL_UNITS } from '../../../game/battle/battle.data'
import { canAttackTarget, getAttackableTargets, getAttackableTiles, getAttackDistance } from '../../../game/battle/battle.attack'
import { reachableForUnit } from '../../../game/battle/battle.movement'
import { battleReducer, canUndoLastMove, createBattleState, isBattleBusy } from '../../../game/battle/battle.state'
import { INITIAL_OBSTACLES, obstacleCell } from '../../../game/battle/obstacles'
import type { InteractionMode } from '../../../game/battle/battle.types'
import { cellKey } from '../../../game/grid/grid.utils'
import type { Cell } from '../../../game/grid/grid.types'
import type { ReachableTile } from '../../../game/grid/movement'

export function useBattleMovement() {
  const [state, dispatch] = useReducer(battleReducer, undefined, () => createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES))
  const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId) ?? null
  const reachable = useMemo(
    () => selectedUnit ? reachableForUnit(state.units, selectedUnit.id, state.obstacles.map(obstacleCell)) : new Map<string, ReachableTile>(),
    [state.units, state.obstacles, selectedUnit],
  )
  const attackRange = useMemo(
    () => state.interactionMode === 'ATTACK' && selectedUnit
      ? new Set(getAttackableTiles(selectedUnit).map(cellKey))
      : new Set<string>(),
    [state.interactionMode, selectedUnit],
  )
  const attackableTargets = useMemo(
    () => state.interactionMode === 'ATTACK' && selectedUnit
      ? getAttackableTargets(state.units, selectedUnit.id)
      : [],
    [state.interactionMode, selectedUnit, state.units],
  )
  const attackableTargetIds = useMemo(
    () => new Set(attackableTargets.map((unit) => unit.id)),
    [attackableTargets],
  )
  const attackableTargetCells = useMemo(
    () => new Set(attackableTargets.map((unit) => cellKey(unit.position))),
    [attackableTargets],
  )
  const selectedAttackTarget = state.units.find((unit) => unit.id === state.selectedAttackTargetId) ?? null
  const selectedAttackTargetDistance = selectedUnit && selectedAttackTarget
    ? getAttackDistance(selectedUnit.position, selectedAttackTarget.position, selectedUnit.attackPattern)
    : null

  const selectUnit = useCallback((unitId: string) => dispatch({ type: 'select', unitId }), [])
  const clearSelection = useCallback(() => dispatch({ type: 'clear' }), [])
  const standby = useCallback(() => dispatch({ type: 'standby' }), [])
  const selectCell = useCallback((cell: Cell) => dispatch({ type: 'cell', cell }), [])
  const finishMove = useCallback((unitId: string, motionId: number) => dispatch({ type: 'finish', unitId, motionId }), [])
  const cancelMove = useCallback((unitId: string, motionId: number) => dispatch({ type: 'cancel', unitId, motionId }), [])
  const undoMove = useCallback(() => dispatch({ type: 'undo' }), [])
  const commitMove = useCallback(() => dispatch({ type: 'commit' }), [])
  const setInteractionMode = useCallback((mode: Exclude<InteractionMode, 'COMMAND'>) => dispatch({ type: 'set-mode', mode }), [])
  const cancelMoveMode = useCallback(() => dispatch({ type: 'cancel-move-mode' }), [])
  const selectAttackTarget = useCallback((targetId: string) => dispatch({ type: 'select-attack-target', targetId }), [])
  const cancelAttack = useCallback(() => dispatch({ type: 'cancel-attack' }), [])
  const confirmAttack = useCallback(() => dispatch({ type: 'confirm-attack' }), [])
  const impactAttack = useCallback((attackId: number) => dispatch({ type: 'attack-impact', attackId }), [])
  const completeAttack = useCallback((attackId: number) => dispatch({ type: 'attack-complete', attackId }), [])
  const abortAttack = useCallback((attackId: number) => dispatch({ type: 'attack-abort', attackId }), [])
  const consumeImpact = useCallback((impactId: number) => dispatch({ type: 'consume-impact', impactId }), [])
  const completeDeath = useCallback(
    (deathId: number, unitId: string) => dispatch({ type: 'death-complete', deathId, unitId }),
    [],
  )
  const abortDeath = useCallback(
    (deathId: number, unitId: string) => dispatch({ type: 'death-abort', deathId, unitId }),
    [],
  )
  const battleBusy = isBattleBusy(state)

  return {
    ...state,
    selectedUnit,
    selectedAttackTarget,
    selectedAttackTargetDistance,
    reachable,
    attackRange,
    attackableTargets,
    attackableTargetIds,
    attackableTargetCells,
    battleBusy,
    deathMotions: state.deathMotions ?? [],
    defeatedUnits: state.defeatedUnits ?? [],
    confirmedImpacts: state.confirmedImpacts ?? [],
    canConfirmAttack: !battleBusy && state.interactionMode === 'ATTACK' &&
      Boolean(state.selectedAttackTargetId && canAttackTarget(state.units, state.selectedUnitId ?? '', state.selectedAttackTargetId)),
    canUndoMove: state.interactionMode === 'COMMAND' && canUndoLastMove(state),
    selectUnit,
    clearSelection,
    standby,
    selectCell,
    finishMove,
    cancelMove,
    undoMove,
    commitMove,
    setInteractionMode,
    cancelMoveMode,
    selectAttackTarget,
    cancelAttack,
    confirmAttack,
    impactAttack,
    completeAttack,
    abortAttack,
    consumeImpact,
    completeDeath,
    abortDeath,
  }
}
