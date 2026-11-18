import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEATH_ANIMATION_PROFILE,
  getDeathDirection,
  getDeathTimelineEvents,
  getDeathTimelineFrame,
  getDeathTotalMs,
} from '../src/game/battle/battle.death.ts'

test('Death Profile 固定為 200/350/650 ms 且總長 1200 ms', () => {
  assert.deepEqual(DEATH_ANIMATION_PROFILE, {
    hitReactionMs: 200,
    collapseMs: 350,
    dissolveMs: 650,
  })
  assert.equal(getDeathTotalMs(), 1200)
})

test('Death Timeline 邊界正確切換四個 Stage', () => {
  assert.equal(getDeathTimelineFrame(0).stage, 'HIT_REACTION')
  assert.equal(getDeathTimelineFrame(199).stage, 'HIT_REACTION')
  assert.equal(getDeathTimelineFrame(200).stage, 'COLLAPSE')
  assert.equal(getDeathTimelineFrame(549).stage, 'COLLAPSE')
  assert.equal(getDeathTimelineFrame(550).stage, 'DISSOLVE')
  assert.equal(getDeathTimelineFrame(1199).stage, 'DISSOLVE')
  assert.equal(getDeathTimelineFrame(1200).stage, 'COMPLETED')
})

test('Stage Progress 與總時間比例均保持合法範圍', () => {
  for (const elapsed of [-10, 0, 100, 200, 375, 550, 875, 1200, 9999, Number.NaN, Number.POSITIVE_INFINITY]) {
    const frame = getDeathTimelineFrame(elapsed)
    assert.ok(Number.isFinite(frame.elapsedMs))
    assert.ok(frame.stageProgress >= 0 && frame.stageProgress <= 1)
    assert.ok(frame.elapsedRatio >= 0 && frame.elapsedRatio <= 1)
  }
})

test('大 Delta 只跨越一次 Complete Event', () => {
  assert.deepEqual(getDeathTimelineEvents(100, 1300), { complete: true })
  assert.deepEqual(getDeathTimelineEvents(1200, 2000), { complete: false })
  assert.deepEqual(getDeathTimelineEvents(1000, 1199), { complete: false })
})

test('不同 Death ID 由各自 elapsed 計算，Timeline 不共用狀態', () => {
  const first = getDeathTimelineFrame(300)
  const second = getDeathTimelineFrame(900)
  assert.equal(first.stage, 'COLLAPSE')
  assert.equal(second.stage, 'DISSOLVE')
})

test('倒地方向使用攻擊來源與死亡位置快照，支援斜向及零向量', () => {
  assert.deepEqual(getDeathDirection({
    deathId: 1,
    unitId: 'target',
    killerId: 'attacker',
    attackId: 1,
    position: { column: 4, row: 4 },
    sourcePosition: { column: 3, row: 3 },
  }), { column: 1, row: 1 })
  assert.deepEqual(getDeathDirection({
    deathId: 2,
    unitId: 'target',
    killerId: 'attacker',
    attackId: 1,
    position: { column: 3, row: 3 },
    sourcePosition: { column: 3, row: 3 },
  }), { column: 0, row: 1 })
})
