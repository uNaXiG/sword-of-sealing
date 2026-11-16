import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { reachableForUnit, moveUnit } from '../src/game/battle/battle.movement.ts'
import { battleReducer, createBattleState } from '../src/game/battle/battle.state.ts'
import { getOccupancy, unitAt } from '../src/game/battle/occupancy.ts'

test('四個角色資料包含互不重疊的初始位置', () => {
  const state = createBattleState(INITIAL_UNITS)
  assert.equal(state.units.length, 4)
  assert.equal(getOccupancy(state.units).size, 4)
  assert.deepEqual(state.units.map((unit) => unit.class), ['knight', 'mage', 'rogue', 'goblin'])
  assert.deepEqual(state.units[0].position, { column: 3, row: 3 })
})

test('三個玩家角色可以切換，敵人不可選取', () => {
  let state = createBattleState(INITIAL_UNITS)
  for (const id of ['knight', 'mage', 'rogue']) {
    state = battleReducer(state, { type: 'select', unitId: id })
    assert.equal(state.selectedUnitId, id)
  }
  const previous = state
  state = battleReducer(state, { type: 'select', unitId: 'goblin' })
  assert.equal(state, previous)
  state = battleReducer(state, { type: 'cell', cell: { column: 5, row: 2 } })
  assert.equal(state, previous)
})

test('角色不能移動到任何陣營的佔位格，各角色使用自己的移動力', () => {
  const units = createBattleState(INITIAL_UNITS).units
  const knight = reachableForUnit(units, 'knight')
  assert.equal(knight.has('2,4'), false)
  assert.equal(knight.has('4,4'), false)
  assert.equal(knight.has('5,2'), false)
  assert.throws(() => moveUnit(units, 'knight', { column: 2, row: 4 }), /Invalid movement/)
  assert.throws(() => moveUnit(units, 'goblin', { column: 3, row: 3 }), /Invalid movement/)
  assert.equal(reachableForUnit(units, 'mage').has('2,1'), false)
  assert.equal(reachableForUnit(units, 'rogue').has('4,7'), true)
})

test('角色不能穿越其他角色，繞路須耗費實際步數', () => {
  const knight = { ...INITIAL_UNITS[0], position: { column: 1, row: 1 }, movement: 3 }
  const blocker = { ...INITIAL_UNITS[3], position: { column: 2, row: 1 } }
  assert.equal(reachableForUnit([knight, blocker], knight.id).has('3,1'), false)
  const path = reachableForUnit([{ ...knight, movement: 4 }, blocker], knight.id).get('3,1')
  assert.equal(path.length - 1, 4)
  assert.equal(path.some((cell) => cell.column === 2 && cell.row === 1), false)
})

test('移動動畫期間鎖定所有指令，完成後原格可供其他角色使用', () => {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 2 } })
  assert.ok(state.motion)
  assert.deepEqual(unitAt(state.units, { column: 3, row: 3 }).id, 'knight')
  assert.equal(battleReducer(state, { type: 'select', unitId: 'mage' }), state)
  assert.equal(battleReducer(state, { type: 'cell', cell: { column: 3, row: 3 } }), state)
  assert.equal(battleReducer(state, { type: 'finish', unitId: 'mage' }), state)
  state = battleReducer(state, { type: 'finish', unitId: 'knight' })
  assert.equal(state.motion, null)
  assert.equal(unitAt(state.units, { column: 3, row: 3 }), undefined)
  assert.equal(unitAt(state.units, { column: 3, row: 2 }).id, 'knight')
  assert.equal(reachableForUnit(state.units, 'mage').has('3,3'), true)
  state = battleReducer(state, { type: 'select', unitId: 'mage' })
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 3 } })
  state = battleReducer(state, { type: 'finish', unitId: 'mage' })
  assert.equal(unitAt(state.units, { column: 3, row: 3 }).id, 'mage')
  assert.equal(getOccupancy(state.units).size, 4)
})

test('不論陣營，移動後均不可產生重複佔位', () => {
  let units = createBattleState(INITIAL_UNITS).units
  units = moveUnit(units, 'goblin', { column: 6, row: 2 })
  assert.equal(unitAt(units, { column: 5, row: 2 }), undefined)
  assert.equal(unitAt(units, { column: 6, row: 2 }).id, 'goblin')
  assert.equal(getOccupancy(units).size, 4)
  assert.throws(() => createBattleState([...units, { ...units[0], id: 'duplicate' }]), /duplicate/)
  assert.throws(() => createBattleState([...units, { ...units[0], position: { column: 7, row: 7 } }]), /duplicate/)
})
