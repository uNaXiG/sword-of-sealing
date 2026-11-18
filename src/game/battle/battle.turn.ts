import type { BattleUnit } from './battle.types'
import { isUnitAlive } from './battle.unit.ts'
import {
  ACTION_DISTANCE,
  ROUND_DURATION,
  TURN_DISTANCE_EPSILON,
  TURN_PREVIEW_COUNT,
  TURN_TIME_EPSILON,
} from './battle.turn.constants.ts'
import type { BattleTurnState, TurnPreviewEntry, UnitTurnState } from './battle.turn.types'

function assertFinite(value: number, label: string): void {
  if (!Number.isFinite(value)) throw new RangeError(`${label} must be finite`)
}

export function calculateActionValue(remainingDistance: number, velocity: number): number {
  assertFinite(remainingDistance, 'Remaining distance')
  assertFinite(velocity, 'Velocity')
  if (remainingDistance < 0 || remainingDistance > ACTION_DISTANCE) {
    throw new RangeError('Remaining distance must be within the action distance')
  }
  if (velocity <= 0) throw new RangeError('Velocity must be greater than zero')
  return remainingDistance / velocity
}

export function calculateRound(battleTime: number): number {
  assertFinite(battleTime, 'Battle time')
  if (battleTime < 0) throw new RangeError('Battle time cannot be negative')
  return Math.floor(battleTime / ROUND_DURATION) + 1
}

function normalizeNearZero(value: number): number {
  if (Math.abs(value) <= TURN_DISTANCE_EPSILON) return 0
  if (value < 0) throw new RangeError('Remaining distance cannot become negative')
  return value
}

function normalizeBoundary(value: number): number {
  const boundary = Math.round(value / ROUND_DURATION) * ROUND_DURATION
  return Math.abs(value - boundary) <= TURN_TIME_EPSILON ? boundary : value
}

function compareArrival(
  left: { readonly av: number; readonly entry: UnitTurnState },
  right: { readonly av: number; readonly entry: UnitTurnState },
): number {
  return right.entry.velocity - left.entry.velocity || left.entry.initialOrder - right.entry.initialOrder
}

export function selectNextTurnUnit(
  timeline: readonly UnitTurnState[],
  aliveUnitIds: ReadonlySet<string>,
): UnitTurnState {
  const candidates = timeline
    .filter((entry) => aliveUnitIds.has(entry.unitId))
    .map((entry) => ({ entry, av: calculateActionValue(entry.remainingDistance, entry.velocity) }))

  if (candidates.length === 0) throw new Error('Cannot schedule a turn without eligible units')

  const minimumAv = Math.min(...candidates.map(({ av }) => av))
  const simultaneous = candidates
    .filter(({ av }) => Math.abs(av - minimumAv) <= TURN_TIME_EPSILON)
    .sort(compareArrival)
  return simultaneous[0].entry
}

export function initializeTurnState(units: readonly BattleUnit[]): BattleTurnState {
  const ids = new Set<string>()
  const timeline = units.map((unit, initialOrder): UnitTurnState => {
    if (ids.has(unit.id)) throw new Error(`Duplicate battle unit id: ${unit.id}`)
    ids.add(unit.id)
    assertFinite(unit.agi, `AGI for ${unit.id}`)
    if (unit.agi <= 0) throw new RangeError(`AGI must be greater than zero: ${unit.id}`)
    return {
      unitId: unit.id,
      initialOrder,
      remainingDistance: ACTION_DISTANCE,
      velocity: unit.agi,
    }
  })
  return scheduleNextTurn({
    battleTime: 0,
    round: 1,
    turnId: 0,
    activeUnitId: null,
    timeline,
  }, units)
}

export function scheduleNextTurn(
  turn: BattleTurnState,
  units: readonly BattleUnit[],
): BattleTurnState {
  const aliveUnitIds = new Set(units.filter(isUnitAlive).map((unit) => unit.id))
  const eligible = turn.timeline.filter((entry) => aliveUnitIds.has(entry.unitId))
  if (eligible.length === 0) {
    return {
      ...turn,
      activeUnitId: null,
      timeline: [],
      round: calculateRound(turn.battleTime),
    }
  }

  const next = selectNextTurnUnit(eligible, aliveUnitIds)
  const deltaTime = calculateActionValue(next.remainingDistance, next.velocity)
  const battleTime = normalizeBoundary(turn.battleTime + deltaTime)
  const timeline = eligible.map((entry) => ({
    ...entry,
    remainingDistance: normalizeNearZero(entry.remainingDistance - entry.velocity * deltaTime),
  }))

  return {
    battleTime,
    round: calculateRound(battleTime),
    turnId: turn.turnId + 1,
    activeUnitId: next.unitId,
    timeline,
  }
}

export function completeIndividualTurn(
  turn: BattleTurnState,
  units: readonly BattleUnit[],
): BattleTurnState {
  if (!turn.activeUnitId) return turn
  const activeUnit = units.find((unit) => unit.id === turn.activeUnitId && isUnitAlive(unit))
  const timeline = turn.timeline.map((entry) => entry.unitId === activeUnit?.id
    ? { ...entry, remainingDistance: ACTION_DISTANCE }
    : entry)
  return scheduleNextTurn({ ...turn, activeUnitId: null, timeline }, units)
}

export function removeDefeatedUnitFromTimeline(
  turn: BattleTurnState,
  unitId: string,
): BattleTurnState {
  const timeline = turn.timeline.filter((entry) => entry.unitId !== unitId)
  return {
    ...turn,
    activeUnitId: turn.activeUnitId,
    timeline,
  }
}

export function predictUpcomingTurns(
  turn: BattleTurnState,
  units: readonly BattleUnit[],
  count = TURN_PREVIEW_COUNT,
): TurnPreviewEntry[] {
  if (!turn.activeUnitId || count <= 0) return []

  const originTime = turn.battleTime
  let simulation = completeIndividualTurn({
    ...turn,
    timeline: turn.timeline.map((entry) => ({ ...entry })),
  }, units)
  const preview: TurnPreviewEntry[] = []

  while (preview.length < count && simulation.activeUnitId) {
    preview.push({
      unitId: simulation.activeUnitId,
      turnId: simulation.turnId,
      battleTime: simulation.battleTime,
      round: simulation.round,
      timeOffset: simulation.battleTime - originTime,
    })
    simulation = completeIndividualTurn(simulation, units)
  }
  return preview
}
