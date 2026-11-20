import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey, isInsideGrid } from '../grid/grid.utils.ts'
import { reachableForUnit, moveUnit } from './battle.movement.ts'
import { canAttackTarget } from './battle.attack.ts'
import type { BattleOutcome, BattleState, BattleUnit, DeathMotion, InteractionMode } from './battle.types'
import {
  canConfirmAttack,
  canEnterAttackMode,
  canStandby,
  canUseCombatAttack,
  createTurnActionState,
  matchesTurnContext,
} from './battle.action.ts'
import { unitAt } from './occupancy.ts'
import { obstacleCell, validateObstacles, type BattleObstacle } from './obstacles.ts'
import { TERRAIN_MOVEMENT_COST } from '../grid/terrain.constants.ts'
import { getTerrainType } from '../grid/terrain.data.ts'
import { calculatePhysicalDamage } from './battle.damage.ts'
import { isUnitAlive } from './battle.unit.ts'
import { isUnitClass, validateAttackProperties } from '../classes/class.data.ts'
import { getAttackProfile } from './battle.animation.ts'
import type { AIAction } from './battle.ai.gateway.ts'
import { isAuthorizedAIAction } from './battle.ai.gateway.ts'
import {
  completeIndividualTurn,
  initializeTurnState,
  removeDefeatedUnitFromTimeline,
} from './battle.turn.ts'
import type { PendingTurnCompletion, TurnContext } from './battle.turn.types.ts'
import { createBattleConditionContext } from '../end-conditions/end-condition.context.ts'
import { resolveBattleOutcome } from '../end-conditions/outcome-resolver.ts'
import type { LossCondition } from '../end-conditions/loss-condition.ts'
import type { WinCondition } from '../end-conditions/win-condition.ts'

export type BattleAction =
  | ({ type: 'select'; targetId: string } & TurnContext)
  | ({ type: 'cell'; cell: Cell } & TurnContext)
  | ({ type: 'clear' } & TurnContext)
  | ({ type: 'standby' } & TurnContext)
  | { type: 'finish'; unitId: string; motionId: number }
  | { type: 'cancel'; unitId: string; motionId: number }
  | ({ type: 'undo' } & TurnContext)
  | ({ type: 'commit' } & TurnContext)
  | ({ type: 'set-mode'; mode: Exclude<InteractionMode, 'COMMAND'> } & TurnContext)
  | ({ type: 'cancel-move-mode' } & TurnContext)
  | ({ type: 'select-attack-target'; targetId: string } & TurnContext)
  | ({ type: 'cancel-attack' } & TurnContext)
  | ({ type: 'confirm-attack' } & TurnContext)
  | { type: 'attack-impact'; attackId: number }
  | { type: 'attack-complete'; attackId: number }
  | { type: 'attack-abort'; attackId: number }
  | { type: 'consume-impact'; impactId: number }
  | { type: 'death-complete'; deathId: number; unitId: string }
  | { type: 'death-abort'; deathId: number; unitId: string }
  | AIAction

export type BattleReducer = (state: BattleState, action: BattleAction) => BattleState

export type BattleEndConditionConfiguration = {
  readonly initialUnits: readonly BattleUnit[]
  readonly winCondition: WinCondition
  readonly lossCondition: LossCondition
}

export function createBattleState(units: readonly BattleUnit[], obstacles: readonly BattleObstacle[] = []): BattleState {
  for (const unit of units) {
    if (!isUnitClass(unit.class)) throw new Error(`Battle unit class is invalid: ${unit.id}`)
    if (unit.faction !== 'player' && unit.faction !== 'enemy') throw new Error(`Battle unit faction is invalid: ${unit.id}`)
    if (!Number.isSafeInteger(unit.maxHp) || unit.maxHp <= 0) {
      throw new RangeError(`Battle unit max HP must be a positive safe integer: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.hp) || unit.hp < 0 || unit.hp > unit.maxHp) {
      throw new RangeError(`Battle unit HP must be a safe integer between 0 and max HP: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.atk) || unit.atk < 0) {
      throw new RangeError(`Battle unit attack must be a non-negative safe integer: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.def) || unit.def < 0) {
      throw new RangeError(`Battle unit defense must be a non-negative safe integer: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.maxSp) || unit.maxSp < 0) {
      throw new RangeError(`Battle unit max SP must be a non-negative safe integer: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.sp) || unit.sp < 0 || unit.sp > unit.maxSp) {
      throw new RangeError(`Battle unit SP must be a safe integer between 0 and max SP: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.agi) || unit.agi < 0) {
      throw new RangeError(`Battle unit agility must be a non-negative safe integer: ${unit.id}`)
    }
    if (!Number.isSafeInteger(unit.movementPoints) || unit.movementPoints < 0) {
      throw new RangeError(`Battle unit movement points must be a non-negative safe integer: ${unit.id}`)
    }
    validateAttackProperties(unit)
  }
  validateObstacles(obstacles, units)
  const turn = initializeTurnState(units)
  return {
    outcome: null,
    units: units.map((unit) => ({ ...unit, position: { ...unit.position } })),
    obstacles: obstacles.map((obstacle) => ({ ...obstacle, position: { ...obstacle.position } })),
    selectedUnitId: units.find((unit) => unit.id === turn.activeUnitId && unit.faction === 'player')?.id ?? null,
    motion: null,
    nextMotionId: 1,
    lastMove: null,
    turnAction: createTurnActionState(turn),
    interactionMode: 'COMMAND',
    selectedAttackTargetId: null,
    lastAttackCommand: null,
    lastAttackResult: null,
    attackMotion: null,
    nextAttackId: 1,
    deathMotions: [],
    nextDeathId: 1,
    defeatedUnits: [],
    confirmedImpacts: [],
    aiProgress: null,
    turn,
    pendingTurnCompletion: null,
  }
}

export function isBattleBusy(state: BattleState): boolean {
  return state.motion !== null || state.attackMotion !== null || (state.deathMotions?.length ?? 0) > 0
}

export function canEnterMoveMode(state: BattleState): boolean {
  const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId)
  return !isBattleBusy(state) &&
    !state.pendingTurnCompletion &&
    state.interactionMode === 'COMMAND' &&
    selectedUnit?.faction === 'player' &&
    selectedUnit.id === state.turn.activeUnitId &&
    isUnitAlive(selectedUnit) &&
    state.turnAction?.movementUsed === false &&
    state.turnAction.movementInitiationLocked === false &&
    state.turnAction.turnId === state.turn.turnId &&
    state.turnAction.unitId === state.turn.activeUnitId
}

export function canUndoLastMove(state: BattleState): boolean {
  const record = state.lastMove
  if (
    !record ||
    record.turnId !== state.turn.turnId ||
    state.turnAction?.turnId !== state.turn.turnId ||
    state.turnAction.unitId !== record.unitId ||
    !state.turnAction.movementUsed ||
    state.turnAction.movementInitiationLocked ||
    isBattleBusy(state) ||
    state.interactionMode !== 'COMMAND' ||
    state.pendingTurnCompletion !== null ||
    state.selectedUnitId !== record.unitId ||
    state.turn.activeUnitId !== record.unitId
  ) return false

  const unit = state.units.find((candidate) => candidate.id === record.unitId)
  if (
    !unit ||
    unit.faction !== 'player' ||
    !isUnitAlive(unit) ||
    !isInsideGrid(unit.position, GRID_SIZE) ||
    !isInsideGrid(record.to, GRID_SIZE) ||
    cellKey(unit.position) !== cellKey(record.to) ||
    cellKey(record.from) === cellKey(record.to) ||
    !isInsideGrid(record.from, GRID_SIZE) ||
    record.path.length < 2 ||
    cellKey(record.path[0]) !== cellKey(record.from) ||
    cellKey(record.path[record.path.length - 1]) !== cellKey(record.to)
  ) return false

  const originKey = cellKey(record.from)
  if (
    state.units.some((candidate) => candidate.id !== record.unitId && cellKey(candidate.position) === originKey) ||
    state.obstacles.some((obstacle) => cellKey(obstacleCell(obstacle)) === originKey) ||
    TERRAIN_MOVEMENT_COST[getTerrainType(record.from, state.obstacles)] === Number.POSITIVE_INFINITY
  ) return false

  return true
}

function selectPlayerUnit(state: BattleState, unitId: string): BattleState {
  const unit = state.units.find((candidate) => candidate.id === unitId)
  if (
    unit?.faction !== 'player' ||
    !isUnitAlive(unit) ||
    unit.id !== state.turn.activeUnitId ||
    unit.id === state.selectedUnitId
  ) return state
  return {
    ...state,
    selectedUnitId: unit.id,
    interactionMode: 'COMMAND',
    selectedAttackTargetId: null,
    lastAttackCommand: null,
    lastAttackResult: null,
    lastMove: state.lastMove?.unitId === unit.id ? state.lastMove : null,
  }
}

function selectAttackTarget(state: BattleState, targetId: string): BattleState {
  if (state.interactionMode !== 'ATTACK' || isBattleBusy(state)) return state
  return {
    ...state,
    selectedAttackTargetId: canAttackTarget(state.units, state.selectedUnitId ?? '', targetId) ? targetId : null,
    lastAttackCommand: null,
    lastAttackResult: null,
  }
}

function selectUnitOrAttackTarget(state: BattleState, unitId: string): BattleState {
  if (state.interactionMode !== 'ATTACK') return selectPlayerUnit(state, unitId)
  return selectAttackTarget(state, unitId)
}

function abortAttack(state: BattleState): BattleState {
  const attack = state.attackMotion
  const turnAction = state.turnAction
  if (!attack || !turnAction || !canAbortAttack(state)) return state
  const attackerStillSelectable = state.units.some(
    (unit) => unit.id === attack.attackerId && unit.faction === 'player' && isUnitAlive(unit),
  )
  return {
    ...state,
    attackMotion: null,
    turnAction: attack.phase === 'PENDING_IMPACT'
      ? { ...turnAction, combatAction: 'AVAILABLE', reservedAttackId: null }
      : turnAction,
    interactionMode: 'COMMAND',
    selectedUnitId: attackerStillSelectable ? attack.attackerId : null,
    selectedAttackTargetId: null,
    lastAttackCommand: attack.phase === 'PENDING_IMPACT' ? null : state.lastAttackCommand,
    lastAttackResult: attack.phase === 'PENDING_IMPACT' ? null : state.lastAttackResult,
  }
}

function canAbortAttack(state: BattleState): boolean {
  const attack = state.attackMotion
  const turnAction = state.turnAction
  return Boolean(
    attack &&
    turnAction &&
    turnAction.turnId === attack.turnId &&
    turnAction.unitId === attack.attackerId &&
    (attack.phase !== 'PENDING_IMPACT' ||
      (turnAction.combatAction === 'RESERVED' && turnAction.reservedAttackId === attack.attackId)) &&
    (attack.phase !== 'IMPACTED' || turnAction.combatAction === 'CONSUMED'),
  )
}

function clearTurnContext(state: BattleState): BattleState {
  return {
    ...state,
    motion: null,
    lastMove: null,
    interactionMode: 'COMMAND',
    selectedAttackTargetId: null,
    lastAttackCommand: null,
    attackMotion: null,
    aiProgress: null,
  }
}

function reserveAttack(
  state: BattleState,
  attackerId: string,
  targetId: string,
): BattleState {
  const attacker = state.units.find((unit) => unit.id === attackerId)
  const target = state.units.find((unit) => unit.id === targetId)
  const turnAction = state.turnAction
  if (!attacker || !target || !turnAction) return state
  const result = {
    attackerId,
    targetId,
    ...calculatePhysicalDamage(attacker, target),
  }
  return {
    ...state,
    interactionMode: 'COMMAND',
    selectedAttackTargetId: null,
    lastAttackCommand: { attackerId, targetId },
    lastAttackResult: null,
    attackMotion: {
      attackId: state.nextAttackId,
      turnId: state.turn.turnId,
      attackerId,
      targetId,
      from: { ...attacker.position },
      to: { ...target.position },
      animationType: getAttackProfile(attacker.class).type,
      phase: 'PENDING_IMPACT',
      result,
    },
    turnAction: {
      ...turnAction,
      movementInitiationLocked: true,
      combatAction: 'RESERVED',
      reservedAttackId: state.nextAttackId,
    },
    nextAttackId: state.nextAttackId + 1,
    lastMove: null,
  }
}

type OutcomeResolver = (state: BattleState) => BattleState

function advanceIndividualTurn(
  state: BattleState,
  context: TurnContext,
  resolveOutcome: OutcomeResolver,
): BattleState {
  if (!matchesTurnContext(state, context) || isBattleBusy(state)) return state
  const resolved = resolveOutcome(state)
  if (resolved !== state) return resolved
  const turn = completeIndividualTurn(state.turn, state.units)
  const activeUnit = state.units.find((unit) => unit.id === turn.activeUnitId && isUnitAlive(unit)) ?? null
  return {
    ...clearTurnContext(state),
    turn,
    turnAction: createTurnActionState(turn),
    pendingTurnCompletion: null,
    selectedUnitId: activeUnit?.faction === 'player' ? activeUnit.id : null,
  }
}

function resolvePendingTurnCompletion(
  state: BattleState,
  resolveOutcome: OutcomeResolver,
): BattleState {
  if (isBattleBusy(state)) return state
  const resolved = resolveOutcome(state)
  if (resolved !== state) return resolved
  const pending = state.pendingTurnCompletion
  if (!pending) return state
  if (pending.turnId !== state.turn.turnId || pending.unitId !== state.turn.activeUnitId) {
    return { ...state, pendingTurnCompletion: null }
  }
  return advanceIndividualTurn(state, pending, resolveOutcome)
}

function queueTurnCompletion(
  state: BattleState,
  pending: PendingTurnCompletion,
  resolveOutcome: OutcomeResolver,
): BattleState {
  const queued = { ...state, pendingTurnCompletion: pending }
  return resolvePendingTurnCompletion(queued, resolveOutcome)
}

function reduceBattleState(
  state: BattleState,
  action: BattleAction,
  resolveOutcome: OutcomeResolver,
): BattleState {
  if (
    action.type === 'select' ||
    action.type === 'cell' ||
    action.type === 'clear' ||
    action.type === 'standby' ||
    action.type === 'undo' ||
    action.type === 'commit' ||
    action.type === 'set-mode' ||
    action.type === 'cancel-move-mode' ||
    action.type === 'select-attack-target' ||
    action.type === 'cancel-attack' ||
    action.type === 'confirm-attack'
  ) {
    if (!matchesTurnContext(state, action) || state.pendingTurnCompletion) return state
  }

  if (action.type.startsWith('ai-')) {
    if (!isAuthorizedAIAction(action)) return state
    const activeUnit = state.units.find((unit) => unit.id === state.turn.activeUnitId)
    if (
      !activeUnit ||
      activeUnit.faction !== 'enemy' ||
      !isUnitAlive(activeUnit) ||
      action.unitId !== activeUnit.id ||
      action.turnId !== state.turn.turnId ||
      isBattleBusy(state) ||
      state.pendingTurnCompletion
    ) return state
  }

  if (action.type === 'ai-standby') {
    const progress = state.aiProgress
    if (progress && (
      progress.turnId !== action.turnId ||
      progress.unitId !== action.unitId
    )) return state
    return advanceIndividualTurn(state, action, resolveOutcome)
  }

  if (action.type === 'ai-move') {
    const turnAction = state.turnAction
    if (
      !turnAction ||
      state.aiProgress ||
      turnAction.movementUsed ||
      turnAction.movementInitiationLocked ||
      turnAction.combatAction !== 'AVAILABLE' ||
      turnAction.turnId !== action.turnId ||
      turnAction.unitId !== action.unitId
    ) return state
    const activeUnit = state.units.find((unit) => unit.id === action.unitId)
    if (!activeUnit || activeUnit.faction !== 'enemy' || !isUnitAlive(activeUnit)) return state
    if (action.targetId && !state.units.some((unit) =>
      unit.id === action.targetId &&
      unit.faction !== activeUnit.faction &&
      isUnitAlive(unit),
    )) return state
    const destination = reachableForUnit(
      state.units,
      activeUnit.id,
      state.obstacles.map(obstacleCell),
    ).get(cellKey(action.destination))
    if (!destination) return state
    if (action.targetId) {
      const hypotheticalUnits = state.units.map((unit) => unit.id === activeUnit.id
        ? { ...unit, position: { ...action.destination } }
        : unit)
      if (!canAttackTarget(hypotheticalUnits, activeUnit.id, action.targetId)) return state
    }
    return {
      ...state,
      motion: {
        motionId: state.nextMotionId,
        turnId: action.turnId,
        unitId: action.unitId,
        path: destination.path.map((cell) => ({ ...cell })),
        cost: destination.cost,
      },
      nextMotionId: state.nextMotionId + 1,
      aiProgress: {
        turnId: action.turnId,
        unitId: action.unitId,
        phase: 'MOVING',
        targetId: action.targetId,
      },
      interactionMode: 'COMMAND',
      selectedUnitId: null,
      selectedAttackTargetId: null,
      lastMove: null,
    }
  }

  if (action.type === 'ai-attack') {
    const progress = state.aiProgress
    if (
      (progress && (
        progress.turnId !== action.turnId ||
        progress.unitId !== action.unitId ||
        progress.phase !== 'MOVE_COMPLETED' ||
        !state.turnAction?.movementUsed
      )) ||
      (!progress && state.turnAction?.movementUsed)
    ) return state
    if (!canUseCombatAttack(state, action.unitId, action.targetId)) return state
    const reserved = reserveAttack(state, action.unitId, action.targetId)
    return reserved === state
      ? state
      : {
        ...reserved,
        aiProgress: {
          turnId: action.turnId,
          unitId: action.unitId,
          phase: 'ATTACKING',
        },
      }
  }

  if (action.type === 'consume-impact') {
    const exists = state.confirmedImpacts.some((impact) => impact.impactId === action.impactId)
    return exists
      ? { ...state, confirmedImpacts: state.confirmedImpacts.filter((impact) => impact.impactId !== action.impactId) }
      : state
  }

  if (action.type === 'death-complete' || action.type === 'death-abort') {
    const motion = state.deathMotions.find(
      (candidate) => candidate.deathId === action.deathId && candidate.unitId === action.unitId,
    )
    const unit = motion && state.units.find((candidate) => candidate.id === motion.unitId)
    if (!motion || !unit || unit.hp !== 0) return state
    const finalized = finalizeDeath(state, motion)
    if (
      state.turn.activeUnitId === motion.unitId &&
      !state.units.some((unit) => unit.id === motion.unitId && isUnitAlive(unit))
    ) {
      return resolvePendingTurnCompletion({
        ...finalized,
        pendingTurnCompletion: {
          turnId: state.turn.turnId,
          unitId: motion.unitId,
          attackId: motion.attackId,
        },
      }, resolveOutcome)
    }
    return resolvePendingTurnCompletion(finalized, resolveOutcome)
  }

  if (action.type === 'attack-impact') {
    const attack = state.attackMotion
    if (import.meta.env?.DEV && attack) {
      console.debug('[REDUCER IMPACT]', {
        attackId: action.attackId,
        motionAttackId: attack.attackId,
        phase: attack.phase,
        turnId: state.turn.turnId,
        motionTurnId: attack.turnId,
        combatAction: state.turnAction?.combatAction,
        reservedAttackId: state.turnAction?.reservedAttackId,
      })
    }
    if (
      !attack ||
      attack.attackId !== action.attackId ||
      attack.turnId !== state.turn.turnId ||
      attack.phase !== 'PENDING_IMPACT' ||
      state.turnAction?.turnId !== attack.turnId ||
      state.turnAction.unitId !== attack.attackerId ||
      state.turnAction.combatAction !== 'RESERVED' ||
      state.turnAction.reservedAttackId !== attack.attackId
    ) {
      if (import.meta.env?.DEV) console.debug('[REDUCER IMPACT REJECTED]', {
        attackId: action.attackId,
        reason: 'guard-mismatch',
      })
      return state
    }
    const attacker = state.units.find((unit) => unit.id === attack.attackerId)
    const target = state.units.find((unit) => unit.id === attack.targetId)
    if (
      !attacker ||
      !target ||
      !isUnitAlive(attacker) ||
      !isUnitAlive(target) ||
      cellKey(attacker.position) !== cellKey(attack.from) ||
      cellKey(target.position) !== cellKey(attack.to) ||
      target.hp !== attack.result.previousHp ||
      !canAttackTarget(state.units, attack.attackerId, attack.targetId)
    ) {
      if (import.meta.env?.DEV) console.debug('[REDUCER IMPACT REJECTED]', {
        attackId: action.attackId,
        reason: 'snapshot-or-eligibility',
      })
      return abortAttack(state)
    }

    const expected = calculatePhysicalDamage(attacker, target)
    if (
      expected.damage !== attack.result.damage ||
      expected.appliedDamage !== attack.result.appliedDamage ||
      expected.previousHp !== attack.result.previousHp ||
      expected.remainingHp !== attack.result.remainingHp ||
      expected.isDefeated !== attack.result.isDefeated
    ) {
      if (import.meta.env?.DEV) console.debug('[REDUCER IMPACT REJECTED]', {
        attackId: action.attackId,
        reason: 'damage-snapshot',
      })
      return abortAttack(state)
    }
    if (import.meta.env?.DEV) console.debug('[REDUCER IMPACT ACCEPTED]', {
      attackId: action.attackId,
      targetId: target.id,
      hpBefore: target.hp,
      hpAfter: attack.result.remainingHp,
      appliedDamage: attack.result.appliedDamage,
    })

    const becomesDefeated = target.hp > 0 && attack.result.remainingHp === 0
    const deathMotion: DeathMotion | null = becomesDefeated
      ? {
        deathId: state.nextDeathId,
        unitId: target.id,
        killerId: attacker.id,
        attackId: attack.attackId,
        position: { ...target.position },
        sourcePosition: { ...attacker.position },
      }
      : null
    return {
      ...state,
      units: state.units.map((unit) => unit.id === target.id ? { ...unit, hp: attack.result.remainingHp } : unit),
      attackMotion: { ...attack, phase: 'IMPACTED' },
      turnAction: {
        ...state.turnAction,
        combatAction: 'CONSUMED',
        reservedAttackId: null,
      },
      lastAttackResult: attack.result,
      deathMotions: deathMotion ? [...(state.deathMotions ?? []), deathMotion] : state.deathMotions ?? [],
      nextDeathId: deathMotion ? state.nextDeathId + 1 : state.nextDeathId,
      confirmedImpacts: [
        ...(state.confirmedImpacts ?? []),
        {
          impactId: attack.attackId,
          attackId: attack.attackId,
          attackerId: attack.attackerId,
          targetId: attack.targetId,
          position: { ...attack.to },
          animationType: attack.animationType,
          result: attack.result,
        },
      ],
      selectedUnitId: deathMotion && state.selectedUnitId === target.id ? null : state.selectedUnitId,
      selectedAttackTargetId: deathMotion && state.selectedAttackTargetId === target.id ? null : state.selectedAttackTargetId,
      lastMove: deathMotion && state.lastMove?.unitId === target.id ? null : state.lastMove,
      turn: deathMotion
        ? removeDefeatedUnitFromTimeline(state.turn, target.id)
        : state.turn,
    }
  }

  if (action.type === 'attack-complete') {
    const attack = state.attackMotion
    if (
      !attack ||
      attack.attackId !== action.attackId ||
      attack.turnId !== state.turn.turnId ||
      attack.phase !== 'IMPACTED' ||
      state.turnAction?.combatAction !== 'CONSUMED'
    ) return state
    const completed: BattleState = {
      ...state,
      attackMotion: null,
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      selectedUnitId: state.units.some(
        (unit) => unit.id === attack.attackerId && unit.faction === 'player' && isUnitAlive(unit),
      ) ? attack.attackerId : null,
    }
    return queueTurnCompletion(completed, {
      turnId: attack.turnId,
      unitId: attack.attackerId,
      attackId: attack.attackId,
    }, resolveOutcome)
  }

  if (action.type === 'attack-abort') {
    if (
      !state.attackMotion ||
      state.attackMotion.attackId !== action.attackId ||
      state.attackMotion.turnId !== state.turn.turnId ||
      !canAbortAttack(state)
    ) return state
    const attack = state.attackMotion
    const aborted = abortAttack(state)
    if (attack.phase === 'PENDING_IMPACT') {
      const attacker = state.units.find((unit) => unit.id === attack.attackerId)
      if (attacker?.faction !== 'enemy') return resolveOutcome(aborted)
      return queueTurnCompletion(
        { ...aborted, aiProgress: null },
        {
          turnId: attack.turnId,
          unitId: attack.attackerId,
          attackId: attack.attackId,
        },
        resolveOutcome,
      )
    }
    return queueTurnCompletion(aborted, {
      turnId: attack.turnId,
      unitId: attack.attackerId,
      attackId: attack.attackId,
    }, resolveOutcome)
  }

  function finalizeDeath(state: BattleState, motion: DeathMotion): BattleState {
    const unit = state.units.find((candidate) => candidate.id === motion.unitId)
    if (!unit || unit.hp !== 0) return state
    if (state.defeatedUnits.some((record) => record.unit.id === motion.unitId)) {
      return {
        ...state,
        deathMotions: state.deathMotions.filter((candidate) => candidate.deathId !== motion.deathId),
      }
    }
    const defeatedUnit = { ...unit, position: { ...unit.position } }
    return {
      ...state,
      units: state.units.filter((candidate) => candidate.id !== motion.unitId),
      deathMotions: state.deathMotions.filter((candidate) => candidate.deathId !== motion.deathId),
      defeatedUnits: [...state.defeatedUnits, {
        deathId: motion.deathId,
        unit: defeatedUnit,
        killerId: motion.killerId,
        attackId: motion.attackId,
      }],
      selectedUnitId: state.selectedUnitId === motion.unitId ? null : state.selectedUnitId,
      selectedAttackTargetId: state.selectedAttackTargetId === motion.unitId ? null : state.selectedAttackTargetId,
      lastMove: state.lastMove?.unitId === motion.unitId ? null : state.lastMove,
      interactionMode: 'COMMAND',
    }
  }

  if (action.type === 'finish' || action.type === 'cancel') {
    const motion = state.motion
    if (
      !motion ||
      action.unitId !== motion.unitId ||
      action.motionId !== motion.motionId ||
      motion.turnId !== state.turn.turnId ||
      motion.unitId !== state.turn.activeUnitId ||
      state.turnAction?.turnId !== motion.turnId ||
      state.turnAction.unitId !== motion.unitId
    ) return state
    if (action.type === 'cancel') {
      return resolveOutcome({ ...state, motion: null, interactionMode: 'COMMAND' })
    }

    const destination = motion.path[motion.path.length - 1]
    const unit = state.units.find((candidate) => candidate.id === motion.unitId)
    if (!unit) return { ...state, motion: null, interactionMode: 'COMMAND' }
    return resolveOutcome({
      ...state,
      units: moveUnit(state.units, motion.unitId, destination, state.obstacles.map(obstacleCell)),
      motion: null,
      interactionMode: 'COMMAND',
      lastAttackResult: null,
      turnAction: {
        ...state.turnAction,
        movementUsed: true,
      },
      aiProgress: state.aiProgress?.turnId === motion.turnId &&
        state.aiProgress.unitId === motion.unitId &&
        state.aiProgress.phase === 'MOVING'
        ? { ...state.aiProgress, phase: 'MOVE_COMPLETED' }
        : state.aiProgress,
      lastMove: {
        motionId: motion.motionId,
        turnId: motion.turnId,
        unitId: motion.unitId,
        from: { ...unit.position },
        to: { ...destination },
        path: motion.path.map((cell) => ({ ...cell })),
        cost: motion.cost,
      },
    })
  }

  if (action.type === 'undo') {
    if (!canUndoLastMove(state)) return state
    const record = state.lastMove!
    return {
      ...state,
      units: state.units.map((unit) => unit.id === record.unitId ? { ...unit, position: { ...record.from } } : unit),
      lastMove: null,
      turnAction: state.turnAction
        ? { ...state.turnAction, movementUsed: false }
        : state.turnAction,
      interactionMode: 'COMMAND',
      lastAttackResult: null,
    }
  }

  if (action.type === 'commit') {
    return state
  }

  if (action.type === 'set-mode') {
    if (isBattleBusy(state)) return state
    if (state.interactionMode !== 'COMMAND') return state
    const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId)
    if (
      selectedUnit?.id !== state.turn.activeUnitId
    ) return state
    if (action.mode === 'MOVE' && !canEnterMoveMode(state)) return state
    if (action.mode === 'ATTACK' && !canEnterAttackMode(state)) return state
    return {
      ...state,
      interactionMode: action.mode,
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'cancel-move-mode') {
    if (isBattleBusy(state) || state.interactionMode !== 'MOVE') return state
    return {
      ...state,
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'cancel-attack') {
    if (isBattleBusy(state) || state.interactionMode !== 'ATTACK') return state
    return {
      ...state,
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'standby') {
    if (!canStandby(state)) return state
    return advanceIndividualTurn(clearTurnContext(state), action, resolveOutcome)
  }

  if (action.type === 'confirm-attack') {
    if (!canConfirmAttack(state)) {
      if (isBattleBusy(state)) return state
      const invalidTarget = state.interactionMode === 'ATTACK' &&
        state.selectedAttackTargetId !== null
      return invalidTarget
        ? { ...state, selectedAttackTargetId: null, lastAttackCommand: null, lastAttackResult: null }
        : state
    }
    const attackerId = state.selectedUnitId
    const targetId = state.selectedAttackTargetId
    const turnAction = state.turnAction
    if (!attackerId || !targetId || !turnAction) return state
    return reserveAttack(state, attackerId, targetId)
  }

  if (isBattleBusy(state)) {
    return state
  }

  if (action.type === 'clear') {
    if (state.interactionMode === 'ATTACK') {
      return { ...state, selectedAttackTargetId: null, lastAttackCommand: null, lastAttackResult: null }
    }
    return {
      ...state,
      selectedUnitId: null,
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }
  if (action.type === 'select') {
    return selectUnitOrAttackTarget(state, action.targetId)
  }

  if (action.type === 'select-attack-target') {
    return selectAttackTarget(state, action.targetId)
  }

  const occupant = unitAt(state.units, action.cell)
  if (occupant) {
    return selectUnitOrAttackTarget(state, occupant.id)
  }
  if (state.interactionMode === 'ATTACK') {
    return { ...state, selectedAttackTargetId: null, lastAttackCommand: null, lastAttackResult: null }
  }
  if (state.interactionMode !== 'MOVE') {
    return state.selectedUnitId
      ? {
        ...state,
        selectedUnitId: null,
        interactionMode: 'COMMAND',
        selectedAttackTargetId: null,
        lastAttackCommand: null,
        lastAttackResult: null,
      }
      : state
  }
  const movingUnit = state.units.find((unit) => unit.id === state.selectedUnitId)
  if (
    !movingUnit ||
    movingUnit.faction !== 'player' ||
    !isUnitAlive(movingUnit) ||
    movingUnit.id !== state.turn.activeUnitId ||
    !state.turnAction ||
    state.turnAction.movementUsed ||
    state.turnAction.movementInitiationLocked ||
    state.lastMove?.unitId === movingUnit.id
  ) return state
  const destination = reachableForUnit(state.units, movingUnit.id, state.obstacles.map(obstacleCell)).get(cellKey(action.cell))
  return destination
    ? {
      ...state,
      motion: {
        motionId: state.nextMotionId,
        turnId: state.turn.turnId,
        unitId: movingUnit.id,
        path: destination.path,
        cost: destination.cost,
      },
      nextMotionId: state.nextMotionId + 1,
      lastMove: null,
      lastAttackCommand: null,
    lastAttackResult: null,
    }
    : { ...state, selectedUnitId: null, interactionMode: 'COMMAND' }
}

function snapshotInitialUnit(unit: BattleUnit): BattleUnit {
  const snapshot = { ...unit, position: { ...unit.position } }
  Object.freeze(snapshot.position)
  return Object.freeze(snapshot)
}

export function createBattleReducer(configuration?: BattleEndConditionConfiguration): BattleReducer {
  let resolveOutcome: OutcomeResolver = (state) => state

  if (configuration) {
    const initialUnits = Object.freeze(configuration.initialUnits.map(snapshotInitialUnit))
    const { winCondition, lossCondition } = configuration
    resolveOutcome = (state) => {
      if (
        state.outcome !== null ||
        isBattleBusy(state) ||
        state.turnAction?.combatAction === 'RESERVED' ||
        (state.turnAction?.reservedAttackId !== null && state.turnAction?.reservedAttackId !== undefined)
      ) return state

      const outcome: BattleOutcome = resolveBattleOutcome(
        createBattleConditionContext(state, initialUnits),
        winCondition,
        lossCondition,
      )
      if (outcome === null) return state

      return {
        ...state,
        outcome,
        turnAction: null,
        pendingTurnCompletion: null,
        aiProgress: null,
        interactionMode: 'COMMAND',
        selectedUnitId: null,
        selectedAttackTargetId: null,
        confirmedImpacts: [],
      }
    }
  }

  return (state, action) => {
    if (state.outcome !== null) return state
    return reduceBattleState(state, action, resolveOutcome)
  }
}

export const battleReducer = createBattleReducer()
