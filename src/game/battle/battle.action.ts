import type { BattleState } from './battle.types.ts'
import type { BattleTurnState, TurnActionState, TurnContext } from './battle.turn.types.ts'
import { canAttackTarget } from './battle.attack.ts'
import { isUnitAlive } from './battle.unit.ts'

export function createTurnActionState(turn: BattleTurnState): TurnActionState | null {
  return turn.activeUnitId
    ? {
      turnId: turn.turnId,
      unitId: turn.activeUnitId,
      movementUsed: false,
      movementInitiationLocked: false,
      combatAction: 'AVAILABLE',
      reservedAttackId: null,
    }
    : null
}

export function matchesTurnContext(
  state: BattleState,
  context: TurnContext,
): boolean {
  return Boolean(
    state.turn.activeUnitId &&
    state.turnAction &&
    context.turnId === state.turn.turnId &&
    context.unitId === state.turn.activeUnitId &&
    state.turnAction.turnId === state.turn.turnId &&
    state.turnAction.unitId === state.turn.activeUnitId,
  )
}

export function canEnterAttackMode(state: BattleState): boolean {
  const unit = state.units.find((candidate) => candidate.id === state.selectedUnitId)
  return Boolean(
    canUseCombatAction(state) &&
    state.turnAction?.combatAction === 'AVAILABLE' &&
    !state.turnAction.reservedAttackId &&
    state.interactionMode === 'COMMAND' &&
    unit &&
    unit.faction === 'player' &&
    unit.hp > 0 &&
    unit.id === state.turn.activeUnitId &&
    state.turnAction?.turnId === state.turn.turnId &&
    state.turnAction.unitId === state.turn.activeUnitId,
  )
}

export function canConfirmAttack(state: BattleState): boolean {
  return Boolean(
    canUseCombatAttack(state, state.selectedUnitId, state.selectedAttackTargetId) &&
    state.interactionMode === 'ATTACK' &&
    state.selectedUnitId === state.turn.activeUnitId &&
    state.units.some((unit) =>
      unit.id === state.selectedUnitId &&
      unit.faction === 'player' &&
      isUnitAlive(unit)),
  )
}

export function canStandby(state: BattleState): boolean {
  const unit = state.units.find((candidate) => candidate.id === state.selectedUnitId)
  return Boolean(
    canUseCombatAction(state) &&
    state.interactionMode === 'COMMAND' &&
    state.turnAction?.turnId === state.turn.turnId &&
    state.turnAction.unitId === state.turn.activeUnitId &&
    unit &&
    unit.faction === 'player' &&
    unit.hp > 0 &&
    unit.id === state.turn.activeUnitId,
  )
}

export function canUseCombatAttack(
  state: BattleState,
  attackerId: string | null,
  targetId: string | null,
): boolean {
  return Boolean(
    !state.pendingTurnCompletion &&
    state.motion === null &&
    state.attackMotion === null &&
    state.deathMotions.length === 0 &&
    state.turnAction?.combatAction === 'AVAILABLE' &&
    state.turnAction.turnId === state.turn.turnId &&
    state.turnAction.unitId === state.turn.activeUnitId &&
    state.turnAction.reservedAttackId === null &&
    attackerId &&
    targetId &&
    attackerId === state.turn.activeUnitId &&
    canAttackTarget(state.units, attackerId, targetId),
  )
}

function canUseCombatAction(state: BattleState): boolean {
  return Boolean(
    !state.pendingTurnCompletion &&
    state.motion === null &&
    state.attackMotion === null &&
    state.deathMotions.length === 0,
  )
}
