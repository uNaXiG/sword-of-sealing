import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey, isInsideGrid } from '../grid/grid.utils.ts'
import { reachableForUnit, moveUnit } from './battle.movement.ts'
import { canAttackTarget } from './battle.attack.ts'
import type { BattleState, BattleUnit, InteractionMode } from './battle.types'
import { unitAt } from './occupancy.ts'
import { obstacleCell, validateObstacles, type BattleObstacle } from './obstacles.ts'
import { TERRAIN_MOVEMENT_COST } from '../grid/terrain.constants.ts'
import { getTerrainType } from '../grid/terrain.data.ts'
import { calculatePhysicalDamage } from './battle.damage.ts'
import { isUnitAlive } from './battle.unit.ts'
import { isUnitClass, validateAttackProperties } from '../classes/class.data.ts'

type BattleAction =
  | { type: 'select'; unitId: string }
  | { type: 'cell'; cell: Cell }
  | { type: 'clear' }
  | { type: 'standby' }
  | { type: 'finish'; unitId: string; motionId: number }
  | { type: 'cancel'; unitId: string; motionId: number }
  | { type: 'undo' }
  | { type: 'commit' }
  | { type: 'set-mode'; mode: Exclude<InteractionMode, 'COMMAND'> }
  | { type: 'cancel-move-mode' }
  | { type: 'select-attack-target'; targetId: string }
  | { type: 'cancel-attack' }
  | { type: 'confirm-attack' }

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
  return {
    units: units.map((unit) => ({ ...unit, position: { ...unit.position } })),
    obstacles: obstacles.map((obstacle) => ({ ...obstacle, position: { ...obstacle.position } })),
    selectedUnitId: null,
    motion: null,
    nextMotionId: 1,
    lastMove: null,
    interactionMode: 'COMMAND',
    selectedAttackTargetId: null,
    lastAttackCommand: null,
    lastAttackResult: null,
  }
}

export function canUndoLastMove(state: BattleState): boolean {
  const record = state.lastMove
  if (!record || state.motion || state.interactionMode !== 'COMMAND' || state.selectedUnitId !== record.unitId) return false

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
  if (unit?.faction !== 'player' || !isUnitAlive(unit) || unit.id === state.selectedUnitId) return state
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
  if (state.interactionMode !== 'ATTACK' || state.motion) return state
  return {
    ...state,
    selectedAttackTargetId: canAttackTarget(state.units, state.selectedUnitId ?? '', targetId) ? targetId : null,
    lastAttackCommand: null,
    lastAttackResult: null,
  }
}

function selectUnitOrAttackTarget(state: BattleState, unitId: string): BattleState {
  if (state.interactionMode !== 'ATTACK') return selectPlayerUnit(state, unitId)
  const unit = state.units.find((candidate) => candidate.id === unitId)
  if (unit?.faction === 'player' && unit.id !== state.selectedUnitId) return selectPlayerUnit(state, unitId)
  return selectAttackTarget(state, unitId)
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  if (action.type === 'finish' || action.type === 'cancel') {
    const motion = state.motion
    if (!motion || action.unitId !== motion.unitId || action.motionId !== motion.motionId) return state
    if (action.type === 'cancel') return { ...state, motion: null, interactionMode: 'COMMAND' }

    const destination = motion.path[motion.path.length - 1]
    const unit = state.units.find((candidate) => candidate.id === motion.unitId)
    if (!unit) return { ...state, motion: null, interactionMode: 'COMMAND' }
    return {
      ...state,
      units: moveUnit(state.units, motion.unitId, destination, state.obstacles.map(obstacleCell)),
      motion: null,
      interactionMode: 'COMMAND',
      lastAttackResult: null,
      lastMove: {
        motionId: motion.motionId,
        unitId: motion.unitId,
        from: { ...unit.position },
        to: { ...destination },
        path: motion.path.map((cell) => ({ ...cell })),
        cost: motion.cost,
      },
    }
  }

  if (action.type === 'undo') {
    if (!canUndoLastMove(state)) return state
    const record = state.lastMove!
    return {
      ...state,
      units: state.units.map((unit) => unit.id === record.unitId ? { ...unit, position: { ...record.from } } : unit),
      lastMove: null,
      interactionMode: 'COMMAND',
      lastAttackResult: null,
    }
  }

  if (action.type === 'commit') {
    return state.motion || !state.lastMove ? state : { ...state, lastMove: null }
  }

  if (action.type === 'set-mode') {
    if (state.motion) return state
    if (state.interactionMode !== 'COMMAND') return state
    const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId)
    if (action.mode === 'MOVE' && (
      selectedUnit?.faction !== 'player' ||
      !isUnitAlive(selectedUnit) ||
      state.lastMove?.unitId === selectedUnit.id
    )) return state
    if (action.mode === 'ATTACK' && (selectedUnit?.faction !== 'player' || !isUnitAlive(selectedUnit))) return state
    return {
      ...state,
      interactionMode: action.mode,
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'cancel-move-mode') {
    if (state.motion || state.interactionMode !== 'MOVE') return state
    return {
      ...state,
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'cancel-attack') {
    if (state.motion || state.interactionMode !== 'ATTACK') return state
    return {
      ...state,
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'standby') {
    const selectedUnit = state.units.find((unit) => unit.id === state.selectedUnitId)
    if (
      state.motion ||
      state.interactionMode !== 'COMMAND' ||
      selectedUnit?.faction !== 'player' ||
      !isUnitAlive(selectedUnit)
    ) return state
    return {
      ...state,
      selectedUnitId: null,
      lastMove: null,
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      lastAttackCommand: null,
      lastAttackResult: null,
    }
  }

  if (action.type === 'confirm-attack') {
    if (state.motion || state.interactionMode !== 'ATTACK' || !state.selectedAttackTargetId) return state
    const attackerId = state.selectedUnitId
    const targetId = state.selectedAttackTargetId
    if (!attackerId || !targetId) return state
    const attacker = state.units.find((unit) => unit.id === attackerId)
    const target = state.units.find((unit) => unit.id === targetId)
    if (
      !attacker ||
      attacker.faction !== 'player' ||
      !isUnitAlive(attacker) ||
      !target ||
      !isUnitAlive(target) ||
      !canAttackTarget(state.units, attackerId, targetId)
    ) {
      return { ...state, selectedAttackTargetId: null, lastAttackCommand: null, lastAttackResult: null }
    }
    const result = {
      attackerId,
      targetId,
      ...calculatePhysicalDamage(attacker, target),
    }
    return {
      ...state,
      units: state.units.map((unit) => unit.id === targetId ? { ...unit, hp: result.remainingHp } : unit),
      interactionMode: 'COMMAND',
      selectedAttackTargetId: null,
      lastAttackCommand: { attackerId, targetId },
      lastAttackResult: result,
      lastMove: null,
    }
  }

  if (state.motion) {
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
    return selectUnitOrAttackTarget(state, action.unitId)
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
    state.lastMove?.unitId === movingUnit.id
  ) return state
  const destination = reachableForUnit(state.units, movingUnit.id, state.obstacles.map(obstacleCell)).get(cellKey(action.cell))
  return destination
    ? {
      ...state,
      motion: {
        motionId: state.nextMotionId,
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
