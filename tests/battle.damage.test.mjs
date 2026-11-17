import test from 'node:test'
import assert from 'node:assert/strict'
import { calculatePhysicalDamage } from '../src/game/battle/battle.damage.ts'
import { INITIAL_UNITS } from '../src/game/battle/battle.data.ts'

const knight = INITIAL_UNITS.find((unit) => unit.id === 'knight')
const goblin = INITIAL_UNITS.find((unit) => unit.id === 'goblin')

test('ATK 高於 DEF 時依差值計算傷害', () => {
  const result = calculatePhysicalDamage(knight, goblin)
  assert.deepEqual(result, {
    damage: 15,
    appliedDamage: 15,
    previousHp: 60,
    remainingHp: 45,
    isDefeated: false,
  })
})

test('ATK 等於或低於 DEF 時仍造成最低 1 點傷害', () => {
  const equalStats = calculatePhysicalDamage({ atk: 10 }, { def: 10, hp: 5 })
  assert.equal(equalStats.damage, 1)
  assert.equal(equalStats.appliedDamage, 1)
  assert.equal(equalStats.remainingHp, 4)

  const lowerAttack = calculatePhysicalDamage({ atk: 0 }, { def: 15, hp: 5 })
  assert.equal(lowerAttack.damage, 1)
  assert.equal(lowerAttack.remainingHp, 4)
})

test('傷害恰好擊倒或造成 Overkill 時 HP 不低於 0', () => {
  const exactKill = calculatePhysicalDamage({ atk: 20 }, { def: 10, hp: 10 })
  assert.deepEqual(exactKill, {
    damage: 10,
    appliedDamage: 10,
    previousHp: 10,
    remainingHp: 0,
    isDefeated: true,
  })

  const overkill = calculatePhysicalDamage({ atk: 30 }, { def: 10, hp: 7 })
  assert.equal(overkill.damage, 20)
  assert.equal(overkill.appliedDamage, 7)
  assert.equal(overkill.remainingHp, 0)
  assert.equal(overkill.isDefeated, true)
})

test('傷害計算不修改攻擊者或目標資料', () => {
  const attacker = { ...knight }
  const target = { ...goblin }
  const attackerBefore = { ...attacker }
  const targetBefore = { ...target }

  calculatePhysicalDamage(attacker, target)

  assert.deepEqual(attacker, attackerBefore)
  assert.deepEqual(target, targetBefore)
})
