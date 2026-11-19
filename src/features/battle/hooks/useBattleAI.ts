import { useEffect, type Dispatch } from 'react'
import { dispatchAIControllerAction } from '../../../game/battle/battle.ai.gateway.ts'
import { canAttackTarget } from '../../../game/battle/battle.attack.ts'
import type { BattleAction } from '../../../game/battle/battle.state.ts'
import type { BattleState } from '../../../game/battle/battle.types.ts'

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
    const intent = dispatchAIControllerAction(state, dispatch)
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
    } else if (intent.type === 'MOVE') {
      logAI('MOVE', {
        ...context,
        destination: intent.destination,
        targetId: intent.targetId,
      })
    } else {
      logAI('TURN END', { ...context, reason: intent.reason })
    }
  }, [dispatch, state])
}

export { getAIControllerIntent } from '../../../game/battle/battle.ai.gateway.ts'
