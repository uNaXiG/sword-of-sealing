import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey, isInsideGrid } from '../grid/grid.utils.ts'
import { reachableForUnit, moveUnit } from './battle.movement.ts'
import type { BattleState, BattleUnit } from './battle.types'
import { unitAt } from './occupancy.ts'
import { obstacleCell, validateObstacles, type BattleObstacle } from './obstacles.ts'
import { TERRAIN_MOVEMENT_COST } from '../grid/terrain.constants.ts'
import { getTerrainType } from '../grid/terrain.data.ts'

type BattleAction =
  | { type: 'select'; unitId: string }
  | { type: 'cell'; cell: Cell }
  | { type: 'clear' }
  | { type: 'finish'; unitId: string; motionId: number }
  | { type: 'cancel'; unitId: string; motionId: number }
  | { type: 'undo' }
  | { type: 'commit' }

export function createBattleState(units: readonly BattleUnit[], obstacles: readonly BattleObstacle[] = []): BattleState {
  validateObstacles(obstacles, units)
  return {
    units: units.map((unit) => ({ ...unit, position: { ...unit.position } })),
    obstacles: obstacles.map((obstacle) => ({ ...obstacle, position: { ...obstacle.position } })),
    selectedUnitId: null,
    motion: null,
    nextMotionId: 1,
    lastMove: null,
  }
}

export function canUndoLastMove(state: BattleState): boolean {
  const record = state.lastMove
  if (!record || state.motion || state.selectedUnitId !== record.unitId) return false

  const unit = state.units.find((candidate) => candidate.id === record.unitId)
  if (
    !unit ||
    unit.faction !== 'player' ||
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
  if (unit?.faction !== 'player' || unit.id === state.selectedUnitId) return state
  return {
    ...state,
    selectedUnitId: unit.id,
    lastMove: state.lastMove?.unitId === unit.id ? state.lastMove : null,
  }
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  if (action.type === 'finish' || action.type === 'cancel') {
    const motion = state.motion
    if (!motion || action.unitId !== motion.unitId || action.motionId !== motion.motionId) return state
    if (action.type === 'cancel') return { ...state, motion: null }

    const destination = motion.path[motion.path.length - 1]
    const unit = state.units.find((candidate) => candidate.id === motion.unitId)
    if (!unit) return { ...state, motion: null }
    return {
      ...state,
      units: moveUnit(state.units, motion.unitId, destination, state.obstacles.map(obstacleCell)),
      motion: null,
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
    }
  }

  if (action.type === 'commit') {
    return state.motion || !state.lastMove ? state : { ...state, lastMove: null }
  }

  if (state.motion) {
    return state
  }

  if (action.type === 'clear') return { ...state, selectedUnitId: null }
  if (action.type === 'select') {
    return selectPlayerUnit(state, action.unitId)
  }

  const occupant = unitAt(state.units, action.cell)
  if (occupant) {
    return selectPlayerUnit(state, occupant.id)
  }
  if (!state.selectedUnitId) return state
  const destination = reachableForUnit(state.units, state.selectedUnitId, state.obstacles.map(obstacleCell)).get(cellKey(action.cell))
  return destination
    ? {
      ...state,
      motion: {
        motionId: state.nextMotionId,
        unitId: state.selectedUnitId,
        path: destination.path,
        cost: destination.cost,
      },
      nextMotionId: state.nextMotionId + 1,
      lastMove: null,
    }
    : { ...state, selectedUnitId: null }
}
