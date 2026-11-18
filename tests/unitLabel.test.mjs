import test from 'node:test'
import assert from 'node:assert/strict'
import {
  drawUnitLabel,
  getHpBarColor,
  getHpBarLayout,
  HP_BAR,
  UNIT_LABEL_LAYOUT,
} from '../src/features/battle/components/unitLabel.utils.ts'

test('HP Fill 與背景血槽共用畫布座標，且完整位於血槽內', () => {
  const layout = getHpBarLayout(1)
  assert.equal(layout.x, HP_BAR.fill.x)
  assert.equal(layout.y, HP_BAR.fill.y)
  assert.equal(layout.width, HP_BAR.fill.width)
  assert.equal(layout.height, HP_BAR.fill.height)
  assert.ok(layout.x >= HP_BAR.track.x)
  assert.ok(layout.y >= HP_BAR.track.y)
  assert.ok(layout.x + layout.width <= HP_BAR.track.x + HP_BAR.track.width)
  assert.ok(layout.y + layout.height <= HP_BAR.track.y + HP_BAR.track.height)
  assert.ok(layout.x + layout.width <= UNIT_LABEL_LAYOUT.width)
  assert.ok(layout.y + layout.height < UNIT_LABEL_LAYOUT.health.y)
})

test('連續受擊時血條左側起點及垂直位置固定，僅由右側縮短', () => {
  const ratios = [1, 0.75, 0.5, 0.25, 0.1, 0]
  const layouts = ratios.map((ratio) => getHpBarLayout(ratio))
  assert.ok(layouts.every((layout) => layout.x === HP_BAR.fill.x && layout.y === HP_BAR.fill.y))
  assert.deepEqual(layouts.map((layout) => layout.width), ratios.map((ratio) => HP_BAR.fill.width * ratio))
  assert.ok(layouts.every((layout, index) => index === 0 || layout.width <= layouts[index - 1].width))
  assert.equal(layouts.at(-1).width, 0)
})

test('非法 HP 比例限制於 0–1 範圍且不改變血條座標', () => {
  assert.equal(getHpBarLayout(-1).ratio, 0)
  assert.equal(getHpBarLayout(2).ratio, 1)
  assert.equal(getHpBarLayout(Number.NaN).ratio, 0)
  assert.equal(getHpBarLayout(Number.POSITIVE_INFINITY).ratio, 0)
  assert.deepEqual(
    [getHpBarLayout(2).x, getHpBarLayout(2).y],
    [getHpBarLayout(0).x, getHpBarLayout(0).y],
  )
})

test('Unit Label 每次繪製重置畫布 Transform，並以同一 Canvas 繪製血槽與填充', () => {
  const calls = []
  const context = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
    setTransform: (...values) => calls.push({ type: 'transform', values }),
    clearRect: (...values) => calls.push({ type: 'clear', values }),
    fillRect: (...values) => calls.push({ type: 'fillRect', color: context.fillStyle, values }),
    strokeRect: (...values) => calls.push({ type: 'strokeRect', values }),
    fillText: (...values) => calls.push({ type: 'text', values }),
  }
  drawUnitLabel(context, { faction: 'player', name: '劍士', hp: 75, maxHp: 100 }, 0.75)

  assert.deepEqual(calls[0], { type: 'transform', values: [1, 0, 0, 1, 0, 0] })
  const barRectangles = calls.filter((call) => call.type === 'fillRect').slice(1)
  assert.deepEqual(barRectangles, [
    { type: 'fillRect', color: '#25343a', values: [HP_BAR.track.x, HP_BAR.track.y, HP_BAR.track.width, HP_BAR.track.height] },
    { type: 'fillRect', color: '#55bd72', values: [HP_BAR.fill.x, HP_BAR.fill.y, HP_BAR.fill.width * 0.75, HP_BAR.fill.height] },
  ])
})

test('0 HP 不繪製任何 Fill，並保留顏色分段', () => {
  const calls = []
  const context = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
    setTransform: () => {},
    clearRect: () => {},
    fillRect: (...values) => calls.push({ color: context.fillStyle, values }),
    strokeRect: () => {},
    fillText: (...values) => calls.push({ text: values }),
  }
  drawUnitLabel(context, { faction: 'enemy', name: '哥布林', hp: 0, maxHp: 60 }, 0)

  assert.equal(calls.filter((call) => call.color === '#25343a').length, 1)
  assert.equal(calls.filter((call) => call.color && call.color !== '#25343a').length, 1)
  assert.equal(getHpBarColor(0.75), '#55bd72')
  assert.equal(getHpBarColor(0.5), '#e4bd49')
  assert.equal(getHpBarColor(0.25), '#df5555')
  assert.ok(calls.some((call) => call.text?.[0] === 'HP 0 / 60 · 失去戰鬥能力'))
})
