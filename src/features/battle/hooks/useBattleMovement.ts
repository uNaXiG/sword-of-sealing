import { useCallback, useMemo, useReducer, useState } from 'react'
import { INITIAL_UNITS } from '../../../game/battle/battle.data'
import { getAttackableTargets, getAttackableTiles, getAttackDistance } from '../../../game/battle/battle.attack'
import { reachableForUnit } from '../../../game/battle/battle.movement'
import { canEnterMoveMode, canUndoLastMove, isBattleBusy } from '../../../game/battle/battle.state'
import { createBattleSession } from '../../../game/battle/battle.session.ts'
import { INITIAL_OBSTACLES, obstacleCell } from '../../../game/battle/obstacles'
import type { InteractionMode } from '../../../game/battle/battle.types'
import { cellKey } from '../../../game/grid/grid.utils'
import type { Cell } from '../../../game/grid/grid.types'
import type { ReachableTile } from '../../../game/grid/movement'
import { predictUpcomingTurns } from '../../../game/battle/battle.turn'
import { canConfirmAttack, canEnterAttackMode, canStandby } from '../../../game/battle/battle.action'
import { LossCondition } from '../../../game/end-conditions/loss-condition.ts'
import { AllDead as LossAllDead } from '../../../game/end-conditions/loss/all-dead.ts'
import { WinCondition } from '../../../game/end-conditions/win-condition.ts'
import { AllDead as WinAllDead } from '../../../game/end-conditions/win/all-dead.ts'
import { useBattleAI } from './useBattleAI'

export function useBattleMovement() {
  const [battleSession] = useState(() => createBattleSession({
    units: INITIAL_UNITS,
    obstacles: INITIAL_OBSTACLES,
    winCondition: new WinCondition([new WinAllDead()]),
    lossCondition: new LossCondition([new LossAllDead()]),
  }))
  const [state, dispatch] = useReducer(battleSession.reducer, battleSession.initialState)
  useBattleAI(state, dispatch)
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

  const turnId = state.turn.turnId
  const activeUnitId = state.turn.activeUnitId ?? ''
  const selectUnit = useCallback(
    (unitId: string) => dispatch({ type: 'select', targetId: unitId, turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const clearSelection = useCallback(
    () => dispatch({ type: 'clear', turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const standby = useCallback(
    () => dispatch({ type: 'standby', turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const selectCell = useCallback(
    (cell: Cell) => dispatch({ type: 'cell', cell, turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const finishMove = useCallback((unitId: string, motionId: number) => dispatch({ type: 'finish', unitId, motionId }), [])
  const cancelMove = useCallback((unitId: string, motionId: number) => dispatch({ type: 'cancel', unitId, motionId }), [])
  const undoMove = useCallback(
    () => dispatch({ type: 'undo', turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const setInteractionMode = useCallback(
    (mode: Exclude<InteractionMode, 'COMMAND'>) => dispatch({ type: 'set-mode', mode, turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const cancelMoveMode = useCallback(
    () => dispatch({ type: 'cancel-move-mode', turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const selectAttackTarget = useCallback(
    (targetId: string) => dispatch({ type: 'select-attack-target', targetId, turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const cancelAttack = useCallback(
    () => dispatch({ type: 'cancel-attack', turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const confirmAttack = useCallback(
    () => dispatch({ type: 'confirm-attack', turnId, unitId: activeUnitId }),
    [turnId, activeUnitId],
  )
  const impactAttack = useCallback((attackId: number) => {
    if (import.meta.env?.DEV) console.debug('[ATTACK DISPATCH]', { event: 'attack-impact', attackId })
    dispatch({ type: 'attack-impact', attackId })
  }, [])
  const completeAttack = useCallback((attackId: number) => {
    if (import.meta.env?.DEV) console.debug('[ATTACK DISPATCH]', { event: 'attack-complete', attackId })
    dispatch({ type: 'attack-complete', attackId })
  }, [])
  const abortAttack = useCallback((attackId: number) => {
    if (import.meta.env?.DEV) console.debug('[ATTACK DISPATCH]', { event: 'attack-abort', attackId })
    dispatch({ type: 'attack-abort', attackId })
  }, [])
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
  const activeUnit = state.units.find((unit) => unit.id === state.turn.activeUnitId) ?? null
  const upcomingTurns = useMemo(
    () => predictUpcomingTurns(state.turn, state.units),
    [state.turn, state.units],
  )

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
    activeUnit,
    upcomingTurns,
    deathMotions: state.deathMotions ?? [],
    defeatedUnits: state.defeatedUnits ?? [],
    confirmedImpacts: state.confirmedImpacts ?? [],
    canEnterMoveMode: canEnterMoveMode(state),
    canEnterAttackMode: canEnterAttackMode(state),
    canConfirmAttack: canConfirmAttack(state),
    canStandby: canStandby(state),
    canUndoMove: state.interactionMode === 'COMMAND' && canUndoLastMove(state),
    selectUnit,
    clearSelection,
    standby,
    selectCell,
    finishMove,
    cancelMove,
    undoMove,
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
