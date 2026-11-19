import assert from 'node:assert/strict'
import { test } from 'node:test'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { INITIAL_OBSTACLES } from '../src/game/battle/obstacles.ts'
import { createBattleScenarioSession } from '../src/features/battle/battleScenario.ts'

test('production scenario sessions initialize equivalent ACTIVE states with independent reducers and snapshots', () => {
  const first = createBattleScenarioSession()
  const restarted = createBattleScenarioSession()

  assert.equal(first.initialState.outcome, null)
  assert.deepEqual(restarted.initialState, first.initialState)
  assert.notEqual(restarted.initialState, first.initialState)
  assert.notEqual(restarted.reducer, first.reducer)
  assert.notEqual(restarted.initialState.units, first.initialState.units)
  assert.notEqual(restarted.initialState.units[0], first.initialState.units[0])
  assert.notEqual(restarted.initialState.units[0].position, first.initialState.units[0].position)
  assert.notEqual(restarted.initialState.obstacles, first.initialState.obstacles)
  assert.notEqual(restarted.initialState.obstacles[0], first.initialState.obstacles[0])
  assert.notEqual(restarted.initialState.obstacles[0].position, first.initialState.obstacles[0].position)
  assert.notEqual(restarted.initialState.turn, first.initialState.turn)
  assert.notEqual(restarted.initialState.turn.timeline, first.initialState.turn.timeline)
  assert.equal(restarted.initialState.nextMotionId, first.initialState.nextMotionId)
  assert.equal(restarted.initialState.nextAttackId, first.initialState.nextAttackId)
  assert.equal(restarted.initialState.nextDeathId, first.initialState.nextDeathId)
})

test('changing one runtime snapshot cannot alter the Scenario source or a restarted session', () => {
  const sourceUnit = INITIAL_UNITS[0]
  const sourceObstacle = INITIAL_OBSTACLES[0]
  const restarted = createBattleScenarioSession()
  const expectedHp = sourceUnit.hp
  const expectedPosition = { ...sourceUnit.position }
  const expectedObstaclePosition = { ...sourceObstacle.position }
  const expectedRemainingDistance = restarted.initialState.turn.timeline[0].remainingDistance

  const previous = createBattleScenarioSession()
  previous.initialState.units[0].hp = 0
  previous.initialState.units[0].position.column = 7
  previous.initialState.obstacles[0].position.x = 7
  previous.initialState.turn.timeline[0].remainingDistance = 0

  assert.equal(sourceUnit.hp, expectedHp)
  assert.deepEqual(sourceUnit.position, expectedPosition)
  assert.deepEqual(sourceObstacle.position, expectedObstaclePosition)
  assert.equal(restarted.initialState.units[0].hp, expectedHp)
  assert.deepEqual(restarted.initialState.units[0].position, expectedPosition)
  assert.deepEqual(restarted.initialState.obstacles[0].position, expectedObstaclePosition)
  assert.equal(restarted.initialState.turn.timeline[0].remainingDistance, expectedRemainingDistance)
  assert.equal(restarted.initialState.outcome, null)
})
