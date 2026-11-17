import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { reachableForUnit, moveUnit } from '../src/game/battle/battle.movement.ts'
import { battleReducer, createBattleState } from '../src/game/battle/battle.state.ts'
import { INITIAL_OBSTACLES, obstacleCell } from '../src/game/battle/obstacles.ts'

const knight = INITIAL_UNITS[0]
const cells = INITIAL_OBSTACLES.map(obstacleCell)

test('障礙物格不可進入，包含直接命令與狀態操作', () => {
  const result = reachableForUnit(INITIAL_UNITS, knight.id, cells)
  assert.equal(result.has('3,2'), false)
  assert.throws(() => moveUnit(INITIAL_UNITS, knight.id, { column: 3, row: 2 }, cells), /Invalid movement/)
  let state = createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES)
  state = battleReducer(state, { type: 'select', unitId: knight.id })
  state = battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 2 } })
  assert.equal(state.motion, null)
  assert.deepEqual(state.units[0].position, knight.position)
})

test('棋盤配置保留多條路線，騎士能繞過相鄰障礙物', () => {
  const result = reachableForUnit(INITIAL_UNITS, knight.id, cells)
  assert.equal(result.has('2,3'), true)
  assert.equal(result.has('3,4'), true)
  const path = result.get('4,2')
  assert.deepEqual(path?.path, [{ column: 3, row: 3 }, { column: 4, row: 3 }, { column: 4, row: 2 }])
})

test('初始障礙物不會將棋盤分割成無法到達的區域', () => {
  const units = INITIAL_UNITS.map((unit) => unit.id === knight.id ? { ...unit, movementPoints: 64 } : unit)
  const result = reachableForUnit(units, knight.id, cells)
  assert.equal(result.size, 64 - INITIAL_OBSTACLES.length - INITIAL_UNITS.length)
})

test('多個障礙物形成通道時找到唯一缺口路徑', () => {
  const unit = { ...knight, position: { column: 0, row: 3 }, movementPoints: 12 }
  const corridor = [
    ...Array.from({ length: 8 }, (_, row) => ({ column: 2, row })).filter((cell) => cell.row !== 3),
    ...Array.from({ length: 8 }, (_, row) => ({ column: 4, row })).filter((cell) => cell.row !== 4),
  ]
  const path = reachableForUnit([unit], unit.id, corridor).get('6,4')
  assert.ok(path)
  const pathCells = path.path
  assert.ok(pathCells.some((cell) => cell.column === 2 && cell.row === 3))
  assert.ok(pathCells.some((cell) => cell.column === 4 && cell.row === 4))
  assert.equal(pathCells.some((cell) => corridor.some((wall) => wall.column === cell.column && wall.row === cell.row)), false)
})

test('障礙物完全封鎖通路時不能抵達另一側', () => {
  const unit = { ...knight, position: { column: 0, row: 3 }, movementPoints: 20 }
  const barrier = Array.from({ length: 8 }, (_, row) => ({ column: 2, row }))
  assert.equal(reachableForUnit([unit], unit.id, barrier).has('3,3'), false)
})

test('初始障礙物不重疊角色或彼此，無效配置會報錯', () => {
  assert.ok(INITIAL_OBSTACLES.length >= 5 && INITIAL_OBSTACLES.length <= 8)
  assert.deepEqual(new Set(INITIAL_OBSTACLES.map((obstacle) => obstacle.type)), new Set(['rock', 'tree', 'wall']))
  assert.doesNotThrow(() => createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES))
  const overlap = { id: 'overlap', type: 'rock', position: { x: 3, y: 3 }, walkable: false }
  assert.throws(() => createBattleState(INITIAL_UNITS, [overlap]), /overlapping obstacle/)
  assert.throws(() => createBattleState(INITIAL_UNITS, [INITIAL_OBSTACLES[0], { ...INITIAL_OBSTACLES[0], id: 'duplicate' }]), /overlapping obstacle/)
  assert.throws(() => createBattleState(INITIAL_UNITS, [INITIAL_OBSTACLES[0], { ...INITIAL_OBSTACLES[0], position: { x: 0, y: 0 } }]), /overlapping obstacle/)
  assert.throws(() => createBattleState(INITIAL_UNITS, [{ ...overlap, position: { x: 8, y: 0 } }]), /overlapping obstacle/)
  assert.throws(() => reachableForUnit(INITIAL_UNITS, knight.id, [{ column: 5, row: 2 }]), /overlaps a unit/)
})

test('障礙物不影響其他合法移動路徑', () => {
  const result = reachableForUnit(INITIAL_UNITS, knight.id, cells)
  assert.deepEqual(result.get('4,3')?.path, [knight.position, { column: 4, row: 3 }])
  const moved = moveUnit(INITIAL_UNITS, knight.id, { column: 4, row: 3 }, cells)
  assert.deepEqual(moved[0].position, { column: 4, row: 3 })
})

test('靜態障礙物及角色格都會阻擋路徑', () => {
  const unit = { ...knight, position: { column: 1, row: 1 }, movementPoints: 8 }
  const other = { ...INITIAL_UNITS[3], position: { column: 2, row: 1 } }
  const staticCells = [{ column: 1, row: 2 }]
  assert.equal(reachableForUnit([unit], unit.id, staticCells).has('2,2'), true)
  const result = reachableForUnit([unit, other], unit.id, staticCells)
  assert.equal(result.has('2,1'), false)
  assert.equal(result.has('2,2'), true)
  assert.equal(result.has('1,2'), false)
  assert.equal(result.get('2,2')?.path.some((cell) => cell.column === 2 && cell.row === 1), false)
})

test('保留選角與移動鎖定，完成時使用相同障礙物驗證', () => {
  let state = createBattleState(INITIAL_UNITS, INITIAL_OBSTACLES)
  const plannedMove = reachableForUnit(state.units, 'knight', cells).get('4,2')
  assert.ok(plannedMove)
  state = battleReducer(state, { type: 'select', unitId: 'knight' })
  state = battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 2 } })
  assert.ok(state.motion)
  assert.deepEqual(state.motion.path, plannedMove.path)
  assert.equal(state.motion.cost, plannedMove.cost)
  assert.deepEqual(state.motion.path, [{ column: 3, row: 3 }, { column: 4, row: 3 }, { column: 4, row: 2 }])
  assert.equal(battleReducer(state, { type: 'select', unitId: 'mage' }), state)
  state = battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
  assert.deepEqual(state.units[0].position, { column: 4, row: 2 })
  assert.equal(state.motion, null)
  assert.equal(state.selectedUnitId, 'knight')
})
