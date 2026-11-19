import { GRID_SIZE } from '../grid/grid.constants.ts'
import type { Cell } from '../grid/grid.types'
import { cellKey } from '../grid/grid.utils.ts'
import { getReachableTiles } from '../grid/movement.ts'
import { TERRAIN_MOVEMENT_COST } from '../grid/terrain.constants.ts'
import { getTerrainType } from '../grid/terrain.data.ts'
import { canAttackTarget } from './battle.attack.ts'
import { calculatePhysicalDamage } from './battle.damage.ts'
import { reachableForUnit } from './battle.movement.ts'
import { isUnitAlive } from './battle.unit.ts'
import type { BattleState, BattleUnit } from './battle.types.ts'
import { obstacleCell } from './obstacles.ts'

export type AIDecision =
  | { type: 'ATTACK'; targetId: string }
  | { type: 'MOVE_ATTACK'; destination: Cell; targetId: string }
  | { type: 'APPROACH'; destination: Cell }
  | { type: 'STANDBY' }

type RankedTarget = {
  unit: BattleUnit
  result: ReturnType<typeof calculatePhysicalDamage>
  initialOrder: number
}

type RankedMoveAttack = RankedTarget & {
  destination: Cell
  movementCost: number
}

type RankedApproach = {
  destination: Cell
  movementCost: number
  remainingCost: number
}

function getInitialOrder(state: BattleState, unitId: string): number {
  return state.turn.timeline.find((entry) => entry.unitId === unitId)?.initialOrder
    ?? Number.MAX_SAFE_INTEGER
}

function compareAttackScore(left: RankedTarget, right: RankedTarget): number {
  return Number(right.result.isDefeated) - Number(left.result.isDefeated) ||
    right.result.appliedDamage - left.result.appliedDamage
}

function compareAttackTargets(left: RankedTarget, right: RankedTarget): number {
  return compareAttackScore(left, right) ||
    left.initialOrder - right.initialOrder ||
    left.unit.id.localeCompare(right.unit.id)
}

function compareCells(left: Cell, right: Cell): number {
  return left.row - right.row || left.column - right.column
}

function compareMoveAttacks(left: RankedMoveAttack, right: RankedMoveAttack): number {
  return compareAttackScore(left, right) ||
    left.movementCost - right.movementCost ||
    left.initialOrder - right.initialOrder ||
    compareCells(left.destination, right.destination) ||
    left.unit.id.localeCompare(right.unit.id)
}

function compareApproaches(left: RankedApproach, right: RankedApproach): number {
  return left.remainingCost - right.remainingCost ||
    left.movementCost - right.movementCost ||
    compareCells(left.destination, right.destination)
}

function hypotheticalMove(
  units: readonly BattleUnit[],
  unitId: string,
  destination: Cell,
): BattleUnit[] {
  return units.map((unit) => unit.id === unitId
    ? { ...unit, position: { ...destination } }
    : unit)
}

function liveEnemies(state: BattleState, attacker: BattleUnit): BattleUnit[] {
  return state.units
    .filter((unit) => isUnitAlive(unit) && unit.faction !== attacker.faction)
    .sort((left, right) =>
      getInitialOrder(state, left.id) - getInitialOrder(state, right.id) ||
      left.id.localeCompare(right.id))
}

function rankTargets(
  state: BattleState,
  attacker: BattleUnit,
  units: readonly BattleUnit[],
): RankedTarget[] {
  return liveEnemies(state, attacker)
    .filter((target) => canAttackTarget(units, attacker.id, target.id))
    .map((target) => ({
      unit: target,
      result: calculatePhysicalDamage(units.find((unit) => unit.id === attacker.id)!, target),
      initialOrder: getInitialOrder(state, target.id),
    }))
    .sort(compareAttackTargets)
}

function getMoveAttackDecision(state: BattleState, attacker: BattleUnit): AIDecision | null {
  const reachable = reachableForUnit(state.units, attacker.id, state.obstacles.map(obstacleCell))
  const candidates = [...reachable.values()]
    .sort((left, right) =>
      left.cost - right.cost ||
      compareCells(left.path[left.path.length - 1], right.path[right.path.length - 1]))
    .flatMap((tile): RankedMoveAttack[] => {
      const destination = tile.path[tile.path.length - 1]
      const units = hypotheticalMove(state.units, attacker.id, destination)
      return rankTargets(state, { ...attacker, position: destination }, units).map((ranked) => ({
        ...ranked,
        destination,
        movementCost: tile.cost,
      }))
    })
    .sort(compareMoveAttacks)

  const best = candidates[0]
  return best
    ? { type: 'MOVE_ATTACK', destination: { ...best.destination }, targetId: best.unit.id }
    : null
}

function isOccupied(units: readonly BattleUnit[], cell: Cell): boolean {
  return units.some((unit) => cellKey(unit.position) === cellKey(cell))
}

function getAttackPositions(
  state: BattleState,
  attacker: BattleUnit,
  target: BattleUnit,
): Cell[] {
  const positions: Cell[] = []
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let column = 0; column < GRID_SIZE; column += 1) {
      const cell = { column, row }
      if (isOccupied(state.units, cell)) continue
      if (state.obstacles.some((obstacle) => cellKey(obstacleCell(obstacle)) === cellKey(cell))) continue
      if (canAttackTarget(
        state.units.map((unit) => unit.id === attacker.id
          ? { ...unit, position: cell }
          : unit),
        attacker.id,
        target.id,
      )) positions.push(cell)
    }
  }
  return positions
}

function remainingApproachCost(
  state: BattleState,
  attacker: BattleUnit,
  targets: readonly BattleUnit[],
  destination: Cell,
): number {
  const occupied = state.units
    .filter((unit) => unit.id !== attacker.id && unit.faction !== attacker.faction)
    .map((unit) => unit.position)
  const reachable = getReachableTiles({
    start: destination,
    budget: Number.POSITIVE_INFINITY,
    size: GRID_SIZE,
    obstacles: state.obstacles.map(obstacleCell),
    occupied,
    movementCostAt: (cell) => TERRAIN_MOVEMENT_COST[getTerrainType(cell)],
  })
  return targets.reduce((best, target) => getAttackPositions(state, attacker, target)
    .reduce((targetBest, position) => Math.min(
      targetBest,
      reachable.get(cellKey(position))?.cost ?? Number.POSITIVE_INFINITY,
    ), best), Number.POSITIVE_INFINITY)
}

function getApproachDecision(state: BattleState, attacker: BattleUnit): AIDecision | null {
  const targets = liveEnemies(state, attacker)
  if (targets.length === 0) return null

  const currentCost = remainingApproachCost(state, attacker, targets, attacker.position)
  const candidates = [...reachableForUnit(state.units, attacker.id, state.obstacles.map(obstacleCell)).values()]
    .map((tile): RankedApproach => {
      const destination = tile.path[tile.path.length - 1]
      return {
        destination,
        movementCost: tile.cost,
        remainingCost: remainingApproachCost(state, attacker, targets, destination),
      }
    })
    .filter((candidate) => Number.isFinite(candidate.remainingCost) && candidate.remainingCost < currentCost)
    .sort(compareApproaches)
  const best = candidates[0]
  return best ? { type: 'APPROACH', destination: { ...best.destination } } : null
}

export function decideEnemyTurn(state: BattleState, enemyUnitId = state.turn.activeUnitId): AIDecision {
  const attacker = state.units.find((unit) => unit.id === enemyUnitId)
  if (
    !attacker ||
    attacker.faction !== 'enemy' ||
    !isUnitAlive(attacker) ||
    attacker.id !== state.turn.activeUnitId ||
    state.units.every((unit) => unit.faction !== 'player' || !isUnitAlive(unit))
  ) return { type: 'STANDBY' }

  const directTarget = rankTargets(state, attacker, state.units)[0]
  if (directTarget) return { type: 'ATTACK', targetId: directTarget.unit.id }

  return getMoveAttackDecision(state, attacker)
    ?? getApproachDecision(state, attacker)
    ?? { type: 'STANDBY' }
}

export function isEnemyTurn(state: BattleState): boolean {
  return Boolean(
    state.turn.activeUnitId &&
    state.units.some((unit) =>
      unit.id === state.turn.activeUnitId &&
      unit.faction === 'enemy' &&
      isUnitAlive(unit)),
  )
}

export function hasOpposingAliveUnits(state: BattleState): boolean {
  return state.units.some((unit) => unit.faction === 'player' && isUnitAlive(unit)) &&
    state.units.some((unit) => unit.faction === 'enemy' && isUnitAlive(unit))
}
