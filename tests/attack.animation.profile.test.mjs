import test from 'node:test'
import assert from 'node:assert/strict'
import { UNIT_CLASSES } from '../src/game/classes/class.data.ts'
import { CLASS_DEFINITIONS } from '../src/game/classes/class.data.ts'
import {
  ATTACK_ANIMATION_PROFILES,
  CLASS_ATTACK_ANIMATION,
  getAttackProfile,
  getAttackTimelineEvents,
  getAttackTimelineFrame,
  getImpactMs,
  getTotalMs,
} from '../src/game/battle/battle.animation.ts'

const expected = {
  knight: ['MELEE_SLASH', 150, 300, 550, 0.45],
  assassin: ['MELEE_STAB', 100, 200, 400, 0.6],
  mage: ['MAGIC_PROJECTILE', 450, 500, 450, 0],
  cleric: ['HOLY_STRIKE', 450, 300, 550, 0],
  ranger: ['RANGED_ARROW', 300, 400, 400, 0],
  goblin: ['MELEE_BASH', 150, 250, 500, 0.4],
}

test('六種職業及六種 Animation Type 具有完整集中式 Profile', () => {
  assert.deepEqual(Object.keys(CLASS_ATTACK_ANIMATION), [...UNIT_CLASSES])
  assert.deepEqual(new Set(Object.values(CLASS_ATTACK_ANIMATION)), new Set(Object.keys(ATTACK_ANIMATION_PROFILES)))
  for (const unitClass of UNIT_CLASSES) {
    const profile = getAttackProfile(unitClass)
    assert.equal(profile, ATTACK_ANIMATION_PROFILES[CLASS_ATTACK_ANIMATION[unitClass]])
    assert.deepEqual(
      [profile.type, profile.windupMs, profile.attackMs, profile.recoveryMs, profile.lungeDistance],
      expected[unitClass],
    )
  }
})

test('Animation Profile 時間、命中與總時長皆合法且正確', () => {
  for (const profile of Object.values(ATTACK_ANIMATION_PROFILES)) {
    assert.ok(Number.isFinite(profile.windupMs) && profile.windupMs > 0)
    assert.ok(Number.isFinite(profile.attackMs) && profile.attackMs > 0)
    assert.ok(Number.isFinite(profile.recoveryMs) && profile.recoveryMs > 0)
    assert.equal(getImpactMs(profile), profile.windupMs + profile.attackMs)
    assert.equal(getTotalMs(profile), profile.windupMs + profile.attackMs + profile.recoveryMs)
    assert.match(profile.effectColor, /^#[0-9a-f]{6}$/i)
  }
})

test('Animation Profile 與 AttackPattern 保持獨立', () => {
  assert.equal(getAttackProfile('knight').type, 'MELEE_SLASH')
  assert.equal(getAttackProfile('assassin').type, 'MELEE_STAB')
  assert.equal(CLASS_DEFINITIONS.knight.attackPattern, CLASS_DEFINITIONS.assassin.attackPattern)
  assert.notEqual(getAttackProfile('mage').type, getAttackProfile('cleric').type)
  assert.equal(CLASS_DEFINITIONS.mage.attackPattern, CLASS_DEFINITIONS.cleric.attackPattern)
})

test('Animation Timeline 覆蓋 Wind-up、Attack、Recovery 與 Completed', () => {
  const profile = getAttackProfile('knight')
  assert.deepEqual(getAttackTimelineFrame(0, profile), {
    stage: 'WINDUP', stageProgress: 0, elapsedMs: 0, elapsedRatio: 0, impactReached: false, completed: false,
  })
  assert.equal(getAttackTimelineFrame(149, profile).stage, 'WINDUP')
  assert.equal(getAttackTimelineFrame(150, profile).stage, 'ATTACK')
  assert.ok(Math.abs(getAttackTimelineFrame(300, profile).stageProgress - 0.5) < 0.0001)
  assert.equal(getAttackTimelineFrame(450, profile).stage, 'RECOVERY')
  assert.equal(getAttackTimelineFrame(1000, profile).stage, 'COMPLETED')
  assert.equal(getAttackTimelineFrame(2000, profile).elapsedMs, 1000)
})

test('跨越 Impact 與 Complete 的大 Delta 不遺漏事件', () => {
  const profile = getAttackProfile('knight')
  assert.deepEqual(getAttackTimelineEvents(100, 500, profile), { impact: true, complete: false })
  assert.deepEqual(getAttackTimelineEvents(100, 1500, profile), { impact: true, complete: true })
  assert.deepEqual(getAttackTimelineEvents(500, 1500, profile), { impact: false, complete: true })
  assert.deepEqual(getAttackTimelineEvents(1500, 2000, profile), { impact: false, complete: false })
})

test('Timeline 負值、無限值與極大 Delta 保持有限合法進度', () => {
  const profile = getAttackProfile('mage')
  for (const elapsed of [-10, 0, 1, 500, 1400, 999999, Number.NaN, Number.POSITIVE_INFINITY]) {
    const frame = getAttackTimelineFrame(elapsed, profile)
    assert.ok(Number.isFinite(frame.elapsedMs))
    assert.ok(frame.stageProgress >= 0 && frame.stageProgress <= 1)
    assert.ok(frame.elapsedRatio >= 0 && frame.elapsedRatio <= 1)
  }
})
