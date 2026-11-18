import test from 'node:test'
import assert from 'node:assert/strict'
import { createBattleUnit } from '../src/game/classes/class.factory.ts'
import { battleReducer, createBattleState } from '../src/game/battle/battle.state.ts'

const attacker = createBattleUnit({
  id: 'knight',
  class: 'knight',
  faction: 'player',
  position: { column: 3, row: 3 },
})
const target = createBattleUnit({
  id: 'goblin',
  class: 'goblin',
  faction: 'enemy',
  position: { column: 4, row: 3 },
})

function beginAttack(targetHp = target.hp) {
  let state = createBattleState([attacker, { ...target, hp: targetHp }])
  state = battleReducer(state, { type: 'select', unitId: attacker.id })
  state = battleReducer(state, { type: 'set-mode', mode: 'ATTACK' })
  state = battleReducer(state, { type: 'select-attack-target', targetId: target.id })
  return battleReducer(state, { type: 'confirm-attack' })
}

test('Confirm Attack 不建立 Confirmed Impact Event', () => {
  const state = beginAttack()
  assert.deepEqual(state.confirmedImpacts, [])
  assert.equal(state.lastAttackResult, null)
})

test('合法 Impact 建立包含位置及 AttackResult 的不可變事件', () => {
  const state = battleReducer(beginAttack(), { type: 'attack-impact', attackId: 1 })
  assert.equal(state.confirmedImpacts.length, 1)
  assert.deepEqual(state.confirmedImpacts[0], {
    impactId: 1,
    attackId: 1,
    attackerId: attacker.id,
    targetId: target.id,
    position: { column: 4, row: 3 },
    animationType: 'MELEE_SLASH',
    result: {
      attackerId: attacker.id,
      targetId: target.id,
      damage: 15,
      appliedDamage: 15,
      previousHp: 60,
      remainingHp: 45,
      isDefeated: false,
    },
  })
  assert.notEqual(state.confirmedImpacts[0].position, state.attackMotion.to)
})

test('重複與無效 Impact 不產生重複 Confirmed Event', () => {
  const impacted = battleReducer(beginAttack(), { type: 'attack-impact', attackId: 1 })
  assert.equal(battleReducer(impacted, { type: 'attack-impact', attackId: 1 }), impacted)
  assert.equal(battleReducer(impacted, { type: 'attack-impact', attackId: 99 }), impacted)
  assert.equal(impacted.confirmedImpacts.length, 1)
})

test('Impact 資料拒絕時不建立 Confirmed Event', () => {
  const pending = beginAttack()
  const corrupted = {
    ...pending,
    units: pending.units.map((unit) => unit.id === target.id ? { ...unit, hp: 59 } : unit),
  }
  const rejected = battleReducer(corrupted, { type: 'attack-impact', attackId: 1 })
  assert.deepEqual(rejected.confirmedImpacts, [])
  assert.equal(rejected.units.find((unit) => unit.id === target.id).hp, 59)
})

test('命中前 Abort 不建立事件，命中後 Abort 保留事件', () => {
  const aborted = battleReducer(beginAttack(), { type: 'attack-abort', attackId: 1 })
  assert.deepEqual(aborted.confirmedImpacts, [])
  let impacted = battleReducer(beginAttack(), { type: 'attack-impact', attackId: 1 })
  impacted = battleReducer(impacted, { type: 'attack-abort', attackId: 1 })
  assert.equal(impacted.confirmedImpacts.length, 1)
})

test('Impact 與 Complete 同批時 Confirmed Event 不因 Motion 清除而遺失', () => {
  let state = battleReducer(beginAttack(), { type: 'attack-impact', attackId: 1 })
  state = battleReducer(state, { type: 'attack-complete', attackId: 1 })
  assert.equal(state.attackMotion, null)
  assert.equal(state.confirmedImpacts.length, 1)
  assert.equal(state.confirmedImpacts[0].result.remainingHp, 45)
})

test('Overkill Event 保存 Applied Damage 5 而非名目 Damage 15', () => {
  let state = battleReducer(beginAttack(5), { type: 'attack-impact', attackId: 1 })
  assert.equal(state.confirmedImpacts[0].result.damage, 15)
  assert.equal(state.confirmedImpacts[0].result.appliedDamage, 5)
  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: target.id })
  assert.equal(state.confirmedImpacts[0].result.appliedDamage, 5)
  assert.deepEqual(state.confirmedImpacts[0].position, target.position)
})

test('Consume Impact Action 具冪等性且不影響 Battle Busy', () => {
  const state = battleReducer(beginAttack(), { type: 'attack-impact', attackId: 1 })
  const consumed = battleReducer(state, { type: 'consume-impact', impactId: 1 })
  assert.deepEqual(consumed.confirmedImpacts, [])
  assert.ok(consumed.attackMotion)
  assert.equal(battleReducer(consumed, { type: 'consume-impact', impactId: 1 }), consumed)
})

test('角色移除後事件仍含顯示必要的傷害、位置及 Animation Type', () => {
  let state = battleReducer(beginAttack(5), { type: 'attack-impact', attackId: 1 })
  state = battleReducer(state, { type: 'death-complete', deathId: 1, unitId: target.id })
  assert.equal(state.units.some((unit) => unit.id === target.id), false)
  assert.equal(state.confirmedImpacts.length, 1)
  assert.equal(state.confirmedImpacts[0].targetId, target.id)
  assert.equal(state.confirmedImpacts[0].result.appliedDamage, 5)
  assert.deepEqual(state.confirmedImpacts[0].position, target.position)
})
