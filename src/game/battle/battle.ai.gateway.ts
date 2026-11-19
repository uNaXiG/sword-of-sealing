import type { Cell } from '../grid/grid.types.ts'
import { canAttackTarget } from './battle.attack.ts'
import {
  decideEnemyTurn,
  hasOpposingAliveUnits,
  isEnemyTurn,
} from './battle.ai.ts'
import type { BattleAction } from './battle.state.ts'
import type { BattleState } from './battle.types.ts'
import type { TurnContext } from './battle.turn.types.ts'

type AIActionIntent =
  | ({ type: 'ai-move'; destination: Cell; targetId: string | null } & TurnContext)
  | ({ type: 'ai-attack'; targetId: string } & TurnContext)
  | ({ type: 'ai-standby' } & TurnContext)

export type AIAction = AIActionIntent

type AIControllerIntent =
  | { type: 'ATTACK'; targetId: string }
  | { type: 'MOVE'; destination: Cell; targetId: string | null }
  | { type: 'STANDBY'; reason: string }

const authorizedActions = new WeakSet<object>()

function createAIAction(intent: AIActionIntent): AIAction {
  const action = Object.freeze({
    ...intent,
    ...('destination' in intent
      ? { destination: Object.freeze({ ...intent.destination }) }
      : {}),
  })
  authorizedActions.add(action)
  return action
}

export function isAuthorizedAIAction(action: unknown): action is AIAction {
  return typeof action === 'object' && action !== null && authorizedActions.has(action)
}

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

export function dispatchAIControllerAction(
  state: BattleState,
  dispatch: (action: BattleAction) => void,
): AIControllerIntent | null {
  const intent = getAIControllerIntent(state)
  const unitId = state.turn.activeUnitId
  if (!intent || !unitId) return null

  const context = { turnId: state.turn.turnId, unitId }
  const action: AIActionIntent = intent.type === 'ATTACK'
    ? { type: 'ai-attack', targetId: intent.targetId, ...context }
    : intent.type === 'MOVE'
      ? {
        type: 'ai-move',
        destination: intent.destination,
        targetId: intent.targetId,
        ...context,
      }
      : { type: 'ai-standby', ...context }

  dispatch(createAIAction(action))
  return intent
}
