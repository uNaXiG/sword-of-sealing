import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { reachableForUnit, moveUnit } from '../src/game/battle/battle.movement.ts'
import { battleReducer, canUndoLastMove, createBattleState } from '../src/game/battle/battle.state.ts'
import { getOccupancy, unitAt } from '../src/game/battle/occupancy.ts'

function beginMove(state) {
  return battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
}

function completeKnightMove(destination = { column: 4, row: 3 }) {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = beginMove(state)
  state = battleReducer(state, { type: 'cell', cell: destination })
  assert.ok(state.motion)
  return battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
}

function completeMoveAdjacentToGoblin() {
  const units = INITIAL_UNITS.map((unit) => unit.id === 'goblin'
    ? { ...unit, position: { column: 4, row: 2 } }
    : unit)
  let state = createBattleState(units)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = beginMove(state)
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  assert.ok(state.motion)
  return battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
}

test('四個角色資料包含互不重疊的初始位置', () => {
  const state = createBattleState(INITIAL_UNITS)
  assert.equal(state.units.length, 4)
  assert.equal(getOccupancy(state.units).size, 4)
  assert.deepEqual(state.units.map((unit) => unit.class), ['knight', 'mage', 'rogue', 'goblin'])
  assert.deepEqual(state.units[0].position, { column: 3, row: 3 })
  assert.deepEqual(state.units.map((unit) => unit.attackRange), [1, 1, 1, 1])
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

test('選取角色先停留在行動選單，選擇移動後才開始移動流程', () => {
  let state = createBattleState(INITIAL_UNITS)
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(battleReducer(state, { type: 'set-mode', mode: 'MOVE' }), state)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.motion, null)
  assert.equal(battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } }).motion, null)

  state = beginMove(state)
  assert.equal(state.interactionMode, 'MOVE')
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  assert.ok(state.motion)
  state = battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
  assert.equal(state.interactionMode, 'COMMAND')
  assert.ok(state.lastMove)
})

test('移動模式取消後回到行動選單並保留角色選取', () => {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = beginMove(state)

  state = battleReducer(state, { type: 'cancel-move-mode' })
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.selectedUnitId, 'knight')
  assert.equal(state.motion, null)

  const commandState = state
  assert.equal(battleReducer(state, { type: 'cancel-move-mode' }), commandState)
  state = beginMove(state)
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  assert.ok(state.motion)
  assert.equal(battleReducer(state, { type: 'cancel-move-mode' }), state)
})

test('未移動角色待命時清除選取並維持命令模式', () => {
  let state = createBattleState(INITIAL_UNITS)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'standby' })

  assert.equal(state.selectedUnitId, null)
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.lastMove, null)
  assert.equal(state.selectedAttackTargetId, null)
  assert.equal(state.lastAttackCommand, null)
})

test('移動完成後待命確認移動且保留座標、佔位、HP 與 MP', () => {
  let state = completeKnightMove()
  assert.equal(canUndoLastMove(state), true)
  const knight = state.units.find((unit) => unit.id === 'knight')
  const position = { ...knight.position }
  const hp = knight.hp
  const movementPoints = knight.movementPoints

  state = battleReducer(state, { type: 'standby' })

  assert.equal(state.selectedUnitId, null)
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.lastMove, null)
  assert.equal(canUndoLastMove(state), false)
  assert.equal(state.selectedAttackTargetId, null)
  assert.equal(state.lastAttackCommand, null)
  assert.deepEqual(state.units.find((unit) => unit.id === 'knight').position, position)
  assert.equal(unitAt(state.units, position).id, 'knight')
  assert.equal(state.units.find((unit) => unit.id === 'knight').hp, hp)
  assert.equal(state.units.find((unit) => unit.id === 'knight').movementPoints, movementPoints)

  const stoodBy = state
  assert.equal(battleReducer(state, { type: 'standby' }), stoodBy)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  assert.equal(state.lastMove, null)
  assert.equal(battleReducer(state, { type: 'undo' }), state)
  assert.deepEqual(state.units.find((unit) => unit.id === 'knight').position, position)

  state = beginMove(state)
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 3 } })
  assert.ok(state.motion)
  state = battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
  assert.ok(state.lastMove)
  assert.deepEqual(state.lastMove.from, position)
})

test('待命只允許已選取玩家角色在 COMMAND 模式且無移動動畫時執行', () => {
  const initial = createBattleState(INITIAL_UNITS)
  assert.equal(battleReducer(initial, { type: 'standby' }), initial)

  let movingMode = battleReducer(initial, { type: 'select', unitId: 'knight' })
  movingMode = beginMove(movingMode)
  assert.equal(battleReducer(movingMode, { type: 'standby' }), movingMode)

  let attackMode = battleReducer(initial, { type: 'select', unitId: 'knight' })
  attackMode = battleReducer(attackMode, { type: 'set-mode', mode: 'ATTACK' })
  assert.equal(battleReducer(attackMode, { type: 'standby' }), attackMode)

  let inMotion = battleReducer(initial, { type: 'select', unitId: 'knight' })
  inMotion = beginMove(inMotion)
  inMotion = battleReducer(inMotion, { type: 'cell', cell: { column: 4, row: 3 } })
  assert.ok(inMotion.motion)
  assert.equal(battleReducer(inMotion, { type: 'standby' }), inMotion)
})

test('待命清除已接受的暫時性攻擊指令', () => {
  let state = completeMoveAdjacentToGoblin()
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: 'goblin' })
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.deepEqual(state.lastAttackCommand, { attackerId: 'knight', targetId: 'goblin' })

  state = battleReducer(state, { type: 'standby' })
  assert.equal(state.selectedUnitId, null)
  assert.equal(state.lastAttackCommand, null)
})

test('一般 clear 仍只取消選取，不確認既有移動', () => {
  let state = completeKnightMove()
  const moveRecord = state.lastMove

  state = battleReducer(state, { type: 'clear' })
  assert.equal(state.selectedUnitId, null)
  assert.equal(state.lastMove, moveRecord)

  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  assert.equal(state.lastMove, moveRecord)
  assert.equal(canUndoLastMove(state), true)
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
  state = beginMove(state)
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
  state = beginMove(state)
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
  state = beginMove(state)
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

  state = beginMove(state)
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
  state = beginMove(state)
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
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(getOccupancy(state.units).size, 4)
  assert.equal(battleReducer(state, { type: 'undo' }), state)

  state = beginMove(state)
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
  moving = beginMove(moving)
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

  let nextMove = beginMove(completed)
  nextMove = battleReducer(nextMove, { type: 'cell', cell: { column: 3, row: 3 } })
  assert.ok(nextMove.motion)
  assert.equal(nextMove.lastMove, null)
})

test('無有效攻擊者或移動動畫執行中時不可進入攻擊模式', () => {
  const initial = createBattleState(INITIAL_UNITS)
  assert.equal(battleReducer(initial, { type: 'set-mode', mode: 'ATTACK' }), initial)

  let moving = battleReducer(initial, { type: 'select', unitId: 'knight' })
  moving = beginMove(moving)
  moving = battleReducer(moving, { type: 'cell', cell: { column: 3, row: 2 } })
  assert.ok(moving.motion)
  assert.equal(battleReducer(moving, { type: 'set-mode', mode: 'ATTACK' }), moving)
  assert.equal(battleReducer(moving, { type: 'select-attack-target', targetId: 'goblin' }), moving)
  assert.equal(battleReducer(moving, { type: 'confirm-attack' }), moving)
})

test('攻擊模式點擊敵軍只選目標，空格或非法目標清除目標且保留移動撤銷紀錄', () => {
  let state = completeMoveAdjacentToGoblin()
  const moveRecord = state.lastMove
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  assert.equal(state.lastMove, moveRecord)
  assert.equal(state.interactionMode, 'ATTACK')
  assert.equal(canUndoLastMove(state), false)

  state = battleReducer(state, { type: 'select', unitId: 'goblin' })
  assert.equal(state.selectedUnitId, 'knight')
  assert.equal(state.selectedAttackTargetId, 'goblin')
  assert.equal(state.motion, null)
  assert.equal(state.lastMove, moveRecord)

  state = battleReducer(state, { type: 'select-attack-target', targetId: 'rogue' })
  assert.equal(state.selectedAttackTargetId, null)
  assert.equal(state.lastMove, moveRecord)
  state = battleReducer(state, { type: 'select-attack-target', targetId: 'goblin' })
  state = battleReducer(state, { type: 'cell', cell: { column: 7, row: 7 } })
  assert.equal(state.selectedUnitId, 'knight')
  assert.equal(state.selectedAttackTargetId, null)
  assert.equal(state.motion, null)
  assert.equal(state.lastMove, moveRecord)
})

test('取消攻擊返回行動選單並保留移動撤銷能力', () => {
  let state = completeMoveAdjacentToGoblin()
  const moveRecord = state.lastMove
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: 'goblin' })
  state = battleReducer(state, { type: 'cancel-attack' })

  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.selectedUnitId, 'knight')
  assert.equal(state.selectedAttackTargetId, null)
  assert.equal(state.lastMove, moveRecord)
  assert.equal(canUndoLastMove(state), true)

  state = battleReducer(state, { type: 'undo' })
  assert.deepEqual(state.units.find((unit) => unit.id === 'knight').position, { column: 3, row: 3 })
  assert.equal(state.lastMove, null)
})

test('確認攻擊重新驗證目標、確認移動並只記錄指令不造成傷害', () => {
  let state = completeMoveAdjacentToGoblin()
  const originalHp = state.units.find((unit) => unit.id === 'goblin').hp
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: 'goblin' })
  state = battleReducer(state, { type: 'confirm-attack' })

  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.selectedAttackTargetId, null)
  assert.deepEqual(state.lastAttackCommand, { attackerId: 'knight', targetId: 'goblin' })
  assert.equal(state.lastMove, null)
  assert.equal(state.units.find((unit) => unit.id === 'goblin').hp, originalHp)
  assert.equal(canUndoLastMove(state), false)
  assert.equal(battleReducer(state, { type: 'confirm-attack' }), state)
})

test('確認前目標若已失效則拒絕攻擊且不確認移動', () => {
  let state = completeMoveAdjacentToGoblin()
  const moveRecord = state.lastMove
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: 'goblin' })
  state = {
    ...state,
    units: state.units.map((unit) => unit.id === 'goblin'
      ? { ...unit, position: { column: 7, row: 7 } }
      : unit),
  }
  const rejected = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(rejected.interactionMode, 'ATTACK')
  assert.equal(rejected.selectedAttackTargetId, null)
  assert.equal(rejected.lastAttackCommand, null)
  assert.equal(rejected.lastMove, moveRecord)
})

test('攻擊模式切換其他友軍會返回行動選單並確認前一角色移動', () => {
  let state = completeMoveAdjacentToGoblin()
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: 'goblin' })
  state = battleReducer(state, { type: 'select', unitId: 'mage' })
  assert.equal(state.selectedUnitId, 'mage')
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(state.selectedAttackTargetId, null)
  assert.equal(state.lastMove, null)
})

test('建立戰場時拒絕非正整數攻擊距離', () => {
  assert.throws(
    () => createBattleState(INITIAL_UNITS.map((unit) => unit.id === 'knight' ? { ...unit, attackRange: 1.5 } : unit)),
    /positive integer/,
  )
})
