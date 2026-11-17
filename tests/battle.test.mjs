import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { reachableForUnit, moveUnit } from '../src/game/battle/battle.movement.ts'
import { battleReducer, canUndoLastMove, createBattleState } from '../src/game/battle/battle.state.ts'
import { getOccupancy, unitAt } from '../src/game/battle/occupancy.ts'

function completeKnightMove(destination = { column: 4, row: 3 }) {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'cell', cell: destination })
  assert.ok(state.motion)
  return battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
}

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

test('其他角色佔據的格子會阻擋路徑且不可進入', () => {
  const knight = { ...INITIAL_UNITS[0], position: { column: 1, row: 1 }, movementPoints: 3 }
  const blocker = { ...INITIAL_UNITS[3], position: { column: 2, row: 1 } }
  const result = reachableForUnit([knight, blocker], knight.id)
  assert.equal(result.has('2,1'), false)
  assert.equal(result.has('3,1'), false)
  assert.throws(() => moveUnit([knight, blocker], knight.id, blocker.position), /Invalid movement/)
})

test('同陣營角色可穿越彼此，但不能停在佔位格', () => {
  const knight = { ...INITIAL_UNITS[0], position: { column: 1, row: 1 }, movementPoints: 3 }
  const rogue = { ...INITIAL_UNITS[2], position: { column: 2, row: 1 } }
  const goblinA = { ...INITIAL_UNITS[3], id: 'goblin-a', position: { column: 1, row: 5 }, movementPoints: 3 }
  const goblinB = { ...INITIAL_UNITS[3], id: 'goblin-b', position: { column: 2, row: 5 } }

  const playerPaths = reachableForUnit([knight, rogue], knight.id)
  assert.equal(playerPaths.has('2,1'), false)
  assert.deepEqual(playerPaths.get('3,1')?.path, [
    { column: 1, row: 1 },
    { column: 2, row: 1 },
    { column: 3, row: 1 },
  ])
  assert.throws(() => moveUnit([knight, rogue], knight.id, rogue.position), /Invalid movement/)
  const movedKnight = moveUnit([knight, rogue], knight.id, { column: 3, row: 1 })
  assert.deepEqual(movedKnight[0].position, { column: 3, row: 1 })
  assert.equal(getOccupancy(movedKnight).size, 2)

  const enemyPaths = reachableForUnit([goblinA, goblinB], goblinA.id)
  assert.equal(enemyPaths.has('2,5'), false)
  assert.deepEqual(enemyPaths.get('3,5')?.path, [
    { column: 1, row: 5 },
    { column: 2, row: 5 },
    { column: 3, row: 5 },
  ])
})

test('移動動畫期間鎖定所有指令，完成後原格可供其他角色使用', () => {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 2 } })
  assert.ok(state.motion)
  const firstMotionId = state.motion.motionId
  assert.deepEqual(unitAt(state.units, { column: 3, row: 3 }).id, 'knight')
  assert.equal(battleReducer(state, { type: 'select', unitId: 'mage' }), state)
  assert.equal(battleReducer(state, { type: 'cell', cell: { column: 3, row: 3 } }), state)
  assert.equal(battleReducer(state, { type: 'finish', unitId: 'mage', motionId: firstMotionId }), state)
  state = battleReducer(state, { type: 'finish', unitId: 'knight', motionId: firstMotionId })
  assert.equal(state.motion, null)
  assert.equal(unitAt(state.units, { column: 3, row: 3 }), undefined)
  assert.equal(unitAt(state.units, { column: 3, row: 2 }).id, 'knight')
  assert.equal(state.units[0].movementPoints, INITIAL_UNITS[0].movementPoints)
  assert.equal(reachableForUnit(state.units, 'mage').has('3,3'), true)
  state = battleReducer(state, { type: 'select', unitId: 'mage' })
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 3 } })
  state = battleReducer(state, { type: 'finish', unitId: 'mage', motionId: state.motion.motionId })
  assert.equal(unitAt(state.units, { column: 3, row: 3 }).id, 'mage')
  assert.equal(getOccupancy(state.units).size, 4)
})

test('取消移動保留原座標、解除佔位鎖定並忽略過期或重複事件', () => {
  let state = createBattleState(INITIAL_UNITS)
  const origin = { column: 3, row: 3 }
  const destination = { column: 4, row: 3 }
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'cell', cell: destination })
  const cancelledMotionId = state.motion.motionId
  const staleFinish = { type: 'finish', unitId: 'knight', motionId: cancelledMotionId }
  const cancel = { type: 'cancel', unitId: 'knight', motionId: cancelledMotionId }

  state = battleReducer(state, cancel)
  assert.equal(state.motion, null)
  assert.equal(state.selectedUnitId, 'knight')
  assert.deepEqual(state.units[0].position, origin)
  assert.equal(unitAt(state.units, origin).id, 'knight')
  assert.equal(unitAt(state.units, destination), undefined)
  assert.equal(battleReducer(state, cancel), state)
  assert.equal(battleReducer(state, staleFinish), state)

  state = battleReducer(state, { type: 'cell', cell: destination })
  const activeMotionId = state.motion.motionId
  assert.notEqual(activeMotionId, cancelledMotionId)
  assert.equal(battleReducer(state, staleFinish), state)
  assert.equal(battleReducer(state, cancel), state)

  state = battleReducer(state, { type: 'finish', unitId: 'knight', motionId: activeMotionId })
  const completedState = state
  assert.equal(state.motion, null)
  assert.deepEqual(state.units[0].position, destination)
  assert.equal(unitAt(state.units, origin), undefined)
  assert.equal(unitAt(state.units, destination).id, 'knight')
  assert.equal(battleReducer(state, { type: 'finish', unitId: 'knight', motionId: activeMotionId }), completedState)
  assert.equal(battleReducer(state, { type: 'cancel', unitId: 'knight', motionId: activeMotionId }), completedState)
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

test('成功完成移動後建立包含路徑與成本的單次撤銷紀錄', () => {
  const state = completeKnightMove()
  assert.deepEqual(state.lastMove, {
    motionId: 1,
    unitId: 'knight',
    from: { column: 3, row: 3 },
    to: { column: 4, row: 3 },
    path: [{ column: 3, row: 3 }, { column: 4, row: 3 }],
    cost: 1,
  })
  assert.equal(canUndoLastMove(state), true)
})

test('移動取消不建立成功移動紀錄', () => {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  state = battleReducer(state, { type: 'cancel', unitId: 'knight', motionId: state.motion.motionId })
  assert.equal(state.lastMove, null)
  assert.deepEqual(state.units[0].position, { column: 3, row: 3 })
})

test('撤銷還原座標與佔位、不消耗 MP，且可重新移動', () => {
  let state = completeKnightMove()
  const originalMovementPoints = state.units[0].movementPoints
  const oldMotionId = state.lastMove.motionId
  state = battleReducer(state, { type: 'undo' })
  assert.deepEqual(state.units[0].position, { column: 3, row: 3 })
  assert.equal(unitAt(state.units, { column: 3, row: 3 }).id, 'knight')
  assert.equal(unitAt(state.units, { column: 4, row: 3 }), undefined)
  assert.equal(state.units[0].movementPoints, originalMovementPoints)
  assert.equal(state.lastMove, null)
  assert.equal(getOccupancy(state.units).size, 4)
  assert.equal(battleReducer(state, { type: 'undo' }), state)

  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  assert.ok(state.motion)
  assert.notEqual(state.motion.motionId, oldMotionId)
  const activeMotion = state
  assert.equal(battleReducer(state, { type: 'finish', unitId: 'knight', motionId: oldMotionId }), activeMotion)
})

test('無紀錄、移動中或撤銷條件失效時拒絕撤銷', () => {
  const initial = createBattleState(INITIAL_UNITS)
  assert.equal(canUndoLastMove(initial), false)
  assert.equal(battleReducer(initial, { type: 'undo' }), initial)

  let moving = battleReducer(initial, { type: 'select', unitId: 'knight' })
  moving = battleReducer(moving, { type: 'cell', cell: { column: 4, row: 3 } })
  assert.equal(canUndoLastMove(moving), false)
  assert.equal(battleReducer(moving, { type: 'undo' }), moving)

  const completed = completeKnightMove()
  const invalidStates = [
    { ...completed, selectedUnitId: 'mage' },
    { ...completed, units: completed.units.filter((unit) => unit.id !== 'knight') },
    { ...completed, units: completed.units.map((unit) => unit.id === 'knight' ? { ...unit, position: { column: 5, row: 3 } } : unit) },
    { ...completed, units: completed.units.map((unit) => unit.id === 'mage' ? { ...unit, position: { column: 3, row: 3 } } : unit) },
    { ...completed, obstacles: [{ id: 'origin-wall', type: 'wall', position: { x: 3, y: 3 }, walkable: false }] },
  ]
  for (const invalid of invalidStates) {
    assert.equal(canUndoLastMove(invalid), false)
    assert.equal(battleReducer(invalid, { type: 'undo' }), invalid)
  }
})

test('確認移動或切換角色後，先前移動不可再撤銷', () => {
  const completed = completeKnightMove()
  const committed = battleReducer(completed, { type: 'commit' })
  assert.equal(committed.lastMove, null)
  assert.equal(battleReducer(committed, { type: 'undo' }), committed)

  const switched = battleReducer(completed, { type: 'select', unitId: 'mage' })
  assert.equal(switched.selectedUnitId, 'mage')
  assert.equal(switched.lastMove, null)
  assert.equal(battleReducer(switched, { type: 'undo' }), switched)
})

test('有效的新移動確認舊紀錄，無效移動保留舊紀錄', () => {
  const completed = completeKnightMove()
  const invalidMove = battleReducer(completed, { type: 'cell', cell: { column: -1, row: 3 } })
  assert.equal(invalidMove.lastMove, completed.lastMove)

  const nextMove = battleReducer(completed, { type: 'cell', cell: { column: 3, row: 3 } })
  assert.ok(nextMove.motion)
  assert.equal(nextMove.lastMove, null)
})
