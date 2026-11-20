import test from 'node:test'
import assert from 'node:assert/strict'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import {
  canAttackTarget,
  getAttackableTargets,
  getAttackableTiles,
  getManhattanDistance,
  isWithinAttackRange,
} from '../src/game/battle/battle.attack.ts'

const knightAtCenter = { ...INITIAL_UNITS[0], position: { column: 3, row: 3 }, attackPattern: 'DIAMOND', minAttackRange: 1 }
const initialGoblin = INITIAL_UNITS.find((unit) => unit.id === 'goblin')

test('曼哈頓距離與一格攻擊範圍只包含四個正交鄰格', () => {
  assert.equal(getManhattanDistance(knightAtCenter.position, { column: 4, row: 3 }), 1)
  assert.equal(getManhattanDistance(knightAtCenter.position, { column: 4, row: 4 }), 2)
  assert.equal(getManhattanDistance(knightAtCenter.position, knightAtCenter.position), 0)
  assert.deepEqual(
    getAttackableTiles(knightAtCenter),
    [
      { column: 2, row: 3 },
      { column: 3, row: 2 },
      { column: 3, row: 4 },
      { column: 4, row: 3 },
    ],
  )
  assert.equal(isWithinAttackRange(knightAtCenter, { column: 4, row: 3 }), true)
  assert.equal(isWithinAttackRange(knightAtCenter, { column: 4, row: 4 }), false)
  assert.equal(isWithinAttackRange(knightAtCenter, knightAtCenter.position), false)
})

test('較大的攻擊距離允許曼哈頓距離二格，且範圍不越過棋盤邊界', () => {
  const attacker = { ...knightAtCenter, attackRange: 2 }
  assert.equal(isWithinAttackRange(attacker, { column: 5, row: 3 }), true)
  assert.equal(isWithinAttackRange(attacker, { column: 5, row: 4 }), false)

  const cornerAttacker = { ...attacker, position: { column: 0, row: 0 } }
  const edgeTiles = getAttackableTiles(cornerAttacker)
  assert.equal(edgeTiles.length, 5)
  assert.ok(edgeTiles.every((cell) => cell.column >= 0 && cell.row >= 0 && cell.column < 8 && cell.row < 8))
  assert.equal(edgeTiles.some((cell) => cell.column === 0 && cell.row === 0), false)
})

test('合法攻擊目標限於範圍內敵軍，陣營規則不綁定玩家角色', () => {
  const attacker = { ...knightAtCenter, attackRange: 2 }
  const enemy = { ...initialGoblin, position: { column: 5, row: 3 } }
  const farEnemy = { ...initialGoblin, id: 'far-enemy', position: { column: 6, row: 3 } }
  const ally = createBattleUnit({
    id: 'mage',
    class: 'mage',
    faction: 'player',
    position: { column: 3, row: 4 },
  })
  const units = [attacker, enemy, farEnemy, ally]

  assert.deepEqual(getAttackableTargets(units, attacker.id).map((unit) => unit.id), [enemy.id])
  assert.equal(canAttackTarget(units, attacker.id, enemy.id), true)
  assert.equal(canAttackTarget(units, attacker.id, attacker.id), false)
  assert.equal(canAttackTarget(units, attacker.id, ally.id), false)
  assert.equal(canAttackTarget(units, attacker.id, 'missing'), false)
  assert.equal(canAttackTarget(units, 'missing', enemy.id), false)

  const enemyAttacker = { ...enemy, position: { column: 5, row: 5 }, attackRange: 2 }
  const playerTarget = { ...attacker, position: { column: 5, row: 3 } }
  assert.equal(canAttackTarget([enemyAttacker, playerTarget], enemyAttacker.id, playerTarget.id), true)
})

test('HP 歸零的攻擊者或目標都不是合法攻擊目標', () => {
  const attacker = { ...knightAtCenter, position: { column: 3, row: 3 } }
  const target = { ...initialGoblin, position: { column: 4, row: 3 } }
  assert.equal(canAttackTarget([attacker, { ...target, hp: 0 }], attacker.id, target.id), false)
  assert.equal(canAttackTarget([{ ...attacker, hp: 0 }, target], attacker.id, target.id), false)
  assert.deepEqual(getAttackableTargets([attacker, { ...target, hp: 0 }], attacker.id), [])
})

test('攻擊範圍計算獨立於地形成本與棋格佔位', () => {
  const attacker = { ...knightAtCenter, attackRange: 2 }
  const range = new Set(getAttackableTiles(attacker).map(({ column, row }) => `${column},${row}`))
  assert.equal(range.has('3,2'), true)
  assert.equal(range.has('4,3'), true)
})

test('無效攻擊距離或棋盤尺寸會明確拒絕計算', () => {
  assert.throws(() => getAttackableTiles({ ...knightAtCenter, attackRange: 0 }), /positive integers/)
  assert.throws(() => getAttackableTiles(knightAtCenter, 0), /positive integers/)
  assert.throws(() => getAttackableTiles({ ...knightAtCenter, position: { column: -1, row: 0 } }), /inside the grid/)
})
