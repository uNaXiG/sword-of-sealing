import { useEffect, type Dispatch } from 'react'
import {
  createAIAction,
  decideEnemyTurn,
  hasOpposingAliveUnits,
  isEnemyTurn,
} from '../../../game/battle/battle.ai.ts'
import type { BattleAction } from '../../../game/battle/battle.state.ts'
import type { BattleState } from '../../../game/battle/battle.types.ts'
import { canAttackTarget } from '../../../game/battle/battle.attack.ts'

type AIControllerIntent =
  | { type: 'ATTACK'; targetId: string }
  | { type: 'MOVE'; destination: { column: number; row: number }; targetId: string | null }
  | { type: 'STANDBY'; reason: string }

export function getAIControllerIntent(state: BattleState): AIControllerIntent | null {
  const unitId = state.turn.activeUnitId
  if (
    !unitId ||
    !isEnemyTurn(state) ||
    !hasOpposingAliveUnits(state) ||
    !state.turnAction ||
    state.turnAction.turnId !== state.turn.turnId ||
    state.turnAction.unitId !== unitId ||
    state.pendingTurnCompletion ||
    state.motion ||
    state.attackMotion ||
    state.deathMotions.length > 0
  ) return null

  const progress = state.aiProgress
  if (progress && (progress.turnId !== state.turn.turnId || progress.unitId !== unitId)) return null

  if (progress?.phase === 'MOVE_COMPLETED') {
    if (
      state.turnAction.movementUsed &&
      progress.targetId &&
      state.turnAction.combatAction === 'AVAILABLE' &&
      canAttackTarget(state.units, unitId, progress.targetId)
    ) return { type: 'ATTACK', targetId: progress.targetId }

    const retry = decideEnemyTurn(state, unitId)
    return retry.type === 'ATTACK'
      ? { type: 'ATTACK', targetId: retry.targetId }
      : { type: 'STANDBY', reason: 'move-completed-without-legal-target' }
  }
  if (progress?.phase === 'MOVING') {
    return { type: 'STANDBY', reason: 'movement-ended-before-completion' }
  }
  if (progress?.phase === 'ATTACKING') {
    return { type: 'STANDBY', reason: 'attack-ended-before-completion' }
  }

  const decision = decideEnemyTurn(state, unitId)
  if (decision.type === 'ATTACK') return { type: 'ATTACK', targetId: decision.targetId }
  if (decision.type === 'MOVE_ATTACK') {
    return { type: 'MOVE', destination: decision.destination, targetId: decision.targetId }
  }
  if (decision.type === 'APPROACH') {
    return { type: 'MOVE', destination: decision.destination, targetId: null }
  }
  return { type: 'STANDBY', reason: 'decision-standby' }
}

function logAI(message: string, data: Record<string, unknown>): void {
  if (import.meta.env?.DEV) console.debug(`[AI ${message}]`, data)
}

export function useBattleAI(
  state: BattleState,
  dispatch: Dispatch<BattleAction>,
): void {
  useEffect(() => {
    const unitId = state.turn.activeUnitId
    if (!unitId) return
    const context = { turnId: state.turn.turnId, unitId }
    const intent = getAIControllerIntent(state)
    if (!intent) return

    logAI(state.aiProgress ? `PHASE ${state.aiProgress.phase}` : 'TURN START', {
      ...context,
      position: state.units.find((unit) => unit.id === unitId)?.position,
      movementUsed: state.turnAction?.movementUsed,
      combatAction: state.turnAction?.combatAction,
    })
    if (!state.aiProgress) {
      logAI('DECISION', {
        ...context,
        decisionType: intent.type,
        targetId: 'targetId' in intent ? intent.targetId : null,
        destination: 'destination' in intent ? intent.destination : null,
        reason: intent.type === 'STANDBY' ? intent.reason : null,
      })
    }

    if (intent.type === 'ATTACK') {
      logAI('ATTACK CHECK', {
        ...context,
        targetId: intent.targetId,
        canAttackTarget: canAttackTarget(state.units, unitId, intent.targetId),
        combatAction: state.turnAction?.combatAction,
        movementUsed: state.turnAction?.movementUsed,
        busy: Boolean(state.motion || state.attackMotion || state.deathMotions.length),
      })
      dispatch(createAIAction({
        type: 'ai-attack',
        targetId: intent.targetId,
        ...context,
      }))
      return
    }
    if (intent.type === 'MOVE') {
      logAI('MOVE', {
        ...context,
        destination: intent.destination,
        targetId: intent.targetId,
      })
      dispatch(createAIAction({
        type: 'ai-move',
        destination: intent.destination,
        targetId: intent.targetId,
        ...context,
      }))
      return
    }
    logAI('TURN END', { ...context, reason: intent.reason })
    dispatch(createAIAction({ type: 'ai-standby', ...context }))
  }, [dispatch, state])
}
