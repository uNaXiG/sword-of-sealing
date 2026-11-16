import type { Cell } from '../grid/grid.types'
import { cellKey } from '../grid/grid.utils.ts'
import { reachableForUnit, moveUnit } from './battle.movement.ts'
import type { BattleState, BattleUnit } from './battle.types'
import { unitAt } from './occupancy.ts'
import { obstacleCell, validateObstacles, type BattleObstacle } from './obstacles.ts'

type BattleAction =
  | { type: 'select'; unitId: string }
  | { type: 'cell'; cell: Cell }
  | { type: 'clear' }
  | { type: 'finish'; unitId: string }

export function createBattleState(units: readonly BattleUnit[], obstacles: readonly BattleObstacle[] = []): BattleState {
  validateObstacles(obstacles, units)
  return {
    units: units.map((unit) => ({ ...unit, position: { ...unit.position } })),
    obstacles: obstacles.map((obstacle) => ({ ...obstacle, position: { ...obstacle.position } })),
    selectedUnitId: null,
    motion: null,
  }
}

export function battleReducer(state: BattleState, action: BattleAction): BattleState {
  if (state.motion) {
    if (action.type !== 'finish' || action.unitId !== state.motion.unitId) return state
    const destination = state.motion.path[state.motion.path.length - 1]
    return { ...state, units: moveUnit(state.units, state.motion.unitId, destination, state.obstacles.map(obstacleCell)), motion: null }
  }

  if (action.type === 'finish') return state
  if (action.type === 'clear') return { ...state, selectedUnitId: null }
  if (action.type === 'select') {
    const unit = state.units.find((candidate) => candidate.id === action.unitId)
    return unit?.faction === 'player' ? { ...state, selectedUnitId: unit.id } : state
  }

  const occupant = unitAt(state.units, action.cell)
  if (occupant) {
    return occupant.faction === 'player' ? { ...state, selectedUnitId: occupant.id } : state
  }
  if (!state.selectedUnitId) return state
  const path = reachableForUnit(state.units, state.selectedUnitId, state.obstacles.map(obstacleCell)).get(cellKey(action.cell))
  return path
    ? { ...state, motion: { unitId: state.selectedUnitId, path } }
    : { ...state, selectedUnitId: null }
}
