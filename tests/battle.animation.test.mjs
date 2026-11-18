import test from 'node:test'
import assert from 'node:assert/strict'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { battleReducer, createBattleState } from '../src/game/battle/battle.state.ts'
import { getOccupancy } from '../src/game/battle/occupancy.ts'

const knight = createBattleUnit({
  id: 'knight',
  class: 'knight',
  faction: 'player',
  position: { column: 3, row: 3 },
})
const goblin = createBattleUnit({
  id: 'goblin',
  class: 'goblin',
  faction: 'enemy',
  position: { column: 4, row: 3 },
})
const mage = createBattleUnit({
  id: 'mage',
  class: 'mage',
  faction: 'player',
  position: { column: 1, row: 6 },
})

function selectAttack(state) {
  state = battleReducer(state, { type: 'select', unitId: knight.id })
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  return battleReducer(state, { type: 'select-attack-target', targetId: goblin.id })
}

function beginAttack(units = [knight, goblin, mage]) {
  const state = selectAttack(createBattleState(units))
  return battleReducer(state, { type: 'confirm-attack' })
}

function resolveAttack(state) {
  const attackId = state.attackMotion.attackId
  state = battleReducer(state, { type: 'attack-impact', attackId })
  return battleReducer(state, { type: 'attack-complete', attackId })
}

test('Battle State 初始化 AttackMotion 並從 Attack ID 1 開始', () => {
  const state = createBattleState([knight, goblin])
  assert.equal(state.attackMotion, null)
  assert.equal(state.nextAttackId, 1)
})

test('合法確認建立獨立座標快照與預計 AttackResult，但不扣 HP', () => {
  const state = beginAttack()
  assert.equal(state.attackMotion.attackId, 1)
  assert.equal(state.nextAttackId, 2)
  assert.deepEqual(state.attackMotion.from, knight.position)
  assert.deepEqual(state.attackMotion.to, goblin.position)
  assert.notEqual(state.attackMotion.from, knight.position)
  assert.notEqual(state.attackMotion.to, goblin.position)
  assert.equal(state.attackMotion.phase, 'PENDING_IMPACT')
  assert.equal(state.attackMotion.result.damage, 15)
  assert.equal(state.lastAttackResult, null)
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 60)
  assert.deepEqual(state.lastAttackCommand, { attackerId: knight.id, targetId: goblin.id })
})

test('合法 Impact 只結算一次並在 Complete 後保留選取', () => {
  let state = beginAttack()
  const attackId = state.attackMotion.attackId
  state = battleReducer(state, { type: 'attack-impact', attackId })
  assert.equal(state.attackMotion.phase, 'IMPACTED')
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 45)
  assert.equal(battleReducer(state, { type: 'attack-impact', attackId }), state)
  state = battleReducer(state, { type: 'attack-complete', attackId })
  assert.equal(state.attackMotion, null)
  assert.equal(state.selectedUnitId, knight.id)
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(battleReducer(state, { type: 'attack-complete', attackId }), state)
})

test('未命中 Complete、無 Motion 及過期 Attack ID 不造成變更', () => {
  const pending = beginAttack()
  assert.equal(battleReducer(pending, { type: 'attack-complete', attackId: 1 }), pending)
  assert.equal(pending.units.find((unit) => unit.id === goblin.id).hp, 60)
  assert.equal(battleReducer(pending, { type: 'attack-impact', attackId: 99 }), pending)

  const completed = resolveAttack(beginAttack())
  assert.equal(battleReducer(completed, { type: 'attack-impact', attackId: 1 }), completed)
  assert.equal(battleReducer(completed, { type: 'attack-abort', attackId: 1 }), completed)
})

test('Attack ID 遞增且舊 ID 不能影響新攻擊', () => {
  let state = resolveAttack(beginAttack())
  state = selectAttack(state)
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(state.attackMotion.attackId, 2)
  assert.equal(state.nextAttackId, 3)
  assert.equal(battleReducer(state, { type: 'attack-impact', attackId: 1 }), state)
  assert.equal(battleReducer(state, { type: 'attack-complete', attackId: 1 }), state)
  assert.equal(battleReducer(state, { type: 'attack-abort', attackId: 1 }), state)
  state = battleReducer(state, { type: 'attack-impact', attackId: 2 })
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 30)
})

test('攻擊期間所有一般戰鬥操作均由 Reducer 鎖定', () => {
  const state = beginAttack()
  for (const action of [
    { type: 'select', unitId: mage.id },
    { type: 'clear' },
    { type: 'standby' },
    { type: 'undo' },
    { type: 'commit' },
    { type: 'set-mode', mode: 'MOVE' },
    { type: 'set-mode', mode: 'ATTACK' },
    { type: 'cancel-move-mode' },
    { type: 'cancel-attack' },
    { type: 'select-attack-target', targetId: goblin.id },
    { type: 'confirm-attack' },
    { type: 'cell', cell: { column: 0, row: 0 } },
  ]) {
    assert.equal(battleReducer(state, action), state)
  }
})

test('移動中不可攻擊，且舊移動事件不改變 AttackMotion', () => {
  let moving = battleReducer(createBattleState([knight, goblin]), { type: 'select', unitId: knight.id })
  moving = battleReducer(moving, { type: 'set-mode', mode: 'MOVE' })
  moving = battleReducer(moving, { type: 'cell', cell: { column: 3, row: 4 } })
  assert.equal(battleReducer(moving, { type: 'confirm-attack' }), moving)

  const attacking = beginAttack()
  assert.equal(battleReducer(attacking, { type: 'finish', unitId: knight.id, motionId: 1 }), attacking)
  assert.equal(battleReducer(attacking, { type: 'cancel', unitId: knight.id, motionId: 1 }), attacking)
})

test('命中前 Abort 不扣血並清除未完成結果', () => {
  let state = beginAttack()
  state = battleReducer(state, { type: 'attack-abort', attackId: 1 })
  assert.equal(state.attackMotion, null)
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 60)
  assert.equal(state.lastAttackResult, null)
  assert.equal(state.lastAttackCommand, null)
  assert.equal(state.selectedUnitId, knight.id)
  assert.equal(state.interactionMode, 'COMMAND')
  assert.equal(battleReducer(state, { type: 'attack-impact', attackId: 1 }), state)
})

test('命中後 Abort 保留傷害、結果與操作解鎖', () => {
  let state = beginAttack()
  state = battleReducer(state, { type: 'attack-impact', attackId: 1 })
  state = battleReducer(state, { type: 'attack-abort', attackId: 1 })
  assert.equal(state.attackMotion, null)
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 45)
  assert.equal(state.lastAttackResult.remainingHp, 45)
  assert.deepEqual(state.lastAttackCommand, { attackerId: knight.id, targetId: goblin.id })
  assert.equal(state.selectedUnitId, knight.id)
})

test('重複與過期 Abort 為 no-op，不影響新攻擊', () => {
  let state = beginAttack()
  state = battleReducer(state, { type: 'attack-abort', attackId: 1 })
  assert.equal(battleReducer(state, { type: 'attack-abort', attackId: 1 }), state)
  state = selectAttack(state)
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(state.attackMotion.attackId, 2)
  assert.equal(battleReducer(state, { type: 'attack-abort', attackId: 1 }), state)
})

test('Impact 資料不一致時安全 Abort，不留下永久鎖定或傷害', () => {
  let state = beginAttack()
  state = {
    ...state,
    units: state.units.map((unit) => unit.id === goblin.id ? { ...unit, hp: 59 } : unit),
  }
  state = battleReducer(state, { type: 'attack-impact', attackId: 1 })
  assert.equal(state.attackMotion, null)
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 59)
  assert.equal(state.lastAttackResult, null)
})

test('合法攻擊清除並不復原已確認移動紀錄，Abort 不重建它', () => {
  let state = createBattleState([knight, goblin])
  state = {
    ...state,
    selectedUnitId: knight.id,
    lastMove: {
      motionId: 9,
      unitId: knight.id,
      from: { column: 2, row: 3 },
      to: { ...knight.position },
      path: [{ column: 2, row: 3 }, { ...knight.position }],
      cost: 1,
    },
    interactionMode: 'ATTACK',
    selectedAttackTargetId: goblin.id,
  }
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(state.lastMove, null)
  state = battleReducer(state, { type: 'attack-abort', attackId: state.attackMotion.attackId })
  assert.equal(state.lastMove, null)
})

test('無效攻擊保留有效 lastMove 並不建立 AttackMotion', () => {
  const moveRecord = {
    motionId: 1,
    unitId: knight.id,
    from: { column: 2, row: 3 },
    to: { ...knight.position },
    path: [{ column: 2, row: 3 }, { ...knight.position }],
    cost: 1,
  }
  const state = {
    ...createBattleState([knight, goblin]),
    selectedUnitId: knight.id,
    selectedAttackTargetId: 'missing',
    interactionMode: 'ATTACK',
    lastMove: moveRecord,
  }
  const rejected = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(rejected.attackMotion, null)
  assert.equal(rejected.lastMove, moveRecord)
})

test('Attack lifecycle 不改變 Position、SP、非目標 HP 或 Occupancy', () => {
  const before = createBattleState([knight, goblin, mage])
  let state = beginAttack()
  const occupancyBefore = [...getOccupancy(state.units).entries()].map(([cell, unit]) => [cell, unit.id])
  state = resolveAttack(state)
  assert.deepEqual(state.units.map((unit) => unit.position), before.units.map((unit) => unit.position))
  assert.deepEqual(state.units.map((unit) => unit.sp), before.units.map((unit) => unit.sp))
  assert.equal(state.units.find((unit) => unit.id === mage.id).hp, mage.hp)
  assert.deepEqual([...getOccupancy(state.units).entries()].map(([cell, unit]) => [cell, unit.id]), occupancyBefore)
})

test('Overkill 仍於 Impact 套用 Applied Damage 並保留失能角色資料', () => {
  const weakGoblin = { ...goblin, hp: 5 }
  let state = beginAttack([knight, weakGoblin])
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 5)
  state = battleReducer(state, { type: 'attack-impact', attackId: 1 })
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 0)
  assert.equal(state.lastAttackResult.damage, 15)
  assert.equal(state.lastAttackResult.appliedDamage, 5)
  assert.equal(state.units.length, 2)
})
