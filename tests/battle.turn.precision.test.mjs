import test from 'node:test'
import assert from 'node:assert/strict'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import {
  calculateRound,
  completeIndividualTurn,
  initializeTurnState,
  predictUpcomingTurns,
  scheduleNextTurn,
} from '../src/game/battle/battle.turn.ts'
import {
  ACTION_DISTANCE,
  ROUND_DURATION,
  TURN_TIME_EPSILON,
} from '../src/game/battle/battle.turn.constants.ts'

function schedulerUnit(id, agi, initialIndex) {
  return {
    ...createBattleUnit({
      id,
      class: 'knight',
      faction: initialIndex % 2 === 0 ? 'player' : 'enemy',
      position: { column: initialIndex, row: 0 },
    }),
    agi,
  }
}

function turnFixture(units, timeline) {
  return {
    battleTime: 0,
    round: 1,
    turnId: 1,
    activeUnitId: units[0].id,
    timeline: units.map((unit, initialOrder) => ({
      unitId: unit.id,
      initialOrder,
      velocity: unit.agi,
      remainingDistance: timeline[initialOrder],
    })),
  }
}

test('Near-tie 使用全域最小事件時間而非優先候選的 AV', () => {
  const units = [schedulerUnit('slower', 10, 0), schedulerUnit('priority', 12, 1)]
  const turn = turnFixture(units, [10, 12 * (1 + TURN_TIME_EPSILON / 2)])
  const next = scheduleNextTurn(turn, units)

  assert.equal(next.activeUnitId, 'priority')
  assert.equal(next.battleTime, 1)
  assert.equal(next.timeline.find((entry) => entry.unitId === 'priority').remainingDistance, 0)
  assert.ok(next.timeline.find((entry) => entry.unitId === 'slower').remainingDistance >= 0)
})

test('Outside-epsilon Near-tie 不加入 Tie Candidate', () => {
  const units = [schedulerUnit('earlier', 10, 0), schedulerUnit('priority', 12, 1)]
  const turn = turnFixture(units, [10, 12 * (1 + TURN_TIME_EPSILON * 2)])
  const next = scheduleNextTurn(turn, units)

  assert.equal(next.activeUnitId, 'earlier')
  assert.equal(next.battleTime, 1)
  assert.ok(next.timeline.find((entry) => entry.unitId === 'priority').remainingDistance > 0)
})

test('Round Boundary 只接受明確 Time Epsilon 內的浮點誤差', () => {
  const units = [schedulerUnit('unit', 10, 0)]
  const exact = turnFixture(units, [ACTION_DISTANCE])
  exact.battleTime = ROUND_DURATION - ACTION_DISTANCE / units[0].agi
  const atBoundary = scheduleNextTurn(exact, units)
  assert.equal(atBoundary.battleTime, ROUND_DURATION)
  assert.equal(atBoundary.round, 2)

  const before = scheduleNextTurn({
    ...exact,
    battleTime: exact.battleTime - TURN_TIME_EPSILON * 2,
  }, units)
  assert.ok(before.battleTime < ROUND_DURATION)
  assert.equal(calculateRound(before.battleTime), 1)
})

test('10,000 次固定速度排程符合獨立 arrivalTime Oracle', () => {
  const units = [
    schedulerUnit('a', 10, 0),
    schedulerUnit('b', 12, 1),
    schedulerUnit('c', 15, 2),
  ]
  const events = 10_000
  const arrivalCounts = new Map(units.map((unit) => [unit.id, 0]))
  let turn = initializeTurnState(units)
  let maxTimeError = 0
  let maxDistanceError = 0
  const expectedTimeTolerance = 2e-6

  for (let index = 0; index < events; index += 1) {
    const candidates = units.map((unit, initialOrder) => {
      const arrivalIndex = arrivalCounts.get(unit.id) + 1
      return {
        unitId: unit.id,
        initialOrder,
        velocity: unit.agi,
        time: arrivalIndex * ACTION_DISTANCE / unit.agi,
      }
    })
    const minimumTime = Math.min(...candidates.map(({ time }) => time))
    const expected = candidates
      .filter(({ time }) => Math.abs(time - minimumTime) <= 1e-12)
      .sort((left, right) =>
        right.velocity - left.velocity || left.initialOrder - right.initialOrder,
      )[0]

    assert.equal(turn.activeUnitId, expected.unitId)
    const timeError = Math.abs(turn.battleTime - expected.time)
    maxTimeError = Math.max(maxTimeError, timeError)
    assert.ok(timeError <= expectedTimeTolerance, `${turn.turnId}: time error ${timeError}`)
    assert.ok(Number.isFinite(turn.battleTime))
    assert.ok(turn.battleTime >= 0)
    assert.equal(turn.turnId, index + 1)

    arrivalCounts.set(expected.unitId, arrivalCounts.get(expected.unitId) + 1)
    for (const unit of units) {
      const theoreticalDistance = unit.id === turn.activeUnitId
        ? 0
        : Math.max(
          0,
          ((arrivalCounts.get(unit.id) + 1) * ACTION_DISTANCE / unit.agi - expected.time) * unit.agi,
        )
      const entry = turn.timeline.find((candidate) => candidate.unitId === unit.id)
      maxDistanceError = Math.max(maxDistanceError, Math.abs(entry.remainingDistance - theoreticalDistance))
      assert.ok(Number.isFinite(entry.remainingDistance))
      assert.ok(entry.remainingDistance >= 0)
      assert.ok(entry.remainingDistance <= ACTION_DISTANCE)
    }
    if (index + 1 < events) turn = completeIndividualTurn(turn, units)
  }

  const finalTime = turn.battleTime
  const actualCounts = Object.fromEntries(arrivalCounts)
  for (const unit of units) {
    const theoreticalCount = Math.floor((finalTime + expectedTimeTolerance) / (ACTION_DISTANCE / unit.agi))
    assert.ok(Math.abs(actualCounts[unit.id] - theoreticalCount) <= 1)
  }
  assert.ok(maxTimeError <= expectedTimeTolerance)
  assert.ok(maxDistanceError <= 0.02)
})

test('Preview 的十次預測與正式相同 Scheduler 後續事件一致且唯讀', () => {
  const units = [
    schedulerUnit('a', 10, 0),
    schedulerUnit('b', 12, 1),
    schedulerUnit('c', 15, 2),
  ]
  const turn = initializeTurnState(units)
  const snapshot = structuredClone(turn)
  const preview = predictUpcomingTurns(turn, units, 10)
  let actual = completeIndividualTurn(turn, units)

  for (const prediction of preview) {
    assert.equal(actual.activeUnitId, prediction.unitId)
    assert.equal(actual.turnId, prediction.turnId)
    assert.ok(Math.abs(actual.battleTime - prediction.battleTime) <= 1e-9)
    assert.equal(actual.round, prediction.round)
    actual = completeIndividualTurn(actual, units)
  }
  assert.deepEqual(turn, snapshot)
})

test('近似 simultaneous arrival 連續排程不累積負值或時間漂移', () => {
  const units = [schedulerUnit('a', 10, 0), schedulerUnit('b', 10, 1)]
  let turn = {
    battleTime: 50,
    round: 1,
    turnId: 1,
    activeUnitId: 'a',
    timeline: [
      { unitId: 'a', initialOrder: 0, velocity: 10, remainingDistance: 0 },
      {
        unitId: 'b',
        initialOrder: 1,
        velocity: 10,
        remainingDistance: TURN_TIME_EPSILON * 10 / 2,
      },
    ],
  }
  for (let index = 0; index < 10_000; index += 1) {
    const previousTime = turn.battleTime
    turn = completeIndividualTurn(turn, units)
    assert.ok(turn.battleTime >= previousTime)
    assert.ok(Number.isFinite(turn.battleTime))
    assert.ok(turn.timeline.every((entry) =>
      Number.isFinite(entry.remainingDistance) && entry.remainingDistance >= 0))
  }
})

test('10,000 次 Near-tie × Round Boundary stress 符合獨立事件 Oracle', () => {
  const units = [
    schedulerUnit('minimum', 10, 0),
    schedulerUnit('priority', 12, 1),
    schedulerUnit('third', 15, 2),
  ]
  const events = 10_000
  let maxTimeError = 0
  let maxDistanceError = 0

  for (let index = 0; index < events; index += 1) {
    const boundary = (Math.floor(index / 3) + 1) * ROUND_DURATION
    const avOffset = (index % 2 === 0 ? 0.25 : 0.75) * TURN_TIME_EPSILON
    const turn = turnFixture(units, [
      10,
      12 * (1 + avOffset),
      15 * (2 + avOffset),
    ])
    turn.battleTime = boundary - 1

    const expectedCandidates = [
      { unitId: 'minimum', av: 1, velocity: 10, initialOrder: 0 },
      { unitId: 'priority', av: 1 + avOffset, velocity: 12, initialOrder: 1 },
      { unitId: 'third', av: 2 + avOffset, velocity: 15, initialOrder: 2 },
    ]
    const expectedDelta = Math.min(...expectedCandidates.map(({ av }) => av))
    const expected = expectedCandidates
      .filter(({ av }) => Math.abs(av - expectedDelta) <= TURN_TIME_EPSILON)
      .sort((left, right) =>
        right.velocity - left.velocity || left.initialOrder - right.initialOrder,
      )[0]
    const next = scheduleNextTurn(turn, units)
    const expectedTime = boundary - 1 + expectedDelta

    assert.equal(next.activeUnitId, expected.unitId)
    assert.equal(next.turnId, turn.turnId + 1)
    assert.equal(next.battleTime, boundary)
    assert.equal(next.round, boundary / ROUND_DURATION + 1)
    const timeError = Math.abs(next.battleTime - expectedTime)
    maxTimeError = Math.max(maxTimeError, timeError)
    assert.ok(timeError <= events * TURN_TIME_EPSILON)

    for (const entry of next.timeline) {
      const source = turn.timeline.find((candidate) => candidate.unitId === entry.unitId)
      const expectedDistance = Math.abs(source.remainingDistance / source.velocity - expectedDelta) <= TURN_TIME_EPSILON
        ? 0
        : source.remainingDistance - source.velocity * expectedDelta
      const distanceError = Math.abs(entry.remainingDistance - expectedDistance)
      maxDistanceError = Math.max(maxDistanceError, distanceError)
      assert.ok(Number.isFinite(entry.remainingDistance))
      assert.ok(entry.remainingDistance >= 0)
      assert.ok(distanceError <= TURN_TIME_EPSILON * source.velocity)
    }
  }

  assert.ok(maxTimeError <= TURN_TIME_EPSILON)
  assert.ok(maxDistanceError <= 1.5e-8)
})

test('Time Epsilon 內外邊界保持精確候選與非候選距離', () => {
  const units = [schedulerUnit('minimum', 10, 0), schedulerUnit('priority', 12, 1)]
  const inside = TURN_TIME_EPSILON * 0.999
  const insideTurn = turnFixture(units, [10, 12 * (1 + inside)])
  const insideNext = scheduleNextTurn(insideTurn, units)
  assert.equal(insideNext.activeUnitId, 'priority')
  assert.equal(insideNext.timeline.find((entry) => entry.unitId === 'priority').remainingDistance, 0)

  const outside = TURN_TIME_EPSILON * 1.001
  const outsideTurn = turnFixture(units, [10, 12 * (1 + outside)])
  const outsideNext = scheduleNextTurn(outsideTurn, units)
  assert.equal(outsideNext.activeUnitId, 'minimum')
  assert.ok(outsideNext.timeline.find((entry) => entry.unitId === 'priority').remainingDistance > 0)
})

test('Near-tie Round Boundary 後 Preview 與正式排程長期一致', () => {
  const units = [
    schedulerUnit('a', 10, 0),
    schedulerUnit('b', 12, 1),
    schedulerUnit('c', 15, 2),
  ]
  const fixture = turnFixture(units, [
    10,
    12 * (1 + TURN_TIME_EPSILON / 2),
    15 * (2 + TURN_TIME_EPSILON / 4),
  ])
  fixture.battleTime = ROUND_DURATION - 1
  fixture.activeUnitId = 'minimum'
  const state = scheduleNextTurn(fixture, units)
  const preview = predictUpcomingTurns(state, units, 1_000)
  let actual = completeIndividualTurn(state, units)
  let maxTimeError = 0

  for (const prediction of preview) {
    assert.equal(actual.activeUnitId, prediction.unitId)
    assert.equal(actual.turnId, prediction.turnId)
    const timeError = Math.abs(actual.battleTime - prediction.battleTime)
    maxTimeError = Math.max(maxTimeError, timeError)
    assert.ok(timeError <= 1e-9)
    assert.equal(actual.round, prediction.round)
    assert.ok(actual.timeline.every((entry) =>
      Number.isFinite(entry.remainingDistance) && entry.remainingDistance >= 0))
    actual = completeIndividualTurn(actual, units)
  }

  assert.equal(preview.length, 1_000)
  assert.ok(maxTimeError <= 1e-9)
})

test('同一 Scheduler 連續 10,000 個 Near-tie 事件不累積誤差', () => {
  const units = [
    schedulerUnit('slower', 10, 0),
    schedulerUnit('faster', 10 + 1e-11, 1),
  ]
  const initialCandidates = units.map((unit, initialOrder) => ({
    unitId: unit.id,
    initialOrder,
    velocity: unit.agi,
    nextArrival: ACTION_DISTANCE / unit.agi,
  }))
  const events = 10_000
  const arrivals = new Map(units.map((unit) => [unit.id, 0]))
  let turn = initializeTurnState(units)
  let oracleBatch = []
  let oracleIndex = 0
  let oracleEventTime = 0
  let oraclePreviousEventTime = 0
  let oracleBattleTime = 0
  let maxTimeError = 0
  let maxDistanceError = 0

  for (let index = 0; index < events; index += 1) {
    if (oracleIndex >= oracleBatch.length) {
      oracleEventTime = Math.min(...initialCandidates.map(({ nextArrival }) => nextArrival))
      oracleBatch = initialCandidates
        .filter(({ nextArrival }) => Math.abs(nextArrival - oracleEventTime) <= TURN_TIME_EPSILON)
        .sort((left, right) =>
          right.velocity - left.velocity || left.initialOrder - right.initialOrder,
        )
      oracleIndex = 0
    }

    const expected = oracleBatch[oracleIndex]
    oracleBattleTime += oracleEventTime - oraclePreviousEventTime
    const nearestBoundary = Math.round(oracleBattleTime / ROUND_DURATION) * ROUND_DURATION
    const expectedBattleTime = Math.abs(oracleBattleTime - nearestBoundary) <= TURN_TIME_EPSILON
      ? nearestBoundary
      : oracleBattleTime
    oracleBattleTime = expectedBattleTime
    oraclePreviousEventTime = oracleEventTime
    const timeError = Math.abs(turn.battleTime - expectedBattleTime)
    maxTimeError = Math.max(maxTimeError, timeError)
    assert.equal(turn.activeUnitId, expected.unitId)
    assert.equal(turn.turnId, index + 1)
    assert.ok(timeError <= events * TURN_TIME_EPSILON)
    assert.ok(Number.isFinite(turn.battleTime))
    assert.equal(turn.round, calculateRound(expectedBattleTime))

    arrivals.set(expected.unitId, arrivals.get(expected.unitId) + 1)
    for (const entry of turn.timeline) {
      const theoretical = initialCandidates.find((candidate) => candidate.unitId === entry.unitId)
      const expectedDistance = entry.unitId === expected.unitId
        ? 0
        : Math.max(0, (theoretical.nextArrival - oracleEventTime) * theoretical.velocity)
      const distanceError = Math.abs(entry.remainingDistance - expectedDistance)
      maxDistanceError = Math.max(maxDistanceError, distanceError)
      assert.ok(Number.isFinite(entry.remainingDistance))
      assert.ok(entry.remainingDistance >= 0)
      assert.ok(entry.remainingDistance <= ACTION_DISTANCE)
      assert.ok(distanceError <= events * TURN_TIME_EPSILON * theoretical.velocity)
    }

    expected.nextArrival += ACTION_DISTANCE / expected.velocity
    oracleIndex += 1
    if (index + 1 < events) turn = completeIndividualTurn(turn, units)
  }

  assert.equal(arrivals.get('slower'), 5_000)
  assert.equal(arrivals.get('faster'), 5_000)
  assert.ok(maxTimeError > 0)
  assert.ok(maxTimeError <= events * TURN_TIME_EPSILON)
  assert.ok(maxDistanceError > 0)
  assert.ok(maxDistanceError <= events * TURN_TIME_EPSILON * Math.max(...units.map((unit) => unit.agi)))
})
