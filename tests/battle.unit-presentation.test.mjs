import test from 'node:test'
import assert from 'node:assert/strict'
import { getActiveIndicatorFloatOffset, getUnitOverheadPresentation } from '../src/features/battle/unitPresentation.ts'

test('friendly units hide name and health overhead while enemy labels remain visible', () => {
  assert.deepEqual(
    getUnitOverheadPresentation({ id: 'assassin', faction: 'player' }, 'assassin'),
    { showNameAndHealth: false, showActiveIndicator: true },
  )
  assert.deepEqual(
    getUnitOverheadPresentation({ id: 'goblin', faction: 'enemy' }, 'assassin'),
    { showNameAndHealth: true, showActiveIndicator: false },
  )
})

test('active indicator follows the exact current PAS unit across player and enemy turns', () => {
  const units = [
    { id: 'assassin', faction: 'player' },
    { id: 'knight', faction: 'player' },
    { id: 'goblin', faction: 'enemy' },
  ]
  const activeByTurn = ['assassin', 'knight', 'goblin']

  for (const activeUnitId of activeByTurn) {
    const activeIndicators = units.filter((unit) =>
      getUnitOverheadPresentation(unit, activeUnitId).showActiveIndicator,
    )
    assert.deepEqual(activeIndicators.map((unit) => unit.id), [activeUnitId])
  }

  assert.equal(getUnitOverheadPresentation(units[0], null).showActiveIndicator, false)
})

test('active indicator float is subtle and disabled for reduced motion or invalid time', () => {
  assert.ok(Math.abs(getActiveIndicatorFloatOffset(0.25, false)) <= 0.08)
  assert.equal(getActiveIndicatorFloatOffset(1, true), 0)
  assert.equal(getActiveIndicatorFloatOffset(Number.NaN, false), 0)
})
