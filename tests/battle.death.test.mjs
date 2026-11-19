import test from 'node:test'
import assert from 'node:assert/strict'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { createBattleState, isBattleBusy } from '../src/game/battle/battle.state.ts'
import { battleReducerFixture as battleReducer } from './turn.fixture.mjs'
import { getOccupancy, unitAt } from '../src/game/battle/occupancy.ts'
import { getUnitLifeState } from '../src/game/battle/battle.unit.ts'
import { activateUnitFixture } from './turn.fixture.mjs'

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
const ranger = createBattleUnit({
  id: 'ranger',
  class: 'ranger',
  faction: 'player',
  position: { column: 1, row: 6 },
})

function beginAttack(units = [knight, goblin, ranger], attackerId = knight.id, targetId = goblin.id) {
  let state = activateUnitFixture(createBattleState(units), attackerId)
  state = battleReducer(state, { type: 'select', unitId: attackerId })
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId })
  return battleReducer(state, { type: 'confirm-attack' })
}

function impact(state) {
  return battleReducer(state, { type: 'attack-impact', attackId: state.attackMotion.attackId })
}

function lethalAttack() {
  return impact(beginAttack([{ ...knight, atk: 20 }, { ...goblin, hp: 5 }, ranger]))
}

test('BattleState 初始化死亡資料與生命狀態 Selector', () => {
  const state = createBattleState([knight, goblin])
  assert.deepEqual(state.deathMotions, [])
  assert.equal(state.nextDeathId, 1)
  assert.deepEqual(state.defeatedUnits, [])
  assert.equal(getUnitLifeState(state, knight.id), 'ALIVE')
  assert.equal(getUnitLifeState(state, 'missing'), 'DEAD')
})

test('Confirm 與非致命 Impact 不建立 DeathMotion 或死亡紀錄', () => {
  let state = beginAttack()
  assert.equal(state.deathMotions.length, 0)
  state = impact(state)
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 45)
  assert.equal(state.deathMotions.length, 0)
  assert.equal(state.defeatedUnits.length, 0)
})

test('致命 Impact 同一 Transition 更新 HP 並建立獨立 DeathMotion', () => {
  const state = lethalAttack()
  assert.equal(state.units.find((unit) => unit.id === goblin.id).hp, 0)
  assert.equal(state.deathMotions.length, 1)
  assert.equal(state.nextDeathId, 2)
  const motion = state.deathMotions[0]
  assert.deepEqual(motion, {
    deathId: 1,
    unitId: goblin.id,
    killerId: knight.id,
    attackId: 1,
    position: { column: 4, row: 3 },
    sourcePosition: { column: 3, row: 3 },
  })
  assert.notEqual(motion.position, state.units.find((unit) => unit.id === goblin.id).position)
  assert.equal(getUnitLifeState(state, goblin.id), 'DYING')
})

test('重複 Impact 不重複建立 DeathMotion 或 Confirmed Impact', () => {
  const state = lethalAttack()
  assert.equal(battleReducer(state, { type: 'attack-impact', attackId: 1 }), state)
  assert.equal(state.deathMotions.length, 1)
  assert.equal(state.confirmedImpacts.length, 1)
})

test('DYING 單位不可成為攻擊者、目標、選取、待命或 Undo', () => {
  const state = lethalAttack()
  for (const action of [
    { type: 'select', unitId: goblin.id },
    { type: 'set-mode', mode: 'MOVE' },
    { type: 'set-mode', mode: 'ATTACK' },
    { type: 'standby' },
    { type: 'undo' },
  ]) assert.equal(battleReducer(state, action), state)
  assert.equal(isBattleBusy(state), true)
  assert.equal(state.units.some((unit) => unit.id === goblin.id && unit.hp === 0), true)
})

test('Death Complete 前保留 Occupancy，完成後移除並保存完整 Record', () => {
  let state = lethalAttack()
  const cell = state.deathMotions[0].position
  assert.equal(unitAt(state.units, cell).id, goblin.id)
  assert.equal(getOccupancy(state.units).has('4,3'), true)
  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: goblin.id })
  assert.equal(state.units.some((unit) => unit.id === goblin.id), false)
  assert.equal(unitAt(state.units, cell), undefined)
  assert.equal(getOccupancy(state.units).has('4,3'), false)
  assert.equal(state.deathMotions.length, 0)
  assert.equal(state.defeatedUnits.length, 1)
  const record = state.defeatedUnits[0]
  assert.equal(record.deathId, 1)
  assert.equal(record.killerId, knight.id)
  assert.equal(record.attackId, 1)
  assert.equal(record.unit.id, goblin.id)
  assert.equal(record.unit.name, goblin.name)
  assert.equal(record.unit.class, goblin.class)
  assert.equal(record.unit.faction, goblin.faction)
  assert.equal(record.unit.hp, 0)
  assert.deepEqual(record.unit.position, cell)
  assert.equal(getUnitLifeState(state, goblin.id), 'DEAD')
})

test('Death Complete 釋放的棋格可由重新計算的移動及 Occupancy 使用', () => {
  const state = battleReducer(lethalAttack(), { type: 'death-complete', deathId: 1, unitId: goblin.id })
  assert.equal(unitAt(state.units, { column: 4, row: 3 }), undefined)
  assert.equal(getOccupancy(state.units).has('4,3'), false)
})

test('過期、重複或錯誤 Unit ID Death Event 為 no-op', () => {
  const state = lethalAttack()
  assert.equal(battleReducer(state, { type: 'death-complete', deathId: 99, unitId: goblin.id }), state)
  assert.equal(battleReducer(state, { type: 'death-complete', deathId: 1, unitId: knight.id }), state)
  const completed = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: goblin.id })
  assert.equal(battleReducer(completed, { type: 'death-complete', deathId: 1, unitId: goblin.id }), completed)
  assert.equal(battleReducer(completed, { type: 'death-abort', deathId: 1, unitId: goblin.id }), completed)
  assert.equal(completed.defeatedUnits.length, 1)
})

test('Death Abort 不復活並以相同流程保存死亡紀錄', () => {
  let state = lethalAttack()
  state = battleReducer(state, { type: 'death-abort', deathId: 1, unitId: goblin.id })
  assert.equal(state.units.some((unit) => unit.id === goblin.id), false)
  assert.equal(state.defeatedUnits[0].unit.hp, 0)
  assert.equal(state.deathMotions.length, 0)
  assert.equal(battleReducer(state, { type: 'death-abort', deathId: 1, unitId: goblin.id }), state)
})

test('攻擊收招與死亡可並行，任一 Motion 完成不清除另一個', () => {
  let state = lethalAttack()
  state = battleReducer(state, { type: 'attack-complete', attackId: 1 })
  assert.equal(state.attackMotion, null)
  assert.equal(state.deathMotions.length, 1)
  assert.equal(isBattleBusy(state), true)
  assert.equal(state.selectedUnitId, knight.id)

  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: goblin.id })
  assert.equal(isBattleBusy(state), false)
})

test('Death Complete 不提前清除有效 AttackMotion', () => {
  let state = lethalAttack()
  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: goblin.id })
  assert.ok(state.attackMotion)
  assert.equal(state.attackMotion.attackId, 1)
  assert.equal(isBattleBusy(state), true)
  state = battleReducer(state, { type: 'attack-complete', attackId: 1 })
  assert.equal(isBattleBusy(state), false)
})

test('命中前 Attack Abort 不建立 DeathMotion，命中後 Abort 保留死亡', () => {
  const pending = battleReducer(beginAttack([knight, { ...goblin, hp: 5 }]), {
    type: 'attack-abort',
    attackId: 1,
  })
  assert.equal(pending.deathMotions.length, 0)
  assert.equal(pending.units.find((unit) => unit.id === goblin.id).hp, 5)

  let impacted = lethalAttack()
  impacted = battleReducer(impacted, { type: 'attack-abort', attackId: 1 })
  assert.equal(impacted.attackMotion, null)
  assert.equal(impacted.deathMotions.length, 1)
  assert.equal(impacted.units.find((unit) => unit.id === goblin.id).hp, 0)
})

test('Death Start 清理死亡單位相關選取與 lastMove，不清除攻擊者狀態', () => {
  const dyingPlayer = { ...knight, hp: 0, id: 'dying-player', position: { column: 2, row: 2 } }
  const state = {
    ...createBattleState([knight, dyingPlayer, goblin]),
    selectedUnitId: dyingPlayer.id,
    lastMove: {
      motionId: 2,
      turnId: 1,
      unitId: dyingPlayer.id,
      from: { column: 1, row: 2 },
      to: { ...dyingPlayer.position },
      path: [{ column: 1, row: 2 }, { ...dyingPlayer.position }],
      cost: 1,
    },
  }
  const lethal = {
    ...state,
    deathMotions: [{
      deathId: 1,
      unitId: dyingPlayer.id,
      killerId: goblin.id,
      attackId: 7,
      position: { ...dyingPlayer.position },
      sourcePosition: { ...goblin.position },
    }],
    nextDeathId: 2,
  }
  const completed = battleReducer(lethal, { type: 'death-complete', deathId: 1, unitId: dyingPlayer.id })
  assert.equal(completed.selectedUnitId, null)
  assert.equal(completed.lastMove, null)
  assert.deepEqual(completed.units.find((unit) => unit.id === knight.id), knight)
})

test('多個 DeathMotion 獨立完成並在最後一個結束後才解鎖', () => {
  const first = { ...goblin, id: 'goblin-a', hp: 0, position: { column: 4, row: 3 } }
  const second = { ...goblin, id: 'goblin-b', hp: 0, position: { column: 5, row: 3 } }
  let state = {
    ...createBattleState([knight, first, second]),
    deathMotions: [
      { deathId: 3, unitId: first.id, killerId: knight.id, attackId: 8, position: first.position, sourcePosition: knight.position },
      { deathId: 4, unitId: second.id, killerId: knight.id, attackId: 9, position: second.position, sourcePosition: knight.position },
    ],
    nextDeathId: 5,
  }
  state = battleReducer(state, { type: 'death-complete', deathId: 3, unitId: first.id })
  assert.equal(state.deathMotions.length, 1)
  assert.equal(state.defeatedUnits.length, 1)
  assert.equal(isBattleBusy(state), true)
  state = battleReducer(state, { type: 'death-complete', deathId: 4, unitId: second.id })
  assert.equal(state.deathMotions.length, 0)
  assert.equal(state.defeatedUnits.length, 2)
  assert.equal(isBattleBusy(state), false)
})

test('過期死亡事件不影響下一個獨立死亡流程', () => {
  let state = lethalAttack()
  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: goblin.id })
  const snapshot = state
  assert.equal(battleReducer(state, { type: 'death-abort', deathId: 1, unitId: goblin.id }), snapshot)
})

test('初始 HP 0 Fixture 不生成虛構死亡紀錄且保留失能佔位', () => {
  const fixture = { ...goblin, hp: 0 }
  const state = createBattleState([knight, fixture])
  assert.equal(state.deathMotions.length, 0)
  assert.equal(state.defeatedUnits.length, 0)
  assert.equal(unitAt(state.units, fixture.position).id, fixture.id)
  assert.equal(getUnitLifeState(state, fixture.id), 'DYING')
})

test('敵方與玩家死亡共用最後結算及紀錄規則', () => {
  const attacker = { ...goblin, position: { column: 4, row: 3 } }
  const playerTarget = { ...knight, hp: 0, position: { column: 3, row: 3 } }
  let state = {
    ...createBattleState([attacker, playerTarget]),
    deathMotions: [{
      deathId: 6,
      unitId: playerTarget.id,
      killerId: attacker.id,
      attackId: 12,
      position: { ...playerTarget.position },
      sourcePosition: { ...attacker.position },
    }],
    selectedUnitId: playerTarget.id,
    nextDeathId: 7,
  }
  state = battleReducer(state, { type: 'death-complete', deathId: 6, unitId: playerTarget.id })
  assert.equal(state.selectedUnitId, null)
  assert.equal(state.defeatedUnits[0].unit.faction, 'player')
  assert.equal(state.defeatedUnits[0].killerId, attacker.id)
})
