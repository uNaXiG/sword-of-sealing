import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import {
  calculateActionValue,
  calculateRound,
  completeIndividualTurn,
  initializeTurnState,
  predictUpcomingTurns,
} from '../src/game/battle/battle.turn.ts'
import { ACTION_DISTANCE } from '../src/game/battle/battle.turn.constants.ts'
import { createBattleState } from '../src/game/battle/battle.state.ts'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { createAIAction } from '../src/game/battle/battle.ai.ts'
import { activateUnitFixture, battleReducerFixture as battleReducer } from './turn.fixture.mjs'

const closeTo = (actual, expected, tolerance = 1e-7) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`)
}

test('PAS 初始化以 AGI 排程，首位是刺客且 Battle Time 為 66.6667', () => {
  const state = createBattleState(INITIAL_UNITS)
  assert.equal(state.turn.turnId, 1)
  assert.equal(state.turn.activeUnitId, 'assassin')
  assert.equal(state.selectedUnitId, 'assassin')
  closeTo(state.turn.battleTime, 1000 / 15)
  assert.equal(state.turn.round, 1)
  assert.deepEqual(
    state.turn.timeline.map((entry) => entry.remainingDistance),
    INITIAL_UNITS.map((unit) => Math.max(0, ACTION_DISTANCE - unit.agi * state.turn.battleTime)),
  )
})

test('PAS 核心 AV、Round 與非法數值驗證', () => {
  assert.equal(calculateActionValue(500, 10), 50)
  assert.equal(calculateRound(200), 2)
  assert.equal(calculateRound(399.999999), 1 + 1)
  for (const invalid of [0, -1, Number.NaN, Infinity]) {
    assert.throws(() => calculateActionValue(1, invalid), RangeError)
  }
  for (const invalid of [-1, ACTION_DISTANCE + 1, Number.NaN]) {
    assert.throws(() => calculateActionValue(invalid, 10), RangeError)
  }
})

test('RS-01 四角色競速產生確認順序與虛擬時間', () => {
  const units = [
    createBattleUnit({ id: 'assassin', class: 'assassin', faction: 'player', position: { column: 0, row: 0 } }),
    createBattleUnit({ id: 'knight', class: 'knight', faction: 'player', position: { column: 1, row: 0 } }),
    createBattleUnit({ id: 'ranger', class: 'ranger', faction: 'player', position: { column: 2, row: 0 } }),
    createBattleUnit({ id: 'goblin', class: 'goblin', faction: 'enemy', position: { column: 3, row: 0 } }),
  ].map((unit) => ({
    ...unit,
    agi: { assassin: 25, knight: 15, ranger: 20, goblin: 12 }[unit.id],
  }))

  let turn = initializeTurnState(units)
  const actual = [{ time: turn.battleTime, unitId: turn.activeUnitId }]
  for (let index = 1; index < 6; index += 1) {
    turn = completeIndividualTurn(turn, units)
    actual.push({ time: turn.battleTime, unitId: turn.activeUnitId })
  }

  assert.deepEqual(actual.map(({ unitId }) => unitId), ['assassin', 'ranger', 'knight', 'assassin', 'goblin', 'ranger'])
  ;[40, 50, 200 / 3, 80, 250 / 3, 100].forEach((expected, index) => closeTo(actual[index].time, expected))
})

test('RS-02 正式初始戰場 17 次順序與 Round 正確', () => {
  let state = createBattleState(INITIAL_UNITS)
  const actual = [{
    turnId: state.turn.turnId,
    round: state.turn.round,
    time: state.turn.battleTime,
    unitId: state.turn.activeUnitId,
  }]
  for (let index = 1; index < 17; index += 1) {
    state = state.units.find((unit) => unit.id === state.turn.activeUnitId)?.faction === 'enemy'
      ? battleReducer(state, createAIAction({
        type: 'ai-standby',
        turnId: state.turn.turnId,
        unitId: state.turn.activeUnitId,
      }))
      : battleReducer(state, { type: 'standby' })
    actual.push({
      turnId: state.turn.turnId,
      round: state.turn.round,
      time: state.turn.battleTime,
      unitId: state.turn.activeUnitId,
    })
  }

  assert.deepEqual(actual.map(({ unitId }) => unitId), [
    'assassin', 'cleric', 'ranger', 'knight', 'mage', 'goblin', 'goblin-b', 'goblin-c',
    'assassin', 'cleric', 'ranger', 'assassin', 'knight', 'mage', 'goblin', 'goblin-b', 'goblin-c',
  ])
  assert.deepEqual(actual.map(({ round }) => round), [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2,
  ])
})

test('同時抵達依 AGI、再依固定 Initial Order 排序且時間可為零', () => {
  const units = INITIAL_UNITS.slice(0, 3).map((unit, index) => ({
    ...unit,
    id: `unit-${index}`,
    agi: index < 2 ? 10 : 15,
  }))
  const turn = {
    battleTime: 10,
    round: 1,
    turnId: 1,
    activeUnitId: 'unit-2',
    timeline: units.map((unit, initialOrder) => ({
      unitId: unit.id,
      initialOrder,
      velocity: unit.agi,
      remainingDistance: unit.id === 'unit-2' ? 0 : 0,
    })),
  }
  const second = completeIndividualTurn(turn, units)
  assert.equal(second.activeUnitId, 'unit-0')
  closeTo(second.battleTime, turn.battleTime)
})

test('行動預覽唯讀且包含可重複出現的未來 10 次', () => {
  const state = createBattleState(INITIAL_UNITS)
  const snapshot = structuredClone(state)
  const preview = predictUpcomingTurns(state.turn, state.units)
  assert.equal(preview.length, 10)
  assert.deepEqual(preview.map(({ unitId }) => unitId), [
    'cleric', 'ranger', 'knight', 'mage', 'goblin', 'goblin-b', 'goblin-c', 'assassin', 'cleric', 'ranger',
  ])
  assert.deepEqual(state, snapshot)
  assert.ok(preview.some((entry, index) => index > 0 && preview[index - 1].battleTime === entry.battleTime))
})

test('10,000 次 DES 排程維持有限、單調及合法距離', () => {
  let state = createBattleState(INITIAL_UNITS)
  for (let index = 0; index < 10_000; index += 1) {
    const previousTime = state.turn.battleTime
    state = state.units.find((unit) => unit.id === state.turn.activeUnitId)?.faction === 'enemy'
      ? battleReducer(state, createAIAction({
        type: 'ai-standby',
        turnId: state.turn.turnId,
        unitId: state.turn.activeUnitId,
      }))
      : battleReducer(state, { type: 'standby' })
    assert.ok(state.turn.battleTime >= previousTime)
    assert.ok(Number.isFinite(state.turn.battleTime))
    assert.ok(state.turn.timeline.every((entry) =>
      Number.isFinite(entry.remainingDistance) &&
      entry.remainingDistance >= 0 &&
      entry.remainingDistance <= ACTION_DISTANCE))
  }
  assert.equal(state.turn.turnId, 10_001)
})

test('Turn 權限、過期完成及空 Timeline 安全停止', () => {
  const state = createBattleState(INITIAL_UNITS)
  assert.equal(battleReducer(state, { type: 'select', unitId: 'knight' }), state)
  assert.equal(battleReducer(state, createAIAction({
    type: 'ai-standby',
    turnId: state.turn.turnId,
    unitId: 'goblin',
  })), state)

  const stale = { ...state, turn: { ...state.turn, turnId: state.turn.turnId + 1 } }
  assert.equal(battleReducer(stale, { type: 'standby' }), stale)

  const empty = createBattleState([])
  assert.equal(empty.turn.activeUnitId, null)
  assert.equal(empty.turn.turnId, 0)
  assert.equal(empty.turn.battleTime, 0)
  assert.equal(battleReducer(empty, { type: 'standby' }), empty)
})

test('致死攻擊只在所有阻擋 Motion 結束後消費 Pending Turn Completion', () => {
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
  let state = activateUnitFixture(createBattleState([knight, { ...goblin, hp: 5 }]), knight.id)
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: goblin.id })
  state = battleReducer(state, { type: 'confirm-attack' })
  state = battleReducer(state, { type: 'attack-impact', attackId: state.attackMotion.attackId })
  assert.equal(state.turn.activeUnitId, knight.id)
  assert.ok(!state.turn.timeline.some((entry) => entry.unitId === goblin.id))

  const completedTurnId = state.turn.turnId
  state = battleReducer(state, { type: 'attack-complete', attackId: state.attackMotion.attackId })
  assert.equal(state.turn.turnId, completedTurnId)
  assert.equal(state.pendingTurnCompletion?.unitId, knight.id)

  state = battleReducer(state, { type: 'death-complete', deathId: state.deathMotions[0].deathId, unitId: goblin.id })
  assert.equal(state.pendingTurnCompletion, null)
  assert.equal(state.turn.activeUnitId, knight.id)
  assert.equal(state.turn.turnId, completedTurnId + 1)
})

test('Post-impact Abort 完成回合，Pre-impact Abort 保留回合與舊事件', () => {
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
  const begin = () => {
    let state = activateUnitFixture(createBattleState([knight, goblin]), knight.id)
    state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
    state = battleReducer(state, { type: 'select-attack-target', targetId: goblin.id })
    return battleReducer(state, { type: 'confirm-attack' })
  }

  const pending = begin()
  const preAbort = battleReducer(pending, { type: 'attack-abort', attackId: pending.attackMotion.attackId })
  assert.equal(preAbort.turn.turnId, pending.turn.turnId)
  assert.equal(preAbort.turn.activeUnitId, knight.id)
  assert.equal(preAbort.units.find((unit) => unit.id === goblin.id).hp, goblin.hp)

  const impacted = battleReducer(begin(), { type: 'attack-impact', attackId: 1 })
  const postAbort = battleReducer(impacted, { type: 'attack-abort', attackId: 1 })
  assert.equal(postAbort.units.find((unit) => unit.id === goblin.id).hp, goblin.hp - 15)
  assert.equal(postAbort.turn.turnId, impacted.turn.turnId + 1)
})

test('獨立確認移動不清除 Undo 且本 Turn 禁止再次移動', () => {
  let state = activateUnitFixture(createBattleState(INITIAL_UNITS), 'knight')
  state = battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  state = battleReducer(state, { type: 'finish', unitId: 'knight', motionId: state.motion.motionId })
  assert.equal(state.lastMove.turnId, state.turn.turnId)
  assert.equal(state.turnAction.movementUsed, true)
  state = battleReducer(state, { type: 'commit' })
  assert.ok(state.lastMove)
  assert.equal(state.turn.turnId, 1)
  const rejected = battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
  assert.equal(rejected, state)
  assert.equal(rejected.motion, null)
})

test('移動後攻擊 Pre-impact Abort 不解除本 Turn 移動限制', () => {
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
  let state = activateUnitFixture(createBattleState([knight, goblin]), knight.id)
  state = battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
  state = battleReducer(state, { type: 'cell', cell: { column: 3, row: 4 } })
  state = battleReducer(state, { type: 'finish', unitId: knight.id, motionId: state.motion.motionId })
  state = {
    ...state,
    units: state.units.map((unit) => unit.id === goblin.id
      ? { ...unit, position: { column: 4, row: 4 } }
      : unit),
  }
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: goblin.id })
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(state.lastMove, null)
  const turnId = state.turn.turnId
  state = battleReducer(state, { type: 'attack-abort', attackId: state.attackMotion.attackId })

  assert.equal(state.turn.turnId, turnId)
  assert.equal(state.turnAction.movementUsed, true)
  assert.equal(state.lastMove, null)
  assert.equal(battleReducer(state, { type: 'set-mode', mode: 'MOVE' }), state)
})

test('下一個個體 Turn 重置移動限制，即使相同角色再次取得行動權', () => {
  const knight = createBattleUnit({
    id: 'knight',
    class: 'knight',
    faction: 'player',
    position: { column: 3, row: 3 },
  })
  let state = activateUnitFixture(createBattleState([knight]), knight.id)
  state = battleReducer(state, { type: 'set-mode', mode: 'MOVE' })
  state = battleReducer(state, { type: 'cell', cell: { column: 4, row: 3 } })
  state = battleReducer(state, { type: 'finish', unitId: knight.id, motionId: state.motion.motionId })
  const previousTurnId = state.turn.turnId
  state = battleReducer(state, { type: 'standby' })

  assert.equal(state.turn.activeUnitId, knight.id)
  assert.equal(state.turn.turnId, previousTurnId + 1)
  assert.equal(state.turnAction.movementUsed, false)
  assert.equal(state.lastMove, null)
  assert.notEqual(battleReducer(state, { type: 'set-mode', mode: 'MOVE' }), state)
})

test('Active Unit 死亡安全釋放操作權並排程下一個存活者', () => {
  const player = createBattleUnit({
    id: 'player',
    class: 'knight',
    faction: 'player',
    position: { column: 0, row: 0 },
  })
  const enemy = createBattleUnit({
    id: 'enemy',
    class: 'goblin',
    faction: 'enemy',
    position: { column: 1, row: 0 },
  })
  let state = activateUnitFixture(createBattleState([player, enemy]), player.id)
  state = {
    ...state,
    units: state.units.map((unit) => unit.id === player.id ? { ...unit, hp: 0 } : unit),
    deathMotions: [{
      deathId: 1,
      unitId: player.id,
      killerId: enemy.id,
      attackId: 99,
      position: player.position,
      sourcePosition: enemy.position,
    }],
    nextDeathId: 2,
  }
  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: player.id })
  assert.equal(state.turn.activeUnitId, enemy.id)
  assert.equal(state.selectedUnitId, null)
  assert.ok(!state.turn.timeline.some((entry) => entry.unitId === player.id))
  assert.equal(state.units.length, 1)
})

test('舊 Turn 的 Attack 事件不能影響新回合', () => {
  const player = createBattleUnit({
    id: 'player',
    class: 'knight',
    faction: 'player',
    position: { column: 0, row: 0 },
  })
  const enemy = createBattleUnit({
    id: 'enemy',
    class: 'goblin',
    faction: 'enemy',
    position: { column: 1, row: 0 },
  })
  let state = activateUnitFixture(createBattleState([player, enemy]), player.id)
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: enemy.id })
  state = battleReducer(state, { type: 'confirm-attack' })
  const staleTurnState = { ...state, turn: { ...state.turn, turnId: state.turn.turnId + 1 } }
  assert.equal(battleReducer(staleTurnState, { type: 'attack-impact', attackId: 1 }), staleTurnState)
  assert.equal(battleReducer(staleTurnState, { type: 'attack-complete', attackId: 1 }), staleTurnState)
  assert.equal(battleReducer(staleTurnState, { type: 'attack-abort', attackId: 1 }), staleTurnState)
})
