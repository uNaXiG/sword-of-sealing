import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { canAttackTarget, getAttackableTiles, getAttackDistance, isWithinAttackRange } from '../src/game/battle/battle.attack.ts'
import { createBattleState } from '../src/game/battle/battle.state.ts'
import { battleReducerFixture as battleReducer } from './turn.fixture.mjs'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'

const knight = INITIAL_UNITS.find((unit) => unit.id === 'knight')

function attacker(pattern, minAttackRange, attackRange, position = { column: 3, row: 3 }) {
  return { ...knight, id: 'attacker', position, attackPattern: pattern, minAttackRange, attackRange }
}

function tileCount(pattern, minAttackRange, attackRange) {
  return getAttackableTiles(attacker(pattern, minAttackRange, attackRange)).length
}

test('四種攻擊模式產生正確圖形與棋格數', () => {
  assert.equal(tileCount('SQUARE', 1, 1), 8)
  assert.equal(tileCount('SQUARE', 1, 2), 24)
  assert.equal(tileCount('CROSS', 1, 2), 8)
  assert.equal(tileCount('DIAMOND', 1, 1), 4)
  assert.equal(tileCount('DIAMOND', 1, 2), 12)
  assert.equal(tileCount('DIAMOND', 1, 3), 24)
  assert.equal(tileCount('DIAMOND_RING', 3, 3), 12)
  assert.equal(tileCount('DIAMOND_RING', 2, 3), 20)
})

test('方形包含斜向鄰格，十字拒絕非同行同列', () => {
  const square = attacker('SQUARE', 1, 1)
  const cross = attacker('CROSS', 1, 2)
  assert.equal(isWithinAttackRange(square, { column: 4, row: 4 }), true)
  assert.equal(isWithinAttackRange(cross, { column: 4, row: 4 }), false)
  assert.equal(isWithinAttackRange(cross, { column: 5, row: 3 }), true)
  assert.equal(getAttackDistance(square.position, { column: 4, row: 4 }, 'SQUARE'), 1)
})

test('菱形環排除距離一與二並接受距離三', () => {
  const ranger = attacker('DIAMOND_RING', 3, 3)
  assert.equal(isWithinAttackRange(ranger, { column: 4, row: 3 }), false)
  assert.equal(isWithinAttackRange(ranger, { column: 5, row: 3 }), false)
  assert.equal(isWithinAttackRange(ranger, { column: 6, row: 3 }), true)
  assert.equal(isWithinAttackRange(ranger, { column: 7, row: 3 }), false)
})

test('AttackableTiles 在邊界裁切且與 isWithinAttackRange 一致', () => {
  for (const pattern of ['SQUARE', 'CROSS', 'DIAMOND', 'DIAMOND_RING']) {
    const min = pattern === 'DIAMOND_RING' ? 3 : 1
    const max = pattern === 'DIAMOND_RING' ? 3 : 2
    const unit = attacker(pattern, min, max, { column: 0, row: 0 })
    const tiles = getAttackableTiles(unit)
    assert.ok(tiles.every((tile) => tile.column >= 0 && tile.row >= 0 && tile.column < 8 && tile.row < 8))
    assert.ok(tiles.every((tile) => isWithinAttackRange(unit, tile)))
    assert.equal(new Set(tiles.map(({ column, row }) => `${column},${row}`)).size, tiles.length)
    assert.equal(tiles.some((tile) => tile.column === 0 && tile.row === 0), false)
  }
})

test('不合法攻擊模式與距離會被拒絕', () => {
  assert.throws(() => getAttackableTiles(attacker('UNKNOWN', 1, 2)), /positive integers/)
  assert.throws(() => getAttackableTiles(attacker('SQUARE', 0, 2)), /positive integers/)
  assert.throws(() => getAttackableTiles(attacker('DIAMOND', 2, 3)), /positive integers/)
  assert.throws(() => getAttackableTiles(attacker('DIAMOND_RING', 1, 3)), /positive integers/)
})

test('各攻擊模式只接受合法敵方且玩家敵方底層規則共用', () => {
  const goblin = createBattleUnit({ id: 'target', class: 'goblin', faction: 'enemy', position: { column: 4, row: 4 } })
  const square = attacker('SQUARE', 1, 1)
  const cross = attacker('CROSS', 1, 2)
  assert.equal(canAttackTarget([square, goblin], square.id, goblin.id), true)
  assert.equal(canAttackTarget([cross, goblin], cross.id, goblin.id), false)
  const enemyAttacker = { ...goblin, id: 'enemy-attacker', position: { column: 3, row: 3 }, attackPattern: 'SQUARE', attackRange: 1, minAttackRange: 1 }
  const playerTarget = { ...square, id: 'player-target', faction: 'player', position: { column: 4, row: 4 } }
  assert.equal(canAttackTarget([enemyAttacker, playerTarget], enemyAttacker.id, playerTarget.id), true)
})

test('Reducer 依模式重新驗證且普通攻擊不消耗 SP 或傷害其他目標', () => {
  const rogueAttacker = attacker('DIAMOND_RING', 3, 3, { column: 1, row: 1 })
  const near = createBattleUnit({ id: 'near', class: 'goblin', faction: 'enemy', position: { column: 2, row: 2 } })
  const far = createBattleUnit({ id: 'far', class: 'goblin', faction: 'enemy', position: { column: 4, row: 1 } })
  const other = createBattleUnit({ id: 'other', class: 'goblin', faction: 'enemy', position: { column: 6, row: 6 } })
  let state = createBattleState([rogueAttacker, near, far, other])
  state = battleReducer(state, { type: 'select', unitId: rogueAttacker.id })
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: near.id })
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(state.units.find((unit) => unit.id === near.id).hp, near.hp)
  assert.equal(state.interactionMode, 'ATTACK')

  state = battleReducer(state, { type: 'select-attack-target', targetId: far.id })
  state = battleReducer(state, { type: 'confirm-attack' })
  assert.equal(state.units.find((unit) => unit.id === far.id).hp, far.hp)
  const attackId = state.attackMotion.attackId
  state = battleReducer(state, { type: 'attack-impact', attackId })
  state = battleReducer(state, { type: 'attack-complete', attackId })
  assert.equal(state.units.find((unit) => unit.id === far.id).hp, far.hp - 15)
  assert.equal(state.units.find((unit) => unit.id === other.id).hp, other.hp)
  assert.equal(state.units.find((unit) => unit.id === rogueAttacker.id).sp, rogueAttacker.sp)
})
